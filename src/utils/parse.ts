import { Agent, AgentRole } from "types/agent.types";

export function parseAgent(agent: Agent) {
    return {
        ...agent,
        role: AgentRole[agent.role],
    };
}

export function parseAgentRole(role: string) {
    return AgentRole[role as unknown as keyof typeof AgentRole];
}
