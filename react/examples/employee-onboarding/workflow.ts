import { createMachine } from "@xstate/fsm";

/**
 * Simplified employee onboarding workflow machine.
 * Groups related activities into logical phases to reduce complexity.
 */
export const onboardingWorkflow = createMachine({
  initial: "START",
  states: {
    START: {
      on: {
        VerifyIncome: "INCOME_READY"
      }
    },
    INCOME_READY: {
      on: {
        SubmitDocuments: "DOCUMENTS_READY"
      }
    },
    DOCUMENTS_READY: {
      on: {
        MarkResourcesComplete: "RESOURCES_READY"
      }
    },
    RESOURCES_READY: {
      on: {
        CompleteOnboarding: "COMPLETED"
      }
    },
    COMPLETED: {}
  }
});