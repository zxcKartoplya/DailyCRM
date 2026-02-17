<script lang="ts" setup></script>

<template>
	<section class="page">
		<div class="ui-loading-page">
			<div class="ui-loading-page__header">
				<Skeleton class="ui-loading-page__title" preserveAspectRatio="none">
					<rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" />
				</Skeleton>
				<Skeleton class="ui-loading-page__subtitle" preserveAspectRatio="none">
					<rect x="0" y="0" width="100%" height="100%" rx="6" ry="6" />
				</Skeleton>
			</div>

			<div class="ui-loading-page__cards">
				<Skeleton
					v-for="index in 4"
					:key="`card-${index}`"
					class="ui-loading-page__card"
					preserveAspectRatio="none"
				>
					<rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" />
				</Skeleton>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.ui-loading-page {
	width: 100%;
	@include flex(column, null, null, 24px);

	&__header {
		@include flex(column, null, null, 12px);
	}

	&__title {
		width: 400px;
		height: 28px;
	}

	&__subtitle {
		width: 250px;
		height: 16px;
	}

	&__cards {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 16px;
	}

	&__card {
		width: 100%;
		height: 140px;
	}
}
</style>
