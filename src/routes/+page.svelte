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

<div class="min-h-screen min-w-screen flex flex-col">
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
		<main class="flex-1 flex justify-center">
			<div class="container flex flex-col justify-center items-center">
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
						const emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
						if (isEmojiToText) {
							const hasEmojis = emojiRegex.test(prompt.toString());
							console.log(hasEmojis)
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
					<div class="flex">
						<div class="card p-12">
							<header class="card-header">{isEmojiToText ? emoji : text}</header>
							<section>
								<textarea name="prompt" class="textarea h-40 w-96" bind:value={textAreaA} />
							</section>
						</div>
						<div class="card p-12">
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
			</div>
		</main>
	</div>

	<footer class="bg-slate-800 min-w-full text-center">code network</footer>
</div>
