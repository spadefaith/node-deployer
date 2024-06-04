<script lang="ts">
	type OptionItemType = {
		value: string;
		display: string;
		id: number;
	};
	export let props = {} as any;

	const changeHandler = (e) => {
		const target = e.target;
		const value = target.value;

		props.changeHandler && props.changeHandler(value);
		props.rawChangeHandler && props.rawChangeHandler(e);
	};
</script>

<div class="field">
	{#if props.label}
		<label for={props.name} class="label">
			{props.display}
		</label>
	{/if}
	<div class="control">
		<div class="select">
			<select
				on:change={changeHandler}
				class="form-control form-control-lg input"
				id={props.name}
				name={props.name}
				value={props.value || null}
				data-validator={props.validator || null}
				data-change={props.change || null}
			>
				{#if props.options}
					{#each props.options as option, index}
						{#if index == 0}
							<option value={option.value || null} selected={true}>
								{option.display}
							</option>
						{:else}
							<option value={option.value}>
								{option.display}
							</option>
						{/if}
					{/each}
				{/if}
			</select>
		</div>
		{#if props.icon}
			<div class="icon is-small is-left">
				<i class={`fas ${props.icon}`}></i>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.select {
		width: 100%;
	}
</style>
