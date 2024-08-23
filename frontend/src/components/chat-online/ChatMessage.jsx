import React from 'react';
import { Box, Avatar, Paper, useTheme, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ message, isUser, userImage, senderName }) => {
    const theme = useTheme();

    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={theme.palette.mode === 'dark' ? dracula : oneLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <Box
            display="flex"
            alignItems="flex-start"
            justifyContent={isUser ? 'flex-end' : 'flex-start'}
            my={1}
        >
            {!isUser && (
                <Avatar
                    src={userImage}
                    alt={senderName}
                    sx={{ mt: 1, width: 42, height: 42, bgcolor: theme.palette.primary.main }}
                >
                    {senderName.charAt(0)}
                </Avatar>
            )}
            <Paper
                elevation={1}
                style={{
                    padding: '2px 10px',
                    marginLeft: isUser ? 'auto' : 8,
                    backgroundColor: isUser ? theme.palette.primary.light : theme.palette.background.paper,
                    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    borderRadius: '8px',
                    maxWidth: '70%',
                    fontSize: '16px',
                    lineHeight: '1.4',
                    textAlign: isUser ? 'right' : 'left',
                }}
            >
                <Typography variant="caption" color="textSecondary">
                    {senderName}
                </Typography>
                <ReactMarkdown components={components} skipHtml={false}>
                    {message}
                </ReactMarkdown>
            </Paper>
            {isUser && (
                <Avatar
                    src={userImage}
                    alt={senderName}
                    sx={{ mt: 1, width: 42, height: 42, bgcolor: theme.palette.primary.main, ml: 1 }}
                >
                    {senderName.charAt(0)}
                </Avatar>
            )}
        </Box>
    );
};

export default ChatMessage;
