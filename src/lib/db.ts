import { MongoClient, Db } from "mongodb";

try {
  // Fix Node.js DNS SRV lookup issues on Windows
  require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:nAVsKwXwp5xA8j8m@cluster0.cz5ytgg.mongodb.net/kanishka_garments?retryWrites=true&w=majority&appName=Cluster0";

const DB_NAME = "kanishka_garments";

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

let cachedConnection: MongoConnection | null = null;

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cachedConnection) {
    return cachedConnection;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedConnection = { client, db };
  return cachedConnection;
}

export async function getQuotesCollection() {
  const { db } = await connectToDatabase();
  return db.collection("quotes");
}

export async function getProductsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("products");
}
