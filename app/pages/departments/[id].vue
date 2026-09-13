<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useDailiesStore } from '~/stores/dailies'
import { useDepartamentsStore } from '~/stores/departments'
import { Alert } from '~/types/alert'
import { alertMessage } from '~/utils/alertMessage'

const departamentsStore = useDepartamentsStore()
const dailiesStore = useDailiesStore()
const alertStore = useAlertStore()
const { dailies, isLoading, periodDays } = storeToRefs(dailiesStore)
const route = useRoute()

const id = route.params.id as string

const periods = [7, 14, 30]

await departamentsStore.fetchDepartament(id)
await dailiesStore.fetchDepartmentDailies(id)

const isRenaming = ref(false)
const renameError = ref('')

const rename = async (name: string) => {
	isRenaming.value = true
	renameError.value = ''

	try {
		await departamentsStore.putDepartament(id, { name })
		alertStore.showAlert(Alert.Added)
	} catch (error) {
		const message = alertMessage(error, Alert.AddedError)
		alertStore.showAlert(message)
		renameError.value = message
	} finally {
		isRenaming.value = false
	}
}

const cancelRename = () => {
	renameError.value = ''
}
</script>

<template>
	<section v-if="departamentsStore.departament" class="page">
		<header class="page__head">
			<h1 class="page__title">
				<UIInlineEdit
					:value="departamentsStore.departament.name"
					placeholder="Введите название департамента"
					aria-label="Название департамента"
					edit-label="Переименовать департамент"
					empty-text="Без названия"
					:error="renameError"
					:is-saving="isRenaming"
					@save="rename"
					@cancel="cancelRename"
				/>
			</h1>
		</header>

		<dl class="facts">
			<div class="facts__item">
				<dt class="facts__label">Сотрудников</dt>
				<dd class="facts__value facts__value--numeric">
					{{ departamentsStore.departament.employees_count ?? 0 }}
				</dd>
			</div>
			<div class="facts__item">
				<dt class="facts__label">Ролей</dt>
				<dd class="facts__value facts__value--numeric">
					{{ departamentsStore.departament.jobs_count ?? 0 }}
				</dd>
			</div>
		</dl>

		<section class="section">
			<div class="section__head">
				<h2 class="section__title">Дейлики</h2>
				<div class="periods">
					<UIButton
						v-for="period in periods"
						:key="period"
						:variant="period === periodDays ? 'primary' : 'ghost'"
						@click="dailiesStore.setPeriod(period, id)"
					>
						{{ period }} дней
					</UIButton>
				</div>
			</div>

			<UILoading v-if="isLoading" />
			<DailiesDepartmentGrid v-else-if="dailies" :dailies="dailies" />
		</section>
	</section>
</template>

<style lang="scss" scoped>
.page__title {
	min-width: 0;

	:deep(.ui-inline-edit__text) {
		font: inherit;
		letter-spacing: inherit;
	}
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
		font-size: var(--t-xl);
		font-weight: 500;

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
		margin-bottom: var(--s-4);
	}

	&__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--s-3);

		.section__title {
			margin-bottom: 0;
		}
	}
}

.periods {
	display: flex;
	gap: var(--s-2);
	margin-bottom: var(--s-4);
}
</style>
