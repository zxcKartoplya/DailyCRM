<script lang="ts" setup>
const router = useRouter()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название роли', sortId: 'name' },
		{ title: 'Оценщик', sortId: 'reviewer' },
		{ title: 'Департамент', sortId: 'department' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'90px minmax(240px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) 60px',
}

const roles = [
	{
		id: 31,
		name: 'Аналитик дейликов',
		reviewer: 'Тимлид',
		department: 'Операционный анализ',
	},
	{
		id: 32,
		name: 'Координатор задач',
		reviewer: 'Старший менеджер',
		department: 'Клиентский успех',
	},
	{
		id: 33,
		name: 'Специалист качества',
		reviewer: 'Руководитель направления',
		department: 'Служба контроля',
	},
	{
		id: 34,
		name: 'Менеджер прогресса',
		reviewer: 'Старший аналитик',
		department: 'Продукт и метрики',
	},
	{
		id: 35,
		name: 'HR-аналитик',
		reviewer: 'HR бизнес-партнер',
		department: 'Люди и культура',
	},
]

const goRole = (id: number) => {
	router.push(`/role/${id}`)
}
</script>

<template>
	<section class="page">
		<div class="page__card">
			<div class="page__title">Роли</div>
			<UITableBase :headList="table.heads" :columnTemplates="table.gridColumns">
				<UITableRow
					v-for="(role, index) in roles"
					:key="role.id"
					:columnTemplates="table.gridColumns"
					class="border-none"
					:style="{
						backgroundColor: index % 2 !== 0 ? '#F6F6F6' : '#FFFFFF',
					}"
				>
					<UITableColumn :text="role.id" isLink @click="goRole(role.id)" />
					<UITableColumn
						:text="role.name"
						isLink
						isEllipsis
						@click="goRole(role.id)"
					/>
					<UITableColumn :text="role.reviewer" isEllipsis />
					<UITableColumn :text="role.department" isEllipsis />
					<UITableColumn>
						<UITableRowPopover
							:items="[
								{
									title: 'Открыть профиль',
									func: () => {
										goRole(role.id)
									},
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
