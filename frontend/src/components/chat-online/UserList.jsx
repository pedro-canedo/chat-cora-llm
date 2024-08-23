import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const UserList = ({ users }) => {
    const theme = useTheme();

    const getEmailName = (email) => {
        return email.split('@')[0];
    };

    return (
        <div style={{ width: 250, borderRight: `1px solid ${theme.palette.divider}`, padding: '10px' }}>
            <Typography variant="h6" gutterBottom>
                Online Users
            </Typography>
            <List>
                {users.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                {getEmailName(user.email).charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={getEmailName(user.email)}
                            secondary={user.email}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default UserList;
