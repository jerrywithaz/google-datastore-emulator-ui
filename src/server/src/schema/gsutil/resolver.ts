import { Query, Resolver } from "type-graphql";
import { exec } from "child_process";
import { promisify } from "util";
import { DatastoreBackup } from "./types";
import removeTrailingSlash from "../../utils/removeTrailingSlash";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

function getDate(backup: string, bucket: string) {
  const date = backup
    .replace(`gs://${bucket}`, "")
    .replace(/_\d+/, "")
    .replace(/\//g, "");

  return new Date(date);
}

function getBackupInfo(backup: string, bucket: string) {
  const backup_dir = process.env.DATASTORE_BACKUP_DIR;

  if (backup_dir) {
    const name = backup.replace(`gs://${bucket}`, "");
    const potential_path = path.join(backup_dir, name);
    const exists = fs.existsSync(path.resolve(potential_path));

    return { exists, path: potential_path };
  }
  return { exists: false, path: undefined };
}

@Resolver()
class GsUtilResolver {
  @Query(() => [DatastoreBackup])
  async getBackups(): Promise<DatastoreBackup[]> {
    const bucket = process.env.DATASTORE_BACKUP_BUCKET;

    const { stdout, stderr } = await execAsync(`gsutil ls gs://${bucket}`);

    const backups = stdout
      .trim()
      .split(/\n/)
      .map((backup) => {
        return {
          id: removeTrailingSlash(backup),
          name: removeTrailingSlash(backup),
          date: getDate(backup, bucket as string),
          ...getBackupInfo(backup, bucket as string),
        };
      });

    if (stderr) {
      throw new Error(stderr);
    }

    return backups;
  }
}

export default GsUtilResolver;
