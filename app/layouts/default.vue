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
	display: grid;
	grid-template-columns: var(--nav-w) minmax(0, 1fr);
	min-height: 100vh;

	&__content {
		min-width: 0;
	}

	&--no-sidebar {
		grid-template-columns: minmax(0, 1fr);
	}
}

@media (max-width: 900px) {
	.layout {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>
