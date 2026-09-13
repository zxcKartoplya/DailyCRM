<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useAnalyticsStore } from '~/stores/analytics'
import { useDailiesStore } from '~/stores/dailies'
import { useWorkerStore } from '~/stores/workers'
import { Alert } from '~/types/alert'
import { DAY_STATE_LABEL, DayState } from '~/types/dailies'
import { Statuses, type User } from '~/types/users'
import { alertMessage } from '~/utils/alertMessage'
import {
	buildDays,
	completionTrend,
	eachDate,
	groupEntriesByUser,
	periodStats,
} from '~/utils/dailyStats'

const PERIOD_DAYS = 30
const SKELETON_ROWS = 5

const router = useRouter()
const route = useRoute()
const workersStore = useWorkerStore()
const dailiesStore = useDailiesStore()
const analyticsStore = useAnalyticsStore()
const alertStore = useAlertStore()

const { workers, isWorkersLoading, hasWorkersError } = storeToRefs(workersStore)
const { entries, entriesRange, isEntriesLoading, hasEntriesError } =
	storeToRefs(dailiesStore)
const { todayByUser, isTodayLoading, hasTodayError } = storeToRefs(analyticsStore)

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Сотрудник', sortId: 'name' },
		{ title: 'Департамент', sortId: 'department' },
		{ title: 'Сегодня', sortId: null },
		{ title: 'Сдача за 30 дней', sortId: null },
		{ title: '', sortId: null },
	],
	gridColumns:
		'80px minmax(220px, 1fr) minmax(160px, 1fr) minmax(150px, 190px) minmax(180px, 220px) 56px',
}

const periodDates = computed(() =>
	entriesRange.value ? eachDate(entriesRange.value) : [],
)

const entriesByUser = computed(() => groupEntriesByUser(entries.value))

const rows = computed(() =>
	workers.value.map(worker => {
		const days = buildDays(
			periodDates.value,
			worker,
			entriesByUser.value.get(worker.id),
		)

		return {
			worker,
			accessMark: worker.status === Statuses.ACTIVE ? null : worker.status,
			state: todayByUser.value.get(worker.id)?.state ?? null,
			rate: periodStats(days).rate,
			trend: completionTrend(periodDates.value, [days]),
		}
	}),
)

const stateFilter = computed(() => {
	const value = route.query.state
	const state = Array.isArray(value) ? value[0] : value

	return Object.values(DayState).find(item => item === state) ?? null
})

const stateFilterLabel = computed(() =>
	stateFilter.value ? DAY_STATE_LABEL[stateFilter.value] : '',
)

const hasStateFilterError = computed(
	() => Boolean(stateFilter.value) && hasTodayError.value,
)

const visibleRows = computed(() => {
	if (!stateFilter.value) return rows.value
	if (hasTodayError.value) return []

	return rows.value.filter(row => row.state === stateFilter.value)
})

const isRowsLoading = computed(
	() => isWorkersLoading.value || (Boolean(stateFilter.value) && isTodayLoading.value),
)

const emptyText = computed(() =>
	stateFilter.value
		? `Сегодня никто не подходит под состояние «${stateFilterLabel.value}».`
		: 'Сотрудников пока нет. Добавьте первого — и он появится в списке.',
)

const clearStateFilter = () => {
	router.push({ path: '/workers' })
}

const goWorker = (id: number) => {
	router.push(`/workers/${id}`)
}

const editWorker = (id: number) => {
	router.push(`/edit/workers?id=${id}`)
}

const workerToDelete = ref<User | null>(null)
const isDeleting = ref(false)

const askDeleteWorker = (worker: User) => {
	workerToDelete.value = worker
}

const cancelDeleteWorker = () => {
	workerToDelete.value = null
}

const confirmDeleteWorker = async () => {
	const worker = workerToDelete.value
	if (!worker || isDeleting.value) return

	isDeleting.value = true
	try {
		await workersStore.deleteWorker(worker.id)
		if (workerToDelete.value?.id === worker.id) workerToDelete.value = null
	} catch (error) {
		alertStore.showAlert(alertMessage(error, Alert.DeletedError))
	} finally {
		isDeleting.value = false
	}
}

