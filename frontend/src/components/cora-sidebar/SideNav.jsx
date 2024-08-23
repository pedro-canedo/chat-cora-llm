import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Button, IconButton, Tabs, Tab, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { deleteConversation, clearChat } from '../../services/firebase/db';

const SideNav = ({ open, handleMenuClose, clearChat, handleImageUpload, conversations = [], setMessages, selectConversation, userId, activeTab, handleTabChange }) => {

    const handleLogout = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('messages');
            localStorage.removeItem('userImage');
            window.location.reload();
        }).catch(error => {
            console.error("Error signing out: ", error);
        });
    };

    const handleDeleteConversation = async (conversationId) => {
        if (window.confirm("Tem certeza que deseja excluir esta conversa?")) {
            await deleteConversation(userId, conversationId);
            setMessages([]);  // Limpa as mensagens na UI
            handleMenuClose();
        }
    };

    const handleClearAllConversations = async () => {
        if (window.confirm("Tem certeza que deseja limpar todas as conversas?")) {
            for (const convo of conversations) {
                await clearChat(userId, convo.id);
            }
            setMessages([]);  // Limpa as mensagens na UI
            handleMenuClose();
        }
    };

    const handleNewChat = () => {
        selectConversation(null);
        setMessages([]);
        handleMenuClose();
    };

    return (
        <Drawer anchor="left" open={open} onClose={handleMenuClose}>
            <div style={{ width: 280, padding: 20 }}>
                <IconButton onClick={handleMenuClose}>
                    <CloseIcon />
                </IconButton>

                {/* Tabs para alternar entre Conversa e Chat Online */}
                <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
                    <Tab label="Cora IA" />
                    <Tab label="Comunidade" />
                </Tabs>

                {activeTab === 0 && (
                    <>
                        <Button fullWidth variant="contained" color="primary" style={{ margin: '10px 0' }} onClick={handleNewChat}>
                            + Nova Conversa
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
                    </>
                )}

                <Divider />
                <List>
                    <ListItem button onClick={handleClearAllConversations}>
                        <ListItemText primary="Limpar todas Conversas" />
                    </ListItem>
                    <ListItem button component="label">
                        <ListItemText primary="Adicione sua Foto" />
                        <input type="file" hidden onChange={handleImageUpload} />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Sair" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default SideNav;
