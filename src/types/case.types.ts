export interface Case {
    id: string;
    title: string;
    description: string;
    status: CaseStatus;
    agentId: string;
}

export enum CaseStatus {
    Open,
    Solved,
}

// Request bodies
export interface CreateCaseBody extends Omit<Case, "id" | "status"> {
    status: string;
}

export interface PutCaseBody extends CreateCaseBody {}
export interface PatchCaseBody extends Partial<PutCaseBody> {}

// Route parameters
export interface CaseIdParams extends Pick<Case, "id"> {}

// Request queries
export interface GetAllCasesQuery {
    agentId?: string;
    status?: string;
}

export interface SearchCaseQuery {
    q: string;
}

// Type aliases
export type UpdateCaseParams = CaseIdParams;
export type DeleteCaseParams = CaseIdParams;
export type GetCaseByIdParams = CaseIdParams;
export type GetCaseAgentParams = CaseIdParams;
