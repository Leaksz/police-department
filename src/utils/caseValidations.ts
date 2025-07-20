import agentsRepository from "repositories/agentsRepository";
import { CaseStatus } from "types/case.types";

interface ValidateCaseInput {
    title?: unknown;
    description?: unknown;
    status?: unknown;
    agentId?: unknown;
}

type ValidationRule<T> = {
    condition: (value: T) => boolean;
    message: string;
};

export function validateCaseField<T>(
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
const titleRules: ValidationRule<string>[] = [
    { condition: (title) => typeof title === "string", message: "Title must be a string" },
    { condition: (title) => title.trim().length > 0, message: "Title cannot be empty" },
    { condition: (title) => title.trim().length >= 2, message: "Title must be at least 2 characters long" },
    { condition: (title) => title.trim().length <= 100, message: "Title cannot exceed 100 characters" },
];

const descriptionRules: ValidationRule<string>[] = [
    { condition: (description) => typeof description === "string", message: "Description must be a string" },
    { condition: (description) => description.trim().length > 0, message: "Description cannot be empty" },
    {
        condition: (description) => description.trim().length >= 2,
        message: "Description must be at least 2 characters long",
    },
];

const statusRules: ValidationRule<string>[] = [
    { condition: (status) => typeof status === "string", message: "Role must be a string" },
    { condition: (status) => status.trim().length > 0, message: "Role cannot be empty" },
    {
        condition: (status) => validateCaseStatus(status),
        message: `Status is not valid. Valid status are: ${Object.values(CaseStatus)
            .filter((status) => isNaN(Number(status)))
            .join(", ")}`,
    },
];

const agentIdRules: ValidationRule<string>[] = [
    { condition: (agentId) => typeof agentId === "string", message: "Agent Id must be a string" },
    {
        condition: (agentId) => agentsRepository.findById(agentId) !== undefined,
        message: `Provided agent id is not a valid`,
    },
];

export const caseFieldConfigs = [
    { key: "title", rules: titleRules, displayName: "Title" },
    { key: "description", rules: descriptionRules, displayName: "Description" },
    { key: "status", rules: statusRules, displayName: "Status" },
    { key: "agentId", rules: agentIdRules, displayName: "Agent Id" },
] as const;

export function validateCase(body: ValidateCaseInput, isPartial = false) {
    const errors: Record<string, string> = {};

    if (Object.hasOwn(body, "id")) {
        errors["id"] = "You can't pass an id when making this request";
    }

    for (const config of caseFieldConfigs) {
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
        const providedFields = caseFieldConfigs
            .map((config) => config.key)
            .filter((field) => Object.hasOwn(body, field));

        if (providedFields.length === 0) {
            const fieldNames = caseFieldConfigs.map((config) => config.displayName.toLowerCase()).join(", ");
            errors.body = `At least one field (${fieldNames}) must be provided for update`;
        }
    }

    return errors;
}

export function validateCaseStatus(key: string): key is keyof typeof CaseStatus {
    return key in CaseStatus && typeof CaseStatus[key as keyof typeof CaseStatus] === "number";
}

export const validateCreateCase = (body: ValidateCaseInput) => validateCase(body, false);
export const validatePutCase = (body: ValidateCaseInput) => validateCase(body, false);
export const validatePatchCase = (body: ValidateCaseInput) => validateCase(body, true);
