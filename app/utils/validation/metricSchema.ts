import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

export const metricSchema = toTypedSchema(
	zod.object({
		display_name: zod
			.string()
			.nonempty({ message: 'Название метрики обязательно' }),
		value: zod.number().min(1, { message: 'Важность метрики обязательна' }),
		description: zod
			.string()
			.nonempty({ message: 'Описание метрики обязательно' }),
	}),
)
