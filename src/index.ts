import { readConfig, setUser } from "./config";

async function main() {
  await setUser("macrespo");
  const cfg = readConfig();
  console.log(JSON.stringify(cfg));
}

main();
