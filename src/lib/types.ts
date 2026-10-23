export const LEAD_STAGES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "nurture", label: "Nurture" },
  { value: "disqualified", label: "Disqualified" },
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number]["value"];

export const DEAL_STAGES = [
  { value: "discovery", label: "Discovery" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;
export type DealStage = (typeof DEAL_STAGES)[number]["value"];

export const KYC_STATUSES = [
  { value: "docs_requested", label: "Docs requested" },
  { value: "docs_received", label: "Docs received" },
  { value: "under_review", label: "Under review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;
export type KycStatus = (typeof KYC_STATUSES)[number]["value"];

export const TASK_STATUSES = [
  { value: "backlog", label: "Backlog" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number]["value"];

export type Priority = "low" | "medium" | "high" | "urgent";
export type Risk = "low" | "medium" | "high";

export interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string | null;
  source: string;
  value: number;
  stage: LeadStage;
  owner: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  amount: number;
  stage: DealStage;
  owner: string;
  closeDate: string | null;
  createdAt: string;
}

export interface KycRecord {
  id: string;
  customer: string;
  reference: string;
  country: string;
  risk: Risk;
  docsTotal: number;
  docsReceived: number;
  status: KycStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assignee: string;
  priority: Priority;
  due: string | null;
  status: TaskStatus;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  active: boolean;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  at: string;
}

export interface WorkspaceSettings {
  id: number;
  workspaceName: string;
  plan: string;
  timezone: string;
}

export interface DashboardData {
  kpis: {
    openPipeline: number;
    wonThisMonth: number;
    openLeads: number;
    qualifiedLeads: number;
    kycPending: number;
    kycHighRisk: number;
    opsOpen: number;
    opsOverdue: number;
  };
  pipeline: { stage: DealStage; total: number; count: number }[];
  attention: {
    kind: "task" | "kyc" | "lead";
    id: string;
    title: string;
    sub: string;
    tone: "danger" | "gold" | "brand";
  }[];
  activity: ActivityItem[];
}

export interface ReportsData {
  monthly: { key: string; label: string; total: number }[];
  funnel: { label: string; count: number }[];
  kyc: { label: string; count: number; cls: string }[];
  topDeals: Deal[];
  stats: {
    totalWon: number;
    avgWon: number;
    winRate: number;
    kycApproval: number;
  };
}

/* ---------- display metadata (labels + chip classes) ---------- */

export const LEAD_META: Record<
  LeadStage,
  { label: string; chip: string; dot: string }
> = {
  new: {
    label: "New",
    chip: "bg-[#eceee6] text-slate-600 ring-[#dcdfd2]",
    dot: "bg-ink-faint",
  },
  contacted: {
    label: "Contacted",
    chip: "bg-gold-soft text-gold-deep ring-[#e6d8b6]",
    dot: "bg-gold",
  },
  qualified: {
    label: "Qualified",
    chip: "bg-brand-soft text-brand-deep ring-[#c3dccd]",
    dot: "bg-brand",
  },
  nurture: {
    label: "Nurture",
    chip: "bg-moss-soft text-moss-deep ring-[#d2deba]",
    dot: "bg-moss",
  },
  disqualified: {
    label: "Disqualified",
    chip: "bg-line-soft text-ink-faint ring-line",
    dot: "bg-line",
  },
};

export const DEAL_META: Record<
  DealStage,
  { label: string; chip: string; dot: string }
> = {
  discovery: {
    label: "Discovery",
    chip: "bg-[#eceee6] text-slate-600 ring-[#dcdfd2]",
    dot: "bg-ink-faint",
  },
  proposal: {
    label: "Proposal",
    chip: "bg-gold-soft text-gold-deep ring-[#e6d8b6]",
    dot: "bg-gold",
  },
  negotiation: {
    label: "Negotiation",
    chip: "bg-brand-soft text-brand-deep ring-[#c3dccd]",
    dot: "bg-brand",
  },
  won: {
    label: "Won",
    chip: "bg-moss-soft text-moss-deep ring-[#d2deba]",
    dot: "bg-moss",
  },
  lost: {
    label: "Lost",
    chip: "bg-[#efe4e1] text-[#a05a50] ring-[#e3d0cb]",
    dot: "bg-[#c8938a]",
  },
};

export const KYC_META: Record<
  KycStatus,
  { label: string; chip: string; dot: string }
> = {
  docs_requested: {
    label: "Docs requested",
    chip: "bg-[#eceee6] text-slate-600 ring-[#dcdfd2]",
    dot: "bg-ink-faint",
  },
  docs_received: {
    label: "Docs received",
    chip: "bg-gold-soft text-gold-deep ring-[#e6d8b6]",
    dot: "bg-gold",
  },
  under_review: {
    label: "Under review",
    chip: "bg-brand-soft text-brand-deep ring-[#c3dccd]",
    dot: "bg-brand",
  },
  approved: {
    label: "Approved",
    chip: "bg-moss-soft text-moss-deep ring-[#d2deba]",
    dot: "bg-moss",
  },
  rejected: {
    label: "Rejected",
    chip: "bg-danger-soft text-danger-deep ring-[#eccdc8]",
    dot: "bg-danger",
  },
};

export const TASK_META: Record<
  TaskStatus,
  { label: string; dot: string }
> = {
  backlog: { label: "Backlog", dot: "bg-ink-faint" },
  in_progress: { label: "In progress", dot: "bg-gold" },
  done: { label: "Done", dot: "bg-moss" },
};

export const PRIORITY_META: Record<Priority, { label: string; chip: string }> =
  {
    low: { label: "Low", chip: "bg-line-soft text-ink-soft ring-line" },
    medium: { label: "Medium", chip: "bg-[#eceee6] text-slate-600 ring-[#dcdfd2]" },
    high: { label: "High", chip: "bg-gold-soft text-gold-deep ring-[#e6d8b6]" },
    urgent: { label: "Urgent", chip: "bg-danger-soft text-danger-deep ring-[#eccdc8]" },
  };

export const RISK_META: Record<Risk, { label: string; chip: string }> = {
  low: { label: "Low", chip: "bg-moss-soft text-moss-deep ring-[#d2deba]" },
  medium: { label: "Medium", chip: "bg-gold-soft text-gold-deep ring-[#e6d8b6]" },
  high: { label: "High", chip: "bg-danger-soft text-danger-deep ring-[#eccdc8]" },
};
