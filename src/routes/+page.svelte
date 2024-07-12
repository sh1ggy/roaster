<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<script lang="ts">
	import type { RoasterResponse } from './+page.server';

	export let form: RoasterResponse;
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">crack!</h1>
		<form method="POST">
			<input type="text" name="prompt" class="input input-primary input-bordered w-full max-w-xs" />
			<p>{!!form.msg ? form.msg : ''}</p>
		</form>
	</div>
</div>
