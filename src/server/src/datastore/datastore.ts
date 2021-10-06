import { Datastore } from '@google-cloud/datastore';

function createDatastore() {
    return new Datastore({
        projectId: process.env.PROJECT_ID,
        apiEndpoint: process.env.DATASTORE_EMULATOR_HOST,
    });
}

export default createDatastore;



