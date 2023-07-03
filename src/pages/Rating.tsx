import { Button, Box, Container, Fade, Typography, Card, CardContent, Avatar, IconButton, Rating as RatingMUI } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import ListaEsperaParaConductores from "../components/ListaEsperaParaConductores";
import ListaEsperaParaPasajeros from "../components/ListaEsperaParaPasajeros";
import axios from "axios";
import { useEffect, useState } from "react";
import { Route, User } from "../types";
// import Rating from "./Rating";
import {HailRounded as PedirColaIcon } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import StarIcon from '@mui/icons-material/Star';
import { Driver, Lift, Vehicle } from "./Inicio";
import { Conductor } from '../components/ListaEsperaParaPasajeros';


interface ColasDisponibles {
  driverID: number;
  email: string;
  gender: string;
  lastname: string;
  liftID: number;
  name: string;
  photo: string;
  role: string;
}

export type Root = Root2[]

export interface Root2 {
  waitingList: WaitingList
  user: UserData
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

export interface lifts {
  lift: Lift
  driver: Driver
  route: Route
  vehicle: Vehicle
}

const root: Root = [
  {
    waitingList: {
      liftId: "123456",
      passengerEmail: "example@example.com"
    },
    user: {
      email: "example@example.com",
      password: "password123",
      name: "John",
      lastName: "Doe",
      photoURL: "https://www.example.com/profile.jpg",
      gender: "male",
      role: "passenger",
      emergencyContact: "emergency@example.com",
      passengerRating: 4.5,
      driverRating: 0,
      confirmedUser: true,
      liftCount: 10,
      status: "active"
    }
  },
  {
    waitingList: {
      liftId: "123456",
      passengerEmail: "another@example.com"
    },
    user: {
      email: "another@example.com",
      password: "password123",
      name: "Jane",
      lastName: "Doe",
      photoURL: "https://www.example.com/profile.jpg",
      gender: "female",
      role: "driver",
      emergencyContact: "emergency@example.com",
      passengerRating: 0,
      driverRating: 4.8,
      confirmedUser: true,
      liftCount: 20,
      status: "active"
    }
  }
];

const Rating = (): JSX.Element => {
  //Necesito establecer los tipos de usuario, es decir, saber si es un conducto o un pasajero
  //porque a cada uno se le va a mostrar algo distinto
  var tipoUsuario: string;
  const params = useParams();
  tipoUsuario = params.tipo!;
  const [usersInfo, setUserInfo] = useState<Root>(root);

  const [values, setValues] = useState<(number | null)[]>([]);
  const [hovers, setHovers] = useState<(number | null)[]>([]);

  // const initialize = (length: number) => {
  //   const newValues = [];
  //   const newHovers = [];
  //   for (let i = 0; i < length; i++) {
  //     newValues.push(0);
  //     newHovers.push(-1);
  //   }

  //   setValues([...newValues]);
  //   setHovers([...newHovers]);
    // }

  useEffect(() => {
      // initialize(usersInfo.length);
      if(tipoUsuario === "conductor"){
        const elegidos: Root = JSON.parse(localStorage.getItem("elegidos")!);
        setUserInfo([...elegidos]);
      }else{
        const driver: UserData = JSON.parse(localStorage.getItem("driverData")!);
        const conductor: Root = [
          {
            waitingList:
            {
              liftId: "",
              passengerEmail: ""
          },
          user: {
            email: driver.email,
            password: "",
            name: driver.name,
            lastName: driver.lastName,
            photoURL: driver.photoURL,
            confirmedUser: true,
            driverRating: driver.driverRating,
            emergencyContact: "",
            gender: "",
            liftCount: 0,
            passengerRating: 0,
            role: "driver",
            status: ""
          }
      }]

      setUserInfo([...conductor]);

      }
  }
  ,[]);

  const finishRating = () => {
    console.log("SI")
  }

  const handleValues = (value: number, index: number) => {

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

  }

  const handleHovers = (hover: number, index: number) => {

    const newHovers = [...hovers];
    newHovers[index] = hover;
    setHovers(newHovers);

  }

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
              Califica a tu{tipoUsuario === "conductor" ? "s pasajeros" : " conductor"}
            </Typography>
            {usersInfo.length > 0 && usersInfo.map((user,ind) => (
                <Card
                  sx={{
                    width: "95%",
                    height: "60px",
                    backgroundColor: grey[100],
                    boxShadow: "none",
                    p: 0,
                    mt: 4,
                    borderRadius: 2,
                    mb: 4,
                    
                  }}
                  key={ind}
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
                    <Avatar sx={{ width: 50, height: 50, marginBottom: 1, marginTop: 1 }} src={user.user.photoURL} />
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                    >
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        marginBottom: 0.5                      
                      }}
                    >
                      {user.user.name} {user.user.lastName}
                    </Typography>
                    <RatingMUI
                      key={ind}
                      name="hover-feedback"
                      value={values[ind] || 0} //values[ind] 
                      precision={1}
                      onChange={(event, newValue) => {
                        handleValues(newValue!, ind);
                      }}
                      onChangeActive={(event, newHover) => {
                        handleHovers(newHover!, ind);
                      }}
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />

                    </Box>
                  </Box>
                </CardContent>
              </Card>
              ))}
                <Button variant="contained" sx={{ width: "100%", marginTop: "10px" }} onClick={finishRating}>
                Enviar Calificación
                </Button>
          </Container>
        </Box>
      </Fade>
    </Box>
  );
};

export default Rating;
