import { Client, TablesDB } from "appwrite";
import { appwriteConfig } from "./config";

const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setDevKey(appwriteConfig.apiKey);

const database = new TablesDB(client);

export { database };