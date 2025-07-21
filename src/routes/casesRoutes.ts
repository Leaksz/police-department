import express from "express";
import casesController from "../controllers/casesController";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Case:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - status
 *         - agentId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated unique identifier of the case
 *         title:
 *           type: string
 *           description: The title/name of the case
 *         description:
 *           type: string
 *           description: Detailed description of the case
 *         status:
 *           type: string
 *           enum: [Open, Solved]
 *           description: Current status of the case
 *         agentId:
 *           type: string
 *           description: ID of the agent assigned to this case
 *       example:
 *         id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46"
 *         title: "homicide"
 *         description: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos."
 *         status: "Open"
 *         agentId: "401bccf5-cf9e-489d-8412-446cd169a0f1"
 *
 *     CreateCaseBody:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: The title/name of the case
 *         description:
 *           type: string
 *           description: Detailed description of the case
 *         status:
 *           type: string
 *           enum: [Open, Solved]
 *           description: Optional status of the case (defaults to Open if not provided)
 *       example:
 *         title: "Burglary Investigation"
 *         description: "Break-in reported at 123 Main Street. Multiple items stolen including electronics and jewelry."
 *         status: "Open"
 *
 *     PutCaseBody:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: The title/name of the case
 *         description:
 *           type: string
 *           description: Detailed description of the case
 *         status:
 *           type: string
 *           enum: [Open, Solved]
 *           description: Optional status of the case
 *       example:
 *         title: "Burglary Investigation - Updated"
 *         description: "Break-in reported at 123 Main Street. Investigation ongoing with new leads."
 *         status: "Open"
 *
 *     PatchCaseBody:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title/name of the case
 *         description:
 *           type: string
 *           description: Detailed description of the case
 *         status:
 *           type: string
 *           enum: [Open, Solved]
 *           description: Status of the case
 *       example:
 *         status: "Solved"
 *         description: "Case resolved. Suspect apprehended and items recovered."
 */

/**
 * @openapi
 * tags:
 *   name: Cases
 *   description: Police cases management API
 */

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Get all cases
 *     tags: [Cases]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Open, Solved]
 *         description: Optional filter cases by status
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: string
 *         description: Optional filter cases by assigned agent ID
 *     responses:
 *       200:
 *         description: List of all cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Case'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/cases", casesController.getAllCases);

/**
 * @swagger
 * /cases/search:
 *   get:
 *     summary: Search cases
 *     tags: [Cases]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (searches in title and description)
 *     responses:
 *       200:
 *         description: List of cases matching search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Case'
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/cases/search", casesController.searchCase);

/**
 * @swagger
 * /cases/{id}:
 *   get:
 *     summary: Get case by ID
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The case ID
 *     responses:
 *       200:
 *         description: Case details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case'
 *       400:
 *         description: Invalid case ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/cases/:id", casesController.getCaseById);

/**
 * @swagger
 * /cases/{id}/agent:
 *   get:
 *     summary: Get the agent assigned to a case
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The case ID
 *     responses:
 *       200:
 *         description: Agent details assigned to the case
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 *       400:
 *         description: Invalid case ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Case not found or agent not assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/cases/:id/agent", casesController.getCaseAgent);

/**
 * @swagger
 * /cases:
 *   post:
 *     summary: Create a new case
 *     tags: [Cases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCaseBody'
 *     responses:
 *       201:
 *         description: Case created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case'
 *       400:
 *         description: Invalid request body or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post("/cases", casesController.createCase);

/**
 * @swagger
 * /cases/{id}:
 *   delete:
 *     summary: Delete a case
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The case ID
 *     responses:
 *       204:
 *         description: Case deleted successfully
 *       400:
 *         description: Invalid case ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Case not found or failed to delete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.delete("/cases/:id", casesController.deleteCase);

/**
 * @swagger
 * /cases/{id}:
 *   put:
 *     summary: Update a case (full replacement)
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The case ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PutCaseBody'
 *     responses:
 *       200:
 *         description: Case updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case'
 *       400:
 *         description: Invalid request body or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.put("/cases/:id", casesController.putCase);

/**
 * @swagger
 * /cases/{id}:
 *   patch:
 *     summary: Partially update a case
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The case ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchCaseBody'
 *     responses:
 *       200:
 *         description: Case updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case'
 *       400:
 *         description: Invalid request body or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.patch("/cases/:id", casesController.patchCase);

export default router;
