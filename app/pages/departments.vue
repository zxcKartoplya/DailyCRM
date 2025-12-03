<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useDepartamentsStore } from '~/stores/departments'
import { Alert } from '~/types/alert'

const departamentsStore = useDepartamentsStore()
const alertStore = useAlertStore()
const isLoading = ref(false)

const columns = [
	{ key: 'name', label: 'Название' },
	{ key: 'id', label: 'ID', width: '120px', align: 'right' },
]

const rows = computed(
	() => departamentsStore.departaments as Record<string, any>[]
)

const loadDepartaments = async () => {
	isLoading.value = true
	try {
		await departamentsStore.fetchDepartaments()
	} catch (error) {
		alertStore.showAlert(Alert.AddedError)
	} finally {
		isLoading.value = false
	}
}

onMounted(loadDepartaments)
</script>

<template>
	<section class="page">
		<div class="page__card">
			<div class="page__title">Список департаментов</div>
			<UITable
				:columns="columns"
				:rows="rows"
				:loading="isLoading"
				empty-text="Пока нет департаментов"
			/>
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
