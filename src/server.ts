import express from "express";
import agentsRouter from "./routes/agentsRoutes";
import casesRouter from "./routes/casesRoutes";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(agentsRouter);
app.use(casesRouter);

app.listen(PORT, () => {
    console.log("Police Department running on localhost:", PORT);
});
