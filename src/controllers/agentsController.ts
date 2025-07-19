import type { Request, Response } from "express";

import {
    Agent,
    AgentRole,
    CreateAgentBody,
    DeleteAgentParams,
    GetAgentByIdParams,
    PutAgentBody,
    UpdateAgentParams,
} from "types/agent.types";
import { RepositoryResponse } from "types/response";
import { parseAgent } from "utils/parseAgent";
import { hasValidationErrors, validateCreateAgent, validatePutAgent } from "utils/agentValidations";
import agentsRepository from "../repositories/agentsRepository";

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

    return response.send(parseAgent(agent));
}

function createAgent(request: Request<{}, {}, CreateAgentBody>, response: Response) {
    const { name, role, incorporationDate } = request.body;

    const errors = validateCreateAgent(request.body);
    if (hasValidationErrors(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
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

    const deleted = agentsRepository.deleteById(id);
    if (deleted !== RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message:
                deleted === RepositoryResponse.Failed
                    ? `Failed to delete agent with id '${id}'`
                    : `Agent with id '${id}' not found`,
            errors: [],
        });
    }

    return response.status(204).send();
}

function putAgent(request: Request<UpdateAgentParams, {}, PutAgentBody>, response: Response) {
    const { name, role, incorporationDate } = request.body;
    const agentId = request.params.id;

    if (!agentsRepository.findById(agentId)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Agent with id ${agentId} not found`],
        });
    }

    const errors = validatePutAgent(request.body);
    if (hasValidationErrors(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }

    const parsedRole = AgentRole[role as unknown as keyof typeof AgentRole];

    const updatedAgent: Agent = {
        id: agentId,
        name,
        role: parsedRole,
        incorporationDate,
    };

    const updated = agentsRepository.update(updatedAgent);
    if (updated !== RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: `Agent with id ${agentId} not found`,
        });
    }

    return response.status(200).send(parseAgent(updatedAgent));
}

export default {
    getAllAgents,
    getAgentById,
    createAgent,
    deleteAgent,
    putAgent,
};
