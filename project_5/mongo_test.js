require("dotenv").config();
const { MongoClient } = require("mongodb");

async function testMongo() {
  const client = new MongoClient(process.env.MONGO_URL);

  try {
    await client.connect();
    const db = client.db("benchmark_db");
    const col = db.collection("todos");

    await col.deleteMany({});

    console.log("--- شروع تست MongoDB ---");
    const data = { title: "تست عملکرد" };

    console.log("در حال درج ۱۰۰۰ آیتم...");
    let start = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      await col.insertOne({ ...data, index: i });
    }
    
    let end = Date.now();
    console.log(`✅ زمان درج مونگو: ${end - start} میلی‌ثانیه`);

    console.log("در حال خواندن ۱۰۰۰ آیتم...");
    start = Date.now();
    
    await col.find({}).limit(1000).toArray();
    
    end = Date.now();
    console.log(`✅ زمان خواندن مونگو: ${end - start} میلی‌ثانیه`);

  } catch (error) {
    console.error("خطای اتصال:", error);
  } finally {
    await client.close();
  }
}

testMongo();