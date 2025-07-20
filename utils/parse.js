"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAgent = parseAgent;
exports.parseCase = parseCase;
exports.parseStringToEnum = parseStringToEnum;
const agent_types_1 = require("../types/agent.types");
const case_types_1 = require("../types/case.types");
function parseAgent(agent) {
    return {
        ...agent,
        role: agent_types_1.AgentRole[agent.role],
    };
}
function parseCase(caseRecord) {
    return {
        ...caseRecord,
        status: case_types_1.CaseStatus[caseRecord.status],
    };
}
function parseStringToEnum(value, target) {
    return target[value];
}
