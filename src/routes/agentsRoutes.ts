import express from "express";
import agentsController from "../controllers/agentsController";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - role
 *         - incorporationDate
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the agent
 *         name:
 *           type: string
 *           description: The agent's full name
 *         role:
 *           type: string
 *           enum: [Officer, Detective, Captain, Chief]
 *           description: The agent's role in the department
 *         incorporationDate:
 *           type: string
 *           format: date
 *           description: Date when the agent was incorporated into the department
 *       example:
 *         id: "507f1f77bcf86cd799439011"
 *         name: "John Smith"
 *         role: "Detective"
 *         incorporationDate: "2023-01-15"
 *
 *     CreateAgentBody:
 *       type: object
 *       required:
 *         - name
 *         - incorporationDate
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: The agent's full name
 *         incorporationDate:
 *           type: string
 *           format: date
 *           description: Date when the agent was incorporated into the department
 *         role:
 *           type: string
 *           enum: [Officer, Detective, Captain, Chief]
 *           description: The agent's role in the department
 *       example:
 *         name: "Jane Doe"
 *         incorporationDate: "2024-01-15"
 *         role: "Detective"
 *
 *     PutAgentBody:
 *       type: object
 *       required:
 *         - name
 *         - incorporationDate
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: The agent's full name
 *         incorporationDate:
 *           type: string
 *           format: date
 *           description: Date when the agent was incorporated into the department
 *         role:
 *           type: string
 *           enum: [Officer, Detective, Captain, Chief]
 *           description: The agent's role in the department
 *       example:
 *         name: "John Smith Updated"
 *         incorporationDate: "2023-01-15"
 *         role: "Captain"
 *
 *     PatchAgentBody:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The agent's full name
 *         incorporationDate:
 *           type: string
 *           format: date
 *           description: Date when the agent was incorporated into the department
 *         role:
 *           type: string
 *           enum: [Officer, Detective, Captain, Chief]
 *           description: The agent's role in the department
 *       example:
 *         name: "John Smith Updated"
 *         role: "Captain"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: HTTP status code
 *         message:
 *           type: string
 *           description: Error message
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of specific error messages
 *       example:
 *         status: 400
 *         message: "Invalid parameters"
 *         errors: ["Name is required", "Role must be valid"]
 */

/**
 * @openapi
 * tags:
 *   name: Agents
 *   description: Police agents management API
 */

/**
 * @openapi
 * /agents:
 *   get:
 *     summary: Get all agents
 *     tags: [Agents]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Officer, Detective, Captain, Chief]
 *         description: Optional filter agents by role
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [incorporationDate, -incorporationDate]
 *         description: Optional sort agents by incorporation date (ascending or descending)
 *     responses:
 *       200:
 *         description: List of all agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/agents", agentsController.getAllAgents);

/**
 * @openapi
 * /agents/{id}:
 *   get:
 *     summary: Get agent by ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The agent ID
 *     responses:
 *       200:
 *         description: Agent details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Invalid agent ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/agents/:id", agentsController.getAgentById);

/**
 * @openapi
 * /agents:
 *   post:
 *     summary: Create a new agent
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAgentBody'
 *     responses:
 *       201:
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Invalid request body or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post("/agents", agentsController.createAgent);

/**
 * @openapi
 * /agents/{id}:
 *   delete:
 *     summary: Delete an agent
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The agent ID
 *     responses:
 *       204:
 *         description: Agent deleted successfully
 *       400:
 *         description: Invalid agent ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Agent not found or failed to delete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.delete("/agents/:id", agentsController.deleteAgent);

/**
 * @openapi
 * /agents/{id}:
 *   put:
 *     summary: Update an agent (full replacement)
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The agent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PutAgentBody'
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Invalid request body or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.put("/agents/:id", agentsController.putAgent);

/**
 * @openapi
 * /agents/{id}:
 *   patch:
 *     summary: Partially update an agent
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The agent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchAgentBody'
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Invalid request body or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.patch("/agents/:id", agentsController.patchAgent);

export default router;