onMounted(() => {
	workersStore.getWorkers()
	dailiesStore.fetchEntries(PERIOD_DAYS)
	analyticsStore.fetchToday()
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Сотрудники</h1>
			<div class="page__actions">
				<UIButton @click="router.push('/edit/workers')">Добавить сотрудника</UIButton>
			</div>
		</header>

		<p v-if="hasWorkersError" class="page__error">
			Список сотрудников не загрузился. Обновите страницу.
		</p>

		<div v-if="stateFilter" class="filter">
			<span class="filter__label">Сегодня:</span>
			<UIDayState :state="stateFilter" />
			<button class="filter__reset" type="button" @click="clearStateFilter">
				Сбросить
			</button>
		</div>

		<p v-if="hasStateFilterError" class="page__error">
			Состояние дня не загрузилось, поэтому фильтр «{{ stateFilterLabel }}» не
			применить. Обновите страницу.
		</p>

		<UITableBase
			:headList="table.heads"
			:columnTemplates="table.gridColumns"
			:is-empty="
				!isRowsLoading && !hasWorkersError && !hasStateFilterError && !visibleRows.length
			"
			:empty-text="emptyText"
		>
			<template v-if="isRowsLoading">
				<UITableRow
					v-for="index in SKELETON_ROWS"
					:key="`skeleton-${index}`"
					:columnTemplates="table.gridColumns"
				>
					<UITableColumn v-for="column in table.heads.length" :key="column">
						<Skeleton class="bone" preserveAspectRatio="none">
							<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
						</Skeleton>
					</UITableColumn>
				</UITableRow>
			</template>

			<UITableRow
				v-for="row in isRowsLoading ? [] : visibleRows"
				:key="row.worker.id"
				:columnTemplates="table.gridColumns"
			>
				<UITableColumn
					:text="row.worker.id"
					isLink
					isNumeric
					@click="goWorker(row.worker.id)"
				/>
				<UITableColumn>
					<div class="person">
						<UIAvatar :name="row.worker.name" :id="row.worker.id" size="sm" />
						<NuxtLink class="person__name" :to="`/workers/${row.worker.id}`">
							{{ row.worker.name }}
						</NuxtLink>
						<UIStatus
							v-if="row.accessMark"
							class="person__access"
							:status="row.accessMark"
							:with-subject="false"
						/>
					</div>
				</UITableColumn>
				<UITableColumn :text="row.worker.department_name ?? '—'" isEllipsis />
				<UITableColumn>
					<UIDayStateCell
						:state="row.state"
						:loading="isTodayLoading"
						:error="hasTodayError"
						empty-hint="Сервер не вернул состояние дня по этому сотруднику"
					/>
				</UITableColumn>
				<UITableColumn>
					<UICompletion
						:rate="row.rate"
						:trend="row.trend"
						:loading="isEntriesLoading"
						:error="hasEntriesError"
					/>
				</UITableColumn>
				<UITableColumn>
					<UITableRowPopover
						:items="[
							{
								title: 'Открыть профиль',
								func: () => goWorker(row.worker.id),
							},
							{
								title: 'Изменить',
								func: () => editWorker(row.worker.id),
							},
							{
								title: 'Удалить',
								red: true,
								func: () => askDeleteWorker(row.worker),
							},
						]"
					/>
				</UITableColumn>
			</UITableRow>
		</UITableBase>

		<Transition name="fade">
			<ModalConfirm
				v-if="workerToDelete"
				title="Удалить сотрудника?"
				:text="`Сотрудник «${workerToDelete.name}» будет удалён без возможности восстановления.`"
				@confirm="confirmDeleteWorker"
				@close="cancelDeleteWorker"
			/>
		</Transition>
	</section>
</template>

<style lang="scss" scoped>
.page__actions {
	display: flex;
	gap: var(--s-3);
}

.page__error {
	margin-bottom: var(--s-3);
	color: var(--err);
	font-size: var(--t-sm);
}

.filter {
	display: flex;
	align-items: center;
	gap: var(--s-2);
	margin-bottom: var(--s-3);

	&__label {
		color: var(--text-3);
		font-size: var(--t-sm);
	}

	&__reset {
		border: 0;
		padding: 0;
		background: none;
		color: var(--accent-text);
		font-size: var(--t-sm);
		cursor: pointer;
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}
}

.person {
	display: flex;
	align-items: center;
	gap: var(--s-3);
	min-width: 0;

	&__name {
		min-width: 0;
		color: var(--accent-text);
		font-size: var(--t-md);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-underline-offset: 3px;

		&:hover {
			text-decoration: underline;
		}
	}

	&__access {
		flex: none;
	}
}

.bone {
	width: 100%;
	height: 1rem;
}
</style>
