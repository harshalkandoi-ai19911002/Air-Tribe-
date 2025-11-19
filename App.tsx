import React, { useState, useMemo } from 'react';
import { Exam, LeedCategory, StudyModule, ChatMode, ModuleStatus } from './types';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import ExamSelectionScreen from './components/ExamSelectionScreen';
import { LEED_MODULES, PMP_MODULES } from './constants';

const App: React.FC = () => {
    const [step, setStep] = useState<'exam' | 'dashboard' | 'chat'>('exam');
    const [selectedExam, setSelectedExam] = useState<Exam>(Exam.None);
    const [studyModules, setStudyModules] = useState<StudyModule[]>([]);
    
    // State for the chat session
    const [chatMode, setChatMode] = useState<ChatMode>('study');
    const [currentCategory, setCurrentCategory] = useState<LeedCategory | null>(null);

    const handleSelectExam = (exam: Exam) => {
        setSelectedExam(exam);
        // Initialize modules based on selected exam
        if (exam === Exam.PMP) {
            setStudyModules(PMP_MODULES);
        } else {
            setStudyModules(LEED_MODULES);
        }
        setStep('dashboard');
    };

    const handleSelectModule = (category: LeedCategory) => {
        setCurrentCategory(category);
        setChatMode('study');
        // Mark module as 'in_progress' when started
        setStudyModules(prev => prev.map(m => m.id === category && m.status === 'not_started' ? { ...m, status: 'in_progress' } : m));
        setStep('chat');
    };

    const handleStartMockTest = () => {
        setCurrentCategory(null); // Mock test covers the whole exam
        setChatMode('mock_test');
        setStep('chat');
    };
    
    const handleReturnToDashboard = () => {
        setStep('dashboard');
        // Reset chat specific state
        setCurrentCategory(null);
    };

    const handleCompleteModule = () => {
        if (currentCategory) {
            setStudyModules(prev => prev.map(m => m.id === currentCategory ? { ...m, status: 'completed' } : m));
        }
        setStep('dashboard');
    };
    
    const handleReset = () => {
        setStep('exam');
        setSelectedExam(Exam.None);
        setStudyModules([]);
        setCurrentCategory(null);
    };

    const renderStep = () => {
        switch (step) {
            case 'exam':
                return <ExamSelectionScreen onSelectExam={handleSelectExam} />;
            case 'dashboard':
                return (
                    <Dashboard 
                        selectedExam={selectedExam}
                        modules={studyModules}
                        onSelectModule={handleSelectModule}
                        onStartMockTest={handleStartMockTest}
                        onBack={handleReset}
                    />
                );
            case 'chat':
                return (
                    <ChatInterface 
                        selectedExam={selectedExam} 
                        category={currentCategory}
                        mode={chatMode}
                        onReturnToDashboard={handleReturnToDashboard}
                        onCompleteModule={handleCompleteModule}
                    />
                );
            default:
                return <ExamSelectionScreen onSelectExam={handleSelectExam} />;
        }
    }

    const backgroundClass = useMemo(() => {
        if (step === 'exam') return 'from-gray-50 to-gray-100';
        if (selectedExam === Exam.PMP) return 'from-blue-50 to-indigo-100';
        if (selectedExam === Exam.LEED || selectedExam === Exam.LEED_V5) return 'from-green-50 to-teal-100';
        return 'from-gray-50 to-gray-100';
    }, [step, selectedExam]);


    return (
        <div className={`antialiased min-h-screen bg-gradient-to-br ${backgroundClass}`}>
           <div className="transition-opacity duration-500 ease-in-out">
                {renderStep()}
           </div>
        </div>
    );
};

export default App;
