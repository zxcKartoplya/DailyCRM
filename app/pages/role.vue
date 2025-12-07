<script lang="ts" setup>
import { useJobStore } from '~/stores/role'

const jobStore = useJobStore()

jobStore.fetchJobs()
</script>

<template>
	<div class="page">
		{{ jobStore.jobs }}
	</div>
</template>

<style lang="scss" scoped></style>
