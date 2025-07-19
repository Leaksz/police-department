import express from "express";
import casesController from "../controllers/casesController";

const router = express.Router();

router.get("/cases", casesController.getAllCases);
router.get("/cases/search", casesController.searchCase);
router.get("/cases/:id", casesController.getCaseById);
router.get("/cases/:id/agent", casesController.getCaseAgent);

router.post("/cases", casesController.createCase);

router.delete("/cases/:id", casesController.deleteCase);

router.put("/cases/:id", casesController.putCase);

router.patch("/cases/:id", casesController.patchCase);

export default router;
