import { v4 as uuidv4 } from "uuid";

export enum AgentRole {
    Officer,
    Detective,
    Captain,
    Chief,
}

export interface Agent {
    id: string;
    name: string;
    role: AgentRole;
    incorporationDate: string;
}

const agents: Agent[] = [
    // {
    //     id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
    //     name: "Rommel Carneiro",
    //     incorporationDate: "1992/10/04",
    //     role: AgentRole.Chief,
    // },
];

function findAll(): Agent[] {
    return agents;
}

function findById(id: string) {
    return agents.find((agent) => agent.id === id);
}

function create(name: string, role: AgentRole, incorporationDate: string): Agent {
    const agent: Agent = {
        id: uuidv4(),
        name,
        role,
        incorporationDate,
    };
    agents.push(agent);

    return agent;
}

function deleteById(id: string) {
    const agentToDelete = findById(id);
    if (!agentToDelete) return false;

    const index = agents.indexOf(agentToDelete);
    agents.splice(index, 1);
    return true;
}

export default {
    findAll,
    findById,
    create,
    deleteById,
};
