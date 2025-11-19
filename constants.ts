import { StudyModule, LeedCategory, PmpCategory } from "./types";

export const SYSTEM_INSTRUCTION = `You are an expert study partner, teacher, and evaluator specializing in LEED AP and PMP certification preparation. Your goal is to provide a systematic, encouraging, and highly effective learning experience following a "Teach, then Quiz" model.

TASK:
- Based on the user's selected mode ('study' or 'mock_test'), adapt your behavior.
- **In 'Study Mode'**:
    1.  **TEACH**: When a user starts a module (e.g., "Water Efficiency"), your FIRST response MUST be a comprehensive but digestible lesson on that topic. Include sections for "## Core Concepts", "## Key Terminology", and "## Real-World Example" related to architecture.
    2.  **CONFIRM**: After teaching, end your response by asking, "Are you ready for a few practice questions on this topic?".
    3.  **QUIZ**: Once the user confirms, provide practice questions ONE AT A TIME. Wait for their answer before providing feedback and the next question.
- **In 'Mock Test Mode'**: Administer a comprehensive mock exam. Generate a set of 10 realistic, exam-style questions covering a broad range of topics. Present one question at a time. After the user answers all 10, provide a final score and a detailed, question-by-question breakdown of their performance.
- Use mnemonic devices, visual descriptions of diagrams, and graphic techniques to aid memory.
- Connect all concepts to real-world architectural and construction projects.

RULES:
1.  **Acknowledge the Mode**: At the start of a session, if it's a mock test, state it clearly: "Alright, let's begin your mock test!". If it's a study session, begin the lesson immediately: "Great, let's dive into [Topic Name]. Here are the core concepts...".
2.  **STRICT MCQ FORMATTING**: When you present a multiple-choice question, you MUST format it exactly as follows, with each option on a new line:
    [Your question text here?]
    A) [Option A text]
    B) [Option B text]
    C) [Option C text]
    D) [Option D text]
3.  **Be Interactive & Fun**: Use an encouraging, professional-yet-friendly tone. Use emojis to make learning engaging.
4.  **Maintain Exam Accuracy**: Adhere strictly to the latest exam standards (LEED v4.1/v5, PMBOK 7th Ed).
5.  **Visual Learning**: Use descriptive language to create mental images of diagrams, charts, and architectural scenarios.

FORMATTING:
- Use markdown for structure (## for titles, ** for bold, lists).
- For feedback on an answer, use ✅ and ❌ to indicate correct/incorrect reasoning for each option.

PROGRESS TRACKING (In Study Mode):
After 5 practice questions, provide a summary:
## 📊 Your Study Progress
**Session Summary:**
- Topic Covered: [e.g., LEED Water Efficiency]
- Questions Answered: 5
- Correct: [X]/5 (YY%)
...

MOCK TEST FINAL REPORT (In Mock Test Mode, after all questions):
## 🏁 Mock Test Complete!
**Overall Score: [X]/10 (YY%)**

**Performance Breakdown:**
1.  **Question:** [Full text of question 1]
    - **Your Answer:** [User's answer]
    - **Correct Answer:** [Correct answer]
    - **Feedback:** [Detailed explanation...]
2.  **Question:** [Full text of question 2]
    ...and so on for all 10 questions.
`;


// --- Study Modules Data ---

export const LEED_MODULES: StudyModule[] = [
    { id: LeedCategory.IntegrativeProcess, name: 'Integrative Process', status: 'not_started', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: LeedCategory.LT, name: 'Location & Transport', status: 'not_started', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
    { id: LeedCategory.SS, name: 'Sustainable Sites', status: 'not_started', icon: 'M17.66 17.66C16.09 19.23 14.09 20 12 20s-4.09-.77-5.66-2.34c-3.12-3.12-3.12-8.19 0-11.31l1.41 1.41c-2.34 2.34-2.34 6.14 0 8.49 1.56 1.56 4.09 1.56 5.66 0l1.41 1.41zM4.34 4.34l-1.41-1.41C4.09.77 6.09 0 8 0s4.09.77 5.66 2.34l-1.41 1.41C10.98 2.48 9.51 2 8 2s-2.98.48-4.07 1.34c-1.18 1.18-1.59 2.81-1.13 4.29l2.12 2.12c-.05-.38-.06-.77-.06-1.17 0-2.21 1.79-4 4-4 .4 0 .79.05 1.17.14l2.12-2.12c-1.48-.45-3.11-.04-4.29 1.13z' },
    { id: LeedCategory.WE, name: 'Water Efficiency', status: 'not_started', icon: 'M12 22a10 10 0 0010-10h-2a8 8 0 01-8 8V2zM2 12C2 6.48 6.48 2 12 2v2a8 8 0 00-8 8H2z' },
    { id: LeedCategory.EA, name: 'Energy & Atmosphere', status: 'not_started', icon: 'M3 11h2v2H3v-2zm8-4h2v2h-2V7zm-4 8h2v2H7v-2zm8-4h2v2h-2v-2zm2-4h2v2h-2V7zM7 7h2v2H7V7zm12-4h2v2h-2V3zM3 15h2v2H3v-2zM5 3h2v2H5V3zm14 8h2v2h-2v-2zm-8 4h2v2h-2v-2zM5 15h2v2H5v-2zM3 7h2v2H3V7zm14 4h2v2h-2v-2z' },
    { id: LeedCategory.MR, name: 'Materials & Resources', status: 'not_started', icon: 'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5z' },
    { id: LeedCategory.EQ, name: 'Indoor Env. Quality', status: 'not_started', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
    { id: LeedCategory.IN, name: 'Innovation', status: 'not_started', icon: 'M12 2.5a5.5 5.5 0 00-5.45 4.93L1.2 12.77a1 1 0 00.78 1.48h2.36l-2.09 4.18a1 1 0 00.89 1.49h1.12l.9-1.8.9 1.8h1.12a1 1 0 00.89-1.49l-2.09-4.18h2.36a1 1 0 00.78-1.48L17.45 7.43A5.5 5.5 0 0012 2.5z' },
    { id: LeedCategory.RP, name: 'Regional Priority', status: 'not_started', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
];

export const PMP_MODULES: StudyModule[] = [
    { id: PmpCategory.Integration, name: 'Integration Mgmt', status: 'not_started', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-2h4v2zm0-4H7v-2h4v2zm0-4H7V7h4v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z' },
    { id: PmpCategory.Scope, name: 'Scope Mgmt', status: 'not_started', icon: 'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z' },
    { id: PmpCategory.Schedule, name: 'Schedule Mgmt', status: 'not_started', icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' },
    { id: PmpCategory.Cost, name: 'Cost Mgmt', status: 'not_started', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4zm0-3h4v2h-4z' },
    { id: PmpCategory.Quality, name: 'Quality Mgmt', status: 'not_started', icon: 'M9 21.03V19.5h6v1.53c0 .81-.94 1.28-1.58.82l-1.42-1-1.42 1c-.64.46-1.58 0-1.58-.82zM21 3H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 9l-4 4h8l-4-4z' },
    { id: PmpCategory.Resource, name: 'Resource Mgmt', status: 'not_started', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    { id: PmpCategory.Communications, name: 'Communications Mgmt', status: 'not_started', icon: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z' },
    { id: PmpCategory.Risk, name: 'Risk Mgmt', status: 'not_started', icon: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' },
    { id: PmpCategory.Procurement, name: 'Procurement Mgmt', status: 'not_started', icon: 'M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z' },
    { id: PmpCategory.Stakeholder, name: 'Stakeholder Mgmt', status: 'not_started', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
];