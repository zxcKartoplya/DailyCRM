<script lang="ts" setup>
import { useDepartamentsStore } from '~/stores/departments'

const router = useRouter()
const departamentsStore = useDepartamentsStore()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название департамента', sortId: 'name' },
		{ title: 'Сотрудников', sortId: 'employees_count' },
		{ title: 'Ролей', sortId: 'jobs_count' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'80px minmax(240px, 1fr) minmax(140px, 200px) minmax(120px, 180px) 56px',
}

const goDepartmemts = (id: number) => {
	router.push(`/departments/${id}`)
}

const editDepartament = (id: number) => {
	router.push(`/edit/department?id=${id}`)
}

onMounted(() => {
	departamentsStore.fetchDepartaments()
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
		<UITableBase
			:headList="table.heads"
			:columnTemplates="table.gridColumns"
			:is-empty="!departamentsStore.departaments?.length"
			empty-text="Департаментов пока нет. С них начинается структура компании."
		>
			<UITableRow
				v-for="departament in departamentsStore.departaments"
				:key="departament.id"
				:columnTemplates="table.gridColumns"
			>
				<UITableColumn
					:text="departament.id"
					isLink
					isNumeric
					@click="goDepartmemts(departament.id)"
				/>
				<UITableColumn
					:text="departament.name"
					isLink
					isEllipsis
					@click="goDepartmemts(departament.id)"
				/>
				<UITableColumn :text="departament.employees_count ?? 0" isNumeric />
				<UITableColumn :text="departament.jobs_count ?? 0" isNumeric />
				<UITableColumn>
					<UITableRowPopover
						:items="[
							{
								title: 'Открыть департамент',
								func: () => goDepartmemts(departament.id),
							},
							{
								title: 'Изменить',
								func: () => editDepartament(departament.id),
							},
							{
								title: 'Удалить',
								red: true,
								func: () => departamentsStore.delDepartament(departament.id),
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
