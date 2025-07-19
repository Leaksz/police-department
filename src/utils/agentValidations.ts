import { AgentRole } from "types/agent.types";

interface ValidateAgentInput {
    name?: unknown;
    role?: unknown;
    incorporationDate?: unknown;
}

type ValidationRule<T> = {
    condition: (value: T) => boolean;
    message: string;
};

function validateField<T>(
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
    { condition: (v) => typeof v === "string", message: "Name must be a string" },
    { condition: (v) => v.trim().length > 0, message: "Name cannot be empty" },
    { condition: (v) => v.trim().length >= 2, message: "Name must be at least 2 characters long" },
    { condition: (v) => v.trim().length <= 100, message: "Name cannot exceed 100 characters" },
];

const roleRules: ValidationRule<string>[] = [
    { condition: (v) => typeof v === "string", message: "Role must be a string" },
    { condition: (v) => v.trim().length > 0, message: "Role cannot be empty" },
    {
        condition: (v) => isAgentRole(v),
        message: `Role is not valid. Valid roles are: ${Object.values(AgentRole).join(", ")}`,
    },
];

const incorporationDateRules: ValidationRule<string>[] = [
    { condition: (v) => typeof v === "string", message: "Incorporation date must be a string" },
    {
        condition: (v) => /^\d{4}\/\d{2}\/\d{2}$/.test(v),
        message: "Incorporation date must follow the 'YYYY/MM/DD' format",
    },
    {
        condition: (v) => !isNaN(new Date(v).getTime()),
        message: "Incorporation date must be a valid date",
    },
];

// Field configuration for easy management
const fieldConfigs = [
    { key: "name", rules: nameRules, displayName: "Name" },
    { key: "role", rules: roleRules, displayName: "Role" },
    { key: "incorporationDate", rules: incorporationDateRules, displayName: "Incorporation Date" },
] as const;

export function validateAgent(body: ValidateAgentInput, isPartial = false) {
    const errors: Record<string, string> = {};

    for (const config of fieldConfigs) {
        const shouldValidate = body.hasOwnProperty(config.key) || !isPartial;

        if (shouldValidate) {
            const error = validateField(body[config.key], config.rules, !isPartial, config.displayName);

            if (error) {
                errors[config.key] = error;
            }
        }
    }

    // For partial validation, ensure at least one field is provided
    if (isPartial) {
        const providedFields = fieldConfigs.map((config) => config.key).filter((field) => body.hasOwnProperty(field));

        if (providedFields.length === 0) {
            const fieldNames = fieldConfigs.map((config) => config.displayName.toLowerCase()).join(", ");
            errors.body = `At least one field (${fieldNames}) must be provided for update`;
        }
    }

    return errors;
}

export function hasValidationErrors(errors: Record<string, string>): boolean {
    return Object.keys(errors).length > 0;
}

export default function isAgentRole(key: string): key is keyof typeof AgentRole {
    return key in AgentRole && typeof AgentRole[key as keyof typeof AgentRole] === "number";
}

export const validateCreateAgent = (body: ValidateAgentInput) => validateAgent(body, false);
export const validatePutAgent = (body: ValidateAgentInput) => validateAgent(body, false);
export const validatePatchAgent = (body: ValidateAgentInput) => validateAgent(body, true);
