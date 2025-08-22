"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, use } from "react";
import { useForm, useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const optionSchema = z.object({ text: z.string().min(1) });
const questionSchema = z.object({ text: z.string().min(1), options: z.array(optionSchema).min(1).max(5) });
const formSchema = z.object({ title: z.string().min(1), questions: z.array(questionSchema).min(1).max(10) });

type FormValues = z.infer<typeof formSchema>;

type ServerSurvey = { id: string; title: string; questions: { id: string; text: string; options: { id: string; text: string }[] }[] };

export default function EditSurveyPage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const { id } = use(params);
	const [survey, setSurvey] = useState<ServerSurvey | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const res = await fetch(`/api/surveys/${id}`);
			if (!res.ok) { setLoading(false); return; }
			const data = await res.json();
			setSurvey(data);
			setLoading(false);
		})();
	}, [id]);

	const defaultValues = useMemo<FormValues>(() => {
		if (!survey) return { title: "", questions: [] };
		return {
			title: survey.title,
			questions: survey.questions.map((q) => ({ text: q.text, options: q.options.map((o) => ({ text: o.text })) })),
		};
	}, [survey]);

	const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	useEffect(() => { if (survey) reset(defaultValues); }, [survey, defaultValues, reset]);

	const { fields: qFields, append: appendQ, remove: removeQ } = useFieldArray({ control, name: "questions" });

	const onSubmit = async (values: FormValues) => {
		const res = await fetch(`/api/surveys/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
		if (!res.ok) return alert("Ошибка сохранения");
		router.push(`/surveys/${id}`);
	};

	return (
		<main className="min-h-dvh p-6">
			<div className="max-w-3xl mx-auto space-y-6">
				<h1 className="text-3xl font-semibold">Редактировать опрос</h1>
				{loading ? (
					<p className="text-sm text-[var(--color-text-muted)]">Загрузка...</p>
				) : (
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
							<button disabled={isSubmitting} type="submit" className="btn-primary px-4 py-2">Сохранить</button>
						</div>
					</form>
				)}
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
