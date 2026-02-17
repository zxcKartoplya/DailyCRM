import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { commonMessages } from './commonMessages'

export const departamentSchema = toTypedSchema(
	zod.object({
		name: zod.string().nonempty({ message: commonMessages.required }),
	}),
)

export default departamentSchema
