"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const case_types_1 = require("../types/case.types");
const response_1 = require("../types/response");
const uuid_1 = require("uuid");
const cases = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        title: "homicide",
        description: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: case_types_1.CaseStatus.Open,
        agentId: "401bccf5-cf9e-489d-8412-446cd169a0f1",
    },
    {
        id: "ffc19f23-198d-4782-9eb2-0b4db3e1da7c",
        title: "car accident",
        description: "car crash into car",
        status: case_types_1.CaseStatus.Solved,
        agentId: "76f133e1-48a4-4184-8e7c-c4550f98b874",
    },
];
let casesMapCache = null;
function getCasesMap() {
    if (!casesMapCache) {
        casesMapCache = new Map(cases.map((c) => [c.id, c]));
    }
    return casesMapCache;
}
function findAll() {
    return cases;
}
function findById(id) {
    return getCasesMap().get(id);
}
function create(options) {
    const { title, description, status, agentId } = options;
    const caseRecord = {
        id: (0, uuid_1.v4)(),
        title,
        description,
        status,
        agentId,
    };
    cases.push(caseRecord);
    if (casesMapCache) {
        casesMapCache.set(caseRecord.id, caseRecord);
    }
    return caseRecord;
}
function deleteById(id) {
    const caseToDelete = findById(id);
    if (!caseToDelete)
        return response_1.RepositoryResponse.NotFound;
    const index = cases.indexOf(caseToDelete);
    if (index === -1)
        return response_1.RepositoryResponse.Failed;
    cases.splice(index, 1);
    if (casesMapCache) {
        casesMapCache.delete(id);
    }
    return response_1.RepositoryResponse.Success;
}
function update(updatedCase) {
    const index = cases.findIndex((caseRecord) => caseRecord.id === updatedCase.id);
    if (index === -1)
        return response_1.RepositoryResponse.NotFound;
    cases[index] = updatedCase;
    if (casesMapCache) {
        casesMapCache.set(updatedCase.id, updatedCase);
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
