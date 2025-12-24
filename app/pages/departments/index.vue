<script lang="ts" setup>
const router = useRouter()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название департамента', sortId: 'name' },
		{ title: 'Количество сотрудников', sortId: 'employees_count' },
		{ title: 'Оценщик', sortId: 'admin_name' },
		{ title: 'Ролей', sortId: 'jobs_count' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'90px minmax(280px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) minmax(120px, 180px) 60px',
}

const departaments = [
	{
		id: 1,
		name: 'Операционный анализ',
		employees_count: 32,
		admin_name: 'Тимлид',
		jobs_count: 8,
	},
	{
		id: 2,
		name: 'Продукт и метрики',
		employees_count: 24,
		admin_name: 'Старший аналитик',
		jobs_count: 6,
	},
	{
		id: 3,
		name: 'Клиентский успех',
		employees_count: 21,
		admin_name: 'Старший менеджер',
		jobs_count: 5,
	},
	{
		id: 4,
		name: 'Служба контроля',
		employees_count: 18,
		admin_name: 'Руководитель направления',
		jobs_count: 4,
	},
	{
		id: 5,
		name: 'Люди и культура',
		employees_count: 15,
		admin_name: 'HR бизнес-партнер',
		jobs_count: 3,
	},
]

const goDepartmemts = (id: number) => {
	router.push(`/departments/${id}`)
}
</script>

<template>
	<section class="page">
		<div class="page__card">
			<div class="page__title">Департаменты</div>
			<UITableBase :headList="table.heads" :columnTemplates="table.gridColumns">
				<UITableRow
					v-for="(departament, index) in departaments"
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
					<UITableColumn :text="departament.admin_name" isEllipsis />
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
									func: () => {
										goDepartmemts(departament.id)
									},
								},
								{
									title: 'Удалить',
									red: true,
									func: () => {},
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
