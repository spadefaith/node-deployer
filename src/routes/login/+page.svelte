<script lang="ts">
	import { Button, Container, Input, InputGroup, Label } from '@sveltestrap/sveltestrap';
	import type { ActionData, PageData } from './$types.js';

	export let data: PageData;

	export let form: ActionData;
</script>

<Container>
	<div class="form-container">
		<form method="POST" action="?/login">
			<h2>Login</h2>

			<Label for="username">Username</Label>
			<InputGroup>
				<Input type="text" class="input" id="username" name="username" />
			</InputGroup>

			<Label for="username">Password</Label>
			<InputGroup>
				<Input type="password" class="input" id="password" name="password" />
			</InputGroup>

			<div class="my-3">
				<Button type="submit" color="success">Submit</Button>
			</div>
		</form>
	</div>
</Container>

<style lang="scss">
	.form-container {
		display: grid;
		justify-content: center;
		margin-top: 3rem;

		form {
			width: 300px;
		}
	}
</style>
