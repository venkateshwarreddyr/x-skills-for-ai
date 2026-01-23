export { AddIncome, VerifyIncome } from "./income-actions.js";
export { AddDocument, SubmitDocuments } from "./document-actions.js";
export { AssignEquipment, CompleteTraining, ScheduleMeeting, CreateAccount, MarkResourcesComplete } from "./resource-actions.js";
export { CompleteOnboarding } from "./onboarding-actions.js";

import { AddIncome, VerifyIncome } from "./income-actions.js";
import { AddDocument, SubmitDocuments } from "./document-actions.js";
import { AssignEquipment, CompleteTraining, ScheduleMeeting, CreateAccount, MarkResourcesComplete } from "./resource-actions.js";
import { CompleteOnboarding } from "./onboarding-actions.js";

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
