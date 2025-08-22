"use client";
import { useEffect, useState, use } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#64748B"];

type Option = { id: string; text: string; count: number };

type Question = { id: string; text: string; options: Option[] };

type Results = { id: string; title: string; questions: Question[] };

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const [data, setData] = useState<Results | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const res = await fetch(`/api/surveys/${id}/results`);
			if (!res.ok) {
				setLoading(false);
				return;
			}
			const json = await res.json();
			if (mounted) {
				setData(json);
				setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [id]);

	return (
		<main className="min-h-dvh p-6">
			<div className="max-w-5xl mx-auto space-y-6">
				{loading ? (
					<p className="text-sm text-[var(--color-text-muted)]">Загрузка...</p>
				) : !data ? (
					<p className="text-sm text-[var(--color-text-muted)]">Нет данных</p>
				) : (
					<>
						<h1 className="text-3xl font-semibold">{data.title}</h1>
						{data.questions.map((q) => (
							<div key={q.id} className="card p-4">
								<h3 className="text-lg font-medium mb-3">{q.text}</h3>
								<div className="grid md:grid-cols-2 gap-4 items-center">
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead>
												<tr className="text-left text-[var(--color-text-muted)]">
													<th className="py-1">Вариант</th>
													<th className="py-1">Количество</th>
												</tr>
											</thead>
											<tbody>
												{q.options.map((o) => (
													<tr key={o.id}>
														<td className="py-1">{o.text}</td>
														<td className="py-1 font-semibold">{o.count}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
									<div className="h-64">
										<ResponsiveContainer>
											<PieChart>
												<Pie data={q.options} dataKey="count" nameKey="text" outerRadius={90}>
													{q.options.map((_, idx) => (
														<Cell key={idx} fill={COLORS[idx % COLORS.length]} />
													))}
												</Pie>
												<Tooltip />
											</PieChart>
										</ResponsiveContainer>
									</div>
								</div>
							</div>
						))}
					</>
				)}
			</div>
		</main>
	);
}
