import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const surveyId = id;
	const survey = await prisma.survey.findUnique({
		where: { id: surveyId },
		select: {
			id: true,
			title: true,
			questions: { select: { id: true, text: true, order: true, options: { select: { id: true, text: true, order: true } } }, orderBy: { order: "asc" } },
		},
	});
	if (!survey) return NextResponse.json({ error: "Not found" }, { status: 404 });

	const counts = await prisma.answer.groupBy({ by: ["optionId"], _count: { optionId: true }, where: { question: { surveyId } } });
	const map = new Map(counts.map((c) => [c.optionId, c._count.optionId]));

	const result = {
		id: survey.id,
		title: survey.title,
		questions: survey.questions.map((q) => ({
			id: q.id,
			text: q.text,
			options: q.options.map((o) => ({ id: o.id, text: o.text, count: map.get(o.id) ?? 0 })),
		})),
	};
	return NextResponse.json(result);
}
