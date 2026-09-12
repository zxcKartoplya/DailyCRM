<script lang="ts" setup>
import { useWorkerStore } from '~/stores/workers'
import workersService from '~/services/workers.servies'

const route = useRoute()
const router = useRouter()
const workerId = route.params.id as string
const workersStore = useWorkerStore()
const { worker, isLoading } = storeToRefs(workersStore)

const aiFeedback = ref<string | null>(null)
const aiFeedbackError = ref<string | null>(null)
const isLoadingFeedback = ref(false)

onMounted(() => {
	workersStore.getWorker(workerId)
})

async function fetchAiFeedback() {
	isLoadingFeedback.value = true
	aiFeedback.value = null
	aiFeedbackError.value = null
	try {
		const result = await workersService.getAiFeedback(workerId)
		if (result?.feedback) {
			aiFeedback.value = result.feedback
		} else {
			aiFeedbackError.value = 'Не удалось получить оценку. Попробуйте ещё раз.'
		}
	} catch {
		aiFeedbackError.value = 'Ошибка при запросе AI-оценки. Попробуйте ещё раз.'
	} finally {
		isLoadingFeedback.value = false
	}
}
</script>

<template>
	<div class="page-stage">
		<Transition name="swap">
			<SkeletonPage v-if="isLoading" />
			<section v-else-if="worker" class="page">
				<header class="page__head">
					<div>
						<h1 class="page__title">{{ worker.name }}</h1>
						<p class="page__lede">
							<UIStatus :status="worker.status" />
						</p>
					</div>
					<UIButton
						variant="secondary"
						@click="router.push(`/edit/workers?id=${worker.id}`)"
					>
						Редактировать
					</UIButton>
				</header>

				<dl class="facts">
					<div class="facts__item">
						<dt class="facts__label">ID</dt>
						<dd class="facts__value facts__value--numeric">{{ worker.id }}</dd>
					</div>
					<div class="facts__item">
						<dt class="facts__label">Почта</dt>
						<dd class="facts__value">{{ worker.email }}</dd>
					</div>
					<div class="facts__item">
						<dt class="facts__label">Департамент</dt>
						<dd class="facts__value">{{ worker.department_name || '—' }}</dd>
					</div>
					<div class="facts__item">
						<dt class="facts__label">Должность</dt>
						<dd class="facts__value">{{ worker.job_name || '—' }}</dd>
					</div>
				</dl>

				<section class="assessment">
					<div class="assessment__head">
						<h2 class="assessment__title">Оценка</h2>
						<UIButton
							variant="secondary"
							size="sm"
							:is-loading="isLoadingFeedback"
							@click="fetchAiFeedback"
						>
							Запросить оценку
						</UIButton>
					</div>

					<p v-if="!aiFeedback && !aiFeedbackError" class="assessment__hint">
						Оценка собирается по метрикам должности и формулируется моделью.
						Это черновик — читайте его как мнение, а не как вердикт.
					</p>

					<p v-if="aiFeedback" class="assessment__text">{{ aiFeedback }}</p>

					<p v-if="aiFeedbackError" class="assessment__error">
						{{ aiFeedbackError }}
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

.assessment {
	margin-top: var(--s-6);
	padding-top: var(--s-5);
	border-top: 1px solid var(--border);

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-4);
		margin-bottom: var(--s-4);
	}

	&__title {
		@include h4;
	}

	&__hint {
		max-width: 60ch;
		color: var(--text-3);
	}

	&__text {
		max-width: 68ch;
		padding: var(--s-4);
		border: 1px solid var(--border);
		border-radius: var(--r-lg);
		background-color: var(--surface);
		line-height: var(--lh-base);
	}

	&__error {
		padding: var(--s-3) var(--s-4);
		border: 1px solid var(--err);
		border-radius: var(--r-md);
		background-color: var(--err-weak);
		color: var(--err);
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
