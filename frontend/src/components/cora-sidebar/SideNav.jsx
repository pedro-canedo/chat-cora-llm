// frontend/src/components/cora-sidebar/SideNav.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { auth } from '../../firebaseConfig';  // Import the auth instance from your Firebase configuration
import { signOut } from 'firebase/auth';  // Import the signOut method

const SideNav = ({ open, handleMenuClose, clearChat, handleImageUpload, conversations = [], selectConversation }) => {

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Clear user session data
            localStorage.removeItem('messages');
            localStorage.removeItem('userImage');
            console.log('Logout successful');
            window.location.reload();
        }).catch(error => {
            console.error("Error signing out: ", error);
        });
    };

    return (
        <Drawer anchor="left" open={open} onClose={handleMenuClose}>
            <div style={{ width: 250, padding: 20 }}>
                <IconButton onClick={handleMenuClose}>
                    <CloseIcon />
                </IconButton>
                <Button fullWidth variant="contained" color="primary" style={{ margin: '10px 0' }}>
                    + New Chat
                </Button>
                <List>
                    {conversations.map(convo => (
                        <ListItem button key={convo.id} onClick={() => selectConversation(convo)}>
                            <ListItemText primary={convo.title} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={clearChat}>
                        <ListItemText primary="Clear conversations" />
                    </ListItem>
                    <ListItem button component="label">
                        <ListItemText primary="Adicione sua Foto" />
                        <input type="file" hidden onChange={handleImageUpload} />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Update & FAQs" />
                    </ListItem>
                    <ListItem button onClick={() => { console.log('Logout button clicked'); handleLogout(); }}>
                        <ListItemText primary="Log out" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default SideNav;
