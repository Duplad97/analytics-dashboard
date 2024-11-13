import express from "express";
import cors from "cors";

//Routers
import userRouter from "./routers/user.router";
import stagesRouter from "./routers/stages.router";
import logRouter from "./routers/log.router";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/stages", stagesRouter);
app.use("/log", logRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`);
});
