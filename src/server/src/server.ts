import express from "express";
import cors from 'cors';
import createDatastore from "./datastore";
import isNullOrUndefined from "./utils/isNullOrUndefined";

type BoostrapOptions = {
  projectId: string;
  emulatorHost: string;
  port: number;
};

function setEnv({ projectId, emulatorHost, port }: BoostrapOptions) {
  process.env.PROJECT_ID = projectId;
  process.env.DATASTORE_EMULATOR_HOST = emulatorHost;
  process.env.SERVER_PORT = port.toString();
}

function boostrap({ projectId, emulatorHost, port }: BoostrapOptions) {
  setEnv({ projectId, emulatorHost, port });

  console.log('PROJECT_ID', projectId);
  console.log('DATASTORE_EMULATOR_HOST', emulatorHost);

  const app = express();
  const datastore = createDatastore();

  app.enable('trust proxy');

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
      const page = Number(req.query.page as string) || 0;
      const pageSize = Number(req.query.pageSize as string) || 25;
      const query = datastore.createQuery(kind).limit(pageSize).offset(page * pageSize);

      const results = await datastore.runQuery(query);
      const entities = results[0].filter(isNullOrUndefined).map((e) => ({ ...e, __key__: e[datastore.KEY].name || e[datastore.KEY].id}));
      const info = results[1];

      res.contentType("application/json");
      res.status(200);
      res.send({
        info,
        entities,
      });
    } catch (error) {
      console.log(error);
      res.status(500);
      res.send(error);
    }
  });

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
    console.log(`Server available at: http://localhost:${port}`);
  });
}

export default boostrap;
