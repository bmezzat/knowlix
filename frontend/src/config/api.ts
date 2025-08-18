export interface ApiDefinition {
  id: string;
  name: string;
  endpoint: Record<string, string>;
  requiresAuth: boolean;
  commands: string[];
}

export const availableApis: ApiDefinition[] = [
  {
    id: "cat",
    name: "Cat Facts API",
    endpoint: {
        get: "https://catfact.ninja/fact"
    },
    requiresAuth: false,
    commands: ["get cat fact"],
  },
  {
    id: "chuck",
    name: "Chuck Norris Jokes API",
    endpoint: {
        get: "https://api.chucknorris.io/jokes/random",
        search: "https://api.chucknorris.io/jokes/search?query=",
    },
    requiresAuth: false,
    commands: ["get chuck joke", "search chuck kick"],
  },
//   Below endpoint is down
//   {
//     id: "bored",
//     name: "Bored API",
//     endpoint: {
//         get: "https://www.boredapi.com/api/activity/"
//     },
//     requiresAuth: false,
//     commands: ["get bored activity"],
//   },
  {
    id: "github",
    name: "GitHub Users Search API",
    endpoint: {
        search: "https://api.github.com/search/users?q="
    },
    requiresAuth: false,
    commands: ["search github john"],
  },
  {
    id: "weather",
    name: "Weather API (Berlin)",
    endpoint: {
        get: "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"
    },
    requiresAuth: false,
    commands: ["get weather Berlin"],
  },
  {
    id: "backend",
    name: "My Backend API",
    endpoint: {
        get: "/api/protected-data"
    },
    requiresAuth: true,
    commands: ["get my preferences", "save search 'weather Tokyo'", "get search history"],
  }
];