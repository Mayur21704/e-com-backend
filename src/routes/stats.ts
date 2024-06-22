import express from "express";
import { AdminOnly } from "../middlewares/auth.js";
import {
  getBarChartStats,
  getDashBoardStats,
  getLineChartStats,
  getPieChartStats,
} from "../controllers/stats.js";

const app = express.Router();

app.get("/stats", AdminOnly, getDashBoardStats);

app.get("/pie", AdminOnly, getPieChartStats);

app.get("/bar", AdminOnly, getBarChartStats);

app.get("/line", AdminOnly, getLineChartStats);

export default app;
