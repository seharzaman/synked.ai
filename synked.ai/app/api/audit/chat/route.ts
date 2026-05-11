import { NextRequest, NextResponse } from "next/server";
import { Command } from "@langchain/langgraph";
import { auditGraph } from "../lib/agent";
import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Business Audit Agent API — LangGraph state machine
 *
 * Actions:
 * - "start": Begin the audit (provide userContext) → returns greeting
 * - "crawl_complete": Resume with crawl data → returns analysis + departments
 * - "departments_selected": Resume with selected departments → returns first question
 * - "answer": Resume with user's answer → returns next question or final report
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, threadId, userContext, crawlData, departments, answer } =
      body;

    if (!threadId) {
      return NextResponse.json(
        { error: "threadId is required" },
        { status: 400 },
      );
    }

    const config = { configurable: { thread_id: threadId } };

    if (action === "start") {
      if (!userContext) {
        return NextResponse.json(
          { error: "userContext required for start action" },
          { status: 400 },
        );
      }

      // Start the graph — runs greet node, then interrupts at wait_for_crawl
      await auditGraph.invoke(
        {
          name: userContext.name,
          email: userContext.email,
          company: userContext.company,
          role: userContext.role,
          industry: userContext.industry,
        },
        config,
      );

      const snapshot = await auditGraph.getState(config);
      const state = snapshot.values;

      return NextResponse.json({
        phase: "greeting",
        greeting: state.greeting,
      });
    }

    if (action === "crawl_complete") {
      if (!crawlData) {
        return NextResponse.json(
          { error: "crawlData required" },
          { status: 400 },
        );
      }

      // Resume — runs analyze + suggest_departments, then interrupts at wait_for_departments
      await auditGraph.invoke(new Command({ resume: crawlData }), config);

      const snapshot = await auditGraph.getState(config);
      const state = snapshot.values;

      return NextResponse.json({
        phase: "departments",
        analysis: state.analysis,
        keyFindings: state.keyFindings,
        suggestedDepartments: state.suggestedDepartments,
      });
    }

    if (action === "departments_selected") {
      if (!departments || !Array.isArray(departments)) {
        return NextResponse.json(
          { error: "departments array required" },
          { status: 400 },
        );
      }

      // Resume — runs route_questions + ask_question, then interrupts at wait_for_answer
      await auditGraph.invoke(new Command({ resume: departments }), config);

      const snapshot = await auditGraph.getState(config);
      const state = snapshot.values;

      return NextResponse.json({
        phase: "question",
        question: state.currentQuestion,
        questionNumber: state.questionNumber,
        totalQuestions: state.totalQuestions,
        skippedTopics: state.skippedTopics ?? [],
      });
    }

    if (action === "answer") {
      if (!answer) {
        return NextResponse.json({ error: "answer required" }, { status: 400 });
      }

      // Resume — goes through assess_answer → probe or compute_scores → next_question or report
      await auditGraph.invoke(new Command({ resume: answer }), config);

      const snapshot = await auditGraph.getState(config);
      const state = snapshot.values;

      if (state.phase === "report_done" && state.reportData) {
        // Persist the audit report to the database
        try {
          await prisma.auditReport.upsert({
            where: { threadId },
            update: {
              scores: state.reportData
                .scores as unknown as Prisma.InputJsonValue,
              overallScore: state.reportData.overallScore,
              opportunities: state.reportData
                .opportunities as unknown as Prisma.InputJsonValue,
              recommendedStack: state.reportData
                .recommendedStack as unknown as Prisma.InputJsonValue,
              roadmap: state.reportData
                .roadmap as unknown as Prisma.InputJsonValue,
              roi: state.reportData.roi as unknown as Prisma.InputJsonValue,
              summary: state.reportData.summary,
              selectedDepartments: state.selectedDepartments,
              answers: state.answers as unknown as Prisma.InputJsonValue,
              status: "completed",
              completedAt: new Date(),
            },
            create: {
              threadId,
              contactName: state.name,
              contactEmail: state.email,
              contactRole: state.role,
              websiteUrl: state.url,
              scores: state.reportData
                .scores as unknown as Prisma.InputJsonValue,
              overallScore: state.reportData.overallScore,
              opportunities: state.reportData
                .opportunities as unknown as Prisma.InputJsonValue,
              recommendedStack: state.reportData
                .recommendedStack as unknown as Prisma.InputJsonValue,
              roadmap: state.reportData
                .roadmap as unknown as Prisma.InputJsonValue,
              roi: state.reportData.roi as unknown as Prisma.InputJsonValue,
              summary: state.reportData.summary,
              selectedDepartments: state.selectedDepartments,
              answers: state.answers as unknown as Prisma.InputJsonValue,
              status: "completed",
              completedAt: new Date(),
            },
          });
        } catch (persistError) {
          console.error("Failed to persist audit report:", persistError);
        }

        return NextResponse.json({
          phase: "report",
          report: state.reportData,
        });
      }

      // Check if this is a probe (follow-up for vague answer)
      if (state.phase === "probe_asked") {
        return NextResponse.json({
          phase: "probe",
          question: state.currentQuestion,
          questionNumber: state.questionNumber,
          totalQuestions: state.totalQuestions,
          partialScores: state.partialScores,
        });
      }

      // Next question with partial scores
      return NextResponse.json({
        phase: "question",
        question: state.currentQuestion,
        questionNumber: state.questionNumber,
        totalQuestions: state.totalQuestions,
        partialScores: state.partialScores,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Audit chat error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
