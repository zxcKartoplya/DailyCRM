<script lang="ts" setup>
interface Props {
	width?: number | string
	height?: number | string
	viewBox?: string
	preserveAspectRatio?: string
	animate?: boolean
	speed?: number
	primaryColor?: string
	secondaryColor?: string
	primaryOpacity?: number
	secondaryOpacity?: number
}

const {
	width = 400,
	height = 130,
	viewBox,
	preserveAspectRatio = 'xMinYMid slice',
	animate = true,
	speed = 2,
	primaryColor = '#f9f9f9',
	secondaryColor = '#ecebeb',
	primaryOpacity = 1,
	secondaryOpacity = 1,
} = defineProps<Props>()

const uid = useId()
const idClip = `${uid}-clip`
const idGradient = `${uid}-gradient`

const computedViewBox = computed<string>(
	() => viewBox ?? `0 0 ${width} ${height}`,
)
</script>

<template>
	<svg
		:width="width"
		:height="height"
		:viewBox="preserveAspectRatio === 'none' ? null : computedViewBox"
		:preserveAspectRatio="preserveAspectRatio"
	>
		<rect
			:style="{ fill: `url(#${idGradient})` }"
			:clip-path="`url(#${idClip})`"
			x="0"
			y="0"
			width="100%"
			height="100%"
		/>

		<defs>
			<clipPath :id="idClip">
				<slot />
			</clipPath>

			<linearGradient :id="idGradient" gradientTransform="rotate(25) scale(2)">
				<stop
					offset="0%"
					:stop-color="primaryColor"
					:stop-opacity="primaryOpacity"
				>
					<animate
						v-if="animate"
						attributeName="offset"
						values="-2; 1"
						:dur="`${speed}s`"
						repeatCount="indefinite"
					/>
				</stop>
				<stop
					offset="50%"
					:stop-color="secondaryColor"
					:stop-opacity="secondaryOpacity"
				>
					<animate
						v-if="animate"
						attributeName="offset"
						values="-1.5; 1.5"
						:dur="`${speed}s`"
						repeatCount="indefinite"
					/>
				</stop>
				<stop
					offset="100%"
					:stop-color="primaryColor"
					:stop-opacity="primaryOpacity"
				>
					<animate
						v-if="animate"
						attributeName="offset"
						values="-1; 2"
						:dur="`${speed}s`"
						repeatCount="indefinite"
					/>
				</stop>
			</linearGradient>
		</defs>
	</svg>
</template>
