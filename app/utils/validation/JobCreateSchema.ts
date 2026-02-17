import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { commonMessages } from './commonMessages'

export const JobCreateSchema = toTypedSchema(
	zod.object({
		name: zod.string().nonempty({
			message: commonMessages.required,
		}),
		department_id: zod
			.number({
				required_error: 'Выберите оценщика',
				invalid_type_error: 'Выберите оценщика',
			})
			.min(1, { message: 'Выберите оценщика' }),

		reviewer_id: zod
			.number({
				required_error: 'Выберите департамент',
				invalid_type_error: 'Выберите департамент',
			})
			.min(1, { message: 'Выберите департамент' }),
	}),
)

export default JobCreateSchema
