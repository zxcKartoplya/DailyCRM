<script lang="ts" setup>
const route = useRoute()

const hasSidebar = computed(() => {
	return route.path !== '/login' && route.path !== '/register'
})
</script>

<template>
	<div class="layout" :class="{ 'layout--no-sidebar': !hasSidebar }">
		<SideBar v-if="hasSidebar" />
		<main class="layout__content">
			<slot />
		</main>
	</div>
</template>

<style lang="scss" scoped>
.layout {
	--sidebar-offset: #{rem(270)}; // 250px width + 20px margin
	--content-padding: #{rem(20)};

	min-height: 100vh;
	display: flex;

	&__content {
		flex: 1;
		padding: var(--content-padding);
		padding-left: var(--sidebar-offset);
		box-sizing: border-box;
	}

	&--no-sidebar {
		--sidebar-offset: 0;

		.layout__content {
			padding-left: var(--content-padding);
		}
	}
}
</style>
