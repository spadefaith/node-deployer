<script lang="ts">
	import { onMount } from 'svelte';
	import { Input, Button } from '@sveltestrap/sveltestrap';

	$: datas = [];
	$: key = '';
	$: value = '';
	export let props = {} as any;

	onMount(() => {
		console.log(11, props.options);
		if (props?.options?.length) {
			datas = props.options;
		}
	});

	const deleteHandler = (o) => {
		return (e) => {
			const id = o.id;

			datas = datas.reduce((accu, item, index) => {
				if (id != index) {
					accu.push(item);
				}

				return accu;
			}, []);
		};
	};

	const addHandler = (e) => {
		// const data = getFormData(e.target);

		datas = [...datas, { key, value }];

		e.target.reset();
	};
</script>

<div class="input-dynamic-one-container">
	<div class="input-dynamic-one-content">
		{#each datas as data, index}
			<div class="kv-list">
				<div class="kv-left">
					<div>
						<Input name={`key_${index}`} type="text" value={data.key || data.prop_key} />
					</div>
					<div>
						<Input name={`value_${index}`} type="text" value={data.value || data.prop_value} />
					</div>
				</div>
				<div class="kv-right">
					<Button
						color="danger"
						type="button"
						form="kv-form"
						on:click={deleteHandler({ id: index })}>Remove</Button
					>
				</div>
			</div>
		{/each}
		<div class="kv-form">
			<form id="kv-form" name="kv-form" class="kv-left" on:submit|preventDefault={addHandler}>
				<div>
					<Input type="text" placeholder="key" bind:value={key} />
				</div>
				<div>
					<Input placeholder="value" type="text" bind:value />
				</div>
			</form>
			<div class="kv-right">
				<Button color="success" type="submit" form="kv-form">Add</Button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.input-dynamic-one-container {
		.kv-list {
			display: grid;
			grid-auto-flow: column;
			grid-template-columns: 1fr 100px;
			grid-gap: 4px;
			// justify-items: center;
			margin-top: 4px;

			.kv-right {
				button {
					width: 100%;
				}
			}

			.kv-left {
				display: grid;
				grid-auto-flow: column;
				grid-gap: 4px;
				align-content: center;
			}
		}
		.kv-form {
			display: grid;
			grid-auto-flow: column;
			grid-template-columns: 1fr 100px;
			grid-gap: 4px;
			// justify-items: center;
			margin-top: 4px;

			.kv-right {
				button {
					width: 100%;
				}
			}

			.kv-left {
				display: grid;
				grid-auto-flow: column;
				grid-gap: 4px;
				align-content: center;
			}
		}
	}
</style>
