import OpenAI from 'openai';
import { OPENAI_KEY } from '$env/static/private';

export type RoasterResponse = {
	msg: string;
};

const EMOJI_TO_TEXT_PROMPT = "You will be provided with emoji, and your task is to translate it into readable text sentences. Do not use any emoji in any circumstances. Come up with a result sentence to the best of your ability."
const TEXT_TO_EMOJI_PROMPT = "You will be provided with text, and your task is to translate it into emojis. Do not use any regular text in any circumstances. Do your best with emojis only."

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
    
		const prompt = formData.get('prompt');
    const isEmojiToText = formData.get('isEmojiToText')
    
    console.log(formData);
    debugger;
		if (!prompt || !isEmojiToText) return;
    

		const openai = new OpenAI({
			apiKey: OPENAI_KEY
		});

    const content = isEmojiToText === "true" ? EMOJI_TO_TEXT_PROMPT : TEXT_TO_EMOJI_PROMPT

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: content
				},
				{ role: 'user', content: prompt.toString() }
			],
			model: 'gpt-3.5-turbo'
		});

		console.log(completion.choices);

		return {
			msg: completion.choices[completion.choices.length - 1].message.content
		};
	}
};
