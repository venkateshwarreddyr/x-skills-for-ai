import { createMachine } from "@xstate/fsm";

export const onboardingWorkflow = createMachine({
  initial: "NEW",
  states: {
    NEW: {
      on: {
        AddIncome: "INCOME_ADDED"
      }
    },
    INCOME_ADDED: {
      on: {
        VerifyIncome: "VERIFIED"
      }
    },
    VERIFIED: {
      on: {
        SubmitDocuments: "DOCUMENTS_COLLECTED"
      }
    },
    DOCUMENTS_COLLECTED: {
      on: {
        AssignEquipment: "EQUIPMENT_ASSIGNED"
      }
    },
    EQUIPMENT_ASSIGNED: {
      on: {
        CompleteTraining: "TRAINING_COMPLETED"
      }
    },
    TRAINING_COMPLETED: {
      on: {
        ScheduleMeeting: "MEETINGS_SCHEDULED"
      }
    },
    MEETINGS_SCHEDULED: {
      on: {
        CreateAccount: "ACCOUNTS_CREATED"
      }
    },
    ACCOUNTS_CREATED: {
      on: {
        CompleteOnboarding: "COMPLETED"
      }
    },
    COMPLETED: {}
  }
});