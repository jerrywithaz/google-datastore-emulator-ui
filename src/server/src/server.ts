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

async function boostrap({ projectId, emulatorHost, port }: BoostrapOptions) {
  setEnv({ projectId, emulatorHost, port });

  console.log("✅ PROJECT_ID", projectId);
  console.log("✅ DATASTORE_EMULATOR_HOST", emulatorHost);

  const app = express();
  const httpServer = http.createServer(app);
  const datastore = createDatastore();

  const schema = await buildSchema({
    resolvers: [KindsResolver, NamespaceResolver, EntitiesResolver],
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
    context: { datastore },
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
