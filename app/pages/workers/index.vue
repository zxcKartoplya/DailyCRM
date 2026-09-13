<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useWorkerStore } from '~/stores/workers'
import type { User } from '~/types/users'
import { alertMessage } from '~/utils/alertMessage'

const router = useRouter()
const workersStore = useWorkerStore()
const alertStore = useAlertStore()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Имя', sortId: 'name' },
		{ title: 'Департамент', sortId: 'department' },
		{ title: 'Статус', sortId: 'status' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'80px minmax(200px, 1fr) minmax(180px, 1fr) minmax(140px, 200px) 56px',
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
		alertStore.showAlert(alertMessage(error, 'Не удалось удалить сотрудника'))
	} finally {
		isDeleting.value = false
	}
}

onMounted(() => {
	workersStore.getWorkers()
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
		<UITableBase
			:headList="table.heads"
			:columnTemplates="table.gridColumns"
			:is-empty="!workersStore.workers.length"
			empty-text="Сотрудников пока нет. Добавьте первого — и он появится в списке."
		>
			<UITableRow
				v-for="worker in workersStore.workers"
				:key="worker.id"
				:columnTemplates="table.gridColumns"
			>
				<UITableColumn
					:text="worker.id"
					isLink
					isNumeric
					@click="goWorker(worker.id)"
				/>
				<UITableColumn
					:text="worker.name"
					isLink
					isEllipsis
					@click="goWorker(worker.id)"
				/>
				<UITableColumn :text="worker.department_name ?? '—'" isEllipsis />
				<UITableColumn>
					<UIStatus :status="worker.status" />
				</UITableColumn>
				<UITableColumn>
					<UITableRowPopover
						:items="[
							{
								title: 'Открыть профиль',
								func: () => goWorker(worker.id),
							},
							{
								title: 'Изменить',
								func: () => editWorker(worker.id),
							},
							{
								title: 'Удалить',
								red: true,
								func: () => askDeleteWorker(worker),
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
</style>
