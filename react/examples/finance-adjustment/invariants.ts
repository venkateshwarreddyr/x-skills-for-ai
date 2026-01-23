import type { Invariant } from "x-skills-for-ai/types";

export const financeInvariants: Invariant[] = [
  (state: any) => {
    if (state.riskScore === "HIGH" && state.amount > 100000 && state.status === "APPROVED") {
      throw new Error("HIGH risk cases above $100k require Finance Director sign-off first");
    }
  },
  (state: any) => {
    if (state.auditLog && !state.auditLog.every((log: any) => log.action && log.timestamp)) {
      throw new Error("All actions must be auditable");
    }
  }
];