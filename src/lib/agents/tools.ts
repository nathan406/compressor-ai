// Deterministic tool implementations for the AI Agents framework.
// Every tool is a pure calculation/lookup over the input the agent
// provides — no invented facts, no external network calls. Where a
// real answer depends on jurisdiction-specific or highly variable
// data (visa rules, customs duty, legal requirements), the tool
// returns clearly-labeled general guidance and tells the caller to
// verify with the relevant authority, rather than fabricating a
// specific figure.

type ToolFn = (input: Record<string, unknown>) => Record<string, unknown>;

const str = (v: unknown, fallback = "") => (typeof v === "string" && v.trim() ? v.trim() : fallback);
const num = (v: unknown, fallback = 0) => (typeof v === "number" && !Number.isNaN(v) ? v : Number(v) || fallback);

// ── Agriculture (AgriPulse) ────────────────────────────────────────
const assess_crop_symptoms: ToolFn = (input) => {
  const crop = str(input.crop, "crop");
  const desc = str(input.symptomDescription).toLowerCase();
  let riskTier = "low";
  let guidance = `No strong signal of a specific problem from the description given. Keep monitoring ${crop} over the next few days.`;

  if (/yellow|chloros/.test(desc)) {
    riskTier = "medium";
    guidance = "Yellowing often points to nutrient deficiency or water stress. Check soil moisture and consider a nitrogen-rich feed.";
  }
  if (/wilt|dying|spread|rot/.test(desc)) {
    riskTier = "high";
    guidance = "Wilting or spreading damage can indicate disease. Isolate affected plants where possible and consult an agricultural extension officer.";
  }
  if (/hole|chew|insect|bug|caterpillar/.test(desc)) {
    riskTier = "medium";
    guidance = "Signs of pest activity. Inspect leaf undersides and consider an appropriate, locally-approved pest control method.";
  }

  return { crop, riskTier, guidance, note: "Possible assessment only — not a certain diagnosis." };
};

const check_planting_window: ToolFn = (input) => {
  const crop = str(input.crop, "crop");
  const rainfallOutlook = str(input.rainfallOutlook, "unknown").toLowerCase();
  const recommendation =
    rainfallOutlook === "high"
      ? `Rain expected: high probability. Conditions may be suitable for planting ${crop}.`
      : rainfallOutlook === "low"
      ? `Dry period detected. Consider delaying planting ${crop} until sufficient rainfall is expected.`
      : `Rainfall outlook unclear — check a local forecast before planting ${crop}.`;
  return { crop, rainfallOutlook, recommendation };
};

// ── Health (HealthPulse) ───────────────────────────────────────────
const triage_symptoms: ToolFn = (input) => {
  const symptoms = str(input.symptoms).toLowerCase();
  let urgency = "self-care";
  if (/mild|slight|minor/.test(symptoms) || symptoms.length < 5) urgency = "self-care";
  if (/fever|pain|vomit|persistent|days/.test(symptoms)) urgency = "see-clinician";
  if (/chest pain|difficulty breathing|severe bleeding|unconscious|stroke|can't breathe|cannot breathe/.test(symptoms)) {
    urgency = "seek-emergency-care";
  }
  return {
    urgency,
    disclaimer: "This is general guidance only, not a medical diagnosis. When in doubt, seek professional care.",
  };
};

const find_care_level: ToolFn = (input) => {
  const urgency = str(input.urgency, "self-care");
  const facilityType =
    urgency === "seek-emergency-care" ? "Nearest emergency department"
    : urgency === "see-clinician"     ? "Local clinic or general practitioner"
    :                                    "Home self-care, monitor and revisit if symptoms worsen";
  return { urgency, facilityType };
};

// ── Tourism (TourismPulse) ─────────────────────────────────────────
const suggest_itinerary: ToolFn = (input) => {
  const destination = str(input.destination, "your destination");
  const days = Math.max(1, Math.min(14, Math.round(num(input.days, 3))));
  const interests = str(input.interests, "sightseeing").split(",").map((s) => s.trim()).filter(Boolean);
  const themes = interests.length ? interests : ["sightseeing", "local food", "culture"];

  const plan = Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    focus: themes[i % themes.length],
  }));

  return { destination, days, plan };
};

