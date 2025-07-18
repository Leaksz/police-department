export interface CreateAgentBody {
    name: string;
    incorporationDate: string;
    role: string;
}

export interface DeleteAgentParams {
    id: string;
}

export interface GetAgentByIdParams {
    id: string;
}
