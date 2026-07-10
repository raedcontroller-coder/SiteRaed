import { pgTable, serial, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('client'), // admin or client
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projectQuotes = pgTable('project_quotes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp').notNull(),
  instagram: text('instagram'),
  linkedin: text('linkedin'),
  totalEstimated: integer('total_estimated').notNull(),
  selections: jsonb('selections').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const proposals = pgTable('proposals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  clientName: text('client_name').notNull(),
  content: jsonb('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
