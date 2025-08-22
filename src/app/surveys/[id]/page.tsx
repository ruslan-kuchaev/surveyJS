"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; text: string };
type Question = { id: string; text: string; options: Option[] };

type Survey = { id: string; title: string; questions: Question[] };

export default function TakeSurveyPage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const { id } = use(params);
	const [survey, setSurvey] = useState<Survey | null>(null);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const res = await fetch(`/api/surveys/${id}`);
			if (!res.ok) {
				setError("Опрос не найден");
				setLoading(false);
				return;
			}
			const data = await res.json();
			if (mounted) {
				setSurvey(data);
				setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [id]);

	const submit = async () => {
		setError(null);
		if (!survey) return;
		const missing = survey.questions.some((q) => !answers[q.id]);
		if (missing) {
			setError("Ответьте на все вопросы");
			return;
		}
		setSubmitting(true);
		const payload = { answers: survey.questions.map((q) => ({ questionId: q.id, optionId: answers[q.id] })) };
		const res = await fetch(`/api/surveys/${survey.id}/responses`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
		setSubmitting(false);
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			setError(data?.error ?? "Ошибка отправки");
			return;
		}
		router.push(`/surveys/${survey.id}/results`);
	};

	return (
		<main className="min-h-dvh p-6">
			<div className="max-w-3xl mx-auto space-y-6">
				{loading ? (
					<p className="text-sm text-[var(--color-text-muted)]">Загрузка...</p>
				) : !survey ? (
					<p className="text-sm text-[var(--color-text-muted)]">Опрос не найден</p>
				) : (
					<>
						<h1 className="text-3xl font-semibold">{survey.title}</h1>
						<div className="space-y-4">
							{survey.questions.map((q) => (
								<div key={q.id} className="card p-4">
									<h3 className="text-lg font-medium mb-2">{q.text}</h3>
									<div className="grid sm:grid-cols-2 gap-2">
										{q.options.map((o) => {
											const selected = answers[q.id] === o.id;
											return (
												<button
													key={o.id}
													onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
													className={`p-3 rounded-lg transition shadow-sm text-left ${selected ? "bg-[var(--color-primary)] text-white" : "bg-white/70"}`}
												>
													{o.text}
												</button>
											);
										})}
									</div>
								</div>
							))}
						</div>
						{error && <div className="text-sm text-white rounded-md bg-[var(--color-error)]/90 px-3 py-2">{error}</div>}
						<div className="sticky bottom-4">
							<button disabled={submitting} onClick={submit} className="btn-primary w-full h-11">
								{submitting ? "Отправка..." : "Отправить"}
							</button>
						</div>
					</>
				)}
			</div>
		</main>
	);
}
