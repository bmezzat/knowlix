import React from 'react';
import { Box } from '@mui/material';
import MainContent from '@/components/MainContent';
import TopPanner from '@/components/TopPanner';
import ChatComponent from '@/components/ChatComponent';
import OptionsBanner from '@/components/OptionsBanner';

const Main: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <TopPanner/>
      <MainContent/>
      <OptionsBanner/>
      <ChatComponent/>
    </Box>
  )
}

export default Main;