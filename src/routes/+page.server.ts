import OpenAI from 'openai';
import { OPENAI_KEY } from '$env/static/private';

export type RoasterResponse = {
	msg: string;
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const prompt = formData.get('prompt');
		if (!prompt) return;

		const openai = new OpenAI({
			apiKey: OPENAI_KEY
		});

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You will be provided with emoji, and your task is to translate it into readable text sentences. Do not use any emoji. Come up with a result sentence to the best of your ability.'
				},
				{ role: 'user', content: prompt.toString() }
			],
			model: 'gpt-3.5-turbo'
		});

		console.log(completion.choices[completion.choices.length - 1].message.content);

		return {
			msg: completion.choices[completion.choices.length - 1].message.content
		};
	}
};
