<script lang="ts" setup>
import { useWorkerStore } from '~/stores/workers'

const router = useRouter()
const workersStore = useWorkerStore()

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
								func: () => workersStore.deleteWorker(worker.id),
							},
						]"
					/>
				</UITableColumn>
			</UITableRow>
		</UITableBase>
	</section>
</template>

<style lang="scss" scoped>
.page__actions {
	display: flex;
	gap: var(--s-3);
}
</style>
