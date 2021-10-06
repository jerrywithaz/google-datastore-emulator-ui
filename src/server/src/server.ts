import express from "express";
import cors from 'cors';
import createDatastore from "./datastore";
import isNullOrUndefined from "./utils/isNullOrUndefined";

type BoostrapOptions = {
  projectId: string;
  emulatorHost: string;
};

const port = 8002;

function boostrap({ projectId, emulatorHost }: BoostrapOptions) {
  process.env.PROJECT_ID = projectId;
  process.env.DATASTORE_EMULATOR_HOST = emulatorHost;

  console.log('PROJECT_ID', projectId);
  console.log('DATASTORE_EMULATOR_HOST', emulatorHost);

  const app = express();
  const datastore = createDatastore();

  app.use(cors());

  app.get("/datastore/namespaces", async (_, res) => {
    try {
      const query = datastore.createQuery("__namespace__").select("__key__");
      const results = await datastore.runQuery(query);
      const namespaces = results[0]
        .map((e) => e[datastore.KEY].name)
        .filter(isNullOrUndefined);

      res.contentType("application/json");
      res.status(200);
      res.send(namespaces);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  });

  app.get("/datastore/kinds", async (_, res) => {
    try {
      const query = datastore.createQuery("__kind__").select("__key__");
      const results = await datastore.runQuery(query);
      const kinds = results[0]
        .map((e) => e[datastore.KEY].name)
        .filter(isNullOrUndefined);

      res.contentType("application/json");
      res.status(200);
      res.send(kinds);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  });

  app.get("/datastore/entities/:kind", async (req, res) => {
    try {
      const kind = req.params.kind;
      const query = datastore.createQuery(kind);
      const results = await datastore.runQuery(query);
      const entities = results[0].filter(isNullOrUndefined);

      res.contentType("application/json");
      res.status(200);
      res.send(entities);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  });

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

export default boostrap;
