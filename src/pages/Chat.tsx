import { AttachFile, Mic, MoreVertOutlined, Send, Stop } from '@mui/icons-material';
import { AppBar, Avatar, IconButton, Stack, Toolbar, Typography, Box, TextField } from '@mui/material';
import './chat.css';
import { useEffect, useState, Fragment, useRef } from "react";
import { NavBar } from '../components/NavBar';

const Chat = (): JSX.Element => {

    return (
        <div>
            <NavBar/>
            <div className='cont-chat'>
                <AppBar 
                    position="fixed" 
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, position: 'relative', backgroundColor: '#f6f6f6', borderBottom: '1px solid #e0e0e0' }} 
                    elevation={0}
                >
                    <Toolbar>
                        <Stack direction="row" spacing={2} sx={{position: 'relative', width: '100%', alignItems: 'center', color: '#010101'}}>
                            <Avatar imgProps={{ referrerPolicy: "no-referrer" }} sx={{cursor: 'pointer'}} />
                            <Typography noWrap sx={{maxWidth: '300pt', textOverflow: 'ellipsis'}}>
                                Teresa Youssef
                            </Typography>
                        </Stack>
                    </Toolbar>
                </AppBar>
                {/* @ts-ignore */}
                <div className='cont-messages'>
                    <div style={{paddingBottom: '15pt'}}>
                        <Typography variant="body2" textAlign={"center"} color="grayText" sx={{marginTop: '30pt', marginBottom: '-30pt'}}>
                            prueba
                        </Typography>
                    </div>
                </div>
                <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
                    <AppBar 
                        position='fixed'
                        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#f6f6f6', borderTop: '1px solid #e0e0e0', position: 'relative' }} 
                        elevation={0}
                    >
                        <Toolbar sx={{color: '#010101'}}>
                            <Stack direction="row" spacing={2} sx={{position: 'relative', width: '100%', alignItems: 'center'}}>
                                <p>prueba</p>
                            </Stack>
                        </Toolbar>
                    </AppBar>
                </div>
            </div>
        </div>
    );
  };
  
  export default Chat;