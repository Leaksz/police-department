import type { Request, Response } from "express";

import casesRepository from "../repositories/casesRepository";
import { GetCaseByIdParams } from "types/case.types";

export function getAllCases(request: Request, response: Response) {
    console.log(request.query);
    const cases = casesRepository.findAll();
    response.json(cases);
}

function getCaseById(request: Request<GetCaseByIdParams>, response: Response) {
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            status: 400,
            message: "Invalid parameters",
        });
    }

    const caseRecord = casesRepository.findById(id);
    if (!caseRecord) {
        return response.status(404).send({
            status: 404,
            message: `Invalid ID`,
            errors: [`Agent with id '${id}' not found`],
        });
    }

    return response.send(caseRecord);
}

export default {
    getAllCases,
};
