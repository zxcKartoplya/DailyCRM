<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useReviewersStore } from '~/stores/reviewers'
import { Alert } from '~/types/alert'
import type { Reviewer } from '~/types/reviewers'
import { alertMessage } from '~/utils/alertMessage'

const router = useRouter()
const reviewersStore = useReviewersStore()
const { reviewers } = storeToRefs(reviewersStore)
const alertStore = useAlertStore()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название', sortId: 'name' },
		{ title: 'Что оценивает', sortId: 'description' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'80px minmax(240px, 1fr) minmax(240px, 2fr) 56px',
}

const goReviewer = (id: number) => {
	router.push(`/reviewer/${id}`)
}

const reviewerToDelete = ref<Reviewer | null>(null)
const isDeleting = ref(false)

const askDeleteReviewer = (reviewer: Reviewer) => {
	reviewerToDelete.value = reviewer
}

const cancelDeleteReviewer = () => {
	reviewerToDelete.value = null
}

const confirmDeleteReviewer = async () => {
	const reviewer = reviewerToDelete.value
	if (!reviewer || isDeleting.value) return

	isDeleting.value = true
	try {
		await reviewersStore.delReviewer(reviewer.id)
		if (reviewerToDelete.value?.id === reviewer.id) reviewerToDelete.value = null
	} catch (error) {
		alertStore.showAlert(alertMessage(error, Alert.DeletedError))
	} finally {
		isDeleting.value = false
	}
}

onMounted(async () => {
	await reviewersStore.fetchReviewers()
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Оценщики</h1>
			<div class="page__actions">
				<UIButton @click="router.push('/edit/reviewer')">Добавить оценщика</UIButton>
			</div>
		</header>
		<UITableBase
			:headList="table.heads"
			:columnTemplates="table.gridColumns"
			:is-empty="!reviewers?.length"
			empty-text="Оценщиков пока нет. Оценщик — это набор метрик для должности."
		>
			<UITableRow
				v-for="reviewer in reviewers"
				:key="reviewer.id"
				:columnTemplates="table.gridColumns"
			>
				<UITableColumn
					:text="reviewer.id"
					isLink
					isNumeric
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
								red: true,
								func: () => {
									askDeleteReviewer(reviewer)
								},
							},
						]"
					/>
				</UITableColumn>
			</UITableRow>
		</UITableBase>
		<Transition name="fade">
			<ModalConfirm
				v-if="reviewerToDelete"
				title="Удалить оценщика?"
				:text="`Оценщик «${reviewerToDelete.name}» будет удалён без возможности восстановления.`"
				@confirm="confirmDeleteReviewer"
				@close="cancelDeleteReviewer"
			/>
		</Transition>
	</section>
</template>

<style lang="scss" scoped>
.page__actions {
	display: flex;
	gap: var(--s-3);
}
</style>
