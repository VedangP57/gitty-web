import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const DIST = "dist";
export const failures = [];
export const fail = (message) => failures.push(message);
export const read = (path) => readFileSync(path, "utf8");
export const page = (route) => {
  const path = join(DIST, route, "index.html");
  return existsSync(path) ? read(path) : null;
};
