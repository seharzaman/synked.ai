import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  company: z.string().min(1).max(200),
  companyWebsite: z.string().url().max(500).optional(),
  industry: z.string().max(100).optional(),
  title: z.string().max(100).optional(),
  message: z.string().min(10).max(5000),
  serviceInterest: z.array(z.string()).min(1).max(10),
  budgetRange: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Find or create company
    let company = await prisma.company.findFirst({
      where: {
        OR: [
          { name: { equals: data.company, mode: "insensitive" } },
          ...(data.companyWebsite
            ? [
                {
                  website: {
                    equals: data.companyWebsite,
                    mode: "insensitive" as const,
                  },
                },
              ]
            : []),
        ],
      },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: data.company,
          website: data.companyWebsite || null,
          industry: data.industry || null,
          status: "prospect",
        },
      });
    }

    // Find or create client
    let client = await prisma.client.findFirst({
      where: { email: { equals: data.email, mode: "insensitive" } },
    });

    if (client) {
      // Update existing client with new submission info
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          name: data.name,
          phone: data.phone || client.phone,
          title: data.title || client.title,
          message: data.message,
          serviceInterest: data.serviceInterest,
          budgetRange: data.budgetRange || client.budgetRange,
          companyId: company.id,
        },
      });
    } else {
      client = await prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          title: data.title || null,
          status: "lead",
          message: data.message,
          serviceInterest: data.serviceInterest,
          budgetRange: data.budgetRange || null,
          companyId: company.id,
        },
      });
    }

    await logActivity("lead.submitted", "client", client.id, undefined, {
      name: data.name,
      email: data.email,
      company: data.company,
      serviceInterest: data.serviceInterest,
      budgetRange: data.budgetRange,
    } as unknown as Record<string, unknown>);

    return NextResponse.json(
      {
        success: true,
        clientId: client.id,
        message: "Thank you! We'll be in touch within 24 hours.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[user/contact] POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
