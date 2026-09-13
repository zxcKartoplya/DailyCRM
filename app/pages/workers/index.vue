<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useDailiesStore } from '~/stores/dailies'
import { useWorkerStore } from '~/stores/workers'
import { Alert } from '~/types/alert'
import { Statuses, type User } from '~/types/users'
import { alertMessage } from '~/utils/alertMessage'
import {
	buildDays,
	completionTrend,
	currentDayState,
	eachDate,
	groupEntriesByUser,
	periodStats,
	toIsoDate,
} from '~/utils/dailyStats'

const PERIOD_DAYS = 30
const SKELETON_ROWS = 5

const router = useRouter()
const workersStore = useWorkerStore()
const dailiesStore = useDailiesStore()
const alertStore = useAlertStore()

const { workers, isWorkersLoading, hasWorkersError } = storeToRefs(workersStore)
const { entries, entriesRange, isEntriesLoading, hasEntriesError } =
	storeToRefs(dailiesStore)

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

const today = computed(() => toIsoDate(new Date()))

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
			state: currentDayState(
				days.find(day => day.date === today.value),
				worker,
			),
			rate: periodStats(days).rate,
			trend: completionTrend(periodDates.value, [days]),
		}
	}),
)

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

		<UITableBase
			:headList="table.heads"
			:columnTemplates="table.gridColumns"
			:is-empty="!isWorkersLoading && !hasWorkersError && !rows.length"
			empty-text="Сотрудников пока нет. Добавьте первого — и он появится в списке."
		>
			<template v-if="isWorkersLoading">
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
				v-for="row in isWorkersLoading ? [] : rows"
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
						:loading="isEntriesLoading"
						:error="hasEntriesError"
						empty-hint="У сотрудника не задан график работы"
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
