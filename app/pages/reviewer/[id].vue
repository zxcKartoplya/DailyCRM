<script lang="ts" setup>
import { useReviewersStore } from '~/stores/reviewers'

const route = useRoute()
const router = useRouter()
const reviewersStore = useReviewersStore()
const { reviewer, isLoading } = storeToRefs(reviewersStore)
const { pluralize } = usePluralize()
const reviewerId = route.params.id as string

const jobsCount = computed(() => reviewer.value?.jobs?.length ?? 0)

onMounted(() => {
	reviewersStore.fetchReviewer(reviewerId)
})
</script>

<template>
	<div class="page-stage">
		<Transition name="fade">
			<SkeletonPage v-if="isLoading" />
			<section v-else-if="reviewer" class="page">
				<header class="page__head">
					<div>
						<h1 class="page__title">{{ reviewer.name }}</h1>
						<p class="page__lede">
							Закреплён за {{ jobsCount }}
							{{ pluralize(jobsCount, ['ролью', 'ролями', 'ролями']) }}
						</p>
					</div>
					<UIButton
						variant="secondary"
						@click="router.push(`/edit/reviewer?id=${reviewer.id}`)"
					>
						Редактировать
					</UIButton>
				</header>

				<section class="section">
					<h2 class="section__title">Что оценивает</h2>
					<p v-if="reviewer.description" class="section__text">
						{{ reviewer.description }}
					</p>
					<p v-else class="section__empty">Описание не заполнено.</p>
				</section>

				<section class="section">
					<h2 class="section__title">Метрики</h2>
					<ul v-if="reviewer.metrics?.length" class="metrics">
						<li
							v-for="metric in reviewer.metrics"
							:key="metric.json_name"
							class="metrics__item"
						>
							<div class="metrics__name">{{ metric.display_name }}</div>
							<p v-if="metric.description" class="metrics__description">
								{{ metric.description }}
							</p>
							<div class="metrics__weight">{{ metric.value }}</div>
						</li>
					</ul>
					<p v-else class="section__empty">
						У оценщика пока нет метрик. Без них он ничего не измеряет.
					</p>
				</section>
			</section>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.page-stage {
	position: relative;
	min-height: 26rem;
}

.section {
	margin-bottom: var(--s-6);

	&__title {
		@include h4;
		margin-bottom: var(--s-3);
	}

	&__text {
		max-width: 70ch;
		line-height: var(--lh-base);
	}

	&__empty {
		color: var(--text-3);
	}
}

.metrics {
	display: grid;
	gap: 1px;
	margin: 0;
	padding: 0;
	list-style: none;
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--border);
	overflow: hidden;

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: start;
		gap: var(--s-1) var(--s-4);
		padding: var(--s-4);
		background-color: var(--surface);
	}

	&__name {
		font-weight: 500;
	}

	&__description {
		grid-column: 1;
		max-width: 70ch;
		color: var(--text-2);
		font-size: var(--t-sm);
	}

	&__weight {
		grid-row: 1 / span 2;
		grid-column: 2;
		align-self: center;
		padding: var(--s-1) var(--s-2);
		border-radius: var(--r-sm);
		background-color: var(--accent-weak);
		color: var(--accent-text);
		@include numeric;
		font-size: var(--t-sm);
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity var(--dur-slow) var(--ease);
}

.fade-leave-active {
	position: absolute;
	inset: 0;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
