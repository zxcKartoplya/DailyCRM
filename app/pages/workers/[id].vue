<script lang="ts" setup>
const route = useRoute()
const workerId = route.params.id as string

const worker = {
	id: workerId,
	name: 'Анна Маркова',
	role: 'Аналитик задач',
	department: 'Операционный анализ',
	reviewerRole: 'Тимлид',
	hireDate: '12.04.2023',
	location: 'Алматы',
	status: 'Активен',
}

const kpis = [
	{ title: 'Индекс продуктивности', value: '84', delta: '+6%' },
	{ title: 'Стабильность отчета', value: '92', delta: '+3%' },
	{ title: 'Скорость закрытия задач', value: '78', delta: '-2%' },
	{ title: 'Качество описаний', value: '88', delta: '+4%' },
]

const weeklyTrend = [
	{ day: 'Пн', score: 76 },
	{ day: 'Вт', score: 81 },
	{ day: 'Ср', score: 79 },
	{ day: 'Чт', score: 85 },
	{ day: 'Пт', score: 88 },
]

const highlights = [
	{
		title: 'Лучший день недели',
		value: 'Пятница',
		note: 'самые полные дейлики',
	},
	{
		title: 'Зона роста',
		value: 'Скорость закрытия',
		note: 'нужно 1-2 дня на стабилизацию',
	},
	{
		title: 'Фокус на неделю',
		value: 'Качество формулировок',
		note: 'снижение двусмысленности в задачах',
	},
]

const lastDailies = [
	{
		date: '11.12.2025',
		summary:
			'Разобрала 6 задач от поддержки, оформила приоритеты и обновила статус по SLA.',
		rating: 'A',
	},
	{
		date: '10.12.2025',
		summary:
			'Согласовала изменения в метриках, подготовила отчет по отклонениям за неделю.',
		rating: 'A-',
	},
	{
		date: '09.12.2025',
		summary:
			'Провела аудит описаний задач, предложила шаблон для ежедневных отчетов.',
		rating: 'B+',
	},
]
</script>

<template>
	<section class="page">
		<div class="header">
			<div class="header__main">
				<div class="header__title">Профиль сотрудника</div>
				<div class="header__name">{{ worker.name }}</div>
				<div class="header__meta">
					<span>ID: {{ worker.id }}</span>
					<span>Роль: {{ worker.role }}</span>
					<span>Департамент: {{ worker.department }}</span>
					<span>Оценщик: {{ worker.reviewerRole }}</span>
				</div>
			</div>
			<div class="header__aside">
				<div class="badge">
					<div class="badge__label">Статус</div>
					<div class="badge__value">{{ worker.status }}</div>
				</div>
				<div class="badge">
					<div class="badge__label">Дата найма</div>
					<div class="badge__value">{{ worker.hireDate }}</div>
				</div>
				<div class="badge">
					<div class="badge__label">Локация</div>
					<div class="badge__value">{{ worker.location }}</div>
				</div>
			</div>
		</div>

		<div class="grid">
			<div class="card">
				<div class="card__title">Ключевые метрики</div>
				<div class="kpi-list">
					<div class="kpi" v-for="kpi in kpis" :key="kpi.title">
						<div class="kpi__title">{{ kpi.title }}</div>
						<div class="kpi__value">{{ kpi.value }}</div>
						<div
							class="kpi__delta"
							:class="{ negative: kpi.delta.includes('-') }"
						>
							{{ kpi.delta }}
						</div>
					</div>
				</div>
			</div>

			<div class="card">
				<div class="card__title">Динамика за неделю</div>
				<div class="trend">
					<div class="trend__row" v-for="item in weeklyTrend" :key="item.day">
						<div class="trend__day">{{ item.day }}</div>
						<div class="trend__bar">
							<div class="trend__fill" :style="{ width: `${item.score}%` }" />
						</div>
						<div class="trend__value">{{ item.score }}</div>
					</div>
				</div>
			</div>

			<div class="card">
				<div class="card__title">Выводы аналитики</div>
				<div class="highlight" v-for="item in highlights" :key="item.title">
					<div class="highlight__title">{{ item.title }}</div>
					<div class="highlight__value">{{ item.value }}</div>
					<div class="highlight__note">{{ item.note }}</div>
				</div>
			</div>

			<div class="card card--wide">
				<div class="card__title">Последние дейлики</div>
				<div class="daily" v-for="item in lastDailies" :key="item.date">
					<div class="daily__date">{{ item.date }}</div>
					<div class="daily__summary">{{ item.summary }}</div>
					<div class="daily__rating">{{ item.rating }}</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.page {
	padding: rem(20);
	@include flex(column, null, null, rem(20));
}

