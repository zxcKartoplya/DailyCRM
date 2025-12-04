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

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название', sortId: null },
		{ title: 'Свойство', sortId: 'segment_type' },
		{ title: 'Клиентов в сегменте', sortId: 'users_count' },
		{ title: 'Последняя рассылка', sortId: 'last_mailing' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'120px minmax(200px, 395px) minmax(160px, 380px) minmax(160px, 380px) 300px 60px',
}

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
			<UITableBase :headList="table.heads" :columnTemplates="table.gridColumns">
				<UITableRow
					v-for="(item, index) in departamentsStore.departaments"
					:key="item.id"
					:columnTemplates="table.gridColumns"
					class="border-none"
					:style="{
						backgroundColor: index % 2 !== 0 ? '#F6F6F6' : '#FFFFFF',
					}"
				>
					<UITableColumn text="id" isLink @click="console.log('1')" />
					<UITableColumn
						text="имя"
						isLink
						isEllipsis
						@click="console.log('1')"
					/>
					<UITableColumn text="выв" isEllipsis />
					<UITableColumn text="юзерсы" isLink />
					<UITableColumn
						text="
						данные"
					/>
					<UITableColumn>
						<UITableRowPopover
							:items="[
								{
									title: 'Редактировать',
									func: () => {
										console.log('1')
									},
								},
								{
									title: 'Удалить',
									red: true,
									func: () => console.log('1'),
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
