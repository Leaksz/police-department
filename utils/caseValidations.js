"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatchCase = exports.validatePutCase = exports.validateCreateCase = exports.caseFieldConfigs = void 0;
exports.validateCaseField = validateCaseField;
exports.validateCase = validateCase;
exports.validateCaseStatus = validateCaseStatus;
const agentsRepository_1 = __importDefault(require("../repositories/agentsRepository"));
const case_types_1 = require("../types/case.types");
function validateCaseField(value, rules, isRequired, fieldName) {
    if (!value) {
        return isRequired ? `${fieldName} field is required` : null;
    }
    for (const rule of rules) {
        if (!rule.condition(value)) {
            return rule.message;
        }
    }
    return null;
}
// Validation Rules
const titleRules = [
    { condition: (title) => typeof title === "string", message: "Title must be a string" },
    { condition: (title) => title.trim().length > 0, message: "Title cannot be empty" },
    { condition: (title) => title.trim().length >= 2, message: "Title must be at least 2 characters long" },
    { condition: (title) => title.trim().length <= 100, message: "Title cannot exceed 100 characters" },
];
const descriptionRules = [
    { condition: (description) => typeof description === "string", message: "Description must be a string" },
    { condition: (description) => description.trim().length > 0, message: "Description cannot be empty" },
    {
        condition: (description) => description.trim().length >= 2,
        message: "Description must be at least 2 characters long",
    },
];
const statusRules = [
    { condition: (status) => typeof status === "string", message: "Role must be a string" },
    { condition: (status) => status.trim().length > 0, message: "Role cannot be empty" },
    {
        condition: (status) => validateCaseStatus(status),
        message: `Status is not valid. Valid status are: ${Object.values(case_types_1.CaseStatus)
            .filter((status) => isNaN(Number(status)))
            .join(", ")}`,
    },
];
const agentIdRules = [
    { condition: (agentId) => typeof agentId === "string", message: "Agent Id must be a string" },
    {
        condition: (agentId) => agentsRepository_1.default.findById(agentId) !== undefined,
        message: `Provided agent id is not a valid`,
    },
];
exports.caseFieldConfigs = [
    { key: "title", rules: titleRules, displayName: "Title" },
    { key: "description", rules: descriptionRules, displayName: "Description" },
    { key: "status", rules: statusRules, displayName: "Status" },
    { key: "agentId", rules: agentIdRules, displayName: "Agent Id" },
];
function validateCase(body, isPartial = false) {
    const errors = {};
    if (Object.hasOwn(body, "id")) {
        errors["id"] = "You can't pass an id when making this request";
    }
    for (const config of exports.caseFieldConfigs) {
        const shouldValidate = Object.hasOwn(body, config.key) || !isPartial;
        if (shouldValidate) {
            const error = validateCaseField(body[config.key], config.rules, !isPartial, config.displayName);
            if (error) {
                errors[config.key] = error;
            }
        }
    }
    // For partial validation, ensure at least one field is provided
    if (isPartial) {
        const providedFields = exports.caseFieldConfigs
            .map((config) => config.key)
            .filter((field) => Object.hasOwn(body, field));
        if (providedFields.length === 0) {
            const fieldNames = exports.caseFieldConfigs.map((config) => config.displayName.toLowerCase()).join(", ");
            errors.body = `At least one field (${fieldNames}) must be provided for update`;
        }
    }
    return errors;
}
function validateCaseStatus(key) {
    return key in case_types_1.CaseStatus && typeof case_types_1.CaseStatus[key] === "number";
}
const validateCreateCase = (body) => validateCase(body, false);
exports.validateCreateCase = validateCreateCase;
const validatePutCase = (body) => validateCase(body, false);
exports.validatePutCase = validatePutCase;
const validatePatchCase = (body) => validateCase(body, true);
exports.validatePatchCase = validatePatchCase;
