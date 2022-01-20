import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { exec, spawn, spawnSync } from "child_process";
import { promisify } from "util";
import { DatastoreBackup } from "./types";
import removeTrailingSlash from "../../utils/removeTrailingSlash";
import * as fs from "fs";
import * as path from "path";
import env from "../../env";
import ValidateEmulatorRunning from "../../decorators/ValidateEmulatorRunning";
import ValidateEnv from "../../decorators/ValidateEnv";

const execAsync = promisify(exec);

function getBackupName(backup: string) {
  return backup
    .replace(`gs://${env.DATASTORE_BACKUP_BUCKET}`, "")
    .replace(/\//g, "");
}

function getDate(backup: string) {
  const date = getBackupName(backup).replace(/_\d+/, "");

  return new Date(date);
}

function getBackupInfo(backup: string) {
  const name = getBackupName(backup);
  const potential_path = path.join(env.DATASTORE_BACKUP_DIR, name);
  const exists = fs.existsSync(path.resolve(potential_path));

  return { exists, path: potential_path };
}

@Resolver()
class GsUtilResolver {
  @Query(() => String)
  async getProjectId(): Promise<string> {
    return env.PROJECT_ID;
  }

  @Query(() => [DatastoreBackup])
  @ValidateEnv(['DATASTORE_BACKUP_BUCKET'])
  async getBackups(): Promise<DatastoreBackup[]> {
    const { stdout, stderr } = await execAsync(
      `gsutil ls gs://${env.DATASTORE_BACKUP_BUCKET}`
    );

    const backups = stdout
      .trim()
      .split(/\n/)
      .map((backup) => {
        return {
          id: removeTrailingSlash(backup),
          name: getBackupName(backup),
          date: getDate(backup),
          ...getBackupInfo(backup),
        };
      });

    if (stderr) {
      throw new Error(stderr);
    }

    return backups;
  }

  @Mutation(() => String)
  @ValidateEnv(['DATASTORE_BACKUP_BUCKET', 'PROJECT_ID'])
  async startBackup(): Promise<string> {
    const command = `gcloud datastore export gs://${env.DATASTORE_BACKUP_BUCKET} --project='${env.PROJECT_ID}' --format=json`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      throw new Error(stderr);
    }

    const {
      metadata: { outputUrlPrefix },
    } = JSON.parse(stdout);

    const timestamp = outputUrlPrefix.split("/").pop();

    return timestamp;
  }

  @Mutation(() => String)
  @ValidateEnv(['DATASTORE_BACKUP_BUCKET', 'DATASTORE_BACKUP_DIR'])
  async downloadBackup(@Arg("name") name: string): Promise<string> {
    const backup_bucket = env.DATASTORE_BACKUP_BUCKET;
    const outputDir = path.join(env.DATASTORE_BACKUP_DIR, name);

    const command = `gsutil -o GSUtil:parallel_process_count=1 -m cp -r "gs://${backup_bucket}/${name}/${name}.overall_export_metadata" "gs://${backup_bucket}/${name}/all_namespaces/" ${outputDir}`;

    fs.mkdirSync(outputDir);

    const { stderr } = await execAsync(command);

    if (stderr) {
      throw new Error(stderr);
    }

    return name;
  }

  @Mutation(() => String)
  @ValidateEmulatorRunning()
  async importBackup(@Arg("name") name: string): Promise<string> {
    const input_url = path.join(
      env.DATASTORE_BACKUP_DIR,
      `${name}/${name}.overall_export_metadata`
    );
    const url = `${env.DATASTORE_PROJECT_URL}:import`;

    const command = `curl -d '{"input_url": "${input_url}"}' -H 'Content-Type: application/json' -X POST ${url}`;

    const { stderr } = await execAsync(command);

    if (stderr) {
      throw new Error(stderr);
    }

    return name;
  }
}

export default GsUtilResolver;
