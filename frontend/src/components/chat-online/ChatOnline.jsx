import React, { useState } from 'react';
import { Box, Typography, Paper, Avatar, Grid, TextField, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import { useChat } from '../../hooks/useChat';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatOnline = () => {
    const theme = useTheme();
    const { users, messages, sendMessage } = useChat();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput('');
            setLoading(false);
        }
    };

    const handleStop = () => {
        setLoading(false);
    };

    const generateAvatarColor = (name, email) => {
        const identifier = name + email;  // Combina o nome e o email para garantir uma variação única
        let hash = 0;
        for (let i = 0; i < identifier.length; i++) {
            hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 60%)`;
        return color;
    };

    const getUserAvatar = (sender) => {
        const user = users.find((user) => user.name === sender);
        const avatarColor = user ? generateAvatarColor(user.name, user.email) : theme.palette.primary.main;

        return user ? (
            <Tooltip title={user.name} arrow>
                <Avatar sx={{ bgcolor: user.photoURL ? 'transparent' : avatarColor }}>
                    {user.photoURL ? <img src={user.photoURL} alt={user.name} /> : user.name.charAt(0)}
                </Avatar>
            </Tooltip>
        ) : (
            <Tooltip title={sender} arrow>
                <Avatar sx={{ bgcolor: avatarColor }}>
                    {sender.charAt(0)}
                </Avatar>
            </Tooltip>
        );
    };

    const currentUserEmail = users.find((user) => user.isCurrentUser)?.email;

    const renderMessageContent = (message) => {
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
            <ReactMarkdown components={components} skipHtml={false}>
                {message.content}
            </ReactMarkdown>
        );
    };

    return (
        <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            bgcolor={theme.palette.background.default}
            color={theme.palette.text.primary}
        >
            <Paper
                style={{
                    padding: '10px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflowY: 'auto',
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Paper
                    elevation={3}
                    style={{
                        padding: '15px 20px',
                        marginBottom: '10px',
                        backgroundColor: theme.palette.background.default,
                        boxShadow: theme.shadows[2],
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h6" align="center" gutterBottom>
                        Usuários Online
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        {users.map((user) => (
                            <Grid item xs={3} key={user.uid}>
                                <Tooltip title={user.name} arrow>
                                    <Avatar sx={{ bgcolor: generateAvatarColor(user.name, user.email) }}>
                                        {user.name.charAt(0)}
                                    </Avatar>
                                </Tooltip>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                <Box flex={1} overflow="auto" mt={2}>
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            justifyContent={message.sender === currentUserEmail ? 'flex-end' : 'flex-start'}
                            mb={1}
                            sx={{ wordWrap: 'break-word', maxWidth: '100%' }}
                        >
                            {message.sender !== currentUserEmail && (
                                <Box mr={1}>
                                    {getUserAvatar(message.sender)}
                                </Box>
                            )}
                            <Box
                                maxWidth="70%"
                                px={2}
                                py={1}
                                borderRadius="15px"
                                bgcolor={message.sender === currentUserEmail ? theme.palette.primary.main : theme.palette.background.paper}
                                color={message.sender === currentUserEmail ? theme.palette.primary.contrastText : theme.palette.text.primary}
                                boxShadow={3}
                                sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            >
                                {renderMessageContent(message)}
                            </Box>
                            {message.sender === currentUserEmail && (
                                <Box ml={1}>
                                    {getUserAvatar(message.sender)}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            </Paper>

            <Paper
                component="form"
                square
                elevation={3}
                style={{
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: theme.palette.background.paper,
                    justifyContent: 'center'
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
            >
                <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ maxWidth: '600px', minWidth: '75%' }}>
                    <Grid item xs={10}>
                        <TextField
                            variant="outlined"
                            placeholder="Digite sua mensagem aqui..."
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={5}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            InputProps={{
                                style: {
                                    color: theme.palette.text.primary,
                                    borderRadius: '30px',
                                    padding: '10px 15px',
                                    backgroundColor: theme.palette.background.paper,
                                },
                                endAdornment: (
                                    <Tooltip title={loading ? "Parar envio" : "Enviar mensagem"}>
                                        <span>
                                            <IconButton
                                                onClick={loading ? handleStop : handleSend}
                                                disabled={!input.trim() && !loading}
                                            >
                                                {loading ? <StopIcon /> : <SendIcon />}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                )
                            }}
                            style={{
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: '30px'
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ChatOnline;
