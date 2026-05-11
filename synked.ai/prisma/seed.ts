import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// Create a temporary auth instance with sign-up enabled for seeding
const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, disableSignUp: false },
});

async function seed() {
  const email = "sillydrycoder@gmail.com";
  const name = "Muhammad Ali";
  const password = "admin123"; // Change this after first login

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Just update role to admin
    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    console.log(`✅ User "${email}" already exists — role set to admin`);
    process.exit(0);
  }

  // Create user via better-auth API (handles password hashing)
  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  if (!result?.user) {
    console.error("❌ Failed to create user");
    process.exit(1);
  }

  // Set role to admin
  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: "admin" },
  });

  console.log(`✅ Admin user created:`);
  console.log(`   Email: ${email}`);
  console.log(`   Name: ${name}`);
  console.log(`   Password: ${password}`);
  console.log(`\n⚠️  Change the password after first login!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
