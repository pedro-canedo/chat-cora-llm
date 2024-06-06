import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SideNav = ({ open, handleMenuClose, clearChat, handleImageUpload, conversations = [], selectConversation }) => {
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
                    <ListItem button>
                        <ListItemText primary="Log out" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default SideNav;
