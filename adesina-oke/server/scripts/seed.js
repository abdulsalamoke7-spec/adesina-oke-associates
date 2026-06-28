/**
 * Run this ONCE after setting up your .env to create the admin account.
 * Usage: cd server && node scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose');
const User = require('../models/User');
const Journal = require('../models/Journal');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ── Admin user ─────────────────────────────────────────────────────────
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log(`ℹ️  Admin user already exists: ${process.env.ADMIN_EMAIL}`);
    } else {
      await User.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`✅ Admin user created: ${process.env.ADMIN_EMAIL}`);
    }

    // ── Sample journal entry ───────────────────────────────────────────────
    const count = await Journal.countDocuments();
    if (count === 0) {
      await Journal.create({
        title: 'Strengthening Anti-Corruption Frameworks in Nigeria: A Legislative Perspective',
        category: 'Governance',
        body: `Nigeria's anti-corruption architecture has evolved significantly over the past two decades. The establishment of the Economic and Financial Crimes Commission (EFCC) and the Independent Corrupt Practices Commission (ICPC) marked watershed moments in the institutional landscape.

However, legislative gaps persist. The Proceeds of Crime (Recovery and Management) Act, while a positive development, requires more robust implementation guidelines. Civil society organisations like CISLAC have long advocated for stronger asset recovery mechanisms and international cooperation frameworks.

For the rule of law to prevail over impunity, Nigeria must harmonise its domestic legislation with international anti-corruption conventions, particularly the UN Convention Against Corruption (UNCAC), to which it is a signatory.`,
      });
      console.log('✅ Sample journal entry created');
    }

    console.log('\n🏛  Seed complete. You can now log in with:');
    console.log(`   Email:    ${process.env.ADMIN_EMAIL}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
    console.log('\n⚠️  Change your password after first login.\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
