import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6936df5800371a655e8e");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
