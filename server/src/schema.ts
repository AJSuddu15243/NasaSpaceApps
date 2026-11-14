import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Saved mission scenarios. Mirrors the scenario fields the web app already
 * round-trips through URL params; `weights` holds both weight sets so the row
 * stays self-contained.
 */
export const scenarios = pgTable('scenarios', {
  /** Short URL slug, e.g. "shackleton-survey". */
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  /** Selected site ids, e.g. ["connecting-ridge", "custom:..."] */
  sites: jsonb('sites').$type<string[]>().notNull(),
  landingDateUtc: timestamp('landing_date_utc', { withTimezone: true, mode: 'string' }).notNull(),
  durationHours: integer('duration_hours').notNull(),
  /** { engine: Weights, mission: MissionWeights, mode, view } */
  weights: jsonb('weights').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
});
