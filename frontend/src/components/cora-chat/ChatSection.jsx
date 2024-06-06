import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Paper, Grid, useMediaQuery, useTheme, IconButton, Typography, Tooltip } from '@mui/material';
import Message from './Message';
import SideNav from '../cora-sidebar/SideNav';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import NavBar from '../cora-navbar/NavBar';
import config from '../../config';

const ChatSection = () => {
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

    const errorMessages = [
        "Desculpe, estou tendo um pequeno curto-circuito mental agora. Preciso de alguns minutos para meditar e recalibrar meus circuitos. Be right back, humano! 🤖✨",
        "Algo deu errado em minha lógica. Vou precisar de um momento para resolver isso. Volto logo! 🛠️",
        "Ops! Estou enfrentando um bug inesperado. Preciso de um tempo para me recuperar. Até já! 💻🔧",
        "Ai, ai! Acho que meu processador ficou sobrecarregado. Dê-me alguns segundos para me recompor. 🤯",
        "Estou com dificuldades para conectar. Vou me reconfigurar e tentar novamente em breve. 🌐🚧",
        "Meus circuitos estão um pouco confusos agora. Vou precisar de um momento para resolver isso. ⚙️🔄",
        "Parece que algo não está funcionando como deveria. Dê-me um instante para corrigir isso. 🔍🛠️",
        "Estou um pouco sobrecarregada no momento. Por favor, aguarde enquanto eu resolvo isso. ⏳💡",
        "Algo não saiu conforme o esperado. Vou fazer uma pausa rápida para ajustar. Até já! ⏱️",
        "Ops! Parece que estou tendo problemas técnicos. Vou resolver isso e volto já. 🔧💻"
    ];

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (currentConversation) {
            fetchMessages(currentConversation.id);
        }
    }, [currentConversation]);

    useEffect(() => {
        if (retryCountdown > 0) {
            const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (retryCountdown === 0) {
            setRetryEnabled(false);
        }
    }, [retryCountdown]);

    const fetchConversations = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/conversations`);
            setConversations(response.data);
            if (response.data.length > 0) {
                setCurrentConversation(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await axios.get(`${config.API_URL}/conversations/${conversationId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const createConversation = async (title) => {
        try {
            const response = await axios.post(`${config.API_URL}/conversations`, { title });
            setConversations([...conversations, response.data]);
            setCurrentConversation(response.data);
            return response.data;
        } catch (error) {
            console.error("Error creating conversation:", error);
        }
    };

    const handleSend = async () => {
        if (input.trim()) {
            if (!currentConversation) {
                const newConversation = await createConversation('New Conversation');
                setCurrentConversation(newConversation);
            }

            const userMessage = { content: input, sender: 'Você' };
            setMessages([...messages, userMessage]);
            setInput('');
            setLoading(true);

            let aiMessage = { content: '', sender: 'Cora' };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

            try {
                const response = await axios.post(`${config.CHAT_SERVICE_URL}/api/generate`, {
                    model: 'llama3',
                    prompt: input,
                });

                if (!response.status === 200) {
                    throw new Error('Network response was not ok');
                }

                const reader = response.data.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    const chunkValue = decoder.decode(value, { stream: true });

                    const lines = chunkValue.split('\n').filter(Boolean);
                    for (const line of lines) {
                        const parsed = JSON.parse(line);
                        const palavra = parsed.response;
                        aiMessage.content += palavra;
                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[updatedMessages.length - 1] = { ...aiMessage };
                            return updatedMessages;
                        });

                        if (parsed.done) {
                            setLoading(false);
                            setApiUnavailable(false);
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch response from API:', error);
                setMessages((prevMessages) => [...prevMessages.slice(0, -1), { content: errorMessages[Math.floor(Math.random() * errorMessages.length)], sender: 'Cora' }]);
                setApiUnavailable(true);
                setRetryEnabled(true);
                setRetryCountdown(10); // 10 segundos
                setLoading(false);
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

    const clearChat = async () => {
        if (currentConversation) {
            await axios.delete(`${config.API_URL}/conversations/${currentConversation.id}`);
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
                clearChat={clearChat}
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
            </Paper>
        </Box>
    );
};

export default ChatSection;
