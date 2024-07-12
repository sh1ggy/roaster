<script lang="ts">
	import { enhance } from '$app/forms';

	import type { RoasterResponse } from './+page.server';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	export let form: RoasterResponse;

	let isEmojiToText: boolean = false;
	const emoji = 'emoji 😹';
	const text = 'english 🗣️';
	let textAreaA = '';
	let textAreaB = '';

	$: {
		if (form) {
			textAreaB = form.msg;
		}
	}

	const handleSwap = () => {
		isEmojiToText = !isEmojiToText;
		let temp = textAreaA;
		textAreaA = textAreaB;
		textAreaB = temp;
	};

	const handleClear = () => {
		textAreaA = '';
		textAreaB = '';
	};

	const toastStore = getToastStore();
</script>

<div class="min-h-screen m-0 min-w-screen w-screen h-screen flex flex-col">
	<AppBar
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
		background="bg-slate-800"
	>
		<svelte:fragment slot="lead">😹</svelte:fragment>
		emoji translator
		<svelte:fragment slot="trail"
			><a href="https://github.com/sh1ggy/roaster">github</a></svelte:fragment
		>
	</AppBar>
	<div class="flex-1 flex flex-col items-center">
		<main class="flex-1 container flex flex-col justify-center items-center">
				<button on:click={handleSwap} type="button" class="btn-icon variant-filled-primary"
					>⇄</button
				>

				<form
					method="POST"
					id="prompt-form"
					use:enhance={({ formData }) => {
						// early return
						const prompt = formData.get('prompt');
						if (!prompt) {
							toastStore.trigger({ message: 'nothing entered....' });
							return async ({ update }) => {
								update({ reset: false });
							};
						}
						const emojiRegex = /\p{Emoji}/u
						if (isEmojiToText) {
							const hasEmojis = emojiRegex.test(prompt.toString())
							if (!hasEmojis) {
								toastStore.trigger({ message: 'uh, emojis only please...' })
								return async ({ update }) => {
									update({ reset: false });
								};
							};
						}
						formData.set('isEmojiToText', isEmojiToText.toString());
						return async ({ update }) => {
							update({ reset: false });
						};
					}}
					class="flex flex-col"
				>
					<div class="flex flex-col lg:flex-row">
						<div class="card lg:p-12">
							<header class="card-header">{isEmojiToText ? emoji : text}</header>
							<section>
								<textarea name="prompt" class="textarea h-40 w-96" bind:value={textAreaA} />
							</section>
						</div>
						<div class="card lg:p-12">
							<header class="card-header">{isEmojiToText ? text : emoji}</header>
							<section>
								<textarea readonly class="textarea h-40 w-96" bind:value={textAreaB} />
							</section>
						</div>
					</div>
					<button type="submit" form="prompt-form" class="btn variant-filled-primary w-full"
						>translate</button
					>
				</form>
		</main>
	</div>

	<footer class="bg-slate-800 min-w-full text-center">code network</footer>
</div>
