<script lang="ts" setup></script>

<template>
	<section class="page">
		<div class="loading">
			<Skeleton class="loading__title" preserveAspectRatio="none">
				<rect x="0" y="0" width="100%" height="100%" rx="6" ry="6" />
			</Skeleton>
			<Skeleton class="loading__subtitle" preserveAspectRatio="none">
				<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
			</Skeleton>

			<div class="loading__rows">
				<Skeleton
					v-for="index in 4"
					:key="`row-${index}`"
					class="loading__row"
					preserveAspectRatio="none"
				>
					<rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" />
				</Skeleton>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.loading {
	display: flex;
	flex-direction: column;
	width: 100%;

	&__title {
		width: min(20rem, 60%);
		height: 1.75rem;
	}

	&__subtitle {
		width: min(12rem, 40%);
		height: 1rem;
		margin-top: var(--s-3);
	}

	&__rows {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		margin-top: var(--s-6);
	}

	&__row {
		width: 100%;
		height: 4rem;
	}
}
</style>
