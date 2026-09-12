import { ApiError } from '~/utils/apiError'

export function alertMessage(error: unknown, fallback: string): string {
	return error instanceof ApiError ? error.message : fallback
}
