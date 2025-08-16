require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaTiDBCloud } = require("@tidbcloud/prisma-adapter");

async function ensureUser(prisma) {
  let user = await prisma.user.findFirst();
  if (!user) {
    const idSuffix = Math.random().toString(36).slice(2, 8);
    user = await prisma.user.create({
      data: {
        clerkId: "test_" + idSuffix,
        email: "test_" + idSuffix + "@example.com",
      },
    });
  }
  return user;
}

async function main() {
  const adapter = new PrismaTiDBCloud({ url: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    const user = await ensureUser(prisma);
    const oneMb = 1 * 1024 * 1024;
    const base = "data:image/webp;base64,";
    const payload =
      base + Buffer.alloc(oneMb, 0).toString("base64").slice(0, oneMb);
    console.log("Trying to insert originalUrl length:", payload.length);
    const img = await prisma.image.create({
      data: {
        userId: user.id,
        fileName: "test.webp",
        originalUrl: payload,
        imageType: "AI_GENERATED",
        fileSize: oneMb,
        format: "webp",
        status: "COMPLETED",
      },
    });
    console.log("Inserted image id:", img.id);
  } catch (e) {
    console.error("Insert failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
