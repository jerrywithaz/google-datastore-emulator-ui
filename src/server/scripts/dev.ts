require('dotenv').config();

import bootstrap from '../src';

const projectId = process.env.PROJECT_ID || '';
const emulatorHost = process.env.DATASTORE_EMULATOR_HOST || '';
const backupBucket = process.env.DATASTORE_BACKUP_BUCKET || '';
const backupDir = process.env.DATASTORE_BACKUP_DIR || '';
const port = Number(process.env.SERVER_PORT) || 8002;

bootstrap({ projectId, emulatorHost, port, backupBucket, backupDir }).catch(console.error);