"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agent_types_1 = require("../types/agent.types");
const response_1 = require("../types/response");
const agentValidations_1 = require("../utils/agentValidations");
const parse_1 = require("../utils/parse");
const agentsRepository_1 = __importDefault(require("../repositories/agentsRepository"));
const hasValidationErrors_1 = __importDefault(require("../utils/hasValidationErrors"));
function getAllAgents(request, response) {
    let agents = agentsRepository_1.default.findAll();
    if (Object.hasOwn(request.query, "role")) {
        const error = (0, agentValidations_1.validateAgentField)(request.query.role, agentValidations_1.agentFieldConfigs[1].rules, true, agentValidations_1.agentFieldConfigs[1].displayName);
        if (error) {
            return response.status(400).send({
                status: 400,
                message: "Invalid parameters",
                error,
            });
        }
        agents = agents.filter((agent) => agent.role == (0, parse_1.parseStringToEnum)(request.query.role, agent_types_1.AgentRole));
    }
    if (Object.hasOwn(request.query, "sort")) {
        if (!(0, agentValidations_1.isValidSortString)(request.query.sort)) {
            return response.status(400).send({
                status: 400,
                message: "Invalid parameters",
                error: `'${request.query.sort}' is not a valid sort string, Valid strings are: ${Object.values(agent_types_1.SortStrings)
                    .filter((role) => isNaN(Number(role)))
                    .join(", ")}}`,
            });
        }
        agents = agents.toSorted((a, b) => {
            return new Date(a.incorporationDate).getTime() - new Date(b.incorporationDate).getTime();
        });
        if (agent_types_1.SortStrings[request.query.sort] === agent_types_1.SortStrings["-incorporationDate"]) {
            agents.reverse();
        }
    }
    return response.json(agents.map((agent) => (0, parse_1.parseAgent)(agent)));
}
function getAgentById(request, response) {
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: [],
        });
    }
    const agent = agentsRepository_1.default.findById(id);
    if (!agent) {
        return response.status(404).send({
            status: 404,
            message: `Agent with id '${id}' not found`,
            errors: [],
        });
    }
    return response.send((0, parse_1.parseAgent)(agent));
}
function createAgent(request, response) {
    const { name, role, incorporationDate } = request.body;
    const errors = (0, agentValidations_1.validateCreateAgent)(request.body);
    if ((0, hasValidationErrors_1.default)(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }
    const newAgent = agentsRepository_1.default.create(name, (0, parse_1.parseStringToEnum)(role, agent_types_1.AgentRole), incorporationDate);
    return response.status(201).send((0, parse_1.parseAgent)(newAgent));
}
function deleteAgent(request, response) {
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: [],
        });
    }
    const deleted = agentsRepository_1.default.deleteById(id);
    if (deleted !== response_1.RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: deleted === response_1.RepositoryResponse.Failed
                ? `Failed to delete agent with id '${id}'`
                : `Agent with id '${id}' not found`,
            errors: [],
        });
    }
    return response.status(204).send();
}
function putAgent(request, response) {
    const { name, role, incorporationDate } = request.body;
    const agentId = request.params.id;
    if (!agentsRepository_1.default.findById(agentId)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Agent with id ${agentId} not found`],
        });
    }
    const errors = (0, agentValidations_1.validatePutAgent)(request.body);
    if ((0, hasValidationErrors_1.default)(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }
    const parsedRole = agent_types_1.AgentRole[role];
    const updatedAgent = {
        id: agentId,
        name,
        role: parsedRole,
        incorporationDate,
    };
    const updated = agentsRepository_1.default.update(updatedAgent);
    if (updated !== response_1.RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: `Agent with id ${agentId} not found`,
        });
    }
    return response.status(200).send((0, parse_1.parseAgent)(updatedAgent));
}
function patchAgent(request, response) {
    const agent = agentsRepository_1.default.findById(request.params.id);
    if (!agent) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Agent with id ${request.params.id} not found`],
        });
    }
    const errors = (0, agentValidations_1.validatePatchAgent)(request.body);
    if ((0, hasValidationErrors_1.default)(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }
    const updatedAgent = {
        ...agent,
        ...(Object.hasOwn(request.body, "name") && { name: request.body.name }),
        ...(Object.hasOwn(request.body, "role") && { role: agent_types_1.AgentRole[request.body.role] }),
        ...(Object.hasOwn(request.body, "incorporationDate") && { incorporationDate: request.body.incorporationDate }),
    };
    const updated = agentsRepository_1.default.update(updatedAgent);
    if (updated !== response_1.RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Agent with id ${request.params.id} not found`],
        });
    }
    return response.status(200).send((0, parse_1.parseAgent)(updatedAgent));
}
exports.default = {
    getAllAgents,
    getAgentById,
    createAgent,
    deleteAgent,
    putAgent,
    patchAgent,
};
