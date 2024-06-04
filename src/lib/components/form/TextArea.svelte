<script lang="ts">
	type PropsType = {
		font?: 'roboto-regular font-14';
		name: string;
		label?: string;
		placeholder: string;
		validator?: string;
		height?: string;
		display?: string;
	};

	export let props = {} as any;
</script>

<div class="field">
	{#if props.label}
		<label class="label" for={props.name}>
			{props.display}
		</label>
	{/if}

	<p class="control has-icons-left has-icons-right">
		<textarea
			class={`input form-control`}
			placeholder={props.placeholder}
			id={props.name}
			name={props.name}
		></textarea>
	</p>
</div>
