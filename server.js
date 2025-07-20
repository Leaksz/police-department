"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agentsRoutes_1 = __importDefault(require("./routes/agentsRoutes"));
const casesRoutes_1 = __importDefault(require("./routes/casesRoutes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const isDev = process.env.NODE_ENV !== "production";
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const options = {
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
const swaggerSpecification = (0, swagger_jsdoc_1.default)(options);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpecification));
app.use(express_1.default.json());
app.use(agentsRoutes_1.default);
app.use(casesRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Police Department running on localhost:${PORT}`);
});
