import 'dotenv/config';
import { db } from '../lib/db/index.js';
import { users } from '../lib/db/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');
  
  try {
    await db.delete(users).where(eq(users.email, 'admin@raed.com'));
    console.log('Old dummy admin removed.');
  } catch (err) {
    // Ignore
  }

  const newAdmins = [
    'glen@raed.world',
    'davi@raed.world',
    'isa@raed.world',
    'carlos@raed.world'
  ];
  const password = 'Raed@2026';
  
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  for (const email of newAdmins) {
    try {
      await db.insert(users).values({
        email,
        passwordHash,
        role: 'admin'
      });
      console.log(`Admin user created: ${email}`);
    } catch (error) {
      if (error.code === '23505') { 
        console.log(`User already exists: ${email}`);
      } else {
        console.error(`Error seeding ${email}:`, error);
      }
    }
  }

  process.exit(0);
}

seed();
