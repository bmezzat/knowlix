import { socket, ApiResponse, CommandStatus, TypingIndicator } from ".";
import { addMessage, setIsTyping } from "@/store/chatSlice";
import { v4 as uuidv4 } from 'uuid';
import store from "../store";

export const sendChatCommand = (command: string) => {
  socket?.emit('chat_command', { command, timestamp: Date.now() });
};

export const attachEventListeners = () => {
  socket?.on('api_response', (data: ApiResponse) => {
    store.dispatch(
      addMessage({
        id: uuidv4(),
        text: JSON.stringify(data.result),
        sender: 'bot',
      })
    );
  });
  socket?.on('command_status', (status: CommandStatus) => {
    if (status?.status === 'error') {
      store.dispatch(
        addMessage({
          id: uuidv4(),
          text: JSON.stringify(status?.error),
          sender: 'bot',
        })
      )  
    }
  });
  socket?.on('typing_indicator', (typing: TypingIndicator) => {
    store.dispatch(setIsTyping(typing.isProcessing));
  });
}

