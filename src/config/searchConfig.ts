// Default configuration that can be safely committed
export const defaultConfig = {
  searchApi: 'tavily' as 'tavily' | 'searxng' | 'exa',
  searxngDefaults: {
    port: 8080,
    bindAddress: '0.0.0.0',
    imageProxy: true,
    limiter: false,
    defaultDepth: 'advanced' as 'basic' | 'advanced',
    maxResults: 100,
    engines: ['google', 'bing', 'duckduckgo', 'Scopus', 'sciencedirect', 'JSTOR', 'PubMed', 'arXiv', 'mwmbl', 'startpage', 'stract', 'swisscows', 'qwant'],
    timeRange: 'None' as 'day' | 'week' | 'month' | 'year' | 'None',
    safeSearch: 2
  }
};

// Function to get API keys from localStorage
export const getApiKeys = () => ({
  serperApiKey: localStorage.getItem('SERPER_API_KEY'),
  tavilyApiKey: localStorage.getItem('TAVILY_API_KEY'),
  upstashRedisUrl: localStorage.getItem('UPSTASH_REDIS_REST_URL'),
  upstashRedisToken: localStorage.getItem('UPSTASH_REDIS_REST_TOKEN'),
  searxngApiUrl: localStorage.getItem('SEARXNG_API_URL'),
  searxngSecret: localStorage.getItem('SEARXNG_SECRET')
});

// Function to set API keys in localStorage
export const setApiKeys = (keys: {
  serperApiKey?: string;
  tavilyApiKey?: string;
  upstashRedisUrl?: string;
  upstashRedisToken?: string;
  searxngApiUrl?: string;
  searxngSecret?: string;
}) => {
  if (keys.serperApiKey) localStorage.setItem('SERPER_API_KEY', keys.serperApiKey);
  if (keys.tavilyApiKey) localStorage.setItem('TAVILY_API_KEY', keys.tavilyApiKey);
  if (keys.upstashRedisUrl) localStorage.setItem('UPSTASH_REDIS_REST_URL', keys.upstashRedisUrl);
  if (keys.upstashRedisToken) localStorage.setItem('UPSTASH_REDIS_REST_TOKEN', keys.upstashRedisToken);
  if (keys.searxngApiUrl) localStorage.setItem('SEARXNG_API_URL', keys.searxngApiUrl);
  if (keys.searxngSecret) localStorage.setItem('SEARXNG_SECRET', keys.searxngSecret);
};

// Initialize with provided values
export const initializeConfig = () => {
  const keys = getApiKeys();
  if (!keys.serperApiKey) {
    setApiKeys({
      serperApiKey: '206a265a87f404e68323df4deb3dc054e4af8866',
      tavilyApiKey: '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',
      upstashRedisUrl: 'https://great-earwig-41525.upstash.io',
      upstashRedisToken: 'AaI1AAIjcDE0NWZhZWQyMGRiMGQ0MjI1ODA0N2M1ZTRiOGZiMWViNnAxMA',
      searxngApiUrl: 'http://localhost:8080',
      searxngSecret: '9SQL/svzWkDIE39jboaec4dGw5v3CnPw9mdwSggtp6o='
    });
  }
};