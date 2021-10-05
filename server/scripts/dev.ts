import bootstrap from '../src';

const projectId = process.env.PROJECT_ID || '';
const emulatorHost = process.env.DATASTORE_EMULATOR_HOST || '';

bootstrap({ projectId, emulatorHost });