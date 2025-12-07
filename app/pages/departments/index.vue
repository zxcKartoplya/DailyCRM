<script lang="ts" setup>
import { useDepartamentsStore } from '~/stores/departments'

const departamentsStore = useDepartamentsStore()
const router = useRouter()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название департамента', sortId: null },
		{ title: 'Количество работников', sortId: 'segment_type' },
		{ title: 'Руководитель', sortId: 'users_count' },
		{ title: 'Роли', sortId: 'users_count' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'120px minmax(300px, 495px) minmax(260px, 180px) minmax(110px, 330px) 100px 60px',
}

const goDepartmemts = (id: number) => {
	router.push(`/departments/${id}`)
}

onMounted(() => {
	departamentsStore.fetchDepartaments()
})
</script>

<template>
	<section class="page">
		<div class="page__card">
			<div class="page__title">Список департаментов</div>
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
					<UITableColumn :text="departament.admin_name" isLink />
					<UITableColumn
						:text="departament.jobs_count"
						isLink
						@click="goDepartmemts(departament.id)"
					/>
					<UITableColumn>
						<UITableRowPopover
							:items="[
								{
									title: 'Редактировать',
									func: () => {
										goDepartmemts(departament.id)
									},
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
