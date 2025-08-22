"use client";
import { useEffect, useState, useCallback } from "react";
import { useUiStore } from "@/stores/ui";
import Link from "next/link";

type Survey = { id: string; title: string; status: "DRAFT" | "OPEN" | "CLOSED" };

type ListResponse = { items: Survey[]; total: number; page: number; pageSize: number };

export default function AdminPage() {
	const [data, setData] = useState<ListResponse>({ items: [], total: 0, page: 1, pageSize: 10 });
	const [loading, setLoading] = useState(true);
	const toast = useUiStore((s) => s.pushToast);

	const load = useCallback(async (page = 1) => {
		setLoading(true);
		const res = await fetch(`/api/surveys?page=${page}&pageSize=${data.pageSize}`);
		const json = (await res.json()) as ListResponse;
		setData(json);
		setLoading(false);
	}, [data.pageSize]);

	useEffect(() => { load(1); }, [load]);

	const changeStatus = async (id: string, status: "OPEN" | "CLOSED") => {
		const res = await fetch(`/api/surveys/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
		if (res.ok) {
			toast({ message: status === "OPEN" ? "Опрос открыт" : "Опрос закрыт", type: "success" });
			load(data.page);
		} else {
			toast({ message: "Не удалось обновить статус", type: "error" });
		}
	};

	const remove = async (id: string) => {
		const res = await fetch(`/api/surveys/${id}`, { method: "DELETE" });
		if (res.ok) {
			toast({ message: "Опрос удален", type: "success" });
			load(data.page);
		} else {
			toast({ message: "Не удалось удалить", type: "error" });
		}
	};

	const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

	return (
		<main className="min-h-dvh p-6">
			<div className="max-w-5xl mx-auto space-y-6">
				<h1 className="text-3xl font-semibold">Администрирование</h1>
				{loading ? (
					<p className="text-sm text-[var(--color-text-muted)]">Загрузка...</p>
				) : (
					<div className="space-y-3">
						{data.items.map((s) => (
							<div key={s.id} className="card p-4 flex items-center justify-between">
								<div>
									<div className="font-medium">{s.title}</div>
									<div className={`text-sm ${s.status === "OPEN" ? "text-[var(--color-secondary)]" : s.status === "CLOSED" ? "text-[var(--color-error)]" : "text-[var(--color-text-muted)]"}`}>{s.status}</div>
								</div>
								<div className="flex gap-2">
									<Link href={`/surveys/${s.id}/edit`} className="btn-primary px-3 py-1.5">Редактировать</Link>
									<button onClick={() => changeStatus(s.id, "OPEN")} className="btn-primary px-3 py-1.5">Открыть</button>
									<button onClick={() => changeStatus(s.id, "CLOSED")} className="btn-primary px-3 py-1.5">Закрыть</button>
									<button onClick={() => remove(s.id)} className="btn-primary px-3 py-1.5">Удалить</button>
								</div>
							</div>
						))}
						<div className="flex items-center gap-2">
							<button disabled={data.page<=1} onClick={() => load(data.page-1)} className="btn-primary px-3 py-2">Назад</button>
							<span className="text-sm text-[var(--color-text-muted)]">{data.page} / {totalPages}</span>
							<button disabled={data.page>=totalPages} onClick={() => load(data.page+1)} className="btn-primary px-3 py-2">Вперед</button>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
