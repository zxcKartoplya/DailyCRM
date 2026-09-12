<script lang="ts" setup>
import workersService from '~/services/workers.servies'
import departamentsService from '~/services/departments.servies'
import reviewersService from '~/services/reviewers.servies'
import { Statuses } from '~/types/users'
import type { User } from '~/types/users'
import type { Departament } from '~/types/departaments'
import type { Reviewer } from '~/types/reviewers'

const router = useRouter()

const isLoading = ref(true)
const workers = ref<User[]>([])
const departments = ref<Departament[]>([])
const reviewers = ref<Reviewer[]>([])

const byStatus = (status: Statuses) =>
	computed(() => workers.value.filter(w => w.status === status).length)

const activeCount = byStatus(Statuses.ACTIVE)
const invitedCount = byStatus(Statuses.INVITED)
const inactiveCount = byStatus(Statuses.INACTIVE)

const summary = computed(() => [
	{ label: 'Сотрудников', value: workers.value.length },
	{ label: 'Активных', value: activeCount.value },
	{ label: 'Приглашённых', value: invitedCount.value },
	{ label: 'Департаментов', value: departments.value.length },
	{ label: 'Оценщиков', value: reviewers.value.length },
])

const topDepartments = computed(() =>
	[...departments.value]
		.sort((a, b) => (b.employees_count ?? 0) - (a.employees_count ?? 0))
		.slice(0, 6),
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
		.slice(0, 6),
)

const needsAttention = computed(() => invitedCount.value + inactiveCount.value)

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
	<section class="page">
		<header class="page__head">
			<div>
				<h1 class="page__title">Команда</h1>
				<p class="page__lede">
					<template v-if="isLoading">Загружаем данные…</template>
					<template v-else-if="needsAttention">
						{{ needsAttention }} из {{ workers.length }} сотрудников не в работе
					</template>
					<template v-else-if="workers.length">
						Все сотрудники активны
					</template>
					<template v-else>Данных пока нет</template>
				</p>
			</div>
			<UIButton @click="router.push('/edit/workers')">
				Добавить сотрудника
			</UIButton>
		</header>

		<dl class="summary">
			<div v-for="item in summary" :key="item.label" class="summary__item">
				<dt class="summary__label">{{ item.label }}</dt>
				<dd class="summary__value">
					<span v-if="isLoading" class="summary__placeholder" />
					<template v-else>{{ item.value }}</template>
				</dd>
			</div>
		</dl>

		<div class="columns">
			<section class="block">
				<header class="block__head">
					<h2 class="block__title">Последние сотрудники</h2>
					<NuxtLink class="block__link" to="/workers">Все сотрудники</NuxtLink>
				</header>

				<ul v-if="!isLoading && recentWorkers.length" class="people">
					<li v-for="worker in recentWorkers" :key="worker.id" class="people__item">
						<NuxtLink class="people__name" :to="`/workers/${worker.id}`">
							{{ worker.name }}
						</NuxtLink>
						<span class="people__meta">
							{{ worker.job_name ?? '—' }} · {{ worker.department_name ?? '—' }}
						</span>
						<UIStatus :status="worker.status" />
					</li>
				</ul>
				<p v-else-if="!isLoading" class="block__empty">
					Сотрудников пока нет.
				</p>
				<div v-else class="block__loading"><UILoading /></div>
			</section>

			<section class="block">
				<header class="block__head">
					<h2 class="block__title">Департаменты</h2>
					<NuxtLink class="block__link" to="/departments">Все</NuxtLink>
				</header>

				<ul v-if="!isLoading && topDepartments.length" class="bars">
					<li
						v-for="(dept, index) in topDepartments"
						:key="dept.id"
						class="bars__item"
						:style="{ '--delay': `${index * 40}ms` }"
					>
						<span class="bars__name" :title="dept.name">{{ dept.name }}</span>
						<span class="bars__track">
							<span
								class="bars__fill"
								:style="{
									inlineSize: `${((dept.employees_count ?? 0) / maxEmployees) * 100}%`,
								}"
							/>
						</span>
						<span class="bars__value">{{ dept.employees_count ?? 0 }}</span>
					</li>
				</ul>
				<p v-else-if="!isLoading" class="block__empty">
					Департаментов пока нет.
				</p>
				<div v-else class="block__loading"><UILoading /></div>
			</section>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.summary {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
	gap: var(--s-5);
	margin: 0 0 var(--s-6);
	padding-bottom: var(--s-5);
	border-bottom: 1px solid var(--border);

	&__label {
		@include label;
	}

	&__value {
		margin: var(--s-2) 0 0;
		@include numeric;
		font-size: var(--t-3xl);
		font-weight: 500;
		line-height: 1;
		letter-spacing: var(--tracking-tight);
	}

	&__placeholder {
		display: inline-block;
		width: 2ch;
		height: 1em;
		border-radius: var(--r-sm);
		background-color: var(--skeleton-base);
	}
}

.columns {
	display: grid;
	grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
	gap: var(--s-6);
}

.block {
	min-width: 0;

	&__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--s-4);
		margin-bottom: var(--s-3);
	}

	&__title {
		@include h4;
	}

	&__link {
		color: var(--accent-text);
		font-size: var(--t-sm);
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}

	&__empty {
		padding: var(--s-5) 0;
		color: var(--text-3);
	}

	&__loading {
		display: flex;
		justify-content: center;
		padding: var(--s-6);
	}
}

.people {
	margin: 0;
	padding: 0;
	list-style: none;

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--s-1) var(--s-4);
		padding: var(--s-3) 0;
		border-top: 1px solid var(--border);
	}

	&__name {
		font-weight: 500;
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}

	&__meta {
		grid-column: 1;
		color: var(--text-3);
		font-size: var(--t-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.bars {
	margin: 0;
	padding: 0;
	list-style: none;

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(4rem, 6rem) auto;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-3) 0;
		border-top: 1px solid var(--border);
	}

	&__name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__track {
		height: 6px;
		border-radius: var(--r-full);
		background-color: var(--surface-sunken);
		overflow: hidden;
	}

	&__fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		background-color: var(--accent);
		transform-origin: left center;
		animation: bar-reveal var(--dur-slow) var(--ease) backwards;
		animation-delay: var(--delay, 0ms);
	}

	&__value {
		@include numeric;
		color: var(--text-2);
		font-size: var(--t-sm);
	}
}

@keyframes bar-reveal {
	from {
		transform: scaleX(0);
	}
}

@media (max-width: 1100px) {
	.columns {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