const check_visa_requirement: ToolFn = (input) => {
  const nationality = str(input.nationality, "the traveler's nationality");
  const destination = str(input.destination, "the destination");
  return {
    nationality,
    destination,
    note: `Visa requirements vary by nationality, destination, and trip purpose and change frequently. Verify current requirements with ${destination}'s official embassy/immigration website before booking.`,
  };
};

// ── Fintech (FinPulse) ─────────────────────────────────────────────
const assess_transaction_risk: ToolFn = (input) => {
  const amountUSD = num(input.amountUSD, 0);
  const isNewRecipient = Boolean(input.isNewRecipient);
  const countryRisk = str(input.countryRisk, "standard").toLowerCase(); // low | standard | high

  let riskScore = 10;
  if (amountUSD > 1000) riskScore += 20;
  if (amountUSD > 10000) riskScore += 25;
  if (isNewRecipient) riskScore += 20;
  if (countryRisk === "high") riskScore += 25;
  if (countryRisk === "low") riskScore -= 5;
  riskScore = Math.max(0, Math.min(100, riskScore));

  const tier = riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low";
  return { riskScore, tier };
};

const calculate_loan_affordability: ToolFn = (input) => {
  const monthlyIncome = num(input.monthlyIncome, 0);
  const monthlyExpenses = num(input.monthlyExpenses, 0);
  const requestedMonthlyPayment = num(input.requestedMonthlyPayment, 0);
  const freeIncome = monthlyIncome - monthlyExpenses;
  const debtToIncomeRatio = monthlyIncome > 0
    ? Math.round(((monthlyExpenses + requestedMonthlyPayment) / monthlyIncome) * 100)
    : 0;
  return {
    freeIncome,
    debtToIncomeRatio,
    affordable: freeIncome >= requestedMonthlyPayment && debtToIncomeRatio <= 40,
  };
};

// ── Education (EduPulse) ───────────────────────────────────────────
const recommend_learning_path: ToolFn = (input) => {
  const subject = str(input.subject, "the subject");
  const currentLevel = str(input.currentLevel, "beginner").toLowerCase();
  const steps =
    currentLevel === "advanced" ? ["Deep-dive projects", "Peer review / teaching others", "Contribute to real-world work"]
    : currentLevel === "intermediate" ? ["Targeted practice on weak areas", "Applied projects", "Structured assessment"]
    :                                    ["Core fundamentals", "Guided exercises", "Small practice projects"];
  return { subject, currentLevel, steps };
};

const estimate_study_time: ToolFn = (input) => {
  const topicsCount = Math.max(1, Math.round(num(input.topicsCount, 5)));
  const hoursPerWeek = Math.max(1, num(input.hoursPerWeek, 5));
  const hoursPerTopic = 3;
  const weeksNeeded = Math.ceil((topicsCount * hoursPerTopic) / hoursPerWeek);
  return { topicsCount, hoursPerWeek, weeksNeeded };
};

// ── Government (GovPulse) ──────────────────────────────────────────
const lookup_service_requirement: ToolFn = (input) => {
  const serviceType = str(input.serviceType, "general").toLowerCase();
  const checklists: Record<string, string[]> = {
    "business-registration": ["Valid ID", "Proof of address", "Business name reservation", "Registration fee"],
    "id-renewal":            ["Existing ID or reference number", "Proof of address", "Passport photo"],
    "tax-filing":            ["Income records", "Tax ID number", "Prior year filing (if applicable)"],
  };
  const requirements = checklists[serviceType] ?? ["Valid ID", "Proof of address", "Relevant supporting documents"];
  return { serviceType, requirements, note: "General guidance — confirm the exact document list with the relevant government office." };
};

const estimate_processing_time: ToolFn = (input) => {
  const serviceType = str(input.serviceType, "general");
  const backlogLevel = str(input.backlogLevel, "normal").toLowerCase(); // low | normal | high
  const baseDays = 5;
  const multiplier = backlogLevel === "high" ? 3 : backlogLevel === "low" ? 0.6 : 1;
  return { serviceType, estimatedDays: Math.round(baseDays * multiplier) };
};

