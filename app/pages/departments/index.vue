<script lang="ts" setup>
import { useAlertStore } from '~/stores/alert'
import { useDepartamentsStore } from '~/stores/departments'
import type { Departament } from '~/types/departaments'
import { alertMessage } from '~/utils/alertMessage'

const router = useRouter()
const departamentsStore = useDepartamentsStore()
const alertStore = useAlertStore()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название департамента', sortId: 'name' },
		{ title: 'Сотрудников', sortId: 'employees_count' },
		{ title: 'Ролей', sortId: 'jobs_count' },
		{ title: '', sortId: null },
	],
	gridColumns:
		'80px minmax(240px, 1fr) minmax(140px, 200px) minmax(120px, 180px) 56px',
}

const goDepartmemts = (id: number) => {
	router.push(`/departments/${id}`)
}

const editDepartament = (id: number) => {
	router.push(`/edit/department?id=${id}`)
}

const departamentToDelete = ref<Departament | null>(null)
const isDeleting = ref(false)

const askDeleteDepartament = (departament: Departament) => {
	departamentToDelete.value = departament
}

const cancelDeleteDepartament = () => {
	departamentToDelete.value = null
}

const confirmDeleteDepartament = async () => {
	const departament = departamentToDelete.value
	if (!departament || isDeleting.value) return

	isDeleting.value = true
	try {
		await departamentsStore.delDepartament(departament.id)
		if (departamentToDelete.value?.id === departament.id)
			departamentToDelete.value = null
	} catch (error) {
		alertStore.showAlert(alertMessage(error, 'Не удалось удалить департамент'))
	} finally {
		isDeleting.value = false
	}
}

onMounted(() => {
	departamentsStore.fetchDepartaments()
})
</script>

<template>
	<section class="page">
		<header class="page__head">
			<h1 class="page__title">Департаменты</h1>
			<div class="page__actions">
				<UIButton @click="router.push('/edit/department')">Добавить департамент</UIButton>
			</div>
		</header>
		<UITableBase
			:headList="table.heads"
			:columnTemplates="table.gridColumns"
			:is-empty="!departamentsStore.departaments?.length"
			empty-text="Департаментов пока нет. С них начинается структура компании."
		>
			<UITableRow
				v-for="departament in departamentsStore.departaments"
				:key="departament.id"
				:columnTemplates="table.gridColumns"
			>
				<UITableColumn
					:text="departament.id"
					isLink
					isNumeric
					@click="goDepartmemts(departament.id)"
				/>
				<UITableColumn
					:text="departament.name"
					isLink
					isEllipsis
					@click="goDepartmemts(departament.id)"
				/>
				<UITableColumn :text="departament.employees_count ?? 0" isNumeric />
				<UITableColumn :text="departament.jobs_count ?? 0" isNumeric />
				<UITableColumn>
					<UITableRowPopover
						:items="[
							{
								title: 'Открыть департамент',
								func: () => goDepartmemts(departament.id),
							},
							{
								title: 'Изменить',
								func: () => editDepartament(departament.id),
							},
							{
								title: 'Удалить',
								red: true,
								func: () => askDeleteDepartament(departament),
							},
						]"
					/>
				</UITableColumn>
			</UITableRow>
		</UITableBase>
		<Transition name="fade">
			<ModalConfirm
				v-if="departamentToDelete"
				title="Удалить департамент?"
				:text="`Департамент «${departamentToDelete.name}» будет удалён без возможности восстановления.`"
				@confirm="confirmDeleteDepartament"
				@close="cancelDeleteDepartament"
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
