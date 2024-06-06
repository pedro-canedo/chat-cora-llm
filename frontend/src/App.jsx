import React, { useState, useContext } from 'react';
import { CssBaseline } from '@mui/material';
import NavBar from './components/cora-navbar/NavBar';
import SideNav from './components/cora-sidebar/SideNav';
import ChatSection from './components/cora-chat/ChatSection';
import { ThemeContext } from './ThemeContext';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { toggleTheme } = useContext(ThemeContext);

    const handleMenuOpen = () => {
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
    };

    const clearChat = () => {
        localStorage.removeItem('messages');
        window.location.reload();
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            localStorage.setItem('userImage', reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="App">
            <CssBaseline />
            <NavBar handleMenuOpen={handleMenuOpen} />
            <SideNav
                open={menuOpen}
                handleMenuClose={handleMenuClose}
                clearChat={clearChat}
                handleImageUpload={handleImageUpload}
            />
            <ChatSection />
        </div>
    );
}

export default App;
