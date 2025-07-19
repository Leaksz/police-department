import express from "express";
import agentsController from "../controllers/agentsController";

const router = express.Router();

router.get("/agents", agentsController.getAllAgents);
router.get("/agents/:id", agentsController.getAgentById);

router.post("/agents", agentsController.createAgent);

router.delete("/agents/:id", agentsController.deleteAgent);

router.put("/agents/:id", agentsController.putAgent);

router.patch("/agents/:id", agentsController.patchAgent);

export default router;
