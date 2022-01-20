"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const datastore_1 = __importDefault(require("./datastore"));
const http_1 = __importDefault(require("http"));
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const resolver_1 = __importDefault(require("./schema/kinds/resolver"));
const apollo_server_core_1 = require("apollo-server-core");
const resolver_2 = __importDefault(require("./schema/namespaces/resolver"));
const resolver_3 = __importDefault(require("./schema/entities/resolver"));
const scalars_1 = require("./schema/entities/scalars");
const resolver_4 = __importDefault(require("./schema/gsutil/resolver"));
const env_1 = __importDefault(require("./env"));
function setEnv({ projectId, emulatorHost, port, backupBucket, backupDir }) {
    process.env.PROJECT_ID = projectId;
    process.env.DATASTORE_EMULATOR_HOST = emulatorHost;
    process.env.SERVER_PORT = port.toString();
    process.env.DATASTORE_BACKUP_BUCKET = backupBucket;
    process.env.DATASTORE_BACKUP_DIR = backupDir;
}
async function boostrap({ projectId, emulatorHost, port, backupBucket, backupDir }) {
    setEnv({ projectId, emulatorHost, port, backupBucket, backupDir });
    const env = (0, env_1.default)();
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const datastore = (0, datastore_1.default)();
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [resolver_1.default, resolver_2.default, resolver_3.default, resolver_4.default],
        scalarsMap: [
            {
                type: scalars_1.OperatorType,
                scalar: scalars_1.OperatorScalar,
            },
            {
                type: scalars_1.FilterType,
                scalar: scalars_1.FilterScalar,
            },
        ],
        orphanedTypes: [],
    });
    app.enable("trust proxy");
    app.use((0, cors_1.default)());
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: { datastore, env },
        introspection: true,
        plugins: [
            process.env.NODE_ENV === "production"
                ? (0, apollo_server_core_1.ApolloServerPluginLandingPageDisabled)()
                : (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)(),
        ],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
}
exports.default = boostrap;
