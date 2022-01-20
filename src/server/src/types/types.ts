import type { Datastore } from "@google-cloud/datastore";
import type { Env } from "../env";

export type Context = {
    datastore: Datastore;
    env: Env;
}