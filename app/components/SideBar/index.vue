<script lang="ts" setup></script>

<template>
	<div class="sidebar">
		<div class="sidebar__logo">DailyCRM</div>
		<div class="sidebar__line"></div>
		<SideBarItem name="Главная" path="/login" />
	</div>
</template>

<style lang="scss" scoped>
.sidebar {
	width: rem(250);
	height: calc(100vh - #{rem(40)});
	margin: rem(20);
	border-radius: $radius-md;
	background-color: $white;
	position: fixed;
	&__logo {
		width: 100%;
		height: rem(60);
		@include flex(row, center, center);
		@include h4;
	}
	&__line {
		margin: 0 rem(10) rem(20) rem(10);
		height: 1px;
		background-color: $gray-light;
	}
}
</style>
