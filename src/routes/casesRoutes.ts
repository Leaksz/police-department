import express from "express";
import casesController from "../controllers/casesController";

const router = express.Router();

router.get("/cases", casesController.getAllCases);

export default router;
