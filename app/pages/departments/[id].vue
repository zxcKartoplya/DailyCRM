<script lang="ts" setup>
import { useDepartamentsStore } from '~/stores/departments'

const departamentsStore = useDepartamentsStore()
const route = useRoute()
const id = route.params.id as string

onMounted(() => {
	departamentsStore.fetchDepartament(id)
})
</script>

<template>
	<div class="page">
		<div class="form" v-if="departamentsStore.departament">
			<div class="form-title">
				Редактирование департамента "{{ departamentsStore.departament.name }}"
			</div>
			<form></form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.form {
	@include flex(column, null, null);
	&-title {
		@include h2;
	}
}
</style>
