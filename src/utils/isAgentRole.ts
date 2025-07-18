import { AgentRole } from "repositories/agentsRepository";

export default function isAgentRole(key: string): key is keyof typeof AgentRole {
    return key in AgentRole && typeof AgentRole[key as keyof typeof AgentRole] === "number";
}
