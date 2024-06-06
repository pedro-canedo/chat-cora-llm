import React from 'react';
import { Box, Avatar, Paper, useTheme, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const IA_IMAGE_PATH = '/public/image-IA.webp';

const Message = ({ message, isUser, userImage }) => {
    const theme = useTheme();
    const avatarSrc = isUser
        ? userImage || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
        : IA_IMAGE_PATH;
    const senderName = isUser ? 'Você' : 'Cora';

    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    children={String(children).replace(/\n$/, '')}
                    {...props}
                />
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <Box display="flex" alignItems="flex-start" my={2}>
            <Avatar src={avatarSrc} />
            <Paper
                elevation={1}
                style={{ padding: 10, marginLeft: 10, backgroundColor: isUser ? theme.palette.background.paper : theme.palette.background.default, flex: 1 }}
            >
                <Typography variant="caption" color="textSecondary">
                    {senderName}
                </Typography>
                <ReactMarkdown components={components}>{message}</ReactMarkdown>
            </Paper>
        </Box>
    );
};

export default Message;
