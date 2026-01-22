export type Income = {
  source: string;
  amount: number;
  verified: boolean;
};

export type Document = {
  name: string;
  submitted: boolean;
};

export type Equipment = {
  item: string;
  assigned: boolean;
};

export type Training = {
  course: string;
  completed: boolean;
};

export type Meeting = {
  title: string;
  scheduled: boolean;
};

export type Account = {
  type: string;
  created: boolean;
};

export type Employee = {
  name: string;
  incomes: Income[];
  documents: Document[];
  equipment: Equipment[];
  training: Training[];
  meetings: Meeting[];
  accounts: Account[];
};

/**
 * Application state for employee onboarding.
 * Workflow phases are simplified to reduce complexity.
 */
export type AppState = {
  workflow: "START" | "INCOME_READY" | "DOCUMENTS_READY" | "RESOURCES_READY" | "COMPLETED";
  employee: Employee;
};