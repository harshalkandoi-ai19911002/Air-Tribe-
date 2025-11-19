export enum Exam {
  LEED = "LEED AP v4.1",
  LEED_V5 = "LEED v5",
  PMP = "PMP",
  None = "None",
}

export enum LeedCategory {
    IntegrativeProcess = "Integrative Process (IP)",
    LT = "Location and Transportation (LT)",
    SS = "Sustainable Sites (SS)",
    WE = "Water Efficiency (WE)",
    EA = "Energy and Atmosphere (EA)",
    MR = "Materials and Resources (MR)",
    EQ = "Indoor Environmental Quality (EQ)",
    IN = "Innovation (IN)",
    RP = "Regional Priority (RP)",
}

// Placeholder for PMP knowledge areas if we want to get specific
export enum PmpCategory {
    Integration = "Integration Management",
    Scope = "Scope Management",
    Schedule = "Schedule Management",
    Cost = "Cost Management",
    Quality = "Quality Management",
    Resource = "Resource Management",
    Communications = "Communications Management",
    Risk = "Risk Management",
    Procurement = "Procurement Management",
    Stakeholder = "Stakeholder Management",
}


export enum Role {
  User = "user",
  Model = "model",
}

export interface Message {
  role: Role;
  text: string;
  id: string;
  options?: string[]; // For rendering MCQ buttons
  isActioned?: boolean; // To disable MCQ buttons after an option is selected
  selectedOption?: string; // To highlight the selected option
}

export interface Progress {
  questionsAnswered: number;
  correctAnswers: number;
}

export type ChatMode = 'study' | 'mock_test';

export type ModuleStatus = 'not_started' | 'in_progress' | 'completed';

export interface StudyModule {
    id: LeedCategory | PmpCategory;
    name: string;
    status: ModuleStatus;
    icon: string; // SVG path data or component name
}