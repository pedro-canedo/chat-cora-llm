import React from 'react';
import { Box, Avatar, Paper, useTheme, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        <Box display="flex" alignItems="flex-start" my={1}>
            <Avatar src={avatarSrc} alt={senderName} sx={{ mt: 1, width: 42, height: 42 }} />
            <Paper
                elevation={1}
                style={{
                    padding: '2px 10px',
                    marginLeft: 8,
                    backgroundColor: isUser ? theme.palette.primary.light : theme.palette.background.paper,
                    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    borderRadius: '8px',
                    maxWidth: '90%',
                    fontSize: '16px',
                    lineHeight: '1.4',
                }}
            >
                <Typography variant="caption" color="textSecondary">
                    {senderName}
                </Typography>
                <ReactMarkdown components={components} skipHtml={false}>
                    {message}
                </ReactMarkdown>
            </Paper>
        </Box>
    );
};

export default Message;
