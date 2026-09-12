<script lang="ts" setup>
import { useJobStore } from '~/stores/role'

const router = useRouter()
const jobStore = useJobStore()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название роли', sortId: 'role' },
		{ title: 'Оценщик', sortId: 'reviewer_name' },
		{ title: 'Департамент', sortId: 'department_name' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'80px minmax(200px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr) 56px',
}

const goRole = (id: number) => {
	router.push(`/role/${id}`)
}

const editRole = (id: number) => {
	router.push(`/edit/role?id=${id}`)
}

onMounted(() => {
	jobStore.fetchJobs()
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Роли</h1>
			<div class="page__actions">
				<UIButton @click="router.push('/edit/role')">Добавить роль</UIButton>
			</div>
		</header>
		<UITableBase
			:headList="table.heads"
			:columnTemplates="table.gridColumns"
			:is-empty="!jobStore.jobs.length"
			empty-text="Ролей пока нет. Роль связывает должность с оценщиком."
		>
			<UITableRow
				v-for="role in jobStore.jobs"
				:key="role.id"
				:columnTemplates="table.gridColumns"
			>
				<UITableColumn :text="role.id" isLink @click="goRole(role.id)" />
				<UITableColumn
					:text="role.name"
					isLink
					isEllipsis
					@click="goRole(role.id)"
				/>
				<UITableColumn :text="role.reviewer_name" isEllipsis />
				<UITableColumn :text="role.department_name" isEllipsis />
				<UITableColumn>
					<UITableRowPopover
						:items="[
							{
								title: 'Открыть роль',
								func: () => {
									goRole(role.id)
								},
							},
							{
								title: 'Изменить роль',
								func: () => {
									editRole(role.id)
								},
							},
							{
								title: 'Удалить',
								red: true,
								func: () => {
									jobStore.delJob(role.id)
								},
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
