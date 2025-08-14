import { prisma } from "./prisma";
import { NextResponse } from "next/server";

export async function createUser(clerkId: string, email: string) {
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        credits: 5,
        subscriptionStatus: "FREE",
      },
    });
    return newUser;
  } catch (error) {
    console.error("Failed to create user", error);
    throw error;
  }
}

export async function updateUser(clerkId: string, email: string) {
  try {
    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        email,
      },
    });

    return user;
  } catch (error) {
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
