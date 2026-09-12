export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly url?: string,
		public readonly fields?: Record<string, string>
	) {
		super(message)
		this.name = 'ApiError'
	}
}

type ValidationIssue = {
	loc?: (string | number)[]
	msg?: string
}

const FALLBACK: Record<number, string> = {
	400: 'Запрос отклонён',
	401: 'Нужно войти заново',
	403: 'Недостаточно прав',
	404: 'Не найдено',
	500: 'Ошибка на сервере',
}

const fieldName = (issue: ValidationIssue) => {
	const path = issue.loc ?? []
	return String(path[path.length - 1] ?? 'form')
}

export function parseApiError(status: number, url: string, payload: unknown): ApiError {
	const detail = (payload as { detail?: unknown })?.detail

	if (typeof detail === 'string' && detail.trim()) {
		return new ApiError(detail, status, url)
	}

	if (Array.isArray(detail)) {
		const issues = detail as ValidationIssue[]
		const fields = Object.fromEntries(
			issues.map(issue => [fieldName(issue), issue.msg ?? 'Некорректное значение'])
		)
		const message = issues[0]?.msg ?? FALLBACK[422] ?? 'Некорректные данные'
		return new ApiError(message, status, url, fields)
	}

	return new ApiError(FALLBACK[status] ?? `Ошибка запроса (${status})`, status, url)
}
