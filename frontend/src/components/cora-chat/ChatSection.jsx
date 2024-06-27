import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Paper, Grid, useMediaQuery, useTheme, IconButton, Typography, Tooltip, Button } from '@mui/material';
import { fetchUserConversations, fetchMessagesFromDatabase, syncMessagesWithDatabase, createConversation, sendMessage, addAiMessage, clearChat } from '../../services/firebase/db';
import { generateAIResponse } from '../../services/llm/api';
import { errorMessages } from './messages';
import Message from './Message';
import SideNav from '../cora-sidebar/SideNav';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import NavBar from '../cora-navbar/NavBar';

const ChatSection = ({ userId }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [retryEnabled, setRetryEnabled] = useState(false);
    const [retryCountdown, setRetryCountdown] = useState(0);
    const [userImage, setUserImage] = useState(() => {
        return localStorage.getItem('userImage');
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const [apiUnavailable, setApiUnavailable] = useState(false);
    const controllerRef = useRef(null);

    useEffect(() => {
        fetchUserConversations(userId, setConversations);
    }, [userId]);

    useEffect(() => {
        if (currentConversation) {
            fetchMessagesFromCacheOrDatabase(userId, currentConversation.id);
        }
    }, [currentConversation, userId]);

    useEffect(() => {
        if (retryCountdown > 0) {
            const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (retryCountdown === 0) {
            setRetryEnabled(false);
        }
    }, [retryCountdown]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentConversation) {
                syncMessagesWithDatabase(userId, currentConversation.id);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentConversation, messages, userId]);

    const fetchMessagesFromCacheOrDatabase = async (userId, conversationId) => {
        const cachedMessages = localStorage.getItem(`messages_${conversationId}`);
        if (cachedMessages) {
            setMessages(JSON.parse(cachedMessages).sort((a, b) => a.timestamp - b.timestamp));
        } else {
            fetchMessagesFromDatabase(userId, conversationId, (msgs) => {
                setMessages(msgs);
            });
        }
    };

    const generateRandomId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const handleSend = async () => {
        if (input.trim()) {
            let convId = currentConversation?.id;
            if (!currentConversation) {
                const newConversation = await createConversation(userId, 'New Conversation');
                if (newConversation && newConversation.id) {
                    setCurrentConversation(newConversation);
                    convId = newConversation.id;
                }
            }
            if (convId) {
                const newMessage = await sendMessage(userId, convId, input);
                setMessages([...messages, newMessage]);
                setInput('');
                setLoading(true);

                let aiMessage = { id: generateRandomId(), content: '', sender: 'Cora', timestamp: Date.now() };
                setMessages((prevMessages) => [...prevMessages, aiMessage]);
                localStorage.setItem(`messages_${convId}`, JSON.stringify([...messages, aiMessage]));

                try {
                    const aiResponse = await generateAIResponse(input);
                    aiMessage.content = aiResponse;

                    const updatedAiMessage = await addAiMessage(userId, convId, aiMessage);

                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[updatedMessages.length - 1] = { ...updatedAiMessage };
                        updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
                        localStorage.setItem(`messages_${convId}`, JSON.stringify(updatedMessages));
                        return updatedMessages;
                    });

                    setLoading(false);
                    setApiUnavailable(false);
                } catch (error) {
                    console.error('Failed to fetch response from API:', error);
                    aiMessage.content = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages.slice(0, -1), aiMessage];
                        updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
                        localStorage.setItem(`messages_${convId}`, JSON.stringify(updatedMessages));
                        return updatedMessages;
                    });
                    setApiUnavailable(true);
                    setRetryEnabled(true);
                    setRetryCountdown(10); // 10 segundos
                    setLoading(false);
                }
            }
        }
    };

    const handleStop = () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        setLoading(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setUserImage(reader.result);
            localStorage.setItem('userImage', reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleMenuOpen = () => {
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
    };

    const clearChatHandler = async () => {
        if (currentConversation) {
            await clearChat(userId, currentConversation.id);
            setConversations(conversations.filter(convo => convo.id !== currentConversation.id));
            setCurrentConversation(conversations[0] || null);
        }
    };

    const selectConversation = (conversation) => {
        setCurrentConversation(conversation);
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh" width="100vw" pt={8}>
            <NavBar handleMenuOpen={handleMenuOpen} currentConversationTitle={currentConversation ? currentConversation.title : 'No Conversation Selected'} />
            <SideNav
                open={menuOpen}
                handleMenuClose={handleMenuClose}
                clearChat={clearChatHandler}
                handleImageUpload={handleImageUpload}
                conversations={conversations}
                selectConversation={selectConversation}
            />
            <Box
                flex={1}
                p={2}
                overflow="auto"
                bgcolor={theme.palette.background.default}
                color={theme.palette.text.primary}
            >
                {messages.map((message, index) => (
                    <Message key={index} message={message.content} isUser={message.sender === 'Você'} userImage={userImage} />
                ))}
                {apiUnavailable && (
                    <Typography variant="body2" color="error" align="center">
                        O contato com a Cora está temporariamente indisponível. Por favor, tente novamente mais tarde.
                    </Typography>
                )}
            </Box>
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
                    <Grid item xs={isSmallScreen ? 8 : 10}>
                        <TextField
                            variant="outlined"
                            placeholder="Type your message here..."
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
                                    <Tooltip title={retryEnabled ? `Aguarde ${retryCountdown} segundos para tentar novamente` : ''}>
                                        <span>
                                            <IconButton
                                                onClick={loading ? handleStop : handleSend}
                                                disabled={(!input.trim() && !loading) || retryEnabled}
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
                {retryEnabled && (
                    <Grid container justifyContent="center" style={{ marginTop: 10 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSend}
                        >
                            Tentar Novamente
                        </Button>
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

export default ChatSection;
