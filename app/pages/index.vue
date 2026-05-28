<script lang="ts" setup>
import workersService from '~/services/workers.servies'
import departamentsService from '~/services/departments.servies'
import reviewersService from '~/services/reviewers.servies'
import { Statuses } from '~/types/users'
import type { User } from '~/types/users'
import type { Departament } from '~/types/departaments'
import type { Reviewer } from '~/types/reviewers'

const isLoading = ref(true)
const workers = ref<User[]>([])
const departments = ref<Departament[]>([])
const reviewers = ref<Reviewer[]>([])

const activeWorkers = computed(() =>
	workers.value.filter(w => w.status === Statuses.ACTIVE),
)

const kpis = computed(() => [
	{
		title: 'Активные сотрудники',
		value: activeWorkers.value.length,
		delta: workers.value.length
			? `${Math.round((activeWorkers.value.length / workers.value.length) * 100)}% от общего`
			: '—',
		negative: false,
	},
	{
		title: 'Всего сотрудников',
		value: workers.value.length,
		delta: null,
		negative: false,
	},
	{
		title: 'Департаментов',
		value: departments.value.length,
		delta: null,
		negative: false,
	},
	{
		title: 'Оценщиков',
		value: reviewers.value.length,
		delta: null,
		negative: false,
	},
])

const topDepartments = computed(() =>
	[...departments.value]
		.sort((a, b) => (b.employees_count ?? 0) - (a.employees_count ?? 0))
		.slice(0, 5),
)

const maxEmployees = computed(() =>
	Math.max(...topDepartments.value.map(d => d.employees_count ?? 0), 1),
)

const recentWorkers = computed(() =>
	[...workers.value]
		.sort(
			(a, b) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
		)
		.slice(0, 3),
)

const statusLabel = (status: Statuses) => {
	const map: Record<Statuses, string> = {
		[Statuses.ACTIVE]: 'Активен',
		[Statuses.INACTIVE]: 'Неактивен',
		[Statuses.INVITED]: 'Приглашён',
	}
	return map[status] ?? status
}

const statusClass = (status: Statuses) => {
	return {
		active: status === Statuses.ACTIVE,
		inactive: status === Statuses.INACTIVE,
		invited: status === Statuses.INVITED,
	}
}

onMounted(async () => {
	try {
		const [w, d, r] = await Promise.all([
			workersService.fetchWorkers(),
			departamentsService.fetchDepartaments(),
			reviewersService.fetchReviewers(),
		])
		workers.value = w
		departments.value = d
		reviewers.value = r
	} finally {
		isLoading.value = false
	}
})

useSeoMeta({
	title: 'Главная страница - DailyCRM',
})
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
			<div class="dashboard__period">Актуальные данные</div>
		</div>

		<template v-if="isLoading">
			<div class="dashboard__grid">
				<div class="card card--wide">
					<div class="card__title">Ключевые показатели</div>
					<div class="kpi-list">
						<div class="kpi kpi--skeleton" v-for="i in 4" :key="i" />
					</div>
				</div>
				<div class="card skeleton-block" />
				<div class="card skeleton-block" />
				<div class="card card--wide skeleton-block" />
			</div>
		</template>

		<template v-else>
			<div class="dashboard__grid">
				<div class="card card--wide">
					<div class="card__title">Ключевые показатели</div>
					<div class="kpi-list">
						<div class="kpi" v-for="kpi in kpis" :key="kpi.title">
							<div class="kpi__title">{{ kpi.title }}</div>
							<div class="kpi__value">{{ kpi.value }}</div>
							<div v-if="kpi.delta" class="kpi__delta">{{ kpi.delta }}</div>
						</div>
					</div>
				</div>

				<div class="card">
					<div class="card__title">Распределение по департаментам</div>
					<div class="trend">
						<div
							class="trend__row"
							v-for="dept in topDepartments"
							:key="dept.id"
						>
							<div class="trend__day" :title="dept.name">{{ dept.name }}</div>
							<div class="trend__bar">
								<div
									class="trend__fill"
									:style="{
										width: `${((dept.employees_count ?? 0) / maxEmployees) * 100}%`,
									}"
								/>
							</div>
							<div class="trend__value">{{ dept.employees_count ?? 0 }}</div>
						</div>
						<div v-if="topDepartments.length === 0" class="empty">
							Нет данных
						</div>
					</div>
				</div>

				<div class="card">
					<div class="card__title">Топ департаментов</div>
					<div class="dept-list">
						<div
							class="dept"
							v-for="dept in topDepartments"
							:key="dept.id"
						>
							<div class="dept__name">{{ dept.name }}</div>
							<div class="dept__value">{{ dept.employees_count ?? 0 }} чел.</div>
						</div>
						<div v-if="topDepartments.length === 0" class="empty">
							Нет данных
						</div>
					</div>
				</div>

				<div class="card card--wide">
					<div class="card__title">Последние сотрудники</div>
					<div class="recent">
						<div
							class="recent__item"
							v-for="worker in recentWorkers"
							:key="worker.id"
						>
							<div class="recent__info">
								<div class="recent__name">{{ worker.name }}</div>
								<div class="recent__meta">
									{{ worker.job_name ?? '—' }} · {{ worker.department_name ?? '—' }}
								</div>
							</div>
							<div class="recent__badge" :class="statusClass(worker.status)">
								{{ statusLabel(worker.status) }}
							</div>
						</div>
						<div v-if="recentWorkers.length === 0" class="empty">
							Нет данных
						</div>
					</div>
				</div>
			</div>
		</template>
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

.skeleton-block {
	min-height: rem(160);
	background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
	0% { background-position: 200% 0; }
	100% { background-position: -200% 0; }
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

	&--skeleton {
		min-height: rem(80);
		background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

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
	}
}

.trend {
	display: grid;
	gap: rem(12);

	&__row {
		display: grid;
		grid-template-columns: 1fr 1fr 48px;
		align-items: center;
		gap: rem(10);
	}

	&__day {
		color: #6b7280;
		font-size: rem(13);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
		transition: width 0.4s ease;
	}

	&__value {
		font-weight: 600;
		color: #111827;
		text-align: right;
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

.recent {
	display: grid;
	grid-template-columns: repeat(3, minmax(200px, 1fr));
	gap: rem(14);

	&__item {
		padding: rem(14);
		border-radius: rem(12);
		background: #f9fafb;
		border: rem(1) solid #eef2f7;
		display: flex;
		flex-direction: column;
		gap: rem(10);
		justify-content: space-between;
	}

	&__name {
		font-weight: 600;
		font-size: rem(14);
		color: #111827;
	}

	&__meta {
		font-size: rem(12);
		color: #6b7280;
		margin-top: rem(4);
	}

	&__badge {
		display: inline-block;
		padding: rem(3) rem(10);
		border-radius: rem(999);
		font-size: rem(12);
		font-weight: 600;
		width: fit-content;

		&.active {
			background: #d1fae5;
			color: #059669;
		}

		&.inactive {
			background: #fee2e2;
			color: #dc2626;
		}

		&.invited {
			background: #e0f2fe;
			color: #0284c7;
		}
	}
}

.empty {
	color: #9ca3af;
	font-size: rem(14);
	padding: rem(8) 0;
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
	.recent {
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
