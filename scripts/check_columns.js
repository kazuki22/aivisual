require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaTiDBCloud } = require("@tidbcloud/prisma-adapter");

async function main() {
  const adapter = new PrismaTiDBCloud({ url: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    const rows = await prisma.$queryRawUnsafe(
      "SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='Image' AND COLUMN_NAME IN ('originalUrl','processedUrl')"
    );
    const replacer = (_k, v) => (typeof v === "bigint" ? v.toString() : v);
    console.log(JSON.stringify(rows, replacer, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
