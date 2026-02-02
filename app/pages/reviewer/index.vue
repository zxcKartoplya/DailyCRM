<script lang="ts" setup>
import { useReviewersStore } from '~/stores/reviewers'

const router = useRouter()
const reviewersStore = useReviewersStore()
const { reviewers } = storeToRefs(reviewersStore)

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название роли', sortId: 'role' },
		{ title: 'Описание роли', sortId: 'description' },
		{ title: '', sortId: null },
	],
	gridColumns: '90px minmax(260px, 1fr) minmax(220px, 1fr) 60px',
}

const goReviewer = (id: number) => {
	router.push(`/reviewer/${id}`)
}

onMounted(async () => {
	await reviewersStore.fetchReviewers()
})
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
						:text="reviewer.name"
						isLink
						isEllipsis
						@click="goReviewer(reviewer.id)"
					/>
					<UITableColumn :text="reviewer.description" isEllipsis />
					<UITableColumn>
						<UITableRowPopover
							:items="[
								{
									title: 'Открыть профиль',
									func: () => {
										goReviewer(reviewer.id)
									},
								},
								{
									title: 'Удалить',
									func: () => {
										reviewersStore.delReviewer(reviewer.id)
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
