import { create } from "zustand";

export type Toast = {
	id: string;
	message: string;
	type?: "success" | "error" | "info";
	durationMs?: number;
};

interface UiState {
	toasts: Toast[];
	pushToast: (toast: Omit<Toast, "id">) => string;
	dismissToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
	toasts: [],
	pushToast: (toast) => {
		const id = Math.random().toString(36).slice(2);
		const entry: Toast = { id, durationMs: 2500, type: "info", ...toast };
		set((s) => ({ toasts: [...s.toasts, entry] }));
		if (entry.durationMs && entry.durationMs > 0) {
			setTimeout(() => get().dismissToast(id), entry.durationMs);
		}
		return id;
	},
	dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
