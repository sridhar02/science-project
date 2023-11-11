import OpenAI from 'openai';

export default {
	async fetch(request, env, ctx) {
		let response;

		const ogURl = request.url;
		const url = new URL(ogURl);
		const key = url.pathname.slice(1);

		console.log({ key });

		if (request.method === 'OPTIONS') {
			response = handleOptions(request);
		} else if (request.method === 'PUT') {
			const openai = new OpenAI({
				apiKey: env.OPENAI_API_KEY,
			});
			try {
				await env.MY_BUCKET.put(key, request.body);
				const responseAI = await handleOpenAIResponse(ogURl, openai);
				console.log({ responseAI });
				response = new Response(JSON.stringify(responseAI));
			} catch (error) {
				console.log({ error });
				response = new Response(JSON.stringify(error));
			}
		} else if (request.method === 'GET') {
			const object = await env.MY_BUCKET.get(key);

			if (object === null) {
				return new Response('Object Not Found', { status: 404 });
			}

			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set('etag', object.httpEtag);

			return new Response(object.body, {
				headers,
			});
		}

		// switch (request.method) {
		// 	case 'OPTIONS':
		// 		handleOptions(request);
		// 	case 'PUT':
		// 		try {
		// 			await env.MY_BUCKET.put(key, request.body);
		// 			response = new Response(`Put ${key} successfully!`);
		// 			response.headers.set('Access-Control-Allow-Origin', '*');
		// 			response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		// 			return response;

		// 			// return new Response(JSON.stringify(response));
		// 			// const response = await handleOpenAIResponse({ key, url }, openai);
		// 		} catch (e) {
		// 			console.log(e);
		// 			response = new Response(e);
		// 			response.headers.set('Access-Control-Allow-Origin', '*');
		// 			response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		// 			return response;
		// 		}

		// 	case 'GET':
		// 		const object = await env.MY_BUCKET.get(key);

		// 		if (object === null) {
		// 			return new Response('Object Not Found', { status: 404 });
		// 		}

		// 		const headers = new Headers();
		// 		object.writeHttpMetadata(headers);
		// 		headers.set('etag', object.httpEtag);

		// 		return new Response(object.body, {
		// 			headers,
		// 		});
		// 	case 'DELETE':
		// 		//   await env.MY_BUCKET.delete(key);
		// 		response = new Response('Deleted!');

		// 	default:
		// 		response = new Response('Method Not Allowed', {
		// 			status: 405,
		// 			headers: {
		// 				Allow: 'PUT, GET, DELETE',
		// 			},
		// 		});
		// }

		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		return response;
	},
};

const handleOpenAIResponse = async (imageURL, openai) => {
	console.log({ imageURL });
	const chatCompletion = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'What’s in this image?',
					},
					{
						type: 'image_url',
						image_url: {
							url: imageURL,
						},
					},
				],
			},
		],
		max_tokens: 100,
	});

	const response = chatCompletion.choices[0].message;

	return response;
};

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400',
};

function handleOptions(request) {
	// Make sure the necessary headers are present
	// for this to be a valid pre-flight request
	let headers = request.headers;
	if (
		headers.get('Origin') !== null &&
		headers.get('Access-Control-Request-Method') !== null &&
		headers.get('Access-Control-Request-Headers') !== null
	) {
		// Handle CORS pre-flight request.
		// If you want to check or reject the requested method + headers
		// you can do that here.
		let respHeaders = {
			...corsHeaders,
			// Allow all future content Request headers to go back to browser
			// such as Authorization (Bearer) or X-Client-Name-Version
			'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
		};
		return new Response(null, {
			headers: respHeaders,
		});
	} else {
		// Handle standard OPTIONS request.
		// If you want to allow other HTTP Methods, you can do that here.
		return new Response(null, {
			headers: {
				Allow: 'GET, HEAD, POST, PUT, OPTIONS',
			},
		});
	}
}