.header {
	padding: rem(20);
	border-radius: rem(16);
	background: linear-gradient(120deg, #f7f8fc 0%, #eef1f8 100%);
	@include flex(row, space-between, flex-start, rem(24));

	&__title {
		font-size: rem(14);
		color: #6b7280;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	&__name {
		margin-top: rem(6);
		font-size: rem(28);
		font-weight: 700;
	}

	&__meta {
		margin-top: rem(10);
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 1fr));
		gap: rem(8);
		color: #374151;
	}

	&__aside {
		@include flex(column, null, null, rem(12));
	}
}

.badge {
	padding: rem(12) rem(14);
	border-radius: rem(12);
	background: #ffffff;
	box-shadow: 0 rem(6) rem(20) rgba(15, 23, 42, 0.08);

	&__label {
		font-size: rem(12);
		color: #6b7280;
	}

	&__value {
		margin-top: rem(6);
		font-size: rem(16);
		font-weight: 600;
		color: #111827;
	}
}

.grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(240px, 1fr));
	gap: rem(20);
}

.card {
	padding: rem(18);
	background: #ffffff;
	border-radius: rem(16);
	box-shadow: 0 rem(10) rem(30) rgba(15, 23, 42, 0.08);

	&__title {
		margin-bottom: rem(16);
		font-size: rem(16);
		font-weight: 600;
	}

	&--wide {
		grid-column: span 3;
	}
}

.kpi-list {
	display: grid;
	grid-template-columns: repeat(2, minmax(180px, 1fr));
	gap: rem(14);
}

.kpi {
	padding: rem(14);
	border-radius: rem(12);
	background: #f9fafb;
	border: rem(1) solid #eef2f7;
	display: grid;
	gap: rem(6);

	&__title {
		color: #6b7280;
		font-size: rem(13);
	}

	&__value {
		font-size: rem(22);
		font-weight: 700;
	}

	&__delta {
		font-size: rem(13);
		color: #059669;
		font-weight: 600;
		&.negative {
			color: #dc2626;
		}
	}
}

.trend {
	display: grid;
	gap: rem(12);

	&__row {
		display: grid;
		grid-template-columns: 40px 1fr 40px;
		align-items: center;
		gap: rem(10);
	}

	&__day {
		color: #6b7280;
		font-size: rem(14);
	}

	&__bar {
		height: rem(10);
		border-radius: rem(999);
		background: #eef2f7;
		overflow: hidden;
	}

	&__fill {
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #6366f1 0%, #38bdf8 100%);
	}

	&__value {
		font-weight: 600;
		color: #111827;
	}
}

.highlight {
	padding: rem(12) rem(14);
	border-radius: rem(12);
	background: #f3f4f6;
	display: grid;
	gap: rem(6);
	& + & {
		margin-top: rem(12);
	}

	&__title {
		font-size: rem(13);
		color: #6b7280;
	}

	&__value {
		font-size: rem(16);
		font-weight: 600;
	}

	&__note {
		font-size: rem(13);
		color: #374151;
	}
}

.daily {
	display: grid;
	grid-template-columns: 120px 1fr 60px;
	gap: rem(16);
	padding: rem(12) 0;
	border-bottom: rem(1) solid #eef2f7;

	&:last-child {
		border-bottom: none;
	}

	&__date {
		color: #6b7280;
		font-size: rem(13);
	}

	&__summary {
		color: #111827;
		font-size: rem(14);
	}

	&__rating {
		font-weight: 600;
		color: #111827;
	}
}

@media (max-width: 1100px) {
	.grid {
		grid-template-columns: repeat(2, minmax(220px, 1fr));
	}
	.card--wide {
		grid-column: span 2;
	}
}

@media (max-width: 760px) {
	.header {
		flex-direction: column;
	}
	.header__meta {
		grid-template-columns: 1fr;
	}
	.grid {
		grid-template-columns: 1fr;
	}
	.card--wide {
		grid-column: span 1;
	}
	.daily {
		grid-template-columns: 1fr;
	}
}
</style>
