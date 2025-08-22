"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, Control, UseFormRegister, FieldErrors, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSurveyDraft } from "@/stores/surveyDraft";

const optionSchema = z.object({ text: z.string().min(1) });
const questionSchema = z.object({ text: z.string().min(1), options: z.array(optionSchema).min(1).max(5) });
const formSchema = z.object({ title: z.string().min(1), questions: z.array(questionSchema).min(1).max(10) });

type FormValues = z.infer<typeof formSchema>;

export default function NewSurveyPage() {
	const router = useRouter();
	const [isCoordinator, setIsCoordinator] = useState<boolean>(false);
	const { draft, saveDraft, clearDraft } = useSurveyDraft();

	useEffect(() => {
		(async () => {
			const res = await fetch("/api/auth/session");
			const s = await res.json();
			setIsCoordinator((s?.user as { role?: string } | undefined)?.role === "COORDINATOR");
		})();
	}, []);

	const defaultValues = useMemo<FormValues>(() => (
		draft ?? { title: "", questions: [{ text: "Новый вопрос", options: [{ text: "Вариант 1" }, { text: "Вариант 2" }] }] }
	), [draft]);

	const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const { fields: qFields, append: appendQ, remove: removeQ } = useFieldArray({ control, name: "questions" });

	// Persist draft on change
	const watched = useWatch({ control });
	useEffect(() => {
		saveDraft(watched as FormValues);
	}, [watched, saveDraft]);

	const onSubmit = async (values: FormValues) => {
		const res = await fetch("/api/surveys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
		if (!res.ok) return alert("Ошибка сохранения");
		const { id } = await res.json();
		clearDraft();
		router.push(`/surveys/${id}`);
	};

	if (!isCoordinator) {
		return (
			<main className="min-h-dvh p-6">
				<div className="max-w-3xl mx-auto">
					<p className="text-sm text-[var(--color-text-muted)]">Требуются права координатора</p>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-dvh p-6">
			<div className="max-w-3xl mx-auto space-y-6">
				<h1 className="text-3xl font-semibold">Создать опрос</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm text-[var(--color-text-muted)]">Название</label>
						<input {...register("title")} className="input w-full px-3 py-2" placeholder="Название опроса" />
						{errors.title && <p className="text-sm text-[var(--color-error)]">{errors.title.message as string}</p>}
					</div>

					<div className="space-y-4">
						{qFields.map((q, qi) => (
							<div key={q.id} className="card p-4">
								<div className="flex items-center justify-between mb-2">
									<h3 className="text-lg font-medium">Вопрос {qi + 1}</h3>
									<button type="button" onClick={() => removeQ(qi)} className="text-sm text-[var(--color-error)]">Удалить</button>
								</div>
								<input {...register(`questions.${qi}.text` as const)} className="input w-full px-3 py-2 mb-3" placeholder="Текст вопроса" />
								<OptionsEditor control={control} qIndex={qi} register={register} errors={errors} />
							</div>
						))}
						<button type="button" onClick={() => appendQ({ text: "", options: [{ text: "" }] })} className="btn-primary px-3 py-2">Добавить вопрос</button>
					</div>

					<div className="flex gap-3">
						<button disabled={isSubmitting} type="submit" className="btn-primary px-4 py-2">Сохранить опрос</button>
					</div>
				</form>
			</div>
		</main>
	);
}

type OptionsEditorProps = {
	control: Control<FormValues>;
	qIndex: number;
	register: UseFormRegister<FormValues>;
	errors: FieldErrors<FormValues>;
};

function OptionsEditor({ control, qIndex, register, errors }: OptionsEditorProps) {
	const { fields, append, remove } = useFieldArray({ control, name: `questions.${qIndex}.options` as const });
	return (
		<div className="space-y-2">
			{fields.map((f, oi) => (
				<div key={f.id} className="flex items-center gap-2">
					<input {...register(`questions.${qIndex}.options.${oi}.text` as const)} className="input px-3 py-2 flex-1" placeholder={`Вариант ${oi + 1}`} />
					<button type="button" onClick={() => remove(oi)} className="text-sm text-[var(--color-error)]">Убрать</button>
				</div>
			))}
			<button type="button" onClick={() => append({ text: "" })} className="btn-primary px-3 py-1.5">Добавить вариант</button>
			{errors?.questions?.[qIndex]?.options && (
				<p className="text-sm text-[var(--color-error)]">Нужно 1-5 вариантов</p>
			)}
		</div>
	);
}
