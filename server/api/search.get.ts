export default defineEventHandler(async event => {
  const query = getQuery(event);
  const config = useRuntimeConfig();

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: config.tavilyApiKey,
      query: query.q,
      max_results: 10,
      search_depth: 'basic',
    }),
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Erreur API Tavily' });
  }

  return response.json();
});
