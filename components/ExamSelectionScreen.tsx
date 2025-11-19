import React from 'react';
import { Exam } from '../types';

// FIX: Changed JSX.Element to React.ReactElement to resolve 'Cannot find namespace JSX' error.
const ExamButton: React.FC<{ onClick: () => void, title: string, description: string, className: string, icon: React.ReactElement }> = ({ onClick, title, description, className, icon }) => (
    <button
        onClick={onClick}
        className={`relative w-full text-left p-6 rounded-2xl shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 transition-all duration-300 transform hover:-translate-y-1 ${className}`}
    >
        <div className="flex flex-col justify-between h-full">
            <div>
                <div className="mb-3 text-white">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="text-white/80 mt-1">{description}</p>
            </div>
        </div>
    </button>
);


const ExamSelectionScreen: React.FC<{ onSelectExam: (exam: Exam) => void }> = ({ onSelectExam }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-4xl w-full">
        <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 tracking-tight">
              Architect's Study Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              An open-source learning platform to help you master your LEED & PMP certifications. Systematically learn, practice with mock exams, and track your progress.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <ExamButton
                onClick={() => onSelectExam(Exam.LEED)}
                title="LEED AP v4.1"
                description="Master the benchmark for green building design and construction."
                className="bg-gradient-to-br from-green-500 to-teal-600 focus:ring-green-400"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0112 3c1.398 0 2.743.54 3.728 1.506C19.5 7 20 10 20 10c2-1 2.657-2.343 2.657-2.343a8 8 0 01-5.001 11z" /></svg>}
            />
            <ExamButton
                onClick={() => onSelectExam(Exam.LEED_V5)}
                title="LEED v5"
                description="Get ahead with the latest standards in sustainable building practices."
                className="bg-gradient-to-br from-teal-500 to-cyan-600 focus:ring-teal-400"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <ExamButton
                onClick={() => onSelectExam(Exam.PMP)}
                title="PMP"
                description="Lead projects effectively with globally recognized management principles."
                className="bg-gradient-to-br from-blue-500 to-indigo-600 focus:ring-blue-400"
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
        </div>
      </div>
    </div>
  );
};

export default ExamSelectionScreen;