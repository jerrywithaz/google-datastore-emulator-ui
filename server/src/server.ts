import express from "express";
import createDatastore from "./datastore";
import isNullOrUndefined from "./utils/isNullOrUndefined";

type BoostrapOptions = {
  port: number;
};

function boostrap({ port }: BoostrapOptions) {
  const app = express();
  const datastore = createDatastore();

  app.get("/datastore/namespaces", async (_, res) => {
    const query = datastore.createQuery("__namespace__").select("__key__");
    const results = await datastore.runQuery(query);
    const namespaces = results[0]
      .map((e) => e[datastore.KEY].name)
      .filter(isNullOrUndefined);

    res.contentType("application/json");
    res.status(200);
    res.send(namespaces);
  });

  app.get("/datastore/kinds", async (_, res) => {
    const query = datastore.createQuery("__kind__").select("__key__");
    const results = await datastore.runQuery(query);
    const kinds = results[0]
      .map((e) => e[datastore.KEY].name)
      .filter(isNullOrUndefined);

    kinds.forEach((kind) => console.log(kind));

    res.contentType("application/json");
    res.status(200);
    res.send(kinds);
  });

  app.get("/datastore/entities/:kind", async (req, res) => {
    try {
      const kind = req.params.kind;
      const query = datastore.createQuery(kind);
      const results = await datastore.runQuery(query);

      res.contentType("application/json");
      res.status(200);
      res.send(results[0]);
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
