import { prisma } from "./prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function createUser(clerkId: string, email: string) {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: { clerkId, email, credits: 5, subscriptionStatus: "FREE" },
    });
    return user;
  } catch (error) {
    // ユニーク制約（メール）の衝突を救済
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingByEmail) {
        const merged = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { clerkId },
        });
        return merged;
      }
    }
    console.error("Failed to create user", error);
    throw error;
  }
}

export async function updateUser(clerkId: string, email: string) {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: { clerkId, email, credits: 5, subscriptionStatus: "FREE" },
    });
    return user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingByEmail) {
        const merged = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { clerkId },
        });
        return merged;
      }
    }
    console.error("Failed to update user", error);
    throw error;
  }
}

export async function deleteUser(clerkId: string) {
  try {
    const user = await prisma.$transaction(async (tx) => {
      await tx.subscription.deleteMany({
        where: {
          user: {
            clerkId: clerkId,
          },
        },
      });

      const user = await tx.user.delete({
        where: { clerkId: clerkId },
      });

      return user;
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete user", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
