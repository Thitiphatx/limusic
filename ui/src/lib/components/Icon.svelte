<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		icon?: Component<any>;
		altIcon?: Component<any>;
		showAlt?: boolean;
		class?: string;
		size?: number | string;
		strokeWidth?: number;
		[key: string]: any;
	}

	let {
		icon,
		altIcon,
		showAlt = false,
		class: className = '',
		size,
		strokeWidth = 2,
		...restProps
	}: Props = $props();

	let CurrentIcon = $derived(showAlt && altIcon ? altIcon : icon);
</script>

{#if CurrentIcon}
	<CurrentIcon class={className} {size} {strokeWidth} {...restProps} />
{/if}
