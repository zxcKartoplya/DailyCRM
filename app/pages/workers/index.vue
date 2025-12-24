<script lang="ts" setup>
const router = useRouter()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Имя', sortId: 'name' },
		{ title: 'Роль', sortId: 'role' },
		{ title: 'Департамент', sortId: 'department' },
		{ title: 'Оценщик', sortId: 'reviewer' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'90px minmax(200px, 320px) minmax(180px, 240px) minmax(180px, 240px) minmax(180px, 260px) 60px',
}

const workers = [
	{
		id: 101,
		name: 'Анна Маркова',
		role: 'Аналитик задач',
		department: 'Операционный анализ',
		reviewer: 'Тимлид',
	},
	{
		id: 102,
		name: 'Дмитрий Соловьев',
		role: 'Менеджер процессов',
		department: 'Клиентский успех',
		reviewer: 'Старший менеджер',
	},
	{
		id: 103,
		name: 'Екатерина Горина',
		role: 'Координатор дейликов',
		department: 'Продукт и метрики',
		reviewer: 'Руководитель направления',
	},
	{
		id: 104,
		name: 'Кирилл Романов',
		role: 'Специалист по качеству',
		department: 'Служба контроля',
		reviewer: 'Старший аналитик',
	},
	{
		id: 105,
		name: 'Ольга Сафонова',
		role: 'HR-аналитик',
		department: 'Люди и культура',
		reviewer: 'HR бизнес-партнер',
	},
]

const goWorker = (id: number) => {
	router.push(`/workers/${id}`)
}
</script>

<template>
	<section class="page">
		<div class="page__card">
			<div class="page__title">Сотрудники</div>
			<UITableBase :headList="table.heads" :columnTemplates="table.gridColumns">
				<UITableRow
					v-for="(worker, index) in workers"
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
					<UITableColumn :text="worker.role" isEllipsis />
					<UITableColumn :text="worker.department" isEllipsis />
					<UITableColumn :text="worker.reviewer" isEllipsis />
					<UITableColumn>
						<UITableRowPopover
							:items="[
								{
									title: 'Открыть профиль',
									func: () => {
										goWorker(worker.id)
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
