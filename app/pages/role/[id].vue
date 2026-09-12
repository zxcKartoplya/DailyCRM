<script lang="ts" setup>
import { useJobStore } from '~/stores/role'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const { job, isLoading } = storeToRefs(jobStore)

const roleId = route.params.id as string

onMounted(() => {
	jobStore.fetchJob(roleId)
})
</script>

<template>
	<div class="page-stage">
		<Transition name="swap">
			<SkeletonPage v-if="isLoading" />

			<section v-else-if="job" key="content" class="page">
				<header class="page__head">
					<h1 class="page__title">{{ job.name }}</h1>
					<UIButton
						variant="secondary"
						@click="router.push(`/edit/role?id=${job.id}`)"
					>
						Редактировать
					</UIButton>
				</header>

				<dl class="facts">
					<div class="facts__item">
						<dt class="facts__label">ID</dt>
						<dd class="facts__value facts__value--numeric">{{ job.id }}</dd>
					</div>
					<div class="facts__item">
						<dt class="facts__label">Оценщик</dt>
						<dd class="facts__value">{{ job.reviewer_name || '—' }}</dd>
					</div>
					<div class="facts__item">
						<dt class="facts__label">Департамент</dt>
						<dd class="facts__value">{{ job.department_name || '—' }}</dd>
					</div>
				</dl>

				<section class="section">
					<h2 class="section__title">Описание роли</h2>
					<p v-if="job.description" class="section__text">
						{{ job.description }}
					</p>
					<p v-else class="section__empty">Описание не заполнено.</p>
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

.facts {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	gap: 1px;
	margin: 0;
	border: 1px solid var(--border);
	border-radius: var(--r-lg);
	background-color: var(--border);
	overflow: hidden;

	&__item {
		padding: var(--s-4);
		background-color: var(--surface);
	}

	&__label {
		@include label;
	}

	&__value {
		margin: var(--s-2) 0 0;
		font-size: var(--t-lg);
		font-weight: 500;
		word-break: break-word;

		&--numeric {
			@include numeric;
		}
	}
}

.section {
	margin-top: var(--s-6);
	padding-top: var(--s-5);
	border-top: 1px solid var(--border);

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

.swap-enter-active,
.swap-leave-active {
	transition: opacity var(--dur-slow) var(--ease);
}

.swap-leave-active {
	position: absolute;
	inset: 0;
}

.swap-enter-from,
.swap-leave-to {
	opacity: 0;
}
</style>
