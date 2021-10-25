import {MongoClient } from "https://deno.land/x/mongo@v0.20.0/mod.ts";

const URI = "mongodb://127.0.0.1:27017";

const client = new MongoClient();
await client.connect(URI);
const database = client.database('deno-tutorial');

export default database;

