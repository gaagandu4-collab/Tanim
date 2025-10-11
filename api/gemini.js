// File: /api/gemini.js
// This single file handles all three functions: chat, summarize, and tts.

export default async function handler(request, response) {
  // 1. Shudhumatro POST request grohon kora hobe
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Request body theke action (kajer dhoron) and payload (asol data) alada kora
  const { action, payload } = request.body;

  // 3. Environment Variable theke apnar gopon API key load kora
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'API key not configured.' });
  }

  let apiUrl = '';

  // 4. Action er upor vitti kore shothik Google API URL nirdharon kora
  switch (action) {
    case 'chat':
    case 'summarize':
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      break;
    case 'tts':
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
      break;
    default:
      return response.status(400).json({ error: 'Invalid action specified.' });
  }

  try {
    // 5. Nirdharito URL e Google API ke call kora
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Payload e shudhu matro user er deya data pathano hocche
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("API Error Body:", errorBody);
        throw new Error(`API Error: ${apiResponse.status}`);
    }

    const result = await apiResponse.json();
    
    // 6. Fola-fol website e ferot pathano
    response.status(200).json(result);

  } catch (error) {
    console.error(`[${action.toUpperCase()}] Function Error:`, error);
    response.status(500).json({ error: error.message });
  }
}
