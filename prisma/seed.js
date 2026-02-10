// prisma/seed.js
require('dotenv').config(); // 👈 wajib
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg'); // 👈 import adapter
const bcrypt = require('bcryptjs');

// Buat adapter dengan connectionString
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Inisialisasi PrismaClient dengan adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@google.com";
  const adminName = "Super Admin";
  const adminPassword = "12345678";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
console.log(prisma.user);
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("✅ Admin created!");
  } else {
    console.log("⚠️ Admin already exists.");
  }
}

main()
  .catch(e => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });