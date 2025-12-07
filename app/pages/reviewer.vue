<script lang="ts" setup>
import { useReviewersStore } from '~/stores/reviewers'

const reviewersStore = useReviewersStore()

reviewersStore.fetchReviewers()
</script>

<template>
	<div class="page">
		{{ reviewersStore.reviewers }}
	</div>
</template>

<style lang="scss" scoped></style>
