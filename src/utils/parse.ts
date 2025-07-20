import { Agent, AgentRole } from "types/agent.types";
import { Case, CaseStatus } from "types/case.types";

export function parseAgent(agent: Agent) {
    return {
        ...agent,
        role: AgentRole[agent.role],
    };
}

export function parseCase(caseRecord: Case) {
    return {
        ...caseRecord,
        status: CaseStatus[caseRecord.status],
    };
}

export function parseStringToEnum(value: string, target: any) {
    return target[value as unknown as keyof typeof target];
}
