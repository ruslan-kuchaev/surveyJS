"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type SurveyListItem = { id: string; title: string; status: string };

type ListResponse = { items: SurveyListItem[]; total: number; page: number; pageSize: number };

export default function SurveysPage() {
	const [status, setStatus] = useState<string>("OPEN");
	const [q, setQ] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [data, setData] = useState<ListResponse>({ items: [], total: 0, page: 1, pageSize: 10 });
	const [loading, setLoading] = useState(true);

	const load = async () => {
		setLoading(true);
		const params = new URLSearchParams();
		if (status) params.set("status", status);
		if (q) params.set("q", q);
		params.set("page", String(page));
		params.set("pageSize", String(data.pageSize));
		const res = await fetch(`/api/surveys?${params.toString()}`);
		const json = (await res.json()) as ListResponse;
		setData(json);
		setLoading(false);
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, q, page]);

	const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

	return (
		<main className="min-h-dvh p-6">
			<div className="max-w-5xl mx-auto space-y-6">
				<h1 className="text-3xl font-semibold">Опросы</h1>
				<div className="card p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
					<div className="flex gap-2">
						<select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="input px-3 py-2">
							<option value="">Все</option>
							<option value="OPEN">Открытые</option>
							<option value="CLOSED">Закрытые</option>
							<option value="DRAFT">Черновики</option>
						</select>
						<input value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} className="input px-3 py-2" placeholder="Поиск..." />
					</div>
					<div className="flex items-center gap-2">
						<button disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))} className="btn-primary px-3 py-2">Назад</button>
						<span className="text-sm text-[var(--color-text-muted)]">{page} / {totalPages}</span>
						<button disabled={page>=totalPages} onClick={() => setPage((p) => Math.min(totalPages, p+1))} className="btn-primary px-3 py-2">Вперед</button>
					</div>
				</div>
				{loading ? (
					<p className="text-sm text-[var(--color-text-muted)]">Загрузка...</p>
				) : (
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<h2 className="text-xl font-semibold">Список</h2>
							{data.items.length === 0 && (
								<p className="text-sm text-[var(--color-text-muted)]">Ничего не найдено</p>
							)}
							{data.items.map((s) => (
								<div key={s.id} className="card p-4 flex items-center justify-between">
									<span>{s.title}</span>
									{(s.status === "OPEN") ? (
										<Link className="btn-primary px-3 py-1.5" href={`/surveys/${s.id}`}>Пройти</Link>
									) : (
										<Link className="btn-primary px-3 py-1.5" href={`/surveys/${s.id}/results`}>Результаты</Link>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
