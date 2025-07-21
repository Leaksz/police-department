import { type Request, type Response } from "express";

import agentsRepository from "repositories/agentsRepository";
import {
    Case,
    CaseStatus,
    CreateCaseBody,
    DeleteCaseParams,
    GetAllCasesQuery,
    GetCaseAgentParams,
    GetCaseByIdParams,
    PatchCaseBody,
    PutCaseBody,
    SearchCaseQuery,
    UpdateCaseParams,
} from "types/case.types";
import { RepositoryResponse } from "types/response";
import {
    caseFieldConfigs,
    validateCaseField,
    validateCreateCase,
    validatePatchCase,
    validatePutCase,
} from "utils/caseValidations";
import hasValidationErrors from "utils/hasValidationErrors";
import { parseAgent, parseCase, parseStringToEnum } from "utils/parse";
import casesRepository from "../repositories/casesRepository";
import { validate as isValidUUID } from "uuid";

export function getAllCases(request: Request<{}, {}, {}, GetAllCasesQuery>, response: Response) {
    let cases = casesRepository.findAll();

    if (Object.hasOwn(request.query, "agentId")) {
        if (!agentsRepository.findById(request.query.agentId!)) {
            return response.status(404).send({
                status: 404,
                message: "Invalid ID",
                error: `Agent with id '${request.query.agentId}' not found`,
            });
        }

        cases = cases.filter((caseRecord) => caseRecord.agentId === request.query.agentId);
    }

    if (Object.hasOwn(request.query, "status")) {
        const error = validateCaseField(
            request.query.status,
            caseFieldConfigs[2].rules,
            false,
            caseFieldConfigs[2].displayName
        );
        if (error) {
            return response.status(400).send({
                status: 400,
                message: "Invalid parameters",
                error,
            });
        }

        cases = cases.filter(
            (caseRecord) => caseRecord.status === parseStringToEnum(request.query.status!, CaseStatus)
        );
    }

    return response.json(cases.map((caseRecord) => parseCase(caseRecord)));
}

function getCaseById(request: Request<GetCaseByIdParams>, response: Response) {
    const id = request.params.id;
    if (!id || isValidUUID(id)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: ["Provided case id is not valid"],
        });
    }

    const caseRecord = casesRepository.findById(id);
    if (!caseRecord) {
        return response.status(404).send({
            status: 404,
            message: `Invalid ID`,
            errors: [`Agent with id '${id}' not found`],
        });
    }

    return response.send(caseRecord);
}

function getCaseAgent(request: Request<GetCaseAgentParams>, response: Response) {
    const caseRecord = casesRepository.findById(request.params.id);
    if (!caseRecord) {
        return response.status(404).send({
            status: 404,
            message: "Invalid ID",
            errors: [`Case with id '${request.params.id}' not found`],
        });
    }

    const caseAgent = agentsRepository.findById(caseRecord.agentId);
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

    return response.status(200).send(parseAgent(caseAgent));
}

function searchCase(request: Request<{}, {}, {}, SearchCaseQuery>, response: Response) {
    const query = request.query.q;
    if (!query) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: [`Invalid query parameter '${query}'`],
        });
    }

    const cases = casesRepository
        .findAll()
        .filter((caseRecord) => caseRecord.title.includes(query) || caseRecord.description.includes(query));

    return response.status(200).send(cases.map((caseRecord) => parseCase(caseRecord)));
}

function createCase(request: Request<{}, {}, CreateCaseBody>, response: Response) {
    const { title, description, status, agentId } = request.body;

    const errors = validateCreateCase(request.body);
    if (hasValidationErrors(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }

    const newCase = casesRepository.create({
        title,
        description,
        status: parseStringToEnum(status, CaseStatus),
        agentId,
    });

    return response.status(201).send(parseCase(newCase));
}

function deleteCase(request: Request<DeleteCaseParams>, response: Response) {
    const id = request.params.id;
    if (!id || !isValidUUID(id)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors: ["Provided case id is not valid"],
        });
    }

    const deleted = casesRepository.deleteById(id);
    if (deleted !== RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message:
                deleted === RepositoryResponse.Failed
                    ? `Failed to delete case with id '${id}'`
                    : `Case with id '${id}' not found`,
            errors: [],
        });
    }

    return response.status(204).send();
}

function putCase(request: Request<UpdateCaseParams, {}, PutCaseBody>, response: Response) {
    const { title, description, status, agentId } = request.body;
    const caseId = request.params.id;

    if (!casesRepository.findById(caseId)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Case with id ${caseId} not found`],
        });
    }

    const errors = validatePutCase(request.body);
    if (hasValidationErrors(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }

    const updatedCase: Case = {
        id: caseId,
        title,
        description,
        status: parseStringToEnum(status, CaseStatus),
        agentId,
    };

    const update = casesRepository.update(updatedCase);
    if (update !== RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: `Case with id ${agentId} not found`,
        });
    }

    return response.status(200).send(parseCase(updatedCase));
}

function patchCase(request: Request<UpdateCaseParams, {}, PatchCaseBody>, response: Response) {
    const caseId = casesRepository.findById(request.params.id);

    if (!caseId || !isValidUUID(caseId)) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Provided case id is not a valid id`],
        });
    }

    const errors = validatePatchCase(request.body);
    if (hasValidationErrors(errors)) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
            errors,
        });
    }

    const updatedCase: Case = {
        ...caseId,
        ...(Object.hasOwn(request.body, "title") && { name: request.body.title }),
        ...(Object.hasOwn(request.body, "description") && { description: request.body.description }),
        ...(Object.hasOwn(request.body, "status") && { status: parseStringToEnum(request.body.status!, CaseStatus) }),
        ...(Object.hasOwn(request.body, "agentId") && { agentId: request.body.agentId }),
    };

    const update = casesRepository.update(updatedCase);
    if (update !== RepositoryResponse.Success) {
        return response.status(404).send({
            status: 404,
            message: "Invalid parameters",
            errors: [`Case with id ${request.params.id} not found`],
        });
    }

    return response.status(200).send(parseCase(updatedCase));
}

export default {
    getAllCases,
    getCaseById,
    getCaseAgent,
    searchCase,
    createCase,
    deleteCase,
    putCase,
    patchCase,
};
