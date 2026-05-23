<script lang="ts" setup>
import { useWorkerStore } from '~/stores/workers'

const router = useRouter()
const workersStore = useWorkerStore()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Имя', sortId: 'name' },
		{ title: 'Роль', sortId: 'role' },
		{ title: 'Департамент', sortId: 'department' },
		{ title: 'Статус', sortId: 'status' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'90px minmax(200px, 320px) minmax(180px, 240px) minmax(180px, 240px) minmax(120px, 160px) 60px',
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
		<div class="page__card">
			<div class="page__title">Сотрудники</div>
			<UITableBase :headList="table.heads" :columnTemplates="table.gridColumns">
				<UITableRow
					v-for="(worker, index) in workersStore.workers"
					:key="worker.id"
					:columnTemplates="table.gridColumns"
					class="border-none"
					:style="{
						backgroundColor: index % 2 !== 0 ? '#F6F6F6' : '#FFFFFF',
					}"
				>
					<UITableColumn
						:text="worker.id"
						isLink
						@click="goWorker(worker.id)"
					/>
					<UITableColumn
						:text="worker.name"
						isLink
						isEllipsis
						@click="goWorker(worker.id)"
					/>
					<UITableColumn :text="worker.job_name" isEllipsis />
					<UITableColumn :text="worker.department_name" isEllipsis />
					<UITableColumn :text="worker.status" isEllipsis />
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
		</div>
	</section>
</template>

<style lang="scss" scoped>
.page {
	&__card {
		padding: rem(20);
	}
	&__title {
		margin-bottom: rem(16);
		@include h3;
	}
}
</style>
