<script lang="ts">
	import { Input } from '@sveltestrap/sveltestrap';

	type PropsType = {
		type: any;
		placeholder?: string;
		name?: string;
		leftIcon?: string;
		font?: 'roboto-regular font-14';
		display?: string;
		label?: string;
		value?: string | number;
		validator?: string;
	};

	export let props: PropsType = {} as any;
</script>

<div class="field">
	{#if props.label}
		<label class="label" for={props.name}>
			{props.display}
		</label>
	{/if}

	<p class={`control ${props.leftIcon ? 'has-icons-left' : ''}`}>
		<Input
			class={`input ${props.font ? props.font : ''}`}
			type={props.type}
			placeholder={props.placeholder}
			id={props.name}
			name={props.name}
			data-validator={props.validator || null}
			value={props.value || null}
		/>

		{#if props.leftIcon}
			<span class="icon is-small is-left">
				<i class={`fas  ${props.leftIcon}`}></i>
			</span>
		{/if}
	</p>
</div>
