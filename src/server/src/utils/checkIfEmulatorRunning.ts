import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkIfEmulatorRunning() {
  try {
    const { stderr, stdout } = await execAsync(
      `curl -X GET -L ${process.env.DATASTORE_EMULATOR_HOST}`
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
