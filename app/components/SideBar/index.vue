<script lang="ts" setup>
const sideBarLinks = [
	{ name: 'Главная ', path: '/', icon: 'mdi:home' },
	{
		name: 'Департаменты ',
		path: '/departments',
		icon: 'material-symbols:cases-rounded',
	},
	{
		name: 'Работники ',
		path: '/workers',
		icon: 'material-symbols:emoji-people-rounded',
	},
	{
		name: 'Обозреватели ',
		path: '/reviewer',
		icon: 'material-symbols:face-retouching-natural-outline-rounded',
	},
	{
		name: 'Роли ',
		path: '/role',
		icon: 'material-symbols:domino-mask',
	},

	{
		name: 'Добавление',
		subLink: [
			{
				name: 'Работника ',
				path: '/create/workers',
				icon: 'material-symbols:emoji-people-rounded',
			},
			{
				name: 'Департамента ',
				path: '/create/department',
				icon: 'material-symbols:cases-rounded',
			},
			{
				name: 'Обозревателя ',
				path: '/create/reviewer',
				icon: 'material-symbols:face-retouching-natural-outline-rounded',
			},
			{
				name: 'Роли ',
				path: '/create/role',
				icon: 'material-symbols:domino-mask',
			},
		],
	},
	{
		name: 'Настройки',
		path: '/setttings',
		icon: 'material-symbols:settings-outline-rounded',
	},
]
</script>

<template>
	<div class="sidebar">
		<NuxtLink to="/" class="sidebar__logo"> DailyCRM </NuxtLink>
		<div class="sidebar__line"></div>
		<SideBarItem v-for="link in sideBarLinks" v-bind="link" />
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
	@include shadow($shadow-color);
	&__logo {
		width: 100%;
		height: rem(60);
		@include flex(row, center, center, rem(16));
		@include h4;
		&--svg {
			width: rem(28);
			height: rem(28);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;

			:deep(svg) {
				width: 100%;
				height: 100%;
			}
		}
	}
	&__line {
		margin: 0 rem(10) rem(20) rem(10);
		height: 1px;
		background-color: $gray-light;
	}
}
</style>
