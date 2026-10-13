import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const memberType = pgEnum("member_type", ["player", "coach"]);
export const memberStatus = pgEnum("member_status", ["active", "inactive"]);
export const jerseyStatus = pgEnum("jersey_status", [
  "available",
  "reserved",
  "issued",
  "unavailable",
]);
export const gameStatus = pgEnum("game_status", [
  "scheduled",
  "in_progress",
  "awaiting_reconciliation",
  "closed",
]);
export const issuanceStatus = pgEnum("issuance_status", [
  "assigned",
  "issued",
  "returned",
  "lost",
  "damaged",
  "cancelled",
]);
export const issuanceEventType = pgEnum("issuance_event_type", [
  "assigned",
  "issued",
  "returned",
  "lost",
  "damaged",
  "corrected",
  "cancelled",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .references(() => teams.id)
    .notNull(),
  name: text("name").notNull(),
  type: memberType("type").notNull(),
  role: text("role").notNull(),
  position: text("position"),
  preferredNumber: integer("preferred_number"),
  status: memberStatus("status").default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const jerseys = pgTable("jerseys", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .references(() => teams.id)
    .notNull(),
  number: integer("number").notNull(),
  kitColour: text("kit_colour").notNull(),
  size: text("size"),
  status: jerseyStatus("status").default("available").notNull(),
  condition: text("condition"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .references(() => teams.id)
    .notNull(),
  opponent: text("opponent").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  venue: text("venue").notNull(),
  competition: text("competition"),
  kitColour: text("kit_colour").notNull(),
  status: gameStatus("status").default("scheduled").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const gameParticipants = pgTable(
  "game_participants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    gameId: uuid("game_id")
      .references(() => games.id)
      .notNull(),
    memberId: uuid("member_id")
      .references(() => teamMembers.id)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    gameMemberUnique: uniqueIndex("game_participants_game_member_unique").on(
      table.gameId,
      table.memberId,
    ),
  }),
);

export const jerseyIssuances = pgTable("jersey_issuances", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameParticipantId: uuid("game_participant_id")
    .references(() => gameParticipants.id)
    .notNull(),
  jerseyId: uuid("jersey_id")
    .references(() => jerseys.id)
    .notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }),
  returnedAt: timestamp("returned_at", { withTimezone: true }),
  status: issuanceStatus("status").default("assigned").notNull(),
  note: text("note"),
});

export const issuanceEvents = pgTable("issuance_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  issuanceId: uuid("issuance_id")
    .references(() => jerseyIssuances.id)
    .notNull(),
  eventType: issuanceEventType("event_type").notNull(),
  performedBy: uuid("performed_by")
    .references(() => users.id)
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, { fields: [teams.createdBy], references: [users.id] }),
  members: many(teamMembers),
  jerseys: many(jerseys),
  games: many(games),
}));

export const gameParticipantsRelations = relations(
  gameParticipants,
  ({ one, many }) => ({
    game: one(games, {
      fields: [gameParticipants.gameId],
      references: [games.id],
    }),
    member: one(teamMembers, {
      fields: [gameParticipants.memberId],
      references: [teamMembers.id],
    }),
    issuances: many(jerseyIssuances),
  }),
);

export const jerseyIssuancesRelations = relations(
  jerseyIssuances,
  ({ one, many }) => ({
    participant: one(gameParticipants, {
      fields: [jerseyIssuances.gameParticipantId],
      references: [gameParticipants.id],
    }),
    jersey: one(jerseys, {
      fields: [jerseyIssuances.jerseyId],
      references: [jerseys.id],
    }),
    events: many(issuanceEvents),
  }),
);

export const issuanceEventsRelations = relations(issuanceEvents, ({ one }) => ({
  issuance: one(jerseyIssuances, {
    fields: [issuanceEvents.issuanceId],
    references: [jerseyIssuances.id],
  }),
  performer: one(users, {
    fields: [issuanceEvents.performedBy],
    references: [users.id],
  }),
}));

export const schema = {
  users,
  teams,
  teamMembers,
  jerseys,
  games,
  gameParticipants,
  jerseyIssuances,
  issuanceEvents,
};
