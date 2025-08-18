export const parseUserCommand = (userMessage: string) => {
  const parts = userMessage.trim().split(/\s+/);
  let commandType = parts[0]?.toLowerCase();
  let apiId = parts[1]?.toLowerCase();
  let searchQuery = parts.slice(2).join(' ');

  const usrMessage = userMessage.toLowerCase();

  if (usrMessage === "get search history") {
    apiId = "backend";
    commandType = "getSearchHistory";
  } else if (usrMessage === 'get my preferences') {
    apiId = "backend";
    commandType = "getMyPreferences";
  } else if (userMessage.startsWith('delete search')) {
    apiId = "backend";
    commandType = "deleteSearch";
    searchQuery = parts[2];
  } else if (userMessage.startsWith("save my preferences ")) {
    apiId = "backend";
    commandType = "savePreferences";
    searchQuery = parts.slice(3).join(' ');
  }

  return { commandType, apiId, searchQuery };
};