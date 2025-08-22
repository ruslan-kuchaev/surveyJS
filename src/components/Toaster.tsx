"use client";
import { useUiStore } from "@/stores/ui";

export function Toaster() {
	const toasts = useUiStore((s) => s.toasts);
	const dismiss = useUiStore((s) => s.dismissToast);
	return (
		<div className="fixed bottom-4 right-4 space-y-2 z-50">
			{toasts.map((t) => (
				<div key={t.id} className="card px-4 py-2 min-w-64 shadow-lg">
					<div className="flex items-center justify-between gap-4">
						<span className={`${t.type === "error" ? "text-[var(--color-error)]" : t.type === "success" ? "text-[var(--color-secondary)]" : ""}`}>{t.message}</span>
						<button onClick={() => dismiss(t.id)} className="text-sm text-[var(--color-text-muted)]">Закрыть</button>
					</div>
				</div>
			))}
		</div>
	);
}
