"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../types/response");
const generateMockData_1 = require("../utils/generateMockData");
const uuid_1 = require("uuid");
const agents = (0, generateMockData_1.generateAgents)(1000);
let agentsMapCache = null;
function getAgentsMap() {
    if (!agentsMapCache) {
        agentsMapCache = new Map(agents.map((agent) => [agent.id, agent]));
    }
    return agentsMapCache;
}
function findAll() {
    return agents;
}
function findById(id) {
    return getAgentsMap().get(id);
}
function create(name, role, incorporationDate) {
    const agent = {
        id: (0, uuid_1.v4)(),
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
function deleteById(id) {
    const agentToDelete = findById(id);
    if (!agentToDelete)
        return response_1.RepositoryResponse.NotFound;
    const index = agents.indexOf(agentToDelete);
    if (index === -1)
        return response_1.RepositoryResponse.Failed;
    agents.splice(index, 1);
    if (agentsMapCache) {
        agentsMapCache.delete(id);
    }
    return response_1.RepositoryResponse.Success;
}
function update(updatedAgent) {
    const index = agents.findIndex((agent) => agent.id === updatedAgent.id);
    if (index === -1)
        return response_1.RepositoryResponse.NotFound;
    agents[index] = updatedAgent;
    if (agentsMapCache) {
        agentsMapCache.set(updatedAgent.id, updatedAgent);
    }
    return response_1.RepositoryResponse.Success;
}
exports.default = {
    findAll,
    findById,
    create,
    deleteById,
    update,
};
