import { CaseStatus } from "types/case.types";

export function validateCaseStatus(key: string): key is keyof typeof CaseStatus {
    return key in CaseStatus && typeof CaseStatus[key as keyof typeof CaseStatus] === "number";
}
