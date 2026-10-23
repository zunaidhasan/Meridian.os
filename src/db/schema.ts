import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  date,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const leadStages = pgEnum("lead_stage", [
  "new",
  "contacted",
  "qualified",
  "nurture",
  "disqualified",
]);
export const dealStages = pgEnum("deal_stage", [
  "discovery",
  "proposal",
  "negotiation",
  "won",
  "lost",
]);
export const kycStatuses = pgEnum("kyc_status", [
  "docs_requested",
  "docs_received",
  "under_review",
  "approved",
  "rejected",
]);
export const taskStatuses = pgEnum("task_status", [
  "backlog",
  "in_progress",
  "done",
]);
export const priorities = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export const riskLevels = pgEnum("risk_level", ["low", "medium", "high"]);

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  company: text("company").notNull(),
  contact: text("contact").notNull(),
  email: text("email"),
  source: text("source").notNull().default("Website"),
  value: integer("value").notNull().default(0),
  stage: leadStages("stage").notNull().default("new"),
  owner: text("owner").notNull().default("Unassigned"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  amount: integer("amount").notNull().default(0),
  stage: dealStages("stage").notNull().default("discovery"),
  owner: text("owner").notNull().default("Unassigned"),
  closeDate: date("close_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const kyc = pgTable("kyc", {
  id: uuid("id").primaryKey().defaultRandom(),
  customer: text("customer").notNull(),
  reference: text("reference").notNull(),
  country: text("country").notNull().default("—"),
  risk: riskLevels("risk").notNull().default("medium"),
  docsTotal: integer("docs_total").notNull().default(4),
  docsReceived: integer("docs_received").notNull().default(0),
  status: kycStatuses("status").notNull().default("docs_requested"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  assignee: text("assignee").notNull().default("Unassigned"),
  priority: priorities("priority").notNull().default("medium"),
  due: date("due"),
  status: taskStatuses("status").notNull().default("backlog"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull().default("Member"),
  email: text("email").notNull(),
  active: boolean("active").notNull().default(true),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  actor: text("actor").notNull().default("You"),
  action: text("action").notNull(),
  at: timestamp("at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  workspaceName: text("workspace_name").notNull().default("Meridian HQ"),
  plan: text("plan").notNull().default("Growth"),
  timezone: text("timezone").notNull().default("Europe/London"),
});