// ── Logistics (LogiPulse) ──────────────────────────────────────────
const estimate_delivery_route: ToolFn = (input) => {
  const distanceKm = Math.max(0, num(input.distanceKm, 0));
  const mode = str(input.mode, "road").toLowerCase(); // road | air | sea
  const speedKmh: Record<string, number> = { road: 55, air: 700, sea: 30 };
  const costPerKm: Record<string, number> = { road: 0.9, air: 4.5, sea: 0.15 };
  const speed = speedKmh[mode] ?? speedKmh.road;
  const cost = costPerKm[mode] ?? costPerKm.road;
  return {
    mode,
    distanceKm,
    etaHours: Math.round((distanceKm / speed) * 10) / 10,
    costEstimateUSD: Math.round(distanceKm * cost),
  };
};

const check_customs_duty: ToolFn = (input) => {
  const valueUSD = Math.max(0, num(input.valueUSD, 0));
  const category = str(input.category, "general").toLowerCase();
  const illustrativePct: Record<string, number> = { electronics: 15, textiles: 20, food: 10, general: 12 };
  const pct = illustrativePct[category] ?? illustrativePct.general;
  return {
    category,
    illustrativeDutyPct: pct,
    illustrativeDutyUSD: Math.round((valueUSD * pct) / 100),
    note: "Illustrative only — actual customs duty depends on the destination country's tariff schedule. Verify with the relevant customs authority.",
  };
};

// ── Retail (RetailPulse) ───────────────────────────────────────────
const recommend_product_bundle: ToolFn = (input) => {
  const primaryItem = str(input.primaryItem, "this item");
  const budget = num(input.budget, 0);
  const addOns = budget > 100
    ? ["premium accessory", "extended warranty", "complementary item"]
    : ["basic accessory", "complementary item"];
  return { primaryItem, budget, suggestedAddOns: addOns };
};

const check_reorder_risk: ToolFn = (input) => {
  const currentStock = Math.max(0, num(input.currentStock, 0));
  const avgDailySales = Math.max(0.01, num(input.avgDailySales, 1));
  const leadTimeDays = Math.max(0, num(input.leadTimeDays, 7));
  const daysOfStockLeft = Math.round((currentStock / avgDailySales) * 10) / 10;
  return { daysOfStockLeft, reorderNow: daysOfStockLeft <= leadTimeDays };
};

// ── Energy (EnergyPulse) ───────────────────────────────────────────
const estimate_solar_savings: ToolFn = (input) => {
  const monthlyBillUSD = Math.max(0, num(input.monthlyBillUSD, 0));
  const sunHoursPerDay = Math.max(1, num(input.sunHoursPerDay, 5));
  const offsetPct = Math.min(90, Math.round(sunHoursPerDay * 9));
  const estimatedMonthlySavingsUSD = Math.round((monthlyBillUSD * offsetPct) / 100);
  const systemCostEstimateUSD = Math.round(monthlyBillUSD * 12 * 4); // rough rule-of-thumb multiplier
  const paybackYears = estimatedMonthlySavingsUSD > 0
    ? Math.round((systemCostEstimateUSD / (estimatedMonthlySavingsUSD * 12)) * 10) / 10
    : null;
  return { offsetPct, estimatedMonthlySavingsUSD, paybackYears };
};

const check_grid_load_risk: ToolFn = (input) => {
  const demandMW = Math.max(0, num(input.demandMW, 0));
  const capacityMW = Math.max(1, num(input.capacityMW, 1));
  const utilizationPct = Math.round((demandMW / capacityMW) * 100);
  const riskTier = utilizationPct >= 90 ? "high" : utilizationPct >= 70 ? "medium" : "low";
  return { utilizationPct, riskTier };
};

// ── Registry dispatch ───────────────────────────────────────────────
const TOOLS: Record<string, ToolFn> = {
  assess_crop_symptoms, check_planting_window,
  triage_symptoms, find_care_level,
  suggest_itinerary, check_visa_requirement,
  assess_transaction_risk, calculate_loan_affordability,
  recommend_learning_path, estimate_study_time,
  lookup_service_requirement, estimate_processing_time,
  estimate_delivery_route, check_customs_duty,
  recommend_product_bundle, check_reorder_risk,
  estimate_solar_savings, check_grid_load_risk,
};

export function runTool(toolName: string, input: Record<string, unknown>): Record<string, unknown> {
  const fn = TOOLS[toolName];
  if (!fn) return { error: `Unknown tool: ${toolName}` };
  try {
    return fn(input ?? {});
  } catch (err) {
    return { error: `Tool ${toolName} failed`, detail: String(err) };
  }
}
