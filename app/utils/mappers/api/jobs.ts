import type { Role } from '~/types/role'

export function mapRolePublicData(dto: Role): Role | null {
	// TODO: deal with empty responses
	if (Object.keys(dto).length === 0) {
		return null
	}

	return {
		id: dto.id,
		name: dto.name ?? '',
		department_id: dto.department_id,
		reviewer_id: dto.reviewer_id,
	}
}
