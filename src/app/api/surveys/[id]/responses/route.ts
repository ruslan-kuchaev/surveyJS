import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getOptionalUser } from "@/lib/rbac";
import { submitResponseSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const surveyId = id;
	const survey = await prisma.survey.findUnique({ where: { id: surveyId }, select: { status: true } });
	if (!survey || survey.status !== "OPEN") {
		return NextResponse.json({ error: "Survey is not open" }, { status: 400 });
	}
	const body = await request.json();
	const parsed = submitResponseSchema.safeParse(body);
	if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

	const user = await getOptionalUser();

	try {
		const created = await prisma.response.create({
			data: {
				surveyId,
				userId: user?.id ?? null,
				answers: {
					create: parsed.data.answers.map((a) => ({ questionId: a.questionId, optionId: a.optionId })),
				},
			},
		});
		return NextResponse.json({ id: created.id }, { status: 201 });
	} catch (e: unknown) {
		if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
			return NextResponse.json({ error: "Already submitted" }, { status: 409 });
		}
		throw e;
	}
}
