import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { availableApis } from '@/config/api';


export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface PanelMessages {
  [key: string]: string[];
}

interface ChatState {
  messages: ChatMessage[];
  panelMessages: PanelMessages;
  useWebsocket: boolean;
  isTyping: boolean;
  searchText: string;
}

const initialState: ChatState = {
  messages: [],
  panelMessages: availableApis.reduce((acc, api) => {
    acc[api.id] = [`Commands: ${api.commands.join(", ")}`, " "];
    return acc;
  }, {} as Record<string, string[]>),
  useWebsocket: false,
  isTyping: false,
  searchText: "",
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    addPanelMessage: (state, action: PayloadAction<{ key: keyof PanelMessages; messages: string[] }>) => {
      state.panelMessages[action.payload.key] = [
        ...state.panelMessages[action.payload.key],
        ...action.payload.messages,
      ]
    },
    setUseWebsocket: (state, action: PayloadAction<boolean>) => {
      state.useWebsocket = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = initialState.messages;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    }
  },
});

export const { 
  addMessage, 
  addPanelMessage, 
  setUseWebsocket, 
  setIsTyping, 
  clearMessages, 
  setSearchText 
} = chatSlice.actions;

export default chatSlice.reducer;
