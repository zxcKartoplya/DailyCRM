<script lang="ts" setup>
import adminService from '~/services/admin.servies'

await adminService.fetchAdmins()
// await adminService.addAdmin()

const kpis = [
	{ title: 'Активные сотрудники', value: '128', delta: '+6%' },
	{ title: 'Средний рейтинг', value: '4.3', delta: '+0.2' },
	{ title: 'Дейлики за сутки', value: '412', delta: '+9%' },
	{ title: 'Найдено блокеров', value: '24', delta: '-4%' },
]

const weeklyTrend = [
	{ day: 'Пн', score: 68 },
	{ day: 'Вт', score: 72 },
	{ day: 'Ср', score: 75 },
	{ day: 'Чт', score: 81 },
	{ day: 'Пт', score: 86 },
]

const departments = [
	{ name: 'Операционный анализ', value: 32 },
	{ name: 'Продукт и метрики', value: 24 },
	{ name: 'Клиентский успех', value: 21 },
	{ name: 'Служба контроля', value: 18 },
]

const alerts = [
	{
		title: 'Падение стабильности дейликов',
		note: 'Команда поддержки: 3 дня подряд ниже нормы',
	},
	{
		title: 'Рост нагрузки на оценщиков',
		note: 'Среднее число работников на оценщика +12%',
	},
	{
		title: 'Улучшение качества формулировок',
		note: 'Снижение двусмысленных задач на 8%',
	},
]
</script>

<template>
	<section class="dashboard">
		<div class="dashboard__header">
			<div>
				<div class="dashboard__title">Сводка по дейликам</div>
				<div class="dashboard__subtitle">
					Аналитика качества задач и прогресса команд
				</div>
			</div>
			<div class="dashboard__period">Последние 7 дней</div>
		</div>

		<div class="dashboard__grid">
			<div class="card card--wide">
				<div class="card__title">Ключевые показатели</div>
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
				<div class="card__title">Индекс эффективности</div>
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
				<div class="card__title">Топ департаментов</div>
				<div class="dept-list">
					<div class="dept" v-for="dept in departments" :key="dept.name">
						<div class="dept__name">{{ dept.name }}</div>
						<div class="dept__value">{{ dept.value }}</div>
					</div>
				</div>
			</div>

			<div class="card card--wide">
				<div class="card__title">Сигналы аналитики</div>
				<div class="alerts">
					<div class="alert" v-for="alert in alerts" :key="alert.title">
						<div class="alert__title">{{ alert.title }}</div>
						<div class="alert__note">{{ alert.note }}</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.dashboard {
	padding: rem(20);
	@include flex(column, null, null, rem(20));

	&__header {
		@include flex(row, space-between, flex-start, rem(16));
		padding: rem(20);
		border-radius: rem(16);
		background: linear-gradient(120deg, #f7f8fc 0%, #eef1f8 100%);
	}

	&__title {
		font-size: rem(24);
		font-weight: 700;
	}

	&__subtitle {
		margin-top: rem(6);
		color: #6b7280;
	}

	&__period {
		padding: rem(8) rem(12);
		border-radius: rem(10);
		background: #ffffff;
		font-size: rem(13);
		color: #374151;
		box-shadow: 0 rem(6) rem(20) rgba(15, 23, 42, 0.08);
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(260px, 1fr));
		gap: rem(20);
	}
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
		grid-column: span 2;
	}
}

.kpi-list {
	display: grid;
	grid-template-columns: repeat(4, minmax(160px, 1fr));
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

.dept-list {
	display: grid;
	gap: rem(12);
}

.dept {
	padding: rem(12) rem(14);
	border-radius: rem(12);
	background: #f3f4f6;
	display: flex;
	justify-content: space-between;
	font-size: rem(14);

	&__name {
		color: #374151;
	}

	&__value {
		font-weight: 600;
		color: #111827;
	}
}

.alerts {
	display: grid;
	grid-template-columns: repeat(3, minmax(200px, 1fr));
	gap: rem(14);
}

.alert {
	padding: rem(14);
	border-radius: rem(12);
	background: #f3f4f6;
	display: grid;
	gap: rem(6);

	&__title {
		font-weight: 600;
		font-size: rem(14);
	}

	&__note {
		color: #374151;
		font-size: rem(13);
	}
}

@media (max-width: 1100px) {
	.dashboard__grid {
		grid-template-columns: 1fr;
	}
	.card--wide {
		grid-column: span 1;
	}
	.kpi-list {
		grid-template-columns: repeat(2, minmax(160px, 1fr));
	}
	.alerts {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 760px) {
	.dashboard__header {
		flex-direction: column;
		align-items: flex-start;
	}
	.kpi-list {
		grid-template-columns: 1fr;
	}
}
</style>
