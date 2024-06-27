// frontend/src/components/cora-sidebar/SideNav.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { auth } from '../../firebaseConfig';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteConversation } from '../../services/firebase/db';

const SideNav = ({ open, handleMenuClose, clearChat, handleImageUpload, conversations = [], selectConversation, userId }) => {

    const handleLogout = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('messages');
            localStorage.removeItem('userImage');
            console.log('Logout successful');
            window.location.reload();
        }).catch(error => {
            console.error("Error signing out: ", error);
        });
    };

    const handleDeleteConversation = async (conversationId) => {
        await deleteConversation(userId, conversationId);
        //limpar a conversa
        clearChat();
        handleMenuClose();
    };

    const handleNewChat = () => {
        selectConversation(null);
        handleMenuClose();
    };

    return (
        <Drawer anchor="left" open={open} onClose={handleMenuClose}>
            <div style={{ width: 250, padding: 20 }}>
                <IconButton onClick={handleMenuClose}>
                    <CloseIcon />
                </IconButton>
                <Button fullWidth variant="contained" color="primary" style={{ margin: '10px 0' }} onClick={handleNewChat}>
                    + New Chat
                </Button>
                <List>
                    {conversations.map(convo => (
                        <ListItem button key={convo.id} onClick={() => selectConversation(convo)}>
                            <ListItemText primary={convo.title} />
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteConversation(convo.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={clearChat}>
                        <ListItemText primary="Limpar todas Conversas" />
                    </ListItem>
                    <ListItem button component="label">
                        <ListItemText primary="Adicione sua Foto" />
                        <input type="file" hidden onChange={handleImageUpload} />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Update & FAQs" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Log out" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default SideNav;
