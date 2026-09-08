// Registry of Compresor AI's industry AI Agents.
// Product spec §23 names AgriPulse, HealthPulse, TourismPulse, and
// EduPulse/GovPulse as the future product line, sitting on top of the
// Compresor AI core platform. Each agent here is a genuine Claude
// tool-use agent: it reasons over the conversation, calls one or more
// of its deterministic tools (lib/agents/tools.ts) for anything
// calculable, and only then answers — rather than a single-shot
// classification.
import type { AgentToolDef } from "@/lib/claude";

export interface AgentDefinition {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  systemPrompt: string;
  tools: AgentToolDef[];
}

const AGENTS: AgentDefinition[] = [
  {
    id: "agriculture",
    name: "AgriPulse",
    icon: "🌾",
    tagline: "Small AI for African agriculture — crop health, planting windows, farmer advice.",
    systemPrompt:
      "You are AgriPulse, an AI agent for smallholder farmers in Africa. Give short, practical, non-alarmist answers. " +
      "Never claim certainty about a crop problem — use tools to ground any risk assessment, and always frame findings " +
      "as possible rather than definite. If a tool flags high risk or low confidence, recommend the farmer consult a " +
      "local agricultural extension officer.",
    tools: [
      {
        name: "assess_crop_symptoms",
        description: "Assess described crop symptoms and return a risk tier and guidance.",
        input_schema: {
          type: "object",
          properties: {
            crop: { type: "string" },
            symptomDescription: { type: "string" },
          },
          required: ["crop", "symptomDescription"],
        },
      },
      {
        name: "check_planting_window",
        description: "Check whether current rainfall outlook favors planting a given crop.",
        input_schema: {
          type: "object",
          properties: {
            crop: { type: "string" },
            rainfallOutlook: { type: "string", enum: ["high", "low", "unknown"] },
          },
          required: ["crop"],
        },
      },
    ],
  },
  {
    id: "health",
    name: "HealthPulse",
    icon: "🏥",
    tagline: "Symptom triage guidance and care-level routing — not a diagnosis.",
    systemPrompt:
      "You are HealthPulse, a health-guidance AI agent. You NEVER diagnose conditions or prescribe treatment. " +
      "Use your tools to triage described symptoms into an urgency level and recommend the appropriate level of care. " +
      "Always include a short disclaimer that this is general guidance, not a medical diagnosis, and to seek " +
      "professional care for anything serious or persistent.",
    tools: [
      {
        name: "triage_symptoms",
        description: "Triage described symptoms into an urgency level.",
        input_schema: {
          type: "object",
          properties: { symptoms: { type: "string" } },
          required: ["symptoms"],
        },
      },
      {
        name: "find_care_level",
        description: "Given an urgency level, recommend the appropriate type of care facility.",
        input_schema: {
          type: "object",
          properties: { urgency: { type: "string", enum: ["self-care", "see-clinician", "seek-emergency-care"] } },
          required: ["urgency"],
        },
      },
    ],
  },
  {
    id: "tourism",
    name: "TourismPulse",
    icon: "✈️",
    tagline: "Trip itineraries and travel-requirement pointers.",
    systemPrompt:
      "You are TourismPulse, a travel-planning AI agent. Use your tools to draft itineraries and to point travelers " +
      "toward verifying visa/entry requirements officially — never state a specific visa rule yourself since these " +
      "change often and vary by nationality.",
    tools: [
      {
        name: "suggest_itinerary",
        description: "Suggest a day-by-day itinerary theme for a trip.",
        input_schema: {
          type: "object",
          properties: {
            destination: { type: "string" },
            days: { type: "number" },
            interests: { type: "string", description: "Comma-separated interests" },
          },
          required: ["destination", "days"],
        },
      },
      {
        name: "check_visa_requirement",
        description: "Return guidance on where to verify visa requirements for a traveler.",
        input_schema: {
          type: "object",
          properties: { nationality: { type: "string" }, destination: { type: "string" } },
          required: ["nationality", "destination"],
        },
      },
    ],
  },
  {
    id: "fintech",
    name: "FinPulse",
    icon: "💳",
    tagline: "Transaction risk scoring and loan-affordability checks.",
    systemPrompt:
      "You are FinPulse, a financial-operations AI agent. Use your tools for any risk scoring or affordability " +
      "calculation — never estimate these numbers yourself. Present results as factual information to help the " +
      "user decide, not as financial advice; you are not a licensed financial advisor.",
    tools: [
      {
        name: "assess_transaction_risk",
        description: "Score the fraud/risk level of a transaction.",
        input_schema: {
          type: "object",
          properties: {
            amountUSD: { type: "number" },
            isNewRecipient: { type: "boolean" },
            countryRisk: { type: "string", enum: ["low", "standard", "high"] },
          },
          required: ["amountUSD"],
        },
      },
      {
        name: "calculate_loan_affordability",
        description: "Calculate debt-to-income ratio and affordability for a requested loan payment.",
        input_schema: {
          type: "object",
          properties: {
            monthlyIncome: { type: "number" },
            monthlyExpenses: { type: "number" },
            requestedMonthlyPayment: { type: "number" },
          },
          required: ["monthlyIncome", "monthlyExpenses", "requestedMonthlyPayment"],
        },
      },
    ],
  },
  {
    id: "education",
    name: "EduPulse",
    icon: "🎓",
    tagline: "Personalized learning paths and study-time estimates.",
    systemPrompt:
      "You are EduPulse, an education-planning AI agent. Use your tools to build learning paths and study-time " +
      "estimates grounded in the learner's stated level and availability. Keep recommendations short and practical.",
    tools: [
      {
        name: "recommend_learning_path",
        description: "Recommend a learning path given a subject and current level.",
        input_schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            currentLevel: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
            goal: { type: "string" },
          },
          required: ["subject", "currentLevel"],
        },
      },
      {
        name: "estimate_study_time",
        description: "Estimate weeks needed to cover a number of topics at a given weekly study pace.",
        input_schema: {
          type: "object",
          properties: { topicsCount: { type: "number" }, hoursPerWeek: { type: "number" } },
          required: ["topicsCount", "hoursPerWeek"],
        },
      },
    ],
  },
  {
    id: "government",
    name: "GovPulse",
    icon: "🏛️",
    tagline: "Government service checklists and processing-time estimates.",
    systemPrompt:
      "You are GovPulse, a government-services AI agent. Use your tools for document checklists and processing-time " +
      "estimates, and always tell the user these are general guidance to confirm with the relevant office, since " +
      "exact requirements vary by jurisdiction.",
    tools: [
      {
        name: "lookup_service_requirement",
        description: "Look up a general document checklist for a type of government service.",
        input_schema: {
          type: "object",
          properties: { serviceType: { type: "string", enum: ["business-registration", "id-renewal", "tax-filing", "general"] } },
          required: ["serviceType"],
        },
      },
      {
        name: "estimate_processing_time",
        description: "Estimate processing time for a service given current office backlog.",
        input_schema: {
          type: "object",
          properties: {
            serviceType: { type: "string" },
            backlogLevel: { type: "string", enum: ["low", "normal", "high"] },
          },
          required: ["serviceType"],
        },
      },
    ],
  },
  {
    id: "logistics",
    name: "LogiPulse",
    icon: "🚚",
    tagline: "Delivery route/cost estimates and customs-duty ballparks.",
    systemPrompt:
      "You are LogiPulse, a logistics-planning AI agent. Use your tools for any ETA, cost, or customs-duty figure " +
      "— never estimate these yourself. Label customs figures as illustrative, since actual duty depends on the " +
      "destination country's tariff schedule.",
    tools: [
      {
        name: "estimate_delivery_route",
        description: "Estimate ETA and cost for a delivery given distance and transport mode.",
        input_schema: {
          type: "object",
          properties: {
            distanceKm: { type: "number" },
            mode: { type: "string", enum: ["road", "air", "sea"] },
          },
          required: ["distanceKm", "mode"],
        },
      },
      {
        name: "check_customs_duty",
        description: "Give an illustrative customs duty estimate for a shipment category and value.",
        input_schema: {
          type: "object",
          properties: {
            valueUSD: { type: "number" },
            category: { type: "string", enum: ["electronics", "textiles", "food", "general"] },
          },
          required: ["valueUSD", "category"],
        },
      },
    ],
  },
  {
    id: "retail",
    name: "RetailPulse",
    icon: "🛍️",
    tagline: "Product bundle suggestions and inventory-reorder risk checks.",
    systemPrompt:
      "You are RetailPulse, a retail-operations AI agent. Use your tools for bundle suggestions and reorder-risk " +
      "checks grounded in the numbers the user gives you, not invented figures.",
    tools: [
      {
        name: "recommend_product_bundle",
        description: "Suggest complementary add-ons for a primary product given a budget.",
        input_schema: {
          type: "object",
          properties: { primaryItem: { type: "string" }, budget: { type: "number" } },
          required: ["primaryItem", "budget"],
        },
      },
      {
        name: "check_reorder_risk",
        description: "Check whether current stock will run out before a reorder lead time elapses.",
        input_schema: {
          type: "object",
          properties: {
            currentStock: { type: "number" },
            avgDailySales: { type: "number" },
            leadTimeDays: { type: "number" },
          },
          required: ["currentStock", "avgDailySales", "leadTimeDays"],
        },
      },
    ],
  },
  {
    id: "energy",
    name: "EnergyPulse",
    icon: "⚡",
    tagline: "Solar-savings estimates and grid-load risk checks.",
    systemPrompt:
      "You are EnergyPulse, an energy-planning AI agent. Use your tools for any solar-savings or grid-load figure. " +
      "Present payback estimates as rough, rule-of-thumb projections, not guarantees.",
    tools: [
      {
        name: "estimate_solar_savings",
        description: "Estimate monthly savings and payback period from installing solar given a bill and sun hours.",
        input_schema: {
          type: "object",
          properties: { monthlyBillUSD: { type: "number" }, sunHoursPerDay: { type: "number" } },
          required: ["monthlyBillUSD", "sunHoursPerDay"],
        },
      },
      {
        name: "check_grid_load_risk",
        description: "Check grid utilization and risk tier given demand and capacity in MW.",
        input_schema: {
          type: "object",
          properties: { demandMW: { type: "number" }, capacityMW: { type: "number" } },
          required: ["demandMW", "capacityMW"],
        },
      },
    ],
  },
];

export function listAgents(): AgentDefinition[] {
  return AGENTS;
}

export function getAgent(id: string): AgentDefinition | undefined {
  return AGENTS.find((a) => a.id === id);
}
