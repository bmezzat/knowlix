import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useTheme,
} from '@mui/material';
import {
  Description,
  Person,
  Logout,
} from '@mui/icons-material';

const TopPanner: React.FC = () => {
  const { logout, user } = useAuth();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
   
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
    
  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };  
  
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Description sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Knowlix Challenge Board
        </Typography>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="user-menu"
          aria-haspopup="true"
          onClick={handleUserMenuOpen}
          color="inherit"
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          {user?.given_name?.charAt(0).toUpperCase() || 'N/A'}
          </Avatar>
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
        >
          <MenuItem disabled>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {user?.given_name}
              </Typography>
              { user?.email && (
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              )}
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default TopPanner;