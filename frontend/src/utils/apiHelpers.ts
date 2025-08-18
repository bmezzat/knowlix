

export const apiParsers: Record<string, (res: any, url?: string) => string[]> = {
  chuck: parseJokeApiResponse,
  github: parseGithubApiResponse,
  weather: parseWeatherApiResponse,
  cat: parseCatApiResponse,
  getSearchHistoryParser: getSearchHistoryParser,
  getMyPreferencesParser: getMyPreferencesParser,
};

function parseJokeApiResponse(res: any, url?: string): string[] {
  if ('value' in res.data) {
    return ["You get the below random joke", "- " + res.data.value, " "];
  } else if ('total' in res.data) {
    const list: string[] = [];
    const total = res.data.total;
    const parts = (url ?? "").split("?query=");
    const keyword = parts.length > 1 ? parts[1] : "";
    list.push(`You have total ${total} items for keyword "${keyword}"`);
    
    if (Array.isArray(res.data.result)) {
      res.data.result.forEach((item: any) => {
        list.push("- " + (item.value ?? JSON.stringify(item)));
      });
    }
    list.push(" ");
    return list;
  }

  return ['No relevant data found.', " "];
}

function parseGithubApiResponse(res: any, url?: string): string[] { 
  if ('total_count' in res.data) {
    const list: string[] = [];
    const total = res.data.total_count;
    const parts = (url ?? "").split("users?q=");
    const keyword = parts.length > 1 ? parts[1] : "";
    list.push(`You have total ${total} accounts for keyword "${keyword}"`);
    
    if (Array.isArray(res.data.items)) {
      res.data.items.forEach((item: any) => {
        list.push("- id: " + item.id + ", URL: " + item.url);
      });
    }
    list.push(" ");
    return list;
  }
  return ['No relevant data found.', " "];
}    

function parseWeatherApiResponse(res: any): string[] { 
  if ('current_weather' in res.data) {
    return ["- Current weather in Berlin is "+ res.data.current_weather.temperature + "°C", " "];
  }
  return ['No relevant data found.', " "];
}

function parseCatApiResponse(res: any): string[] { 
  if ('fact' in res.data) {
    return ["- "+ res.data.fact, " "];
  }
  return ['No relevant data found.', " "];
}

function getSearchHistoryParser(res: any): string[] { 
  if ('history' in res) {
    const list: string[] = [];
    list.push("History is:");
    
    if (Array.isArray(res.history)) {
      res.history.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .forEach((item: any) => {
        const date = new Date(item.createdAt);
        const formatted = date.getFullYear() + "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getDate()).padStart(2, "0") +
          " " +
          String(date.getHours()).padStart(2, "0") +
          ":" +
          String(date.getMinutes()).padStart(2, "0") +
          ":" +
          String(date.getSeconds()).padStart(2, "0");
        list.push(`- ${formatted}  -  ${item.id}:   ${item.query}`);
      });
    }
    list.push(" ");
    return list;
  }
  return ['No history found.', " "];
}    

function getMyPreferencesParser(res: any): string[] { 
  if ('preferences' in res) {
    const list: string[] = [];
    list.push(`Preferences is:"`);
    list.push(`- ${JSON.stringify(res.preferences)}`);
    list.push(" ");
    return list;
  }
  return ['No preferences found.', " "];
}  

export { 
  parseJokeApiResponse,
  parseGithubApiResponse,
  parseWeatherApiResponse,
  parseCatApiResponse,
  getSearchHistoryParser,
  getMyPreferencesParser
};