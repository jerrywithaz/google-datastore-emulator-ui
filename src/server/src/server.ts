import express from "express";
import cors from "cors";
import createDatastore from "./datastore";
import http from "http";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import KindsResolver from "./schema/kinds/resolver";
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import NamespaceResolver from "./schema/namespaces/resolver";
import EntitiesResolver from "./schema/entities/resolver";
import { FilterScalar, OperatorType, OperatorScalar, FilterType } from "./schema/entities/scalars";
import GsUtilResolver from "./schema/gsutil/resolver";
import getEnv from "./env";

type BoostrapOptions = {
  projectId: string;
  emulatorHost: string;
  backupBucket: string;
  backupDir: string;
  port: number;
};

function setEnv({ projectId, emulatorHost, port, backupBucket, backupDir }: BoostrapOptions) {
  process.env.PROJECT_ID = projectId;
  process.env.DATASTORE_EMULATOR_HOST = emulatorHost;
  process.env.SERVER_PORT = port.toString();
  process.env.DATASTORE_BACKUP_BUCKET = backupBucket;
  process.env.DATASTORE_BACKUP_DIR = backupDir;

  const env = ["PROJECT_ID", "DATASTORE_EMULATOR_HOST", "SERVER_PORT", "DATASTORE_BACKUP_BUCKET", "DATASTORE_BACKUP_DIR"]

  for (const key of env) {
    const element = process.env[key];
  
    if (element) {
      console.log("✅", key, element);
    } else {
      console.log("❌", key, element);
    }
  }
}

async function boostrap({ projectId, emulatorHost, port, backupBucket, backupDir }: BoostrapOptions) {
  setEnv({ projectId, emulatorHost, port, backupBucket, backupDir });
  
  const env = getEnv();
  const app = express();
  const httpServer = http.createServer(app);
  const datastore = createDatastore();

  const schema = await buildSchema({
    resolvers: [KindsResolver, NamespaceResolver, EntitiesResolver, GsUtilResolver],
    scalarsMap: [
      {
        type: OperatorType,
        scalar: OperatorScalar,
      },
      {
        type: FilterType,
        scalar: FilterScalar,
      },
    ],
    orphanedTypes: [],
  });

  app.enable("trust proxy");

  app.use(cors());

  const server = new ApolloServer({
    schema,
    context: { datastore, env },
    introspection: true,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

export default boostrap;
