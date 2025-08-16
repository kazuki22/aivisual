require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaTiDBCloud } = require("@tidbcloud/prisma-adapter");

async function main() {
  const adapter = new PrismaTiDBCloud({ url: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    const rows = await prisma.$queryRawUnsafe("SHOW CREATE TABLE `Image`");
    console.log(rows);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
