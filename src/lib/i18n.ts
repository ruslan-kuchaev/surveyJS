export type Locale = "ru" | "en";

export const defaultLocale: Locale = "ru";

export const locales: Locale[] = ["ru", "en"];

export const translations = {
	ru: {
		common: {
			login: "Войти",
			logout: "Выйти",
			save: "Сохранить",
			cancel: "Отмена",
			edit: "Редактировать",
			delete: "Удалить",
			create: "Создать",
			submit: "Отправить",
			loading: "Загрузка...",
			error: "Ошибка",
			success: "Успешно",
		},
		auth: {
			title: "Войти",
			email: "Email",
			password: "Пароль",
			loginWithGoogle: "Войти через Google",
			loginWithGitHub: "Войти через GitHub",
			invalidCredentials: "Неверные учетные данные",
			loginInProgress: "Входим...",
		},
		surveys: {
			title: "Опросы",
			openSurveys: "Открытые опросы",
			closedSurveys: "Закрытые опросы",
			draftSurveys: "Черновики",
			createSurvey: "Создать опрос",
			editSurvey: "Редактировать опрос",
			takeSurvey: "Пройти",
			viewResults: "Результаты",
			search: "Поиск...",
			status: {
				OPEN: "Открыт",
				CLOSED: "Закрыт",
				DRAFT: "Черновик",
			},
		},
		admin: {
			title: "Администрирование",
			open: "Открыть",
			close: "Закрыть",
			surveyOpened: "Опрос открыт",
			surveyClosed: "Опрос закрыт",
			surveyDeleted: "Опрос удален",
			updateFailed: "Не удалось обновить статус",
			deleteFailed: "Не удалось удалить",
		},
		forms: {
			surveyTitle: "Название опроса",
			question: "Вопрос",
			option: "Вариант",
			addQuestion: "Добавить вопрос",
			addOption: "Добавить вариант",
			removeQuestion: "Удалить",
			removeOption: "Убрать",
			validation: {
				minQuestions: "Нужно 1-10 вопросов",
				minOptions: "Нужно 1-5 вариантов",
			},
		},
		navigation: {
			home: "На главную",
			surveys: "Опросы",
			admin: "Админ",
		},
	},
	en: {
		common: {
			login: "Login",
			logout: "Logout",
			save: "Save",
			cancel: "Cancel",
			edit: "Edit",
			delete: "Delete",
			create: "Create",
			submit: "Submit",
			loading: "Loading...",
			error: "Error",
			success: "Success",
		},
		auth: {
			title: "Login",
			email: "Email",
			password: "Password",
			loginWithGoogle: "Login with Google",
			loginWithGitHub: "Login with GitHub",
			invalidCredentials: "Invalid credentials",
			loginInProgress: "Logging in...",
		},
		surveys: {
			title: "Surveys",
			openSurveys: "Open Surveys",
			closedSurveys: "Closed Surveys",
			draftSurveys: "Drafts",
			createSurvey: "Create Survey",
			editSurvey: "Edit Survey",
			takeSurvey: "Take",
			viewResults: "Results",
			search: "Search...",
			status: {
				OPEN: "Open",
				CLOSED: "Closed",
				DRAFT: "Draft",
			},
		},
		admin: {
			title: "Administration",
			open: "Open",
			close: "Close",
			surveyOpened: "Survey opened",
			surveyClosed: "Survey closed",
			surveyDeleted: "Survey deleted",
			updateFailed: "Failed to update status",
			deleteFailed: "Failed to delete",
		},
		forms: {
			surveyTitle: "Survey Title",
			question: "Question",
			option: "Option",
			addQuestion: "Add Question",
			addOption: "Add Option",
			removeQuestion: "Remove",
			removeOption: "Remove",
			validation: {
				minQuestions: "Need 1-10 questions",
				minOptions: "Need 1-5 options",
			},
		},
		navigation: {
			home: "Home",
			surveys: "Surveys",
			admin: "Admin",
		},
	},
} as const;

export type TranslationKey = keyof typeof translations.ru;

export function t(locale: Locale, key: string): string {
	const keys = key.split(".");
	let value: unknown = translations[locale];
	
	for (const k of keys) {
		value = (value as Record<string, unknown>)?.[k];
		if (value === undefined) break;
	}
	
	return (value as string) || key;
}
