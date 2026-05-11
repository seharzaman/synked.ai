-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('discovery', 'active', 'delivered', 'paused');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('in_progress', 'completed', 'expired');

-- CreateEnum
CREATE TYPE "BlueprintCategory" AS ENUM ('agent', 'workflow', 'rag', 'full_system');

-- CreateEnum
CREATE TYPE "DeliverableType" AS ENUM ('agent', 'workflow', 'integration', 'custom');

-- CreateEnum
CREATE TYPE "GraphPattern" AS ENUM ('conversational', 'pipeline', 'reactive', 'team_orchestrator', 'team_autonomous');

-- AlterTable
ALTER TABLE "ai_agent" ADD COLUMN     "channels" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "deploymentId" TEXT,
ADD COLUMN     "deploymentStatus" TEXT,
ADD COLUMN     "deploymentUrl" TEXT,
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'discovery',
    "industry" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "budget" DOUBLE PRECISION,
    "companyId" TEXT,
    "clientId" TEXT,
    "auditId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_report" (
    "id" TEXT NOT NULL,
    "threadId" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactRole" TEXT,
    "websiteUrl" TEXT,
    "crawlData" JSONB,
    "scores" JSONB NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "opportunities" JSONB NOT NULL,
    "recommendedStack" JSONB NOT NULL,
    "roadmap" JSONB NOT NULL,
    "roi" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "selectedDepartments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answers" JSONB,
    "status" "AuditStatus" NOT NULL DEFAULT 'in_progress',
    "companyId" TEXT,
    "clientId" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprint" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "category" "BlueprintCategory" NOT NULL,
    "steps" JSONB NOT NULL,
    "estimatedHours" INTEGER,
    "estimatedROI" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blueprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_deliverable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "DeliverableType" NOT NULL,
    "config" JSONB,
    "outcome" JSONB,
    "notes" TEXT,
    "projectId" TEXT NOT NULL,
    "blueprintId" TEXT,
    "agentId" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "graphPattern" "GraphPattern" NOT NULL DEFAULT 'conversational',
    "baseConfig" JSONB,
    "systemPrompt" TEXT,
    "teamConfig" JSONB,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight" (
    "id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "finding" TEXT NOT NULL,
    "evidenceCount" INTEGER NOT NULL DEFAULT 1,
    "avgROI" TEXT,
    "relatedBlueprintIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_companyId_idx" ON "project"("companyId");

-- CreateIndex
CREATE INDEX "project_clientId_idx" ON "project"("clientId");

-- CreateIndex
CREATE INDEX "project_auditId_idx" ON "project"("auditId");

-- CreateIndex
CREATE INDEX "project_status_idx" ON "project"("status");

-- CreateIndex
CREATE UNIQUE INDEX "audit_report_threadId_key" ON "audit_report"("threadId");

-- CreateIndex
CREATE INDEX "audit_report_companyId_idx" ON "audit_report"("companyId");

-- CreateIndex
CREATE INDEX "audit_report_clientId_idx" ON "audit_report"("clientId");

-- CreateIndex
CREATE INDEX "audit_report_status_idx" ON "audit_report"("status");

-- CreateIndex
CREATE UNIQUE INDEX "blueprint_slug_key" ON "blueprint"("slug");

-- CreateIndex
CREATE INDEX "blueprint_category_idx" ON "blueprint"("category");

-- CreateIndex
CREATE INDEX "blueprint_industry_idx" ON "blueprint"("industry");

-- CreateIndex
CREATE INDEX "project_deliverable_projectId_idx" ON "project_deliverable"("projectId");

-- CreateIndex
CREATE INDEX "project_deliverable_blueprintId_idx" ON "project_deliverable"("blueprintId");

-- CreateIndex
CREATE INDEX "project_deliverable_agentId_idx" ON "project_deliverable"("agentId");

-- CreateIndex
CREATE INDEX "agent_template_category_idx" ON "agent_template"("category");

-- CreateIndex
CREATE INDEX "agent_template_graphPattern_idx" ON "agent_template"("graphPattern");

-- CreateIndex
CREATE INDEX "insight_industry_idx" ON "insight"("industry");

-- CreateIndex
CREATE INDEX "insight_category_idx" ON "insight"("category");

-- CreateIndex
CREATE INDEX "ai_agent_templateId_idx" ON "ai_agent"("templateId");

-- CreateIndex
CREATE INDEX "ai_agent_projectId_idx" ON "ai_agent"("projectId");

-- AddForeignKey
ALTER TABLE "ai_agent" ADD CONSTRAINT "ai_agent_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "agent_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_agent" ADD CONSTRAINT "ai_agent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "audit_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_report" ADD CONSTRAINT "audit_report_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_report" ADD CONSTRAINT "audit_report_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint" ADD CONSTRAINT "blueprint_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_deliverable" ADD CONSTRAINT "project_deliverable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_deliverable" ADD CONSTRAINT "project_deliverable_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "blueprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_deliverable" ADD CONSTRAINT "project_deliverable_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "ai_agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_template" ADD CONSTRAINT "agent_template_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight" ADD CONSTRAINT "insight_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
