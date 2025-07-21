import type { Request, Response } from "express";

import {
    Agent,
    AgentRole,
    CreateAgentBody,
    DeleteAgentParams,
    GetAgentByIdParams,
    GetAllAgentsQuery,
    PatchAgentBody,
    PutAgentBody,
    SortStrings,
    UpdateAgentParams,
} from "types/agent.types";
import { RepositoryResponse } from "types/response";
import {
    agentFieldConfigs,
    isValidSortString,
    validateCreateAgent,
    validateAgentField,
    validatePatchAgent,
    validatePutAgent,
} from "utils/agentValidations";
import { parseAgent, parseStringToEnum } from "utils/parse";
import agentsRepository from "../repositories/agentsRepository";
import hasValidationErrors from "utils/hasValidationErrors";
import { validate as isValidUUID } from "uuid";

function getAllAgents(request: Request<{}, {}, {}, GetAllAgentsQuery>, response: Response) {
    let agents = agentsRepository.findAll();

    if (Object.hasOwn(request.query, "role")) {
        const error = validateAgentField(
            request.query.role,
            agentFieldConfigs[1].rules,
            true,
            agentFieldConfigs[1].displayName
        );
        if (error) {
            return response.status(400).send({
                status: 400,
                message: "Invalid parameters",
                error,
            });
        }

        agents = agents.filter((agent) => agent.role == parseStringToEnum(request.query.role as string, AgentRole));
    }

    if (Object.hasOwn(request.query, "sort")) {
        if (!isValidSortString(request.query.sort!)) {
            return response.status(400).send({
                status: 400,
                message: "Invalid parameters",
                error: `'${request.query.sort}' is not a valid sort string, Valid strings are: ${Object.values(
                    SortStrings
                )
                    .filter((role) => isNaN(Number(role)))
                    .join(", ")}}`,
            });
        }

        agents = agents.toSorted((a, b) => {
            return new Date(a.incorporationDate).getTime() - new Date(b.incorporationDate).getTime();
        });

        if (SortStrings[request.query.sort!] === SortStrings["-incorporationDate"]) {
            agents.reverse();
        }
    }

    return response.json(agents.map((agent) => parseAgent(agent)));
}

function getAgentById(request: Request<GetAgentByIdParams>, response: Response) {
    const id = request.params.id;

    if (!id || !isValidUUID(id)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: ["Provided agent id is not valid"],
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

    const newAgent = agentsRepository.create(name, parseStringToEnum(role, AgentRole), incorporationDate);

    return response.status(201).send(parseAgent(newAgent));
}

function deleteAgent(request: Request<DeleteAgentParams>, response: Response) {
    const id = request.params.id;
    if (!id || !isValidUUID(id)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: ["Provided agent id is not valid"],
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

    if (!agentId || !isValidUUID(agentId)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: ["Provided agent id is not valid"],
        });
    }

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

function patchAgent(request: Request<UpdateAgentParams, {}, PatchAgentBody>, response: Response) {
    if (!request.params.id || !isValidUUID(request.params.id)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: ["Provided agent id is not valid"],
        });
    }

    const agent = agentsRepository.findById(request.params.id);

    if (!agent) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Agent with id ${request.params.id} not found`],
        });
    }

    const errors = validatePatchAgent(request.body);
    if (hasValidationErrors(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }

    const updatedAgent: Agent = {
        ...agent,
        ...(Object.hasOwn(request.body, "name") && { name: request.body.name }),
        ...(Object.hasOwn(request.body, "role") && { role: AgentRole[request.body.role as keyof typeof AgentRole] }),
        ...(Object.hasOwn(request.body, "incorporationDate") && { incorporationDate: request.body.incorporationDate }),
    };

    const updated = agentsRepository.update(updatedAgent);
    if (updated !== RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Agent with id ${request.params.id} not found`],
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
    patchAgent,
};
