import React from 'react';
import { Exam, StudyModule, LeedCategory } from '../types';

const getStatusClasses = (status: StudyModule['status']) => {
    switch (status) {
        case 'completed':
            return {
                bg: 'bg-green-100',
                text: 'text-green-800',
                ring: 'ring-green-500',
                label: 'Completed'
            };
        case 'in_progress':
            return {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                ring: 'ring-yellow-500',
                label: 'In Progress'
            };
        default: // not_started
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-600',
                ring: 'ring-gray-400',
                label: 'Not Started'
            };
    }
};

const ModuleCard: React.FC<{ module: StudyModule, onClick: () => void }> = ({ module, onClick }) => {
    const statusInfo = getStatusClasses(module.status);
    return (
        <button 
            onClick={onClick}
            className="group w-full text-left p-5 bg-white rounded-2xl shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusInfo.bg}`}>
                    <svg className={`w-7 h-7 ${statusInfo.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={module.icon} />
                    </svg>
                </div>
                <div className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                    {statusInfo.label}
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mt-4">{module.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Dive into this module to start learning.</p>
        </button>
    );
};

const MockTestCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="group relative w-full h-full text-left p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
    >
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Start Mock Test</h3>
        <p className="text-sm text-white/80 mt-1">Test your knowledge with a simulated exam.</p>
    </button>
);


interface DashboardProps {
    selectedExam: Exam;
    modules: StudyModule[];
    onSelectModule: (category: LeedCategory) => void;
    onStartMockTest: () => void;
    onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedExam, modules, onSelectModule, onStartMockTest, onBack }) => {
    
    const completedCount = modules.filter(m => m.status === 'completed').length;
    const totalModules = modules.length;
    const progressPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
    
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <button onClick={onBack} className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1 mb-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Change Exam
                        </button>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            {selectedExam} Dashboard
                        </h1>
                    </div>
                     <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">{progressPercentage}% Complete</p>
                        <p className="text-sm text-gray-500">{completedCount} of {totalModules} modules</p>
                    </div>
                </header>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-10">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {modules.map(module => (
                        <ModuleCard 
                            key={module.id} 
                            module={module}
                            onClick={() => onSelectModule(module.id as LeedCategory)} 
                        />
                    ))}
                    <MockTestCard onClick={onStartMockTest} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
