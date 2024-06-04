<script lang="ts">
	import type { FormControlItemType } from '../../../types/form';
	import Input from './Input.svelte';
	import InputCheck from './InputCheck.svelte';
	import TextArea from './TextArea.svelte';
	import Select from './Select.svelte';
	import Datalist from './Datalist.svelte';
	import InputDynamicOne from './InputDynamicOne.svelte';
	import Text from './Text.svelte';

	export let props: { data: FormControlItemType[] } = {} as any;
</script>

{#each props.data as control}
	{#if control.tag == 'group'}
		<div class="form-grouping card">
			<p class="form-grouping-title">{control.display}</p>
			{#each control.children as child}
				{#if child.tag == 'input'}
					{#if child.type}
						{#if ['text', 'date', 'email', 'hidden'].includes(child.type)}
							<Input
								props={{
									type: child.type,
									placeholder: child.placeholder,
									name: child.name,
									leftIcon: child.leftIcon,
									font: child.font,
									display: child.display,
									label: child.label,
									value: child.value,
									validator: child.validator
								}}
							/>
						{/if}
					{/if}
				{:else if child.tag == 'check'}
					<InputCheck props={child} />
				{:else if child.tag == 'textarea'}
					<TextArea props={child} />
				{:else if child.tag == 'select'}
					<Select props={child} />
				{:else if child.tag == 'datalist'}
					<Datalist props={child} />
				{:else if child.tag == 'input-dynamic-one'}
					<InputDynamicOne props={child} />
				{:else if child.tag == 'text'}
					<Text props={child} />
				{/if}
			{/each}
		</div>
	{:else if control.tag == 'row'}
		<div class="form-row">
			{#each control.children as child}
				{#if child.tag == 'input'}
					{#if child.type}
						{#if ['text', 'date', 'email', 'hidden'].includes(child.type)}
							<Input
								props={{
									type: child.type,
									placeholder: child.placeholder,
									name: child.name,
									leftIcon: child.leftIcon,
									font: child.font,
									display: child.display,
									label: child.label,
									value: child.value,
									validator: child.validator
								}}
							/>
						{/if}
					{/if}
				{:else if child.tag == 'check'}
					<InputCheck props={child} />
				{:else if child.tag == 'textarea'}
					<TextArea props={child} />
				{:else if child.tag == 'select'}
					<Select props={child} />
				{:else if child.tag == 'datalist'}
					<Datalist props={child} />
				{:else if child.tag == 'virtual'}
					<InputDynamicOne props={child} />
				{:else if child.tag == 'text'}
					<Text props={child} />
				{/if}
			{/each}
		</div>
	{:else if control.tag == 'input'}
		{#if control.type}
			{#if ['text', 'date', 'email', 'hidden'].includes(control.type)}
				<Input
					props={{
						type: control.type,
						placeholder: control.placeholder,
						name: control.name,
						leftIcon: control.leftIcon,
						font: control.font,
						display: control.display,
						label: control.label,
						value: control.value,
						validator: control.validator
					}}
				/>
			{/if}
		{/if}
	{:else if control.tag == 'check'}
		<InputCheck props={control} />
	{:else if control.tag == 'textarea'}
		<TextArea props={control} />
	{:else if control.tag == 'select'}
		<Select props={control} />
	{:else if control.tag == 'datalist'}
		<Datalist props={control} />
	{:else if control.tag == 'input-dynamic-one'}
		<InputDynamicOne props={control} />
	{:else if control.tag == 'text'}
		<Text props={control} />
	{/if}
{/each}

<style lang="scss">
	.form-grouping {
		// border: 1px solid gray;
		padding: 1rem 1rem 2rem;
		margin-bottom: 1rem;
		// border-radius: 10px;
		.form-grouping-title {
			margin: 1rem 0rem 2rem;
			font-weight: bold;
		}
	}

	.form-row {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 4px;
	}
</style>
