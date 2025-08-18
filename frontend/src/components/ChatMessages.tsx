import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ChatMessage } from '@/store/chatSlice';

interface Props {
  messages: ChatMessage[];
  isTyping: boolean;
}

const ChatMessages: React.FC<Props> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, display: 'flex', flexDirection: 'column' }}>
      {messages.map((msg) => (
        <Box
          key={msg.id}
          sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}
        >
          <Paper
            sx={{
              p: 1,
              maxWidth: '70%',
              bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
              color: msg.sender === 'user' ? 'white' : 'black',
            }}
          >
            <Typography variant="body2">
              {msg.text.replace(/\\"/g, '"').split('\\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
          </Paper>
        </Box>
      ))}
      {isTyping && (
        <Box sx={{ px: 2, py: 1, bottom: 0, position: 'sticky' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            Someone is typing...
          </Typography>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatMessages;
