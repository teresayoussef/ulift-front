import { ArrowBackIosNewOutlined, ArrowForwardIosOutlined, AttachFile, Mic, MoreVertOutlined, Send, Stop } from '@mui/icons-material';
import { AppBar, Avatar, IconButton, Toolbar, Typography, Box, TextField } from '@mui/material';
import './chat.css';
import { useEffect, useState, Fragment, useRef } from "react";
import { NavBar } from '../components/NavBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import userEvent from '@testing-library/user-event';
import ChatGlobo from '../components/ChatGlobo';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import axios from 'axios';
import { connect } from 'http2';
import { set } from 'date-fns';

const Chat = (): JSX.Element => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
     };

     const stackRef = useRef<HTMLDivElement | null>(null); 
     const stackRefMessages = useRef<HTMLDivElement | null>(null);
     const [canScrollLeft, setCanScrollLeft] = useState(false); 
     const [canScrollRight, setCanScrollRight] = useState(true);
     const [connection, setConnection] = useState<HubConnection | null>(null);
     const [messages, setMessages] = useState<{ content: string; senderEmail: string }[]>([]);
     const [receivedMessages, setReceivedMessages] = useState(false);
     const receiver = localStorage.getItem("receiverEmail");
     const sender = localStorage.getItem("email");
     const [receiverData, setReceiverData] = useState<any | null>(null);
     const [senderData, setSenderData] = useState<any | null>(null);


    const user ={
        url : `https://u-lift.azurewebsites.net/api/User/${receiver}`,
        method: 'get',
    }

    const user2 ={
        url : `https://u-lift.azurewebsites.net/api/User/${sender}`,
        method: 'get',
    }

     const scrollToBottom = () => {
        if (stackRefMessages.current){
            console.log(stackRefMessages.current.scrollHeight)
            stackRefMessages.current.scrollTo({
                top: stackRefMessages.current.scrollHeight,
                behavior: 'smooth',
            });
        };
    }

     useEffect(() => {
        axios(user)
        .then((response) => {
            console.log(response.data);
            setReceiverData(response.data);
        }
        ).catch((error) => {
            console.log(error);
        }
        );

        axios(user2)
        .then((response) => {
            console.log(response.data);
            setSenderData(response.data);
            console.log(senderData);
        }
        ).catch((error) => {
            console.log(error);
        }
        );
            const connection = new HubConnectionBuilder()
            .withUrl('https://u-lift.azurewebsites.net/chatHub')
            .withAutomaticReconnect()
            .build();

        
          if (connection){
            setConnection(connection)
          }
      }, []);

    if (connection) {
        connection.start()
            .then(result => {
                console.log('Connected!');
                console.log(connection)
            }
        )
        .catch(e => console.log('Connection failed: ', e));
    }

    if (connection && !receivedMessages) {
        const senderEmail = localStorage.getItem("receiverEmail");
        const receiverEmail = localStorage.getItem("senderEmail");
        const receiveMessage = {
            url: `https://u-lift.azurewebsites.net/api/Message/${senderEmail}/${receiverEmail}`,
            method: 'get',
        }
        axios(receiveMessage)
        .then((response) => {
            console.log(response);
            setMessages(response.data);
        }
        )
        .catch((error) => {
            console.log(error);
        }
        );
        scrollToBottom();
        setReceivedMessages(true);
    }

    useEffect(() => {
        if (connection) {
          // Suscribirse al evento "ReceiveMessage" del servidor
          connection.on("ReceiveMessage", (senderEmail, receiverEmail, message) => {
                if (senderEmail === localStorage.getItem("receiverEmail") && receiverEmail === localStorage.getItem("senderEmail")){
                    console.log('Message received from ' + senderEmail + ' with message: ' + message);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { content: message, senderEmail: senderEmail ?? '' },
                      ]);
                    }         
                scrollToBottom();
          });
        }
      }, [connection]);



     useEffect(() => {
        if (stackRef.current) {
          const handleScroll = () => {
            if (stackRef.current) {
                // @ts-ignore
              setCanScrollLeft(stackRef.current.scrollLeft > 0);
              setCanScrollRight(
                // @ts-ignore
                stackRef.current.scrollLeft + stackRef.current.clientWidth < stackRef.current.scrollWidth
              );
            }
          };
          // @ts-ignore
          stackRef.current.addEventListener('scroll', handleScroll);
          // @ts-ignore
          return () => stackRef.current?.removeEventListener('scroll', handleScroll);
        }
      }, [stackRef]);

     const handleScrollLeft = () => {
       if (stackRef.current) {
        // @ts-ignore
         stackRef.current.scrollLeft -= 250; 
         setCanScrollRight(true); 
         // @ts-ignore
         if (stackRef.current.scrollLeft <= 0) {
           setCanScrollLeft(false); 
         }
       }
     };
   
     const handleScrollRight = () => {
       if (stackRef.current) {
        // @ts-ignore
         stackRef.current.scrollLeft += 250; 
         setCanScrollLeft(true); 
         // @ts-ignore
         if (stackRef.current.scrollLeft + stackRef.current.clientWidth >= stackRef.current.scrollWidth) {
           setCanScrollRight(false); 
         }
       }
     };

    const handleSendMessage = (message: string) => {
        if (connection){
            console.log(message);
            const senderEmail = localStorage.getItem("senderEmail");
            const receiverEmail = localStorage.getItem("receiverEmail");
            const liftID = localStorage.getItem("liftID");
            connection.invoke('SendMessage', localStorage.getItem("senderEmail"), localStorage.getItem("receiverEmail"), message)
            .then(() => console.log('Message sent to ' + localStorage.getItem("receiverEmail") + ' from ' + localStorage.getItem("senderEmail") + ' with message: ' + message ))
            .catch((e) => console.log('Error: ', e));

            const sendMessage = {
                url: `https://u-lift.azurewebsites.net/api/Message/${liftID}/${senderEmail}/${receiverEmail}/${message}`,
                method: 'post',
            }

            axios(sendMessage)
            .then((response) => {
                console.log(response);
            }
            )
            .catch((error) => {
                console.log(error);
            }
            );     
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: message, senderEmail: senderEmail ?? '' },
              ]); 
            scrollToBottom();
        }
    }

    const mensajesPasajero = [
        "Hola.",
        "Esta bien.",
        "Estoy en los patos.",
        "Estoy en el CDE",
        "Estoy en la parada de la UCAB.",
        "En 5 minutos salgo.",
        "En 10 minutos salgo.",
        "En 15 minutos salgo.",
        "Estoy afuera.",
        "Estoy en el estacionamiento.",
        "Estoy esperando.",
        "¿Cuánto te falta?",
        "Me avisas cuando estes aquí.",
        "¿En dónde te espero?",
        "Okey.",
        "¿Te demorarás un poco?",
        "No te preocupes.",
        "Gracias." 
    ];

    const mensajesConductor = [
        "Hola.",
        "Esta bien.",
        "Esperame en los patos.",
        "Esperame en el CDE",
        "Esperame en el estacionamiento",
        "Estoy en la parada de la UCAB.",
        "En 5 minutos salgo.",
        "En 10 minutos salgo.",
        "En 15 minutos salgo.",
        "Ya estoy saliendo para allá.",
        "Estoy en camino.",
        "Ya puedes ir saliendo.",
        "Estoy afuera.",
        "Estoy en el estacionamiento.",
        "Estoy esperando.",
        "Me avisas cuando estes aquí.",
        "Okey.",
        "No hay de que.",
    ];

    return (
        <div style={{backgroundColor: '#fff'}}> 
            <NavBar/>
            <div className='cont-chat'>
                <AppBar 
                    position="fixed" 
                    sx={{ zIndex: (theme) => theme.zIndex.drawer, position: 'relative', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }} 
                    elevation={0}
                >
                    <Toolbar>
                        <Stack direction="row" spacing={2} sx={{position: 'relative', width: '100%', alignItems: 'center', color: '#010101'}}>
                            <IconButton onClick={handleClick}>
                                <ArrowBackIcon/> 
                            </IconButton>
                            {/* src={user.img}  colocar la imagen en avatar*/} 
                            <Avatar src = {receiverData?.user.photoURL} imgProps={{ referrerPolicy: "no-referrer" }} />
                            <Typography noWrap sx={{maxWidth: '300pt', textOverflow: 'ellipsis'}}>
                                {/* colocar variable con la foto obtenida del endpoint */}
                                {receiverData?.user.name}
                            </Typography>
                        </Stack>
                    </Toolbar>
                </AppBar>
                {/* @ts-ignore */}
                <div className='cont-messages'  ref={stackRefMessages}>
                <Box display={"flex"} flexDirection="column">
                        {messages.map((message, index) => (
                        <ChatGlobo key={index} content={message.content} senderEmail={message.senderEmail === localStorage.getItem("senderEmail") ? "yo" : "otro"} />
                        ))}
                </Box>
                </div>
                <div style={{position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff'}}>
                    <AppBar 
                        position='fixed'
                        sx={{ zIndex: (theme) => theme.zIndex.drawer, backgroundColor: '#fff', borderTop: '1px solid #e0e0e0', position:"relative" }} 
                        elevation={0}
                    >
                        <Toolbar sx={{color: '#010101'}}>
                            <IconButton sx={{marginLeft: "-15px", marginRight: '10px'}} onClick={handleScrollLeft} disabled={!canScrollLeft}>
                                <ArrowBackIosNewOutlined/>
                            </IconButton>
                            <Stack 
                                direction="row" 
                                spacing={2}
                                ref={stackRef} 
                                sx={{
                                    position: 'relative',
                                    maxWidth: '100%',
                                    alignItems: 'center',
                                    overflow: "scroll",
                                    scrollbarWidth: 'none', 
                                    '::-webkit-scrollbar': { 
                                        width: "0",
                                        display: "none",
                                    },
                                    '::-webkit-scrollbar-track': {
                                        backgroundColor: 'transparent',
                                    },
                                    '::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                    },
                                    '::-webkit-scrollbar-corner': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <>
                                    {senderData?.user.status === "D" ? 
                                        mensajesConductor.map((mensaje) => (
                                            <Chip
                                                key = {mensaje}
                                                label = {mensaje}
                                                variant = "outlined"
                                                onClick = {() => handleSendMessage(mensaje)}
                                            />
                                        ))
                                    :  mensajesPasajero.map((mensaje) => (
                                            <Chip
                                                key = {mensaje}
                                                label = {mensaje}
                                                variant = "outlined"
                                                onClick = {() => handleSendMessage(mensaje)}
                                            />
                                        ))
                                    }
                                </>
                            </Stack>
                            <IconButton sx={{marginLeft: "10px", marginRight: '-15px'}} onClick={handleScrollRight} disabled={!canScrollRight}>
                                <ArrowForwardIosOutlined/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </div>
            </div>
        </div>
    );
  };
  
  export default Chat;