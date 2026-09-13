<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useAnalyticsStore } from '~/stores/analytics'
import { useDepartamentsStore } from '~/stores/departments'
import { Alert } from '~/types/alert'
import type { Departament } from '~/types/departaments'
import { alertMessage } from '~/utils/alertMessage'
import { completionRate, completionTrendPoints } from '~/utils/completionTrend'

const SKELETON_ROWS = 4

const router = useRouter()
const departamentsStore = useDepartamentsStore()
const analyticsStore = useAnalyticsStore()
const alertStore = useAlertStore()

const { departaments, isDepartamentsLoading, hasDepartamentsError } =
	storeToRefs(departamentsStore)
const {
	departmentsById,
	isLoading: isAnalyticsLoading,
	hasError: hasAnalyticsError,
} = storeToRefs(analyticsStore)

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название департамента', sortId: 'name' },
		{ title: 'Сотрудников', sortId: 'employees_count' },
		{ title: 'Ролей', sortId: 'jobs_count' },
		{ title: 'Сдача за 30 дней', sortId: null },
		{ title: 'Блокеры', sortId: null },
		{ title: '', sortId: null },
	],
	gridColumns:
		'80px minmax(220px, 1fr) minmax(120px, 160px) minmax(100px, 140px) minmax(180px, 220px) minmax(110px, 150px) 56px',
}

const rows = computed(() =>
	(departaments.value ?? []).map(departament => {
		const analytics = departmentsById.value.get(departament.id)

		return {
			departament,
			rate: completionRate(analytics),
			trend: completionTrendPoints(analytics?.trend),
			blockers: analytics?.blocked_items_count ?? null,
		}
	}),
)

const goDepartmemts = (id: number) => {
	router.push(`/departments/${id}`)
}

const editDepartament = (id: number) => {
	router.push(`/edit/department?id=${id}`)
}

const departamentToDelete = ref<Departament | null>(null)
const isDeleting = ref(false)

const askDeleteDepartament = (departament: Departament) => {
	departamentToDelete.value = departament
}

const cancelDeleteDepartament = () => {
	departamentToDelete.value = null
}

const confirmDeleteDepartament = async () => {
	const departament = departamentToDelete.value
	if (!departament || isDeleting.value) return

	isDeleting.value = true
	try {
		await departamentsStore.delDepartament(departament.id)
		if (departamentToDelete.value?.id === departament.id)
			departamentToDelete.value = null
	} catch (error) {
		alertStore.showAlert(alertMessage(error, Alert.DeletedError))
	} finally {
		isDeleting.value = false
	}
}

onMounted(() => {
	departamentsStore.fetchDepartaments()
	analyticsStore.fetchDepartments()
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Департаменты</h1>
			<div class="page__actions">
				<UIButton @click="router.push('/edit/department')">Добавить департамент</UIButton>
			</div>
		</header>

		<p v-if="hasDepartamentsError" class="page__error">
			Список департаментов не загрузился. Обновите страницу.
		</p>

		<UITableBase
			:headList="table.heads"
			:columnTemplates="table.gridColumns"
			:is-empty="!isDepartamentsLoading && !hasDepartamentsError && !rows.length"
			empty-text="Департаментов пока нет. С них начинается структура компании."
		>
			<template v-if="isDepartamentsLoading">
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
				v-for="row in isDepartamentsLoading ? [] : rows"
				:key="row.departament.id"
				:columnTemplates="table.gridColumns"
			>
				<UITableColumn
					:text="row.departament.id"
					isLink
					isNumeric
					@click="goDepartmemts(row.departament.id)"
				/>
				<UITableColumn
					:text="row.departament.name"
					isLink
					isEllipsis
					@click="goDepartmemts(row.departament.id)"
				/>
				<UITableColumn :text="row.departament.employees_count ?? 0" isNumeric />
				<UITableColumn :text="row.departament.jobs_count ?? 0" isNumeric />
				<UITableColumn>
					<UICompletion
						:rate="row.rate"
						:trend="row.trend"
						:loading="isAnalyticsLoading"
						:error="hasAnalyticsError"
					/>
				</UITableColumn>
				<UITableColumn>
					<Skeleton
						v-if="isAnalyticsLoading"
						class="bone bone--narrow"
						preserveAspectRatio="none"
					>
						<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
					</Skeleton>
					<span v-else-if="hasAnalyticsError" class="note">не загрузилось</span>
					<span v-else-if="row.blockers === null" class="note">нет данных</span>
					<span
						v-else
						class="blockers"
						:class="{ 'blockers--alert': row.blockers > 0 }"
					>
						{{ row.blockers }}
					</span>
				</UITableColumn>
				<UITableColumn>
					<UITableRowPopover
						:items="[
							{
								title: 'Открыть департамент',
								func: () => goDepartmemts(row.departament.id),
							},
							{
								title: 'Изменить',
								func: () => editDepartament(row.departament.id),
							},
							{
								title: 'Удалить',
								red: true,
								func: () => askDeleteDepartament(row.departament),
							},
						]"
					/>
				</UITableColumn>
			</UITableRow>
		</UITableBase>

		<Transition name="fade">
			<ModalConfirm
				v-if="departamentToDelete"
				title="Удалить департамент?"
				:text="`Департамент «${departamentToDelete.name}» будет удалён без возможности восстановления.`"
				@confirm="confirmDeleteDepartament"
				@close="cancelDeleteDepartament"
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

.bone {
	width: 100%;
	height: 1rem;

	&--narrow {
		width: 2rem;
	}
}

.note {
	color: var(--text-3);
	font-size: var(--t-xs);
}

.blockers {
	@include numeric;
	color: var(--text-2);
	font-size: var(--t-md);

	&--alert {
		color: var(--err);
		font-weight: 500;
	}
}
</style>
