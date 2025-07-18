import type { Request, Response } from "express";

import agentsRepository, { AgentRole } from "../repositories/agentsRepository";
import { CreateAgentBody, DeleteAgentParams, GetAgentByIdParams } from "types/Agent";
import isAgentRole from "utils/isAgentRole";
import { parseAgent } from "utils/parseAgent";

function getAllAgents(_request: Request, response: Response) {
    const agents = agentsRepository.findAll();
    return response.json(agents.map((agent) => parseAgent(agent)));
}

function getAgentById(request: Request<GetAgentByIdParams>, response: Response) {
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: [],
        });
    }

    const agent = agentsRepository.findById(id);
    if (!agent) {
        return response.status(404).send({
            status: 404,
            message: `Agent with id '${id}' not found`,
            errors: [],
        });
    }

    return response.send(agent);
}

function createAgent(request: Request<{}, {}, CreateAgentBody>, response: Response) {
    const { name, role, incorporationDate } = request.body;

    if (!name || !role || !incorporationDate) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: {
                name: name ? "name field must be defined " : undefined,
                role: role ? "role field must be defined" : undefined,
                incorporationDate: incorporationDate
                    ? "incorporationDate field must follow the 'YYYY-MM-DD' formatting"
                    : undefined,
            },
        });
    }

    if (!isAgentRole(role)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid role",
            error: `Role '${role}' is not a valid Agent Role`,
        });
    }

    const parsedRole = AgentRole[role as unknown as keyof typeof AgentRole];

    const newAgent = agentsRepository.create(name, parsedRole, incorporationDate);

    return response.status(201).send(parseAgent(newAgent));
}

function deleteAgent(request: Request<DeleteAgentParams>, response: Response) {
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: [],
        });
    }

    const success = agentsRepository.deleteById(id);
    if (!success) {
        return response.status(404).send({
            status: 404,
            message: `Failed to delete agent with id '${id}'`,
            errors: [],
        });
    }

    return response.status(204).send();
}

export default {
    getAllAgents,
    getAgentById,
    createAgent,
    deleteAgent,
};
