require('dotenv').config();

import bootstrap from '../src';

const projectId = process.env.PROJECT_ID || '';
const emulatorHost = process.env.DATASTORE_EMULATOR_HOST || '';
const port = Number(process.env.SERVER_PORT) || 8002;

bootstrap({ projectId, emulatorHost, port }).catch(console.error);