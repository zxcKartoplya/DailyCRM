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
		'90px minmax(280px, 1fr) minmax(160px, 1fr) minmax(120px, 180px) 60px',
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
		<div class="page__card">
			<div class="page__title">Департаменты</div>
			<UITableBase :headList="table.heads" :columnTemplates="table.gridColumns">
				<UITableRow
					v-for="(departament, index) in departamentsStore.departaments"
					:key="departament.id"
					:columnTemplates="table.gridColumns"
					class="border-none"
					:style="{
						backgroundColor: index % 2 !== 0 ? '#F6F6F6' : '#FFFFFF',
					}"
				>
					<UITableColumn
						:text="departament.id"
						isLink
						@click="goDepartmemts(departament.id)"
					/>
					<UITableColumn
						:text="departament.name"
						isLink
						isEllipsis
						@click="goDepartmemts(departament.id)"
					/>
					<UITableColumn :text="departament.employees_count" isEllipsis />
					<UITableColumn
						:text="departament.jobs_count"
						isEllipsis
						@click="goDepartmemts(departament.id)"
					/>
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
