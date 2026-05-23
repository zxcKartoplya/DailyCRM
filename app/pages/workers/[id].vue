<script lang="ts" setup>
import { useWorkerStore } from '~/stores/workers'

const route = useRoute()
const workerId = route.params.id as string
const workersStore = useWorkerStore()
const { worker, isLoading } = storeToRefs(workersStore)

onMounted(() => {
	workersStore.getWorker(workerId)
})
</script>

<template>
	<div class="page-stage">
		<Transition name="fade">
			<SkeletonPage v-if="isLoading" />
			<section v-else-if="worker" class="page">
				<div class="header">
					<div class="header__main">
						<div class="header__title">Профиль сотрудника</div>
						<div class="header__name">{{ worker.name }}</div>
						<div class="header__meta">
							<span>ID: {{ worker.id }}</span>
							<span v-if="worker.department_name">Департамент: {{ worker.department_name }}</span>
						</div>
					</div>
					<div class="header__aside">
						<div class="badge">
							<div class="badge__label">Статус</div>
							<div class="badge__value">{{ worker.status }}</div>
						</div>
						<div class="badge">
							<div class="badge__label">Email</div>
							<div class="badge__value">{{ worker.email }}</div>
						</div>
					</div>
				</div>
			</section>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.page-stage {
	position: relative;
	min-height: rem(420);
}

.page {
	padding: rem(20);
	@include flex(column, null, null, rem(20));
}

.header {
	padding: rem(20);
	border-radius: rem(16);
	background: linear-gradient(120deg, #f7f8fc 0%, #eef1f8 100%);
	@include flex(row, space-between, flex-start, rem(24));

	&__title {
		font-size: rem(14);
		color: #6b7280;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	&__name {
		margin-top: rem(6);
		font-size: rem(28);
		font-weight: 700;
	}

	&__meta {
		margin-top: rem(10);
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 1fr));
		gap: rem(8);
		color: #374151;
	}

	&__aside {
		@include flex(column, null, null, rem(12));
	}
}

.badge {
	padding: rem(12) rem(14);
	border-radius: rem(12);
	background: #ffffff;
	box-shadow: 0 rem(6) rem(20) rgba(15, 23, 42, 0.08);

	&__label {
		font-size: rem(12);
		color: #6b7280;
	}

	&__value {
		margin-top: rem(6);
		font-size: rem(16);
		font-weight: 600;
		color: #111827;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}
.fade-leave-active {
	position: absolute;
	inset: 0;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
