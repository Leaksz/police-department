"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatchAgent = exports.validatePutAgent = exports.validateCreateAgent = exports.agentFieldConfigs = void 0;
exports.validateAgentField = validateAgentField;
exports.validateAgent = validateAgent;
exports.isAgentRole = isAgentRole;
exports.isValidSortString = isValidSortString;
const agent_types_1 = require("../types/agent.types");
function validateAgentField(value, rules, isRequired, fieldName) {
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
const nameRules = [
    { condition: (name) => typeof name === "string", message: "Name must be a string" },
    { condition: (name) => name.trim().length > 0, message: "Name cannot be empty" },
    { condition: (name) => name.trim().length >= 2, message: "Name must be at least 2 characters long" },
    { condition: (name) => name.trim().length <= 100, message: "Name cannot exceed 100 characters" },
];
const roleRules = [
    { condition: (role) => typeof role === "string", message: "Role must be a string" },
    { condition: (role) => role.trim().length > 0, message: "Role cannot be empty" },
    {
        condition: (role) => isAgentRole(role),
        message: `Role is not valid. Valid roles are: ${Object.values(agent_types_1.AgentRole)
            .filter((role) => isNaN(Number(role)))
            .join(", ")}`,
    },
];
const incorporationDateRules = [
    { condition: (date) => typeof date === "string", message: "Incorporation date must be a string" },
    {
        condition: (date) => /^\d{4}\/\d{2}\/\d{2}$/.test(date),
        message: "Incorporation date must follow the 'YYYY/MM/DD' format",
    },
    {
        condition: (date) => !isNaN(new Date(date).getTime()),
        message: "Incorporation date must be a valid date",
    },
];
exports.agentFieldConfigs = [
    { key: "name", rules: nameRules, displayName: "Name" },
    { key: "role", rules: roleRules, displayName: "Role" },
    { key: "incorporationDate", rules: incorporationDateRules, displayName: "Incorporation Date" },
];
function validateAgent(body, isPartial = false) {
    const errors = {};
    if (Object.hasOwn(body, "id")) {
        errors["id"] = "You can't pass an id when making this request";
    }
    for (const config of exports.agentFieldConfigs) {
        const shouldValidate = Object.hasOwn(body, config.key) || !isPartial;
        if (shouldValidate) {
            const error = validateAgentField(body[config.key], config.rules, !isPartial, config.displayName);
            if (error) {
                errors[config.key] = error;
            }
        }
    }
    // For partial validation, ensure at least one field is provided
    if (isPartial) {
        const providedFields = exports.agentFieldConfigs
            .map((config) => config.key)
            .filter((field) => Object.hasOwn(body, field));
        if (providedFields.length === 0) {
            const fieldNames = exports.agentFieldConfigs.map((config) => config.displayName.toLowerCase()).join(", ");
            errors.body = `At least one field (${fieldNames}) must be provided for update`;
        }
    }
    return errors;
}
function isAgentRole(key) {
    return key in agent_types_1.AgentRole && typeof agent_types_1.AgentRole[key] === "number";
}
function isValidSortString(key) {
    return key in agent_types_1.SortStrings && typeof agent_types_1.SortStrings[key] === "number";
}
const validateCreateAgent = (body) => validateAgent(body, false);
exports.validateCreateAgent = validateCreateAgent;
const validatePutAgent = (body) => validateAgent(body, false);
exports.validatePutAgent = validatePutAgent;
const validatePatchAgent = (body) => validateAgent(body, true);
exports.validatePatchAgent = validatePatchAgent;
