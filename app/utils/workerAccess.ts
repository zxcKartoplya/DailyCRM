import { Statuses } from '~/types/users'

export const isAccessEnabled = (status?: string | null) =>
	status !== Statuses.INACTIVE

export const hasNeverSignedIn = (status?: string | null) =>
	status === Statuses.INVITED

export const statusFromAccess = (
	enabled: boolean,
	currentStatus?: string | null,
) => {
	if (!enabled) return Statuses.INACTIVE

	return hasNeverSignedIn(currentStatus) ? Statuses.INVITED : Statuses.ACTIVE
}
