import { setUser, readConfig } from "./config";
import {
  getUserByName,
  createUser,
  deleteAllUsers,
  getUsers,
} from "./lib/db/queries/users";

export async function handleLogin(_: string, ...args: string[]) {
  if (!args.length) {
    throw new Error("A user is expected as argument");
  }
  const exist = await getUserByName(args[0]);
  if (!exist) {
    throw new Error("User doesn't exist");
  }
  setUser(args[0]);
  console.log(`User ${args[0]} has been set`);
}

export async function handleRegister(_: string, ...args: string[]) {
  if (!args.length) {
    throw new Error("A user is expected as argument");
  }
  const alreadyExist = await getUserByName(args[0]);
  if (alreadyExist) {
    throw new Error(`User ${args[0]} already exist`);
  }
  await createUser(args[0]);
  setUser(args[0]);
  console.log(`User ${args[0]} has successfully been created`);
}

export async function handleReset(_: string) {
  await deleteAllUsers();
  console.log("All users successfully deleted");
}

export async function handleUsers(_: string) {
  const users = await getUsers();
  const currentUser = readConfig().currentUserName;
  for (let i = 0; i < users.length; i++) {
    console.log(
      `* ${users[i].name} ${users[i].name === currentUser ? "(current)" : ""}`,
    );
  }
}
