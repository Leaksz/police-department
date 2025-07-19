export interface Agent {
    id: string;
    name: string;
    role: AgentRole;
    incorporationDate: string;
}

export enum AgentRole {
    Officer,
    Detective,
    Captain,
    Chief,
}

// Request bodies
export interface CreateAgentBody extends Omit<Agent, "id" | "role"> {
    role: string;
}

export interface PutAgentBody extends CreateAgentBody {}
export interface PatchAgentBody extends Partial<PutAgentBody> {}

// Route parameters
export interface AgentIdParams extends Pick<Agent, "id"> {}

// Type aliases
export type UpdateAgentParams = AgentIdParams;
export type DeleteAgentParams = AgentIdParams;
export type GetAgentByIdParams = AgentIdParams;
