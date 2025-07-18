export enum CaseStatus {
    Open,
    Solved,
}

interface Case {
    id: string;
    title: string;
    description: string;
    status: CaseStatus;
    agentsIds: string[];
}

const cases: Case[] = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        title: "homicide",
        description:
            "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: CaseStatus.Open,
        agentsIds: ["401bccf5-cf9e-489d-8412-446cd169a0f1"],
    },
];

function findAll(): Case[] {
    return cases;
}

export default {
    findAll,
};
