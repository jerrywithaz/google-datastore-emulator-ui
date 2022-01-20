import { createMethodDecorator } from "type-graphql";
import { Context } from "../types";
import checkIfEmulatorRunning from "../utils/checkIfEmulatorRunning";

function ValidateEmulatorRunning() {
  return createMethodDecorator<Context>(async (_, next) => {

    const emulatorRunning = await checkIfEmulatorRunning();

    if (!emulatorRunning) {
      throw new Error(
        `Unable to connect to google datastore emulator running at: ${process.env.DATASTORE_EMULATOR_HOST}. \nMake sure you either set the environment variable DATASTORE_EMULATOR_HOST or run the google-datastore-emulator with the -e or --emulator-host option.`
      );
    }

    return next();
  });
}

export default ValidateEmulatorRunning;
