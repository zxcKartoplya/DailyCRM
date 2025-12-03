<script lang="ts" setup>
import { useDepartamentsStore } from '~/stores/departments'

const departamentsStore = useDepartamentsStore()

onMounted(() => {
	departamentsStore.fetchDepartaments()
})
</script>

<template>
	<div class="page">
		{{ departamentsStore.departaments }}
	</div>
</template>

<style lang="scss" scoped></style>
