import os from "node:os";
import path from "node:path";
import fs from "node:fs";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath() {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config) {
  const content = JSON.stringify(cfg);
  fs.writeFileSync(getConfigFilePath(), content);
}

function validateConfig(rawConfig: any) {
  const cfg: Config = JSON.parse(rawConfig);
  return cfg;
}

export function readConfig() {
  const rawCfg = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" });
  return validateConfig(rawCfg);
}

export async function setUser(username: string) {
  const cfg = readConfig();
  cfg.currentUserName = username;
  writeConfig(cfg);
}
