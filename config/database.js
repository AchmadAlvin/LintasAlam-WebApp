const { MongoClient } = require("mongodb");

if (!process.env.MONGODB_URI) {
  throw new Error("MongoDB URI tidak ditemukan di environment variables");
}

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client = null;
let database = null;

async function connectToDatabase() {
  try {
    if (!client) {
      client = new MongoClient(uri, options);
      await client.connect();
      database = client.db("absensi");
      console.log("Berhasil terhubung ke MongoDB");

      // Buat indexes untuk optimasi
      const messagesCollection = database.collection("messages");
      await messagesCollection.createIndex({ createdAt: -1 });
      await messagesCollection.createIndex({ name: 1 });
      await messagesCollection.createIndex({ course: 1 });

      const studentsCollection = database.collection("students");
      await studentsCollection.createIndex({ nim: 1 }, { unique: true });
      await studentsCollection.createIndex({ name: 1 });

      console.log("Indexes berhasil dibuat");
    }
    return database;
  } catch (error) {
    console.error("Error koneksi MongoDB:", error);
    throw error;
  }
}

async function getCollection(collectionName) {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}

module.exports = {
  connectToDatabase,
  getCollection,
  collections: {
    messages: "messages",
    students: "students",
    courses: "courses",
    attendance: "attendance",
    logs: "logs",
  },
};
