import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireCoordinator, getOptionalUser } from "@/lib/rbac";
import { createSurveySchema } from "@/lib/validation";
import { Prisma, type SurveyStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
	const params = request.nextUrl.searchParams;
	const statusParam = params.get("status");
	const q = params.get("q")?.trim() ?? "";
	const page = Math.max(1, Number(params.get("page") ?? 1) || 1);
	const pageSize = Math.min(50, Math.max(1, Number(params.get("pageSize") ?? 10) || 10));

	const where: Prisma.SurveyWhereInput = {};
	if (statusParam === "OPEN" || statusParam === "CLOSED" || statusParam === "DRAFT") {
		where.status = statusParam as SurveyStatus;
	}
	if (q) {
		where.title = { contains: q };
	}

	const [total, items] = await Promise.all([
		prisma.survey.count({ where }),
		prisma.survey.findMany({
			where,
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * pageSize,
			take: pageSize,
			select: { id: true, title: true, status: true, createdAt: true, updatedAt: true },
		}),
	]);

	return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request: Request) {
	await requireCoordinator();
	const body = await request.json();
	const parsed = createSurveySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}
	const user = await getOptionalUser();
	if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { title, questions } = parsed.data;
	const created = await prisma.survey.create({
		data: {
			title,
			createdById: user.id,
			questions: {
				create: questions.map((q, i) => ({
					text: q.text,
					order: i + 1,
					options: { create: q.options.map((o, j) => ({ text: o.text, order: j + 1 })) },
				})),
			},
		},
		select: { id: true },
	});
	return NextResponse.json({ id: created.id }, { status: 201 });
}
