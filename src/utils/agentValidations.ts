import { AgentRole, SortStrings } from "types/agent.types";

interface ValidateAgentInput {
    id?: unknown;
    name?: unknown;
    role?: unknown;
    incorporationDate?: unknown;
}

type ValidationRule<T> = {
    condition: (value: T) => boolean;
    message: string;
};

export function validateAgentField<T>(
    value: unknown,
    rules: ValidationRule<T>[],
    isRequired: boolean,
    fieldName: string
): string | null {
    if (!value) {
        return isRequired ? `${fieldName} field is required` : null;
    }

    for (const rule of rules) {
        if (!rule.condition(value as T)) {
            return rule.message;
        }
    }

    return null;
}

// Validation Rules
const nameRules: ValidationRule<string>[] = [
    { condition: (name) => typeof name === "string", message: "Name must be a string" },
    { condition: (name) => name.trim().length > 0, message: "Name cannot be empty" },
    { condition: (name) => name.trim().length >= 2, message: "Name must be at least 2 characters long" },
    { condition: (name) => name.trim().length <= 100, message: "Name cannot exceed 100 characters" },
];

const roleRules: ValidationRule<string>[] = [
    { condition: (role) => typeof role === "string", message: "Role must be a string" },
    { condition: (role) => role.trim().length > 0, message: "Role cannot be empty" },
    {
        condition: (role) => isAgentRole(role),
        message: `Role is not valid. Valid roles are: ${Object.values(AgentRole)
            .filter((role) => isNaN(Number(role)))
            .join(", ")}`,
    },
];

const incorporationDateRules: ValidationRule<string>[] = [
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

export const agentFieldConfigs = [
    { key: "name", rules: nameRules, displayName: "Name" },
    { key: "role", rules: roleRules, displayName: "Role" },
    { key: "incorporationDate", rules: incorporationDateRules, displayName: "Incorporation Date" },
] as const;

export function validateAgent(body: ValidateAgentInput, isPartial = false) {
    const errors: Record<string, string> = {};

    if (Object.hasOwn(body, "id")) {
        errors["id"] = "You can't pass an id when making this request";
    }

    for (const config of agentFieldConfigs) {
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
        const providedFields = agentFieldConfigs
            .map((config) => config.key)
            .filter((field) => Object.hasOwn(body, field));

        if (providedFields.length === 0) {
            const fieldNames = agentFieldConfigs.map((config) => config.displayName.toLowerCase()).join(", ");
            errors.body = `At least one field (${fieldNames}) must be provided for update`;
        }
    }

    return errors;
}

export function isAgentRole(key: string): key is keyof typeof AgentRole {
    return key in AgentRole && typeof AgentRole[key as keyof typeof AgentRole] === "number";
}

export function isValidSortString(key: string) {
    return key in SortStrings && typeof SortStrings[key as keyof typeof SortStrings] === "number";
}

export const validateCreateAgent = (body: ValidateAgentInput) => validateAgent(body, false);
export const validatePutAgent = (body: ValidateAgentInput) => validateAgent(body, false);
export const validatePatchAgent = (body: ValidateAgentInput) => validateAgent(body, true);
