import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { logActivity } from "@/lib/activity-log";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.4,
  maxOutputTokens: 2048,
});

export async function POST(req: NextRequest) {
  try {
    const { clientId } = await req.json();

    if (!clientId || typeof clientId !== "string") {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 },
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        company: true,
        audits: {
          where: { status: "completed" },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { overallScore: true, summary: true, scores: true },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const auditContext = client.audits[0]
      ? `\nAudit Results: Overall Score ${client.audits[0].overallScore}/100. Summary: ${client.audits[0].summary}`
      : "";

    const prompt = `You are a lead qualification AI for Synked.ai, an AI automation agency.

Analyze this lead and provide a qualification assessment:

Name: ${client.name}
Email: ${client.email}
Title: ${client.title || "Not provided"}
Company: ${client.company?.name || "Unknown"}
Industry: ${client.company?.industry || "Not specified"}
Website: ${client.company?.website || "Not provided"}
Service Interest: ${client.serviceInterest.join(", ") || "Not specified"}
Budget Range: ${client.budgetRange || "Not specified"}
Message: ${client.message || "No message"}${auditContext}

Respond with ONLY valid JSON (no markdown) in this exact format:
{
  "score": <number 1-10>,
  "tier": "<hot|warm|cold>",
  "intent": ["<signal1>", "<signal2>"],
  "recommendedService": "<best matching service>",
  "reasoning": "<1-2 sentences explaining the score>",
  "suggestedResponse": "<personalized 2-3 sentence response to send them>",
  "urgency": "<immediate|this_week|next_week|low>"
}

Scoring guidelines:
- 8-10: Clear budget, specific needs, decision-maker, urgent timeline
- 5-7: Some interest, exploring options, moderate budget
- 1-4: Vague interest, no budget, just browsing, bad fit`;

    const response = await model.invoke([
      new SystemMessage(
        "You are a lead qualification assistant. Return only valid JSON.",
      ),
      new HumanMessage(prompt),
    ]);

    const content =
      typeof response.content === "string" ? response.content : "";

    let qualification;
    try {
      const cleaned = content
        .replace(/```json?\n?/g, "")
        .replace(/```/g, "")
        .trim();
      qualification = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    // Update client with score
    await prisma.client.update({
      where: { id: clientId },
      data: {
        qualificationScore: Math.min(10, Math.max(1, qualification.score)),
      },
    });

    await logActivity("lead.qualified", "client", clientId, undefined, {
      score: qualification.score,
      tier: qualification.tier,
      urgency: qualification.urgency,
    });

    return NextResponse.json({ qualification });
  } catch (error) {
    console.error("[user/contact/qualify] POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
