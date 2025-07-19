import { Agent, AgentRole } from "types/agent.types";
import { RepositoryResponse } from "types/response";
import { generateAgents } from "utils/generateMockData";
import { v4 as uuidv4 } from "uuid";

const agents: Agent[] = generateAgents(1000);

let agentMapCache: Map<string, Agent> | null = null;
const getAgentMap = () => {
    if (!agentMapCache) {
        agentMapCache = new Map(agents.map((agent) => [agent.id, agent]));
    }

    return agentMapCache;
};

function findAll(): Agent[] {
    return agents;
}

function findById(id: string) {
    return getAgentMap().get(id);
}

function create(name: string, role: AgentRole, incorporationDate: string): Agent {
    const agent: Agent = {
        id: uuidv4(),
        name,
        role,
        incorporationDate,
    };

    agents.push(agent);
    if (agentMapCache) {
        agentMapCache.set(agent.id, agent);
    }

    return agent;
}

function deleteById(id: string): RepositoryResponse {
    const agentToDelete = findById(id);
    if (!agentToDelete) return RepositoryResponse.NotFound;

    const index = agents.indexOf(agentToDelete);
    if (index === -1) return RepositoryResponse.Failed;

    agents.splice(index, 1);
    if (agentMapCache) {
        agentMapCache.delete(id);
    }

    return RepositoryResponse.Success;
}

function update(updatedAgent: Agent): RepositoryResponse {
    const index = agents.indexOf(updatedAgent);
    if (index === -1) return RepositoryResponse.NotFound;

    agents[index] = updatedAgent;
    if (agentMapCache) {
        agentMapCache.set(updatedAgent.id, updatedAgent);
    }

    return RepositoryResponse.Success;
}

export default {
    findAll,
    findById,
    create,
    deleteById,
    update,
};
