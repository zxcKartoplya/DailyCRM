<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const sideBarLinks = [
	{ name: 'Главная', path: '/', icon: 'material-symbols:dashboard-outline-rounded' },
	{
		name: 'Департаменты',
		path: '/departments',
		icon: 'material-symbols:cases-rounded',
	},
	{
		name: 'Сотрудники',
		path: '/workers',
		icon: 'material-symbols:emoji-people-rounded',
	},
	{
		name: 'Оценщики',
		path: '/reviewer',
		icon: 'material-symbols:face-retouching-natural-outline-rounded',
	},
	{
		name: 'Роли',
		path: '/role',
		icon: 'material-symbols:domino-mask',
	},
]

const { isDark, toggle } = useTheme()

const themeLabel = computed(() =>
	isDark.value ? 'Светлая тема' : 'Тёмная тема',
)
</script>

<template>
	<aside class="sidebar">
		<NuxtLink to="/" class="sidebar__logo">
			<IconLogo />
			<span class="sidebar__wordmark">DailyCRM</span>
		</NuxtLink>

		<nav class="sidebar__nav">
			<SideBarItem v-for="link in sideBarLinks" :key="link.path" v-bind="link" />
		</nav>

		<div class="sidebar__foot">
			<button
				class="sidebar__theme"
				type="button"
				:aria-label="themeLabel"
				:title="themeLabel"
				@click="toggle"
			>
				<ClientOnly>
					<Icon
						:icon="
							isDark
								? 'material-symbols:light-mode-outline-rounded'
								: 'material-symbols:dark-mode-outline-rounded'
						"
						width="18"
						height="18"
					/>
					<span class="sidebar__theme-label">{{ themeLabel }}</span>
					<template #fallback>
						<Icon
							icon="material-symbols:dark-mode-outline-rounded"
							width="18"
							height="18"
						/>
						<span class="sidebar__theme-label">Тема</span>
					</template>
				</ClientOnly>
			</button>
		</div>
	</aside>
</template>

<style lang="scss" scoped>
.sidebar {
	display: flex;
	flex-direction: column;
	width: var(--nav-w);
	height: 100vh;
	position: sticky;
	top: 0;
	padding: var(--s-4) var(--s-3);
	background-color: var(--surface-nav);
	border-right: 1px solid var(--border);

	&__logo {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		height: var(--control-h);
		padding: 0 var(--s-3);
		margin-bottom: var(--s-5);
		color: var(--text-1);
	}

	&__wordmark {
		font-size: var(--t-lg);
		font-weight: 600;
		letter-spacing: var(--tracking-tight);
	}

	&__nav {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}

	&__foot {
		margin-top: auto;
		padding-top: var(--s-3);
		border-top: 1px solid var(--border);
	}

	&__theme {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		width: 100%;
		height: var(--control-h);
		padding: 0 var(--s-3);
		border: none;
		border-radius: var(--r-md);
		background: transparent;
		color: var(--text-2);
		font-size: var(--t-md);
		font-weight: 500;
		text-align: left;
		cursor: pointer;
		transition:
			background-color var(--dur-fast) var(--ease),
			color var(--dur-fast) var(--ease);

		&:hover {
			background-color: var(--surface-hover);
			color: var(--text-1);
		}
	}
}

@media (max-width: 900px) {
	.sidebar {
		position: static;
		align-self: start;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--s-3);
		width: 100%;
		height: auto;
		border-right: none;
		border-bottom: 1px solid var(--border);

		&__logo {
			order: 1;
			margin-bottom: 0;
		}

		&__foot {
			order: 2;
			margin-top: 0;
			margin-left: auto;
			padding-top: 0;
			border-top: none;
		}

		&__nav {
			order: 3;
			width: 100%;
			flex-direction: row;
			flex-wrap: wrap;
		}

		&__theme {
			width: var(--control-h);
			justify-content: center;
			padding: 0;
		}

		&__theme-label {
			@include visually-hidden;
		}
	}
}
</style>
