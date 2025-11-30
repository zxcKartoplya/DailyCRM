import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { commonMessages } from './commonMessages'

export const loginSchema = toTypedSchema(
	zod.object({
		email: zod
			.string()
			.nonempty({ message: commonMessages.required })
			.email({ message: commonMessages.email }),
		password: zod
			.string()
			.nonempty({ message: commonMessages.required })
			.min(6, { message: commonMessages.min(6) }),
	})
)

export default loginSchema
