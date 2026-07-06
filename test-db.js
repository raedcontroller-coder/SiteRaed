require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

sql`select 1`.then(() => {
  console.log("Connected successfully");
  process.exit(0);
}).catch((err) => {
  console.error("Connection failed", err);
  process.exit(1);
});
