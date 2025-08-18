import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '@/components/Sidebar';
import PanelContainer from '@/components/PanelContainer';

const MainContent: React.FC = () => {
  const TOP_PANNER_HEIGHT = 64; // adjust to your Toolbar/AppBar height
  const CHAT_HEIGHT = 200;
  const BANNER_HEIGHT = 55;
  return (
    <Box sx={{ 
      display: 'flex', 
      height: `calc(100vh - ${TOP_PANNER_HEIGHT + CHAT_HEIGHT + BANNER_HEIGHT}px)`, 
      overflow: 'hidden'
    }}>
      <Box 
        sx={{ 
          width: 300, 
          borderRight: '1px solid', 
          borderColor: 'divider', 
          pr: 2, 
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          height: '100%',
        }}
      >
        <Sidebar />
      </Box>
      <Box sx={{ 
        flexGrow: 1, 
        pl: 2, 
        pr: 2,
        overflowY: 'auto',
        height: '100%',
        width: '400px',
        maxWidth: '100% - 300px - 40px',
        boxSizing: 'border-box', 
      }}>
        <PanelContainer />
      </Box>
    </Box>
  )
}

export default MainContent;