require("dotenv").config();
const { createClient } = require("redis");

async function testRedis() {
  const client = createClient({ url: process.env.REDIS_URL });
  client.on("error", (err) => console.error("Redis Error:", err));

  await client.connect();
  console.log("--- شروع تست Redis ---");

  const data = { title: "تست عملکرد" };

  console.log("در حال درج ۱۰۰۰ آیتم...");
  let start = Date.now();
  
  const writePromises = [];
  for (let i = 0; i < 1000; i++) {
    writePromises.push(client.set(`todo:${i}`, JSON.stringify(data)));
  }
  await Promise.all(writePromises);
  
  let end = Date.now();
  console.log(`✅ زمان درج ردیس: ${end - start} میلی‌ثانیه`);

  console.log("در حال خواندن ۱۰۰۰ آیتم...");
  start = Date.now();
  
  const readPromises = [];
  for (let i = 0; i < 1000; i++) {
    readPromises.push(client.get(`todo:${i}`));
  }
  await Promise.all(readPromises);

  end = Date.now();
  console.log(`✅ زمان خواندن ردیس: ${end - start} میلی‌ثانیه`);

  await client.quit();
}

testRedis();