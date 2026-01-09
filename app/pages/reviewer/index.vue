<script lang="ts" setup>
const router = useRouter()

	const table = {
		heads: [
			{ title: 'ID', sortId: 'id' },
			{ title: 'Роль оценщика', sortId: 'role' },
			{ title: 'Закреплено работников', sortId: 'workers_count' },
			{ title: '', sortId: null },
		],
		gridColumns:
			'90px minmax(260px, 1fr) minmax(220px, 1fr) 60px',
	}

	const reviewers = [
		{
			id: 21,
			role: 'Тимлид',
			workers_count: 12,
		},
		{
			id: 22,
			role: 'Старший менеджер',
			workers_count: 9,
		},
		{
			id: 23,
			role: 'Руководитель направления',
			workers_count: 15,
		},
		{
			id: 24,
			role: 'Старший аналитик',
			workers_count: 7,
		},
		{
			id: 25,
			role: 'HR бизнес-партнер',
			workers_count: 10,
		},
	]

const goReviewer = (id: number) => {
	router.push(`/reviewer/${id}`)
}
</script>

<template>
	<section class="page">
		<div class="page__card">
			<div class="page__title">Оценщики</div>
			<UITableBase :headList="table.heads" :columnTemplates="table.gridColumns">
				<UITableRow
					v-for="(reviewer, index) in reviewers"
					:key="reviewer.id"
					:columnTemplates="table.gridColumns"
					class="border-none"
					:style="{
						backgroundColor: index % 2 !== 0 ? '#F6F6F6' : '#FFFFFF',
					}"
				>
					<UITableColumn
						:text="reviewer.id"
						isLink
						@click="goReviewer(reviewer.id)"
					/>
					<UITableColumn
						:text="reviewer.role"
						isLink
						isEllipsis
						@click="goReviewer(reviewer.id)"
					/>
					<UITableColumn :text="reviewer.workers_count" isEllipsis />
					<UITableColumn>
						<UITableRowPopover
							:items="[
								{
									title: 'Открыть профиль',
									func: () => {
										goReviewer(reviewer.id)
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
