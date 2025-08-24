import { deleteSearchById, listSearches } from "../db/searches";
import { getPrefs, setPrefs } from "../db/user";

export async function processCommand(command: string, userId: any) {
  const usrMessage = command.toLowerCase();
  const parts = usrMessage.trim().split(/\s+/);
  let searchQuery;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  if (usrMessage === "get search history") {
    await sleep(800);
    const history = listSearches(userId);
    const list: string[] = [];
    history.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
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
    return list.join('\n');
  } else if (usrMessage === 'get my preferences') {
    await sleep(800);
    const preferences = getPrefs(userId);
    const formattedPrefs = JSON.stringify(preferences, null, 2);
    console.log(formattedPrefs)
    return `Preferences is:\n${formattedPrefs}`;
  } else if (usrMessage.startsWith('delete search')) {
    await sleep(400);
    searchQuery = parts[2];
    if (!searchQuery) {
      return "No ID provided, Please provide a valid ID to delete";
    }
    deleteSearchById(userId, searchQuery);
    return "Search deleted successfully";
  } else if (usrMessage.startsWith("save my preferences")) {
    await sleep(700);
    searchQuery = parts[3];
    if (!searchQuery) {
      return {status: "error", message: "No Preference provided"};
    }
    setPrefs(userId, searchQuery);
    return "Preference Saved successfully"; 	
  }
  return 'Not a valid command'
}
