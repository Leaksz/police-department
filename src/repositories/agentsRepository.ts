import { Agent, AgentRole } from "types/agent.types";
import { RepositoryResponse } from "types/response";
import { generateAgents } from "utils/generateMockData";
import { v4 as uuidv4 } from "uuid";

const agents: Agent[] = generateAgents(2);

let agentsMapCache: Map<string, Agent> | null = null;
function getAgentsMap(): Map<string, Agent> {
    if (!agentsMapCache) {
        agentsMapCache = new Map(agents.map((agent) => [agent.id, agent]));
    }

    return agentsMapCache;
}

function findAll() {
    return agents;
}

function findById(id: string) {
    return getAgentsMap().get(id);
}

function create(name: string, role: AgentRole, incorporationDate: string): Agent {
    const agent: Agent = {
        id: uuidv4(),
        name,
        role,
        incorporationDate,
    };

    agents.push(agent);
    if (agentsMapCache) {
        agentsMapCache.set(agent.id, agent);
    }

    return agent;
}

function deleteById(id: string): RepositoryResponse {
    const agentToDelete = findById(id);
    if (!agentToDelete) return RepositoryResponse.NotFound;

    const index = agents.indexOf(agentToDelete);
    if (index === -1) return RepositoryResponse.Failed;

    agents.splice(index, 1);
    if (agentsMapCache) {
        agentsMapCache.delete(id);
    }

    return RepositoryResponse.Success;
}

function update(updatedAgent: Agent): RepositoryResponse {
    const index = agents.findIndex((agent) => agent.id === updatedAgent.id);
    if (index === -1) return RepositoryResponse.NotFound;

    agents[index] = updatedAgent;
    if (agentsMapCache) {
        agentsMapCache.set(updatedAgent.id, updatedAgent);
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
