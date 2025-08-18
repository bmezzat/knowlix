import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

const ChatInput: React.FC<Props> = ({ input, setInput, onSend, disabled, inputRef, handleKeyDown }) => (
  <Box sx={{ borderTop: 1, borderColor: 'divider', p: 1, display: 'flex', alignItems: 'center' }}>
    <TextField
      fullWidth
      size="small"
      multiline
      maxRows={4}
      value={input}
      onChange={(e: { target: { value: string; }; }) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type a message..."
      data-testid="chat-input"
      disabled={disabled}
      inputRef={inputRef}
    />
    <IconButton color="primary" onClick={onSend} sx={{ ml: 1 }}>
      <SendIcon />
    </IconButton>
  </Box>
);

export default ChatInput;
