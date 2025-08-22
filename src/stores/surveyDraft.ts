"use client";
import { create } from "zustand";
import type { CreateSurveyInput } from "@/lib/validation";

const STORAGE_KEY = "survey_draft_v1";

interface SurveyDraftState {
	draft: CreateSurveyInput | null;
	saveDraft: (draft: CreateSurveyInput) => void;
	clearDraft: () => void;
}

function loadDraft(): CreateSurveyInput | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as CreateSurveyInput) : null;
	} catch {
		return null;
	}
}

export const useSurveyDraft = create<SurveyDraftState>((set) => ({
	draft: loadDraft(),
	saveDraft: (draft) => {
		set({ draft });
		try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch {}
	},
	clearDraft: () => {
		set({ draft: null });
		try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
	},
}));
