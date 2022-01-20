import { createMethodDecorator } from "type-graphql";
import { Context } from "../types";

const hints: Record<string, string> = {
  'DATASTORE_BACKUP_BUCKET': 'You can either set the envionrment variable or run google-datastore-emulator-ui with the -b or --backup-bucket option.',
  'PROJECT_ID': 'You can either set the envionrment variable or run google-datastore-emulator-ui with the -i or --id option.',
  'DATASTORE_BACKUP_DIR': 'You can either set the envionrment variable or run google-datastore-emulator-ui with the -d or --backup-dir option.'
}

function ValidateEnv(vars: string | string[]) {
  return createMethodDecorator<Context>(async (_, next) => {

    const varsToCheck = Array.isArray(vars) ? vars : [vars];

    for (const varToCheck of varsToCheck) {
      if (!process.env[varToCheck]) {
        throw new Error(
          `The envionment variable ${varToCheck} is not set. ${hints[varToCheck]}`
        );
      }
    }

    return next();
  });
}

export default ValidateEnv;
