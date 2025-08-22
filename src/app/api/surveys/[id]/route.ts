import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireCoordinator } from "@/lib/rbac";
import { createSurveySchema } from "@/lib/validation";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const survey = await prisma.survey.findUnique({
		where: { id },
		include: {
			questions: { include: { options: true }, orderBy: { order: "asc" } },
		},
	});
	if (!survey) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(survey);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	await requireCoordinator();
	const { id } = await context.params;
	const body = await request.json();
	const nextStatus = body?.status as "OPEN" | "CLOSED" | undefined;
	if (!nextStatus) return NextResponse.json({ error: "Bad request" }, { status: 400 });
	const updated = await prisma.survey.update({ where: { id }, data: { status: nextStatus } });
	return NextResponse.json({ id: updated.id, status: updated.status });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
	await requireCoordinator();
	const { id } = await context.params;
	await prisma.survey.delete({ where: { id } });
	return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	await requireCoordinator();
	const { id } = await context.params;
	const body = await request.json();
	const parsed = createSurveySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}
	const { title, questions } = parsed.data;
	const updated = await prisma.survey.update({
		where: { id },
		data: {
			title,
			questions: {
				deleteMany: {},
				create: questions.map((q, i) => ({
					text: q.text,
					order: i + 1,
					options: { create: q.options.map((o, j) => ({ text: o.text, order: j + 1 })) },
				})),
			},
		},
		select: { id: true },
	});
	return NextResponse.json({ id: updated.id }, { status: 200 });
}
