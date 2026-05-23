import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { commonMessages } from './commonMessages'

export const WorkerCreateSchema = toTypedSchema(
	zod.object({
		name: zod.string().nonempty({
			message: commonMessages.required,
		}),
		email: zod.string().email({ message: commonMessages.email }).optional().or(zod.literal('')),
		department_id: zod
			.number({
				required_error: 'Выберите департамент',
				invalid_type_error: 'Выберите департамент',
			})
			.min(1, { message: 'Выберите департамент' })
			.optional(),
		job_id: zod
			.number({
				required_error: 'Выберите роль',
				invalid_type_error: 'Выберите роль',
			})
			.min(1, { message: 'Выберите роль' })
			.optional(),
		status: zod.string().nonempty({
			message: commonMessages.required,
		}),
		password: zod.string().optional().or(zod.literal('')),
	}),
)

export default WorkerCreateSchema
