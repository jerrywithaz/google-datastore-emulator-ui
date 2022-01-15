import { Datastore } from "@google-cloud/datastore";

export type Context = {
    datastore: Datastore;
}