import { spawn } from "child_process";

function spawnProcess(command: string) {
  const child_process = spawn(command, {
    shell: true,
  });

  child_process.stderr.on("data", (data) => console.log(data.toString()));
  child_process.stdout.on("data", (data) => console.log(data.toString()));
  child_process.on("error", (error) => console.log(error));

  return child_process;
}

async function startServer() {
    const server = spawnProcess('cd server && npm run start');
}


async function startClient() {
    const client = spawnProcess('cd client && npm run start');
}

async function start() {
    await startServer();
    await startClient();
}

start();

export {};
