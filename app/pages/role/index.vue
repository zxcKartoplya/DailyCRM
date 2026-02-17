<script lang="ts" setup>
import { useJobStore } from '~/stores/role'

const router = useRouter()
const jobStore = useJobStore()

const table = {
	heads: [
		{ title: 'ID', sortId: 'id' },
		{ title: 'Название роли', sortId: 'role' },
		{ title: 'Описание роли', sortId: 'description' },
		{ title: '', sortId: null },
	],
	gridColumns: '90px minmax(260px, 1fr) minmax(220px, 1fr) 60px',
}

const goRole = (id: number) => {
	router.push(`/role/${id}`)
}

const editRole = (id: number) => {
	router.push(`/edit/role?id=${id}`)
}

onMounted(() => {
	jobStore.fetchJobs()
})
</script>

<template>
	<section class="page">
		<div class="page__card">
			<div class="page__title">Роли</div>
			<UITableBase :headList="table.heads" :columnTemplates="table.gridColumns">
				<UITableRow
					v-for="(role, index) in jobStore.jobs"
					:key="role.id"
					:columnTemplates="table.gridColumns"
					class="border-none"
					:style="{
						backgroundColor: index % 2 !== 0 ? '#F6F6F6' : '#FFFFFF',
					}"
				>
					<UITableColumn :text="role.id" isLink @click="goRole(role.id)" />
					<UITableColumn
						:text="role.name"
						isLink
						isEllipsis
						@click="goRole(role.id)"
					/>
					<UITableColumn :text="role.reviewer_name" isEllipsis />
					<UITableColumn>
						<UITableRowPopover
							:items="[
								{
									title: 'Открыть роль',
									func: () => {
										goRole(role.id)
									},
								},
								{
									title: 'Изменить роль',
									func: () => {
										editRole(role.id)
									},
								},
								{
									title: 'Удалить',
									red: true,
									func: () => {
										jobStore.delJob(role.id)
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
