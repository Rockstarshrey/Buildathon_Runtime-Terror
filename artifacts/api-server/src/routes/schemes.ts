import { Router, type IRouter } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";
import { GetGovernmentSchemesResponse } from "@workspace/api-zod";

const DATA_FILE = resolve(process.cwd(), "src/data/schemes.json");

const router: IRouter = Router();

router.get("/", (_req, res) => {
  const raw = readFileSync(DATA_FILE, "utf-8");
  const data = GetGovernmentSchemesResponse.parse(JSON.parse(raw));
  res.json(data);
});

export default router;
