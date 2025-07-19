import { Agent, AgentRole } from "types/agent.types";

export function parseAgent(agent: Agent) {
    return {
        ...agent,
        role: AgentRole[agent.role],
    };
}
