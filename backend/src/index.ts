import express from "express";

//Routers
import userRouter from "./routers/user.router";
import stagesRouter from "./routers/stages.router";

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/stages", stagesRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`);
});
