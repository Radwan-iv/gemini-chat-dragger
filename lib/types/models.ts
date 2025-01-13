export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
}

export const models: Model[] = [
  {
    id: 'gemini-1.5-pro',
    name: 'NPA Ai',
    provider: 'NPA NPA AI MODEL',
    providerId: 'google'
  },
   {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash',
    provider: 'NPA NPA AI MODEL',
    providerId: 'google'
  },
    {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'NPA NPA AI MODEL',
    providerId: 'google'
  },
      {
    id: 'gemini-1.5-flash-8b',
    name: 'gemini 1.5 flash-8b',
    provider: 'NPA NPA AI MODEL',
    providerId: 'google'
  },
  {
    id: 'llama-3.1-70b-versatile',
    name: 'NPA Engine',
    provider: 'NPA Fast Engine',
    providerId: 'groq'
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'llama-3.1-8b-instant',
    provider: 'NPA Engine',
    providerId: 'groq'
  },
    {
    id: 'gemma2-9b-it',
    name: 'gemma2-9b-it',
    provider: 'NPA Engine',
    providerId: 'groq'
  },
    {
    id: 'mixtral-8x7b-32768',
    name: 'mixtral-8x7b-32768',
    provider: 'NPA Engine',
    providerId: 'groq'
  },
]

