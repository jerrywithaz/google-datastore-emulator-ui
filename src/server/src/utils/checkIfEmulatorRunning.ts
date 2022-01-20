import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkIfEmulatorRunning() {
  try {
    const { stderr, stdout } = await execAsync(
      `curl --write-out '%{http_code}' --silent --output /dev/null -X GET -L ${process.env.DATASTORE_EMULATOR_HOST}`
    );

    if (stdout.trim() === '200') {
      return true;
    }

    if (stderr) {
      return false;
    }

    return false;
  } catch (error) {
    return false;
  }
}

export default checkIfEmulatorRunning;
