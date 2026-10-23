import { db } from "@/db";
import { sql } from "drizzle-orm";
import {
  leads,
  deals,
  kyc,
  tasks,
  members,
  activities,
  settings,
} from "@/db/schema";

const daysAgo = (n: number) => new Date(Date.now() - n * 864e5);
const inDays = (n: number) => new Date(Date.now() + n * 864e5);
const hoursAgo = (n: number) => new Date(Date.now() - n * 36e5);
const ds = (d: Date) => d.toISOString().slice(0, 10);

export async function logActivity(action: string, actor = "You") {
  await db.insert(activities).values({ actor, action });
}

export async function seedIfEmpty() {
  const rows = await db.select({ c: sql<number>`count(*)` }).from(leads);
  if (Number(rows[0]?.c ?? 0) > 0) return;
  await seedAll();
}

export async function resetAndSeed() {
  await db.delete(activities);
  await db.delete(tasks);
  await db.delete(kyc);
  await db.delete(deals);
  await db.delete(leads);
  await db.delete(members);
  await db.delete(settings);
  await seedAll();
}

type Ins<T> = T extends { $inferInsert: infer R } ? R : never;

async function seedAll() {
  await db.insert(settings).values({
    id: 1,
    workspaceName: "Meridian HQ",
    plan: "Growth",
    timezone: "Europe/London",
  });

  const memberRows: Ins<typeof members>[] = [
    { name: "Ava Chen", role: "Founder", email: "ava@meridianhq.io", active: true },
    { name: "Marcus Reid", role: "Sales Lead", email: "marcus@meridianhq.io", active: true },
    { name: "Priya Nair", role: "Compliance", email: "priya@meridianhq.io", active: true },
    { name: "Tom Okafor", role: "Operations", email: "tom@meridianhq.io", active: true },
    { name: "Lena Fischer", role: "Customer Success", email: "lena@meridianhq.io", active: true },
  ];
  await db.insert(members).values(memberRows);

  const leadRows: Ins<typeof leads>[] = [
    { company: "Cobalt Health", contact: "Nina Patel", email: "nina@cobalthealth.com", source: "Outbound", value: 56000, stage: "new", owner: "Marcus Reid", createdAt: hoursAgo(3) },
    { company: "Fern & Field Retail", contact: "Mia Alvarez", email: "mia@fernfield.shop", source: "Website", value: 9500, stage: "new", owner: "Lena Fischer", createdAt: daysAgo(1) },
    { company: "Bluepeak Logistics", contact: "Sam Ortiz", email: "sam@bluepeak.co", source: "Website", value: 18000, stage: "contacted", owner: "Marcus Reid", createdAt: daysAgo(2) },
    { company: "Sable Studio", contact: "Ila Roy", email: "ila@sable.studio", source: "LinkedIn", value: 6200, stage: "contacted", owner: "Lena Fischer", createdAt: daysAgo(4) },
    { company: "Marlow Legal", contact: "Theo Lang", email: "theo@marlowlegal.uk", source: "Website", value: 15400, stage: "contacted", owner: "Marcus Reid", createdAt: daysAgo(6) },
    { company: "Helios Analytics", contact: "Dana Whitfield", email: "dana@helios.io", source: "Referral", value: 24000, stage: "qualified", owner: "Marcus Reid", createdAt: daysAgo(5) },
    { company: "Granite Capital", contact: "Owen Blake", email: "owen@granitecap.com", source: "Trade show", value: 72000, stage: "qualified", owner: "Ava Chen", createdAt: daysAgo(9) },
    { company: "Northwind Retail", contact: "Greg Haas", email: "greg@northwind.de", source: "Referral", value: 34000, stage: "qualified", owner: "Marcus Reid", createdAt: daysAgo(11) },
    { company: "Vertex Bio", contact: "Alan Choi", email: "alan@vertexbio.com", source: "Webinar", value: 88000, stage: "qualified", owner: "Ava Chen", createdAt: daysAgo(14) },
    { company: "Apex Freight", contact: "June Park", email: "june@apexfreight.sg", source: "Outbound", value: 12800, stage: "nurture", owner: "Tom Okafor", createdAt: daysAgo(18) },
    { company: "Quill & Co", contact: "Rosa Marin", email: "rosa@quillco.es", source: "Website", value: 4800, stage: "nurture", owner: "Lena Fischer", createdAt: daysAgo(22) },
    { company: "Otterpay", contact: "Becca Stone", email: "becca@otterpay.ee", source: "Referral", value: 21000, stage: "disqualified", owner: "Marcus Reid", createdAt: daysAgo(26) },
  ];
  await db.insert(leads).values(leadRows);

  const dealRows: Ins<typeof deals>[] = [
    { title: "Compliance suite rollout", company: "Cobalt Health", amount: 56000, stage: "discovery", owner: "Marcus Reid", closeDate: ds(inDays(38)), createdAt: daysAgo(7) },
    { title: "Enterprise pilot", company: "Vertex Bio", amount: 88000, stage: "discovery", owner: "Ava Chen", closeDate: ds(inDays(52)), createdAt: daysAgo(12) },
    { title: "Annual seats + onboarding", company: "Helios Analytics", amount: 24000, stage: "proposal", owner: "Marcus Reid", closeDate: ds(inDays(12)), createdAt: daysAgo(9) },
    { title: "Growth plan", company: "Northwind Retail", amount: 34000, stage: "proposal", owner: "Marcus Reid", closeDate: ds(inDays(16)), createdAt: daysAgo(13) },
    { title: "3-year platform license", company: "Granite Capital", amount: 72000, stage: "negotiation", owner: "Ava Chen", closeDate: ds(inDays(8)), createdAt: daysAgo(20) },
    { title: "Pilot to scale", company: "Bluepeak Logistics", amount: 18000, stage: "negotiation", owner: "Tom Okafor", closeDate: ds(inDays(5)), createdAt: daysAgo(16) },
    { title: "Team plan renewal", company: "Apex Freight", amount: 12800, stage: "won", owner: "Tom Okafor", closeDate: ds(daysAgo(8)), createdAt: daysAgo(40) },
    { title: "Seat expansion", company: "Marlow Legal", amount: 15400, stage: "won", owner: "Marcus Reid", closeDate: ds(daysAgo(21)), createdAt: daysAgo(52) },
    { title: "Starter plan", company: "Sable Studio", amount: 6200, stage: "won", owner: "Lena Fischer", closeDate: ds(daysAgo(12)), createdAt: daysAgo(30) },
    { title: "Growth plan", company: "Dune Analytics", amount: 21900, stage: "won", owner: "Ava Chen", closeDate: ds(daysAgo(38)), createdAt: daysAgo(70) },
    { title: "Team plan", company: "Crestline Media", amount: 13200, stage: "won", owner: "Marcus Reid", closeDate: ds(daysAgo(70)), createdAt: daysAgo(95) },
    { title: "Growth plan", company: "Pillar Systems", amount: 27500, stage: "won", owner: "Tom Okafor", closeDate: ds(daysAgo(105)), createdAt: daysAgo(130) },
    { title: "Team plan", company: "Harbor & Co", amount: 9800, stage: "won", owner: "Lena Fischer", closeDate: ds(daysAgo(140)), createdAt: daysAgo(160) },
    { title: "Team plan", company: "Otterpay", amount: 21000, stage: "lost", owner: "Marcus Reid", closeDate: ds(daysAgo(24)), createdAt: daysAgo(48) },
  ];
  await db.insert(deals).values(dealRows);

  const kycRows: Ins<typeof kyc>[] = [
    { customer: "Northwind Retail", reference: "KYC-2026-0148", country: "Germany", risk: "low", docsTotal: 4, docsReceived: 4, status: "approved", updatedAt: daysAgo(2), createdAt: daysAgo(12) },
    { customer: "Granite Capital", reference: "KYC-2026-0151", country: "Cyprus", risk: "high", docsTotal: 4, docsReceived: 3, status: "under_review", note: "Beneficial ownership document missing", updatedAt: hoursAgo(26), createdAt: daysAgo(9) },
    { customer: "Apex Freight", reference: "KYC-2026-0147", country: "Singapore", risk: "medium", docsTotal: 4, docsReceived: 3, status: "under_review", updatedAt: daysAgo(1), createdAt: daysAgo(10) },
    { customer: "Helios Analytics", reference: "KYC-2026-0153", country: "United Kingdom", risk: "low", docsTotal: 4, docsReceived: 4, status: "docs_received", updatedAt: hoursAgo(6), createdAt: daysAgo(5) },
    { customer: "Vertex Bio", reference: "KYC-2026-0152", country: "United States", risk: "low", docsTotal: 4, docsReceived: 4, status: "docs_received", updatedAt: daysAgo(1), createdAt: daysAgo(8) },
    { customer: "Cobalt Health", reference: "KYC-2026-0149", country: "UAE", risk: "medium", docsTotal: 4, docsReceived: 2, status: "docs_requested", updatedAt: hoursAgo(40), createdAt: daysAgo(6) },
    { customer: "Fern & Field Retail", reference: "KYC-2026-0154", country: "Spain", risk: "medium", docsTotal: 4, docsReceived: 2, status: "docs_requested", updatedAt: daysAgo(2), createdAt: daysAgo(4) },
    { customer: "Bluepeak Logistics", reference: "KYC-2026-0150", country: "Netherlands", risk: "low", docsTotal: 4, docsReceived: 4, status: "approved", updatedAt: daysAgo(4), createdAt: daysAgo(14) },
    { customer: "Marlow Legal", reference: "KYC-2026-0145", country: "United Kingdom", risk: "low", docsTotal: 4, docsReceived: 4, status: "approved", updatedAt: daysAgo(7), createdAt: daysAgo(18) },
    { customer: "Otterpay", reference: "KYC-2026-0144", country: "Estonia", risk: "high", docsTotal: 4, docsReceived: 1, status: "rejected", note: "Sanctions screening flag — escalated", updatedAt: daysAgo(9), createdAt: daysAgo(21) },
  ];
  await db.insert(kyc).values(kycRows);

  const taskRows: Ins<typeof tasks>[] = [
    { title: "Reconcile January invoices", description: "Match 14 statements against Stripe payouts and flag variances.", assignee: "Tom Okafor", priority: "high", due: ds(new Date()), status: "in_progress", createdAt: daysAgo(3) },
    { title: "Onboard Granite Capital workspace", description: "Domains, SSO, board permissions and first data import.", assignee: "Ava Chen", priority: "urgent", due: ds(inDays(1)), status: "in_progress", createdAt: daysAgo(4) },
    { title: "Update W-9 for Apex Freight", description: "Legal entity name changed after restructuring.", assignee: "Priya Nair", priority: "medium", due: ds(daysAgo(2)), status: "backlog", createdAt: daysAgo(6) },
    { title: "Send QBR deck to Northwind", description: "Usage, wins and H2 roadmap slide.", assignee: "Lena Fischer", priority: "medium", due: ds(inDays(2)), status: "backlog", createdAt: daysAgo(2) },
    { title: "Migrate contacts from HubSpot", description: "Dedupe 4,800 records and map lifecycle stages.", assignee: "Tom Okafor", priority: "high", due: ds(inDays(4)), status: "in_progress", createdAt: daysAgo(5) },
    { title: "Configure e-invoicing for DE entities", description: "XRechnung templates and PEPPOL test cycle.", assignee: "Priya Nair", priority: "high", due: ds(inDays(6)), status: "backlog", createdAt: daysAgo(3) },
    { title: "Invoice Vertex Bio pilot deposit", description: "50% of $88k pilot — PO on file.", assignee: "Tom Okafor", priority: "urgent", due: ds(daysAgo(1)), status: "in_progress", createdAt: daysAgo(7) },
    { title: "Publish KYC checklist v2", description: "Add EDD triggers for high-risk corridors.", assignee: "Priya Nair", priority: "medium", due: ds(daysAgo(1)), status: "done", createdAt: daysAgo(9) },
    { title: "Weekly ops standup notes", description: "Circulate to the leadership group.", assignee: "Tom Okafor", priority: "low", due: ds(daysAgo(1)), status: "done", createdAt: daysAgo(2) },
    { title: "Renew S3 bucket policy review", description: "Quarterly access audit, rotate keys.", assignee: "Ava Chen", priority: "low", due: ds(inDays(9)), status: "backlog", createdAt: daysAgo(1) },
    { title: "Archive closed Q4 deals", description: "Move won/lost deals to the Q4 archive board.", assignee: "Lena Fischer", priority: "low", due: ds(inDays(5)), status: "backlog", createdAt: daysAgo(3) },
  ];
  await db.insert(tasks).values(taskRows);

  const activityRows: Ins<typeof activities>[] = [
    { actor: "You", action: "approved KYC for Northwind Retail", at: hoursAgo(1) },
    { actor: "Marcus Reid", action: "moved Granite Capital from Proposal to Negotiation", at: hoursAgo(3) },
    { actor: "Priya Nair", action: "started KYC review for Apex Freight", at: hoursAgo(5) },
    { actor: "Lena Fischer", action: "marked docs received for Helios Analytics", at: hoursAgo(6) },
    { actor: "You", action: "added Cobalt Health to the Lead Board", at: hoursAgo(9) },
    { actor: "Tom Okafor", action: "shipped “Publish KYC checklist v2”", at: hoursAgo(22) },
    { actor: "Ava Chen", action: "created deal “3-year platform license” — Granite Capital", at: hoursAgo(28) },
    { actor: "You", action: "rejected KYC for Otterpay (sanctions flag)", at: hoursAgo(48) },
  ];
  await db.insert(activities).values(activityRows);
}
