/**
 * GET /api/agents
 * Lists all industry AI Agents (AgriPulse, HealthPulse, TourismPulse,
 * FinPulse, EduPulse, GovPulse, LogiPulse, RetailPulse, EnergyPulse)
 * with their tools, for building an agent picker UI.
 *
 * 200: [{ id, name, icon, tagline, tools: [{name, description}] }]
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { listAgents } from "@/lib/agents/registry";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agents = listAgents().map((a) => ({
    id: a.id,
    name: a.name,
    icon: a.icon,
    tagline: a.tagline,
    tools: a.tools.map((t) => ({ name: t.name, description: t.description })),
  }));

  return NextResponse.json(agents);
}
