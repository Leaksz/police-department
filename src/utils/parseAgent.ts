import { Agent, AgentRole } from "repositories/agentsRepository";

export function parseAgent(agent: Agent) {
    return {
        ...agent,
        role: AgentRole[agent.role],
    };
}
