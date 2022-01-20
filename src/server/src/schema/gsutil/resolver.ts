import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { exec } from "child_process";
import { promisify } from "util";
import { DatastoreBackup } from "./types";
import removeTrailingSlash from "../../utils/removeTrailingSlash";
import * as fs from "fs";
import * as path from "path";
import ValidateEmulatorRunning from "../../decorators/ValidateEmulatorRunning";
import ValidateEnv from "../../decorators/ValidateEnv";
import { Context } from "../../types";

const execAsync = promisify(exec);

function getBackupName(backup: string, bucket: string) {
  return backup
    .replace(`gs://${bucket}`, "")
    .replace(/\//g, "");
}

function getDate(backup: string, bucket: string) {
  const date = getBackupName(backup, bucket).replace(/_\d+/, "");

  return new Date(date);
}

function getBackupInfo(backup: string, backupDir: string, bucket: string) {
  const name = getBackupName(backup, bucket);
  const potential_path = path.join(backupDir, name);
  const exists = fs.existsSync(path.resolve(potential_path));

  return { exists, path: potential_path };
}

@Resolver()
class GsUtilResolver {
  @Query(() => String)
  async getProjectId(@Ctx() { env }: Context): Promise<string> {
    return env.PROJECT_ID;
  }

  @Query(() => [DatastoreBackup])
  @ValidateEnv(['DATASTORE_BACKUP_BUCKET'])
  async getBackups(@Ctx() { env }: Context): Promise<DatastoreBackup[]> {
    const { stdout, stderr } = await execAsync(
      `gsutil ls gs://${env.DATASTORE_BACKUP_BUCKET}`
    );

    const backups = stdout
      .trim()
      .split(/\n/)
      .map((backup) => {
        return {
          id: removeTrailingSlash(backup),
          name: getBackupName(backup, env.DATASTORE_BACKUP_BUCKET),
          date: getDate(backup, env.DATASTORE_BACKUP_BUCKET),
          ...getBackupInfo(backup, env.DATASTORE_BACKUP_DIR, env.DATASTORE_BACKUP_BUCKET),
        };
      });

    if (stderr) {
      throw new Error(stderr);
    }

    return backups;
  }

  @Mutation(() => String)
  @ValidateEnv(['DATASTORE_BACKUP_BUCKET', 'PROJECT_ID'])
  async startBackup(@Ctx() { env }: Context): Promise<string> {
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
  async downloadBackup(@Arg("name") name: string, @Ctx() { env }: Context): Promise<string> {
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
  async importBackup(@Arg("name") name: string, @Ctx() { env }: Context): Promise<string> {
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
