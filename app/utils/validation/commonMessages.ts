const required = 'Поле обязательно для заполнения'

const min = (min: number) => `Минимальное значение — ${min}`

const max = (max: number) => `Максимальное значение — ${max}`

const email = 'Введите корректный email'

const url = 'Введите корректный URL'

const numberMin = (min: number) => `Минимальное значение — ${min}`

const numberMax = (max: number) => `Максимальное значение — ${max}`

const tel = 'Введите корректный номер телефона'

const password = 'Неверный пароль'

const telNotFound = 'Номер телефона не найден'

export const commonMessages = {
	min,
	max,
	email,
	url,
	required,
	numberMin,
	numberMax,
	tel,
	password,
	telNotFound,
}
