"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCases = getAllCases;
const agentsRepository_1 = __importDefault(require("../repositories/agentsRepository"));
const case_types_1 = require("../types/case.types");
const response_1 = require("../types/response");
const caseValidations_1 = require("../utils/caseValidations");
const hasValidationErrors_1 = __importDefault(require("../utils/hasValidationErrors"));
const parse_1 = require("../utils/parse");
const casesRepository_1 = __importDefault(require("../repositories/casesRepository"));
function getAllCases(request, response) {
    let cases = casesRepository_1.default.findAll();
    if (Object.hasOwn(request.query, "agentId")) {
        if (!agentsRepository_1.default.findById(request.query.agentId)) {
            return response.status(404).send({
                status: 404,
                message: "Invalid ID",
                error: `Agent with id '${request.query.agentId}' not found`,
            });
        }
        cases = cases.filter((caseRecord) => caseRecord.agentId === request.query.agentId);
    }
    if (Object.hasOwn(request.query, "status")) {
        const error = (0, caseValidations_1.validateCaseField)(request.query.status, caseValidations_1.caseFieldConfigs[2].rules, false, caseValidations_1.caseFieldConfigs[2].displayName);
        if (error) {
            return response.status(400).send({
                status: 400,
                message: "Invalid parameters",
                error,
            });
        }
        cases = cases.filter((caseRecord) => caseRecord.status === (0, parse_1.parseStringToEnum)(request.query.status, case_types_1.CaseStatus));
    }
    return response.json(cases.map((caseRecord) => (0, parse_1.parseCase)(caseRecord)));
}
function getCaseById(request, response) {
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
        });
    }
    const caseRecord = casesRepository_1.default.findById(id);
    if (!caseRecord) {
        return response.status(404).send({
            status: 404,
            message: `Invalid ID`,
            errors: [`Agent with id '${id}' not found`],
        });
    }
    return response.send(caseRecord);
}
function getCaseAgent(request, response) {
    const caseRecord = casesRepository_1.default.findById(request.params.id);
    if (!caseRecord) {
        return response.status(404).send({
            status: 404,
            message: "Invalid ID",
            errors: [`Case with id '${request.params.id}' not found`],
        });
    }
    const caseAgent = agentsRepository_1.default.findById(caseRecord.agentId);
    if (!caseAgent) {
        return response.status(500).send({
            status: 500,
            message: "Internal Server Error",
            errors: [
                `Case with id '${request.params.id}' does not have a valid responsible agent`,
                `Found agentId: ${caseRecord.agentId}`,
            ],
        });
    }
    return response.status(200).send((0, parse_1.parseAgent)(caseAgent));
}
function searchCase(request, response) {
    const query = request.query.q;
    if (!query) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: [`Invalid query parameter '${query}'`],
        });
    }
    const cases = casesRepository_1.default
        .findAll()
        .filter((caseRecord) => caseRecord.title.includes(query) || caseRecord.description.includes(query));
    return response.status(200).send(cases.map((caseRecord) => (0, parse_1.parseCase)(caseRecord)));
}
function createCase(request, response) {
    const { title, description, status, agentId } = request.body;
    const errors = (0, caseValidations_1.validateCreateCase)(request.body);
    if ((0, hasValidationErrors_1.default)(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }
    const newCase = casesRepository_1.default.create({
        title,
        description,
        status: (0, parse_1.parseStringToEnum)(status, case_types_1.CaseStatus),
        agentId,
    });
    return response.status(201).send((0, parse_1.parseCase)(newCase));
}
function deleteCase(request, response) {
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: [],
        });
    }
    const deleted = casesRepository_1.default.deleteById(id);
    if (deleted !== response_1.RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: deleted === response_1.RepositoryResponse.Failed
                ? `Failed to delete case with id '${id}'`
                : `Case with id '${id}' not found`,
            errors: [],
        });
    }
    return response.status(204).send();
}
function putCase(request, response) {
    const { title, description, status, agentId } = request.body;
    const caseId = request.params.id;
    if (!casesRepository_1.default.findById(caseId)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Case with id ${caseId} not found`],
        });
    }
    const errors = (0, caseValidations_1.validatePutCase)(request.body);
    if ((0, hasValidationErrors_1.default)(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }
    const updatedCase = {
        id: caseId,
        title,
        description,
        status: (0, parse_1.parseStringToEnum)(status, case_types_1.CaseStatus),
        agentId,
    };
    const update = casesRepository_1.default.update(updatedCase);
    if (update !== response_1.RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: `Case with id ${agentId} not found`,
        });
    }
    return response.status(200).send((0, parse_1.parseCase)(updatedCase));
}
function patchCase(request, response) {
    const agent = casesRepository_1.default.findById(request.params.id);
    if (!agent) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Case with id ${request.params.id} not found`],
        });
    }
    const errors = (0, caseValidations_1.validatePatchCase)(request.body);
    if ((0, hasValidationErrors_1.default)(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }
    const updatedCase = {
        ...agent,
        ...(Object.hasOwn(request.body, "title") && { name: request.body.title }),
        ...(Object.hasOwn(request.body, "description") && { description: request.body.description }),
        ...(Object.hasOwn(request.body, "status") && { status: (0, parse_1.parseStringToEnum)(request.body.status, case_types_1.CaseStatus) }),
        ...(Object.hasOwn(request.body, "agentId") && { agentId: request.body.agentId }),
    };
    const update = casesRepository_1.default.update(updatedCase);
    if (update !== response_1.RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Case with id ${request.params.id} not found`],
        });
    }
    return response.status(200).send((0, parse_1.parseCase)(updatedCase));
}
exports.default = {
    getAllCases,
    getCaseById,
    getCaseAgent,
    searchCase,
    createCase,
    deleteCase,
    putCase,
    patchCase,
};
