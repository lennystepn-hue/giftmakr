import express from "express";
import cors from "cors";
import recommendRouter from "./routes/recommend.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/recommend", recommendRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
