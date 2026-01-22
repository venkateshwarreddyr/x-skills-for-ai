/**
 * Employee Onboarding Actions
 *
 * This module aggregates all actions from modular action files.
 * Actions are organized by functional area for better maintainability.
 */

// Import actions from modular files
import { AddIncome, VerifyIncome } from "./income-actions.js";
import { AddDocument, SubmitDocuments } from "./document-actions.js";
import { AssignEquipment, CompleteTraining, ScheduleMeeting, CreateAccount, MarkResourcesComplete } from "./resource-actions.js";
import { CompleteOnboarding } from "./onboarding-actions.js";

// Export all actions for use in the application
export {
  AddIncome,
  VerifyIncome,
  AddDocument,
  SubmitDocuments,
  AssignEquipment,
  CompleteTraining,
  ScheduleMeeting,
  CreateAccount,
  MarkResourcesComplete,
  CompleteOnboarding
};

// Combined actions array for easy access
export const actions = [
  AddIncome,
  VerifyIncome,
  AddDocument,
  SubmitDocuments,
  AssignEquipment,
  CompleteTraining,
  ScheduleMeeting,
  CreateAccount,
  MarkResourcesComplete,
  CompleteOnboarding
];