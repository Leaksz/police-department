import express from "express";
import agentsRouter from "./routes/agentsRoutes";
import casesRouter from "./routes/casesRoutes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const isDev = process.env.NODE_ENV !== "production";

const app = express();
const PORT = process.env.PORT;

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Police Department",
            version: "1.0.0",
        },
    },
    apis: isDev
        ? ["./src/routes/*.ts"] // Development: TypeScript files
        : ["./build/routes/*.js"],
};

const swaggerSpecification = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

app.use(express.json());

app.use(agentsRouter);
app.use(casesRouter);

app.listen(PORT, () => {
    console.log(`Police Department running on localhost:${PORT}`);
});
