import { exec } from "child_process";
import { promisify } from "util";
import env from "../env";

const execAsync = promisify(exec);

async function checkIfEmulatorRunning() {
  try {
    const { stderr, stdout } = await execAsync(
      `curl -X GET -L ${env.DATASTORE_EMULATOR_HOST}`
    );

    if (stderr) {
      return false;
    }

    if (stdout === "ok") {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

export default checkIfEmulatorRunning;
