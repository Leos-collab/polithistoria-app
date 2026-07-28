export interface UserAnswer {
  questionId: string;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface UserRegistration {
  id: string;
  name: string;
  birthDate: string; // DD/MM/YYYY format
  createdAt: string;
  answers: UserAnswer[];
  completed: boolean;
}

export interface Question {
  id: string;
  text: string;
  imageUrl: string;
  options: string[]; // 4 options
  correctOptionIndex?: number;
  createdAt: number;
}

export type AppView =
  | 'home'
  | 'questionnaire'
  | 'completion'
  | 'adm_login'
  | 'adm_dashboard'
  | 'adm_create_question'
  | 'adm_edit_question'
  | 'adm_responses';
