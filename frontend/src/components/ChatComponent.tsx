import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addMessage, addPanelMessage, clearMessages } from '../store/chatSlice';
import { v4 as uuidv4 } from 'uuid';
import { availableApis } from '@/config/api';
import { apiParsers } from '@/utils/apiHelpers';
import axios from 'axios';
import { Paper } from '@mui/material';
import { sendChatCommand } from '@/sockets/chat';
import { useDeleteSearch } from '@/hooks/mutations/useDeleteSearch';
import { useSaveUserPrefs } from '@/hooks/mutations/useSaveUserPrefs';
import { useSearchHistory } from '@/hooks/queries/useSearchHistory';
import { useUserPrefs } from '@/hooks/queries/useUserPrefs';
import { useSaveSearch } from '@/hooks/mutations/useSaveSearch';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { parseUserCommand } from '@/utils/chatHelpers';


const ChatComponent: React.FC = () => {
  const dispatch = useDispatch();
  const {messages, useWebsocket, isTyping} = useSelector((state: RootState) => state.chat);
  const activeApis = useSelector((state: RootState) => state.api).activeApis;

  const { data: searchHistory, isLoading: isSearchHistoryLoading  } = useSearchHistory();
  const { data: userPrefs, isLoading: isUserPrefsLoading } = useUserPrefs();

  const deleteSearchMutation = useDeleteSearch();
  const saveUserPrefsMutation = useSaveUserPrefs();
  const saveSearchMutation = useSaveSearch();
  const isDeleteSearchLoading = deleteSearchMutation.status === 'pending';
  const isSaveUserPrefsLoading = saveUserPrefsMutation.status === 'pending';
  const isSaveSearchLoading = saveSearchMutation.status === 'pending';

  const anyIsLoading =
    isSearchHistoryLoading || 
    isUserPrefsLoading || 
    isDeleteSearchLoading || 
    isSaveUserPrefsLoading || 
    isSaveSearchLoading;

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null); 

  const CallPrivateEndpoint = (commandType: string, searchQuery: string) => {
    let replyList = [""];
    if (commandType === "getSearchHistory") {
      replyList = apiParsers["getSearchHistoryParser"](searchHistory);
    } else if (commandType === "getMyPreferences") {
      replyList = apiParsers["getMyPreferencesParser"](userPrefs);
    } else if (commandType === "deleteSearch") {
      deleteSearchMutation.mutate(searchQuery, {
        onSuccess: (data: { error: string; }) => {
          replyList = data.error ? [data.error, " "] : ["Search deleted successfully", " "];
        },
      });
    } else if (commandType === "savePreferences") {
      saveUserPrefsMutation.mutate({ prefs: searchQuery }, {
        onSuccess: (data: { error: string; }) => {
          replyList = data.error ? [data.error, " "] : ["Preference Saved successfully", " "];
        },
      });
    }
    dispatch(addMessage({
      id: uuidv4(),
      text: `Your request is processed, please check "Backend" panel`,
      sender: 'bot',
    }));
    dispatch(addPanelMessage({
      key: "backend",
      messages: replyList,
    }));
  }

  const callEndpoint = async (url: string, apiName: string, apiId: string) => {
    try {
      const res = await axios.get(url);
      
      dispatch(addMessage({
        id: uuidv4(),
        text: `Your request is processed, please check "${apiName}" panel`,
        sender: 'bot',
      }));

      const parser = apiParsers[apiId];
      const replyList = parser ? 
        parser(res, url) 
        : 
        [typeof res.data === 'object' ? JSON.stringify(res.data, null, 2) : String(res.data), " "];

      dispatch(addPanelMessage({
        key: apiId,
        messages: replyList,
      }));
    } catch (err: any) {
      dispatch(addMessage({
        id: uuidv4(),
        text: `Error fetching data: ${err.message}`,
        sender: 'bot',
      }));
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    dispatch(
      addMessage({
        id: uuidv4(),
        text: userMessage,
        sender: 'user',
      })
    );
    setInput('');

    await saveSearchMutation.mutateAsync(userMessage);
    if (userMessage === "clear") {
      dispatch(clearMessages());
      return
    }

    if (useWebsocket) {
      sendChatCommand(userMessage);
      return
    }

    const { commandType, apiId, searchQuery } = parseUserCommand(userMessage);
    if ((commandType === 'deleteSearch' || commandType === 'savePreferences') && !searchQuery) {
      return dispatch(addMessage({
        id: uuidv4(),
        text: `No ${commandType === 'deleteSearch' ? 'ID' : 'preference'} provided.`,
        sender: 'bot',
      }));
    }

    const apiDef = availableApis.find(a => a.id.toLowerCase() === apiId);
    if (!apiDef) {
      return dispatch(addMessage({
        id: uuidv4(),
        text: `No API configured for "${apiId}".`,
        sender: 'bot',
      }));
    }

    if (!activeApis.includes(apiId)) {
      return dispatch(addMessage({
        id: uuidv4(),
        text: `API "${apiId}" is not active.`,
        sender: 'bot',
      }));
    }

    if (apiId === "backend") {
      CallPrivateEndpoint(commandType, searchQuery);
    } else if (commandType === 'get') {
      if (!apiDef.endpoint.get) {
        return dispatch(addMessage({
          id: uuidv4(),
          text: `GET command not available for API "${apiId}".`,
          sender: 'bot',
        }));
      }
      await callEndpoint(apiDef.endpoint.get, apiDef.name, apiId);
    } else if (commandType === 'search') {
      if (!apiDef.endpoint.search) {
        return dispatch(addMessage({
          id: uuidv4(),
          text: `SEARCH command not available for API "${apiId}".`,
          sender: 'bot',
        }));
      }
      if (!searchQuery) {
        return dispatch(addMessage({
          id: uuidv4(),
          text: `Please provide a search query for API "${apiId}".`,
          sender: 'bot',
        }));
      }
      await callEndpoint(apiDef.endpoint.search + encodeURIComponent(searchQuery), apiDef.name, apiId);
    } else {
      return dispatch(addMessage({
        id: uuidv4(),
        text: `Unknown command "${commandType}". Use "get" or "search".`,
        sender: 'bot',
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend().then(() => {
        // focus after the state updates
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
    }
  };

  return ( 
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '200px',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        disabled={anyIsLoading}
        inputRef={inputRef}
        handleKeyDown={handleKeyDown}
      />
    </Paper>
  );
}

export default ChatComponent;