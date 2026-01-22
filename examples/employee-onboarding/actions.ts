/**
 * Employee Onboarding Actions
 *
 * This module aggregates all actions from modular action files.
 * Actions are organized by functional area for better maintainability.
 */

// Import actions from modular files
import { AddIncome, VerifyIncome } from "./income-actions";
import { AddDocument, SubmitDocuments } from "./document-actions";
import { AssignEquipment, CompleteTraining, ScheduleMeeting, CreateAccount, MarkResourcesComplete } from "./resource-actions";
import { CompleteOnboarding } from "./onboarding-actions";

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