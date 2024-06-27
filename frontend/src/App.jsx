// frontend/src/App.jsx
import React, { useState, useContext } from 'react';
import { CssBaseline } from '@mui/material';
import NavBar from './components/cora-navbar/NavBar';
import SideNav from './components/cora-sidebar/SideNav';
import ChatSection from './components/cora-chat/ChatSection';
import { ThemeContext } from './ThemeContext';
import Auth from './components/auth/Auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';
import './App.css';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { toggleTheme } = useContext(ThemeContext);
    const [user] = useAuthState(auth);

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
        <>
            <CssBaseline />
            {user ? (
                <div className="App">
                    <NavBar handleMenuOpen={handleMenuOpen} />
                    <SideNav
                        open={menuOpen}
                        handleMenuClose={handleMenuClose}
                        clearChat={clearChat}
                        handleImageUpload={handleImageUpload}
                        conversations={[]}
                        selectConversation={() => { }}
                    />
                    <ChatSection
                        userId={user.uid}
                    />
                </div>
            ) : (
                <div className="AuthContainer">
                    <Auth />
                </div>
            )}
        </>
    );
}

export default App;
