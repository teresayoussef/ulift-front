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

const Chat = (): JSX.Element => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
     };

     const stackRef = useRef(null); 
     const [canScrollLeft, setCanScrollLeft] = useState(false); 
     const [canScrollRight, setCanScrollRight] = useState(true);
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
                            <Avatar imgProps={{ referrerPolicy: "no-referrer" }} sx={{cursor: 'pointer'}} />
                            <Typography noWrap sx={{maxWidth: '300pt', textOverflow: 'ellipsis'}}>
                                {/* colocar variable con la foto obtenida del endpoint */}
                                Teresa Youssef
                            </Typography>
                        </Stack>
                    </Toolbar>
                </AppBar>
                {/* @ts-ignore */}
                <div className='cont-messages'>
                <Box display={"flex"} flexDirection="column">
                    <ChatGlobo content={"Me fuí."} sender={"yo"} />
                    <ChatGlobo content={"Hola"} sender={"otro"} />
                    <ChatGlobo content={"Estoy en el estacionamiento"} sender={"yo"} />
                    <ChatGlobo content={"Hola"} sender={"otro"} />
                    <ChatGlobo content={"Estoy en los patos"} sender={"otro"} />
                    <ChatGlobo content={"Hola"} sender={"otro"} />
                    <ChatGlobo content={"Estoy en el estacionamiento"} sender={"yo"} />
                    <ChatGlobo content={"Hola"} sender={"otro"} />
                    <ChatGlobo content={"Estoy en los patos"} sender={"otro"} />
                    <ChatGlobo content={"Hola"} sender={"otro"} />
                    <ChatGlobo content={"Estoy en el estacionamiento"} sender={"yo"} />
                    <ChatGlobo content={"Hola"} sender={"otro"} />
                    <ChatGlobo content={"Estoy en los patos"} sender={"otro"} />
                    <ChatGlobo content={"Cesar es estupido"} sender={"otro"} />
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
                                    {/* { user.status === "pasajero" ? {

                                    } : {

                                    } */}
                                    {
                                        mensajesPasajero.map((mensaje) => (
                                            <Chip label={mensaje} variant="outlined" onClick={() => console.log({mensaje})} />
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