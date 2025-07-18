import type { Request, Response } from "express";

import casesRepository from "../repositories/casesRepository";

export function getAllCases(request: Request, response: Response) {
    const cases = casesRepository.findAll();
    response.json(cases);
}

export default {
    getAllCases,
};
