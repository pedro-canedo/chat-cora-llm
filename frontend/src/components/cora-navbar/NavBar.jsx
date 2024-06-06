import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../../ThemeContext';
import { useTheme } from '@mui/material/styles';

const NavBar = ({ handleMenuOpen, currentConversationTitle }) => {
    const { toggleTheme } = useContext(ThemeContext);
    const theme = useTheme();

    return (
        <AppBar position="fixed">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {currentConversationTitle}
                </Typography>
                <IconButton color="inherit" aria-label="toggle dark mode" onClick={toggleTheme}>
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <Typography variant="h6">+</Typography>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
