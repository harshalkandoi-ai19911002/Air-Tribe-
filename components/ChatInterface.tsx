import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Exam, Message, Role, LeedCategory, ChatMode } from '../types';
import { getChatResponse } from '../services/geminiService';

// --- Helper Functions ---

const MCQ_OPTION_REGEX = /^\s*([A-Z])\)\s(.+)/;

const parseMCQ = (text: string): { question: string, options: string[] } | null => {
    const lines = text.split('\n');
    const options: string[] = [];
    let question = text;
    let optionsStartIndex = -1;

    lines.forEach((line, index) => {
        const match = line.match(MCQ_OPTION_REGEX);
        if (match) {
            if (optionsStartIndex === -1) {
                optionsStartIndex = index;
            }
            options.push(line.trim());
        }
    });

    if (options.length >= 2) { // Typically at least 2 options for an MCQ
        question = lines.slice(0, optionsStartIndex).join('\n');
        return { question, options };
    }

    return null;
};


// --- Helper Components defined in the same file ---

// Loading Spinner SVG
const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Simple Markdown to JSX Renderer
const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
        if (inList) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
                    {listItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            );
            listItems = [];
            inList = false;
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('## ')) {
            flushList();
            elements.push(<h2 key={index} className="text-2xl font-bold mt-4 mb-2 text-gray-900">{line.substring(3)}</h2>);
        } else if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={index} className="text-xl font-semibold mt-3 mb-1 text-gray-800">{line.substring(4)}</h3>);
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            if (!inList) inList = true;
            listItems.push(line.substring(2));
        } else if (line === '---') {
            flushList();
            elements.push(<hr key={index} className="my-4 border-gray-200" />);
        } else if (line.length > 0) {
            flushList();
            const parts = line.split(/(\*\*.*?\*\*|✅|❌|✓|🏁|📊)/g);
            elements.push(
                <p key={index} className="my-2 leading-relaxed">
                    {parts.map((part, i) => 
                        part.startsWith('**') && part.endsWith('**') ? 
                        <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> : 
                        part
                    )}
                </p>
            );
        }
    });

    flushList();
    return <div className="prose prose-sm max-w-none text-gray-800">{elements}</div>;
};


// Chat Message Bubble
const ChatMessage: React.FC<{ message: Message; onOptionClick: (option: string) => void; }> = ({ message, onOptionClick }) => {
  const isModel = message.role === Role.Model;

  const handleOptionClick = (option: string) => {
    if (message.isActioned) return;
    onOptionClick(option);
  }

  return (
    <div className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
      <div className={`max-w-3xl w-full`}>
          <div className={`px-5 py-3 rounded-2xl shadow-md ${isModel ? 'bg-white text-gray-800 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
            {isModel ? <MarkdownRenderer text={message.text} /> : <p>{message.text}</p>}
          </div>
          {isModel && message.options && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.options.map((option, index) => {
                    const isSelected = message.selectedOption === option;
                    const buttonClasses = message.isActioned
                        ? `bg-gray-100 text-gray-500 cursor-not-allowed ${isSelected ? 'ring-2 ring-blue-500' : ''}`
                        : 'bg-white hover:bg-blue-50 focus:ring-blue-500 text-gray-800';

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            disabled={message.isActioned}
                            className={`w-full text-left p-3 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${buttonClasses}`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
          )}
      </div>
    </div>
  );
};

// --- Main Chat Interface Component ---

interface ChatInterfaceProps {
  selectedExam: Exam;
  category: LeedCategory | null;
  mode: ChatMode;
  onReturnToDashboard: () => void;
  onCompleteModule: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedExam, category, mode, onReturnToDashboard, onCompleteModule }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const lastMessageIsMCQ = useMemo(() => {
    const lastMsg = messages[messages.length - 1];
    return lastMsg?.role === Role.Model && !!lastMsg.options && !lastMsg.isActioned;
  }, [messages]);

  const handleSend = useCallback(async (messageText: string, isSystemMessage: boolean = false) => {
    if (!messageText.trim() || isLoading) return;

    if (!isSystemMessage) {
        const newUserMessage: Message = { role: Role.User, text: messageText, id: Date.now().toString() };
        setMessages(prev => [...prev, newUserMessage]);
    }
    setInput('');
    setIsLoading(true);

    try {
        const responseText = await getChatResponse(messageText, messages, selectedExam);
        const mcqData = parseMCQ(responseText);
        
        const newModelMessage: Message = { 
            role: Role.Model, 
            text: mcqData ? mcqData.question : responseText, 
            id: (Date.now() + 1).toString(),
            options: mcqData?.options,
            isActioned: false,
        };
        setMessages(prev => [...prev, newModelMessage]);

    } catch (error) {
        console.error("Error fetching response:", error);
        const errorMessage: Message = { role: Role.Model, text: "Oh no! 🤖 I seem to have a short circuit. Please try again or return to the dashboard.", id: 'error' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, messages, selectedExam]);


  const handleOptionClick = useCallback((messageId: string, option: string) => {
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isActioned: true, selectedOption: option } : msg));
    handleSend(option);
  }, [handleSend]);

  useEffect(() => {
    let initialPrompt = '';
    if (mode === 'mock_test') {
        initialPrompt = `I'm ready to start a mock test for the **${selectedExam}** exam. Please begin.`
    } else {
        initialPrompt = `I want to start a study session for **${selectedExam}**, focusing on the **${category}** category.`
    }
    handleSend(initialPrompt, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExam, category, mode]);
  
  useEffect(() => {
    setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isLoading]);

  const headerTitle = mode === 'mock_test' ? `${selectedExam} Mock Test` : category;

  return (
    <div className="flex flex-col h-screen max-h-screen bg-transparent">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center z-10 sticky top-0">
        <button onClick={onReturnToDashboard} className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1" aria-label="Back to Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          Dashboard
        </button>
        <h1 className="text-lg text-center font-bold text-gray-800">{headerTitle}</h1>
        <div className="flex items-center gap-4">
           {mode === 'study' ? (
             <button onClick={onCompleteModule} className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors" aria-label="Mark Module as Complete">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Complete Module
             </button>
           ) : <div className="w-36"></div>}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} onOptionClick={(option) => handleOptionClick(msg.id, option)} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-2xl px-4 py-3 rounded-2xl shadow bg-white text-gray-800 rounded-bl-none flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="w-full bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="p-3 md:p-4">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
                    <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={lastMessageIsMCQ ? "Select an option above" : "Ask a follow-up question..."}
                            className="flex-1 bg-transparent px-4 py-2.5 text-gray-800 focus:outline-none placeholder-gray-500"
                            disabled={isLoading || lastMessageIsMCQ}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim() || lastMessageIsMCQ}
                            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            aria-label="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;