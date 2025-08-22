import { z } from "zod";

export const createSurveySchema = z.object({
	title: z.string().min(1).max(200),
	questions: z.array(
		z.object({
			text: z.string().min(1).max(500),
			options: z.array(z.object({ text: z.string().min(1).max(200) })).min(1).max(5),
		})
	).min(1).max(10),
});

export type CreateSurveyInput = z.infer<typeof createSurveySchema>;

export const submitResponseSchema = z.object({
	answers: z.array(
		z.object({
			questionId: z.string().min(1),
			optionId: z.string().min(1),
		})
	).min(1),
});

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
