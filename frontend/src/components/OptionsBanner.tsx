import { Box, Switch, TextField, Typography } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { connectSocket, disconnectSocket } from '../sockets';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setSearchText, setUseWebsocket } from '@/store/chatSlice';
import { RootState } from '@/store';
import { useEffect, useState } from 'react';

const OptionsBanner: React.FC = () => {
  const {useWebsocket, searchText} = useSelector((state: RootState) => state.chat);
  const [inputValue, setInputValue] = useState(searchText);
  const dispatch = useDispatch();
  const {accessToken} = useAuth();

  const [debouncedInput] = useDebounce(inputValue, 600);

  useEffect(() => {
    dispatch(setSearchText(debouncedInput));
  }, [debouncedInput, dispatch]);

  const handleToggle = async () => {
    if (!useWebsocket) {
      if (!accessToken) {
        dispatch(addMessage({
          id: uuidv4(),
          text: `Cannot connect to websocket: no access token`,
          sender: 'bot',
        }));
        return;
      }
      await connectSocket(accessToken);
      dispatch(setUseWebsocket(true));
      dispatch(addMessage({
        id: uuidv4(),
        text: `Chatmode turned on`,
        sender: 'bot',
      }));
    } else {
        dispatch(addMessage({
        id: uuidv4(),
        text: `Chatmode turned off`,
        sender: 'bot',
      }));
      disconnectSocket();
      dispatch(setUseWebsocket(false));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'lavender',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
        <Typography variant="body2">Search:</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Type to search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          sx={{ 
            width: 150, 
            '& .MuiInputBase-input': {
              backgroundColor: 'white',
              borderRadius: 1,
              px: 1,
            },
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">WebSocket Connection</Typography>
        <Switch checked={useWebsocket} onChange={handleToggle} />
      </Box>
    </Box>
  );
};

export default OptionsBanner;
