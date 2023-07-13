import { Box, Fade, Container, Typography, Card, CardContent, Avatar, IconButton, List } from "@mui/material"
import { NavBar } from "../components/NavBar";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { grey } from "@mui/material/colors";
import { ChatRounded as LocIcon } from "@mui/icons-material";
import axios from "axios";

interface ColasDisponibles {
    color: string;
    date: Date;
    distanceLastNode: number;
    id: number | string;
    email: string;
    gender: string;
    lastname: string;
    liftID: number | string;
    model: string;
    nameU: string;
    path: string;
    photo: string;
    plate: string;
    rName: string;
    rate: number;
    role: string;
    seats: number;
    time: Date;
    waitingTime: number;
    newRate: number | null;
  }
  
  export type Root = Root2[]
  
  export interface Root2 {
    waitingList: WaitingList
    user: UserData
    photoURL: string
    name: string
    lastName: string
    email: string
  }
  
  export interface WaitingList {
    liftId: string
    passengerEmail: string
  }
  
  export interface UserData {
    email: string
    password: string
    name: string
    lastName: string
    photoURL: string
    gender: string
    role: string
    emergencyContact: string
    passengerRating: number
    driverRating: number
    confirmedUser: boolean
    liftCount: number
    status: string
  }
  
  export interface solicitud {
    usuario: Root2;
    solicitudes?: Root2[];
    elegidos?: Root;
    setElegidos?: React.Dispatch<React.SetStateAction<Root>>;
  }

export function ChatList (): JSX.Element {

    const [passengersData, setPassengersData] = React.useState<Root>([]);

  const fetchUser = async () => {
    const liftID = localStorage.getItem("liftID");
    const requestsPasajeros = `https://ulift.azurewebsites.net/api/Lift/usersInLift/${liftID}`;
    const request ={
      url : requestsPasajeros,
      method: 'GET',
    }

    axios(request)
    .then((response) => {
      console.log(response.data);
      setPassengersData(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  React.useEffect(() => {
    fetchUser();
  } , []);


  return (
    <Box>
    <NavBar />
    <Fade in timeout={800}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md" sx={{ p: 3, alignItems: "center" }}>
          <Typography
            color="primary"
            textAlign="left"
            fontSize={{ xs: 27, md: 30 }}
            fontWeight={600}
            mb={{ xs: 2, sm: 3 }}
            mt={-5}
          >
            Lista de chats
          </Typography>
          {passengersData.length === 0 && (
            <Typography fontSize={{ xs: 14, md: 17 }} mb={{ xs: 2, sm: 3 }}>
                No hay pasajeros.
            </Typography>
            )}
          <List dense sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          {/* {requests.map((user, index) => (
            // <PasajeroListaEspera usuario={user} solicitudes={requests} key={index} />
          ))} */}
            {passengersData.map((request, index) => (
                <PasajeroListaEspera usuario={request} solicitudes={passengersData} key={index} />
            ))}
          </List>
        </Container>
    </Box>
   </Fade>
   </Box>
  )
}

export const PasajeroListaEspera = ({ usuario, solicitudes, elegidos, setElegidos  }: solicitud): JSX.Element => {
    console.log(usuario)
    const foto = usuario.photoURL;
    const navigate = useNavigate();
    // console.log(
    //   "arreglo de requests " + requests.flatMap((usuario) => usuario.nameU + " " + usuario.id)
    // );
    const handleClick = (email: string) => () => {
        localStorage.setItem("receiverEmail", email);
        navigate("/chat") ;
    };
    const goChat = (id: number) => () => {
      navigate("/chatPrivado/" + id);
    };
  
    return (
      <Card
        sx={{
          width: "95%",
          height: "60px",
          backgroundColor: grey[100],
          color:  "",
          boxShadow: "none",
          p: 0,
          m: 0,
          mt: 1.5,
          borderRadius: 2,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            boxShadow: "none",
            width: "100%",
            height: "60px",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <Box alignItems="center" mr={2} mt={1}>
            {/* Aquí se tiene que cambiar para colocar la imagen */}
            <Avatar sx={{ width: 50, height: 50 }} src={foto} />
          </Box>
  
          <Box
            sx={{
              width: "100%",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontStyle: "bold",
              }}
            >
              {usuario.name} {usuario.lastName}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {/* <IconButton sx={{ marginRight: 1 }} onClick={goChat(usuario.id)}>
              <ChatRounded color="primary" />
            </IconButton> */}
            <IconButton sx={{ marginRight: 1 }} onClick={handleClick(usuario.email)}>
              <LocIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };