import {
  Box,
  Container,
  Typography,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import {
  AccessTimeRounded as TimeIcon,
  DirectionsCarFilledRounded as CarIcon,
  EditRounded as EditIcon,
  AddLocationAltRounded as LocationIcon,
  RampLeftRounded as RutaIcon,
  EmailRounded as EmailIcon,
  PhoneRounded as PhoneIcon,
  PersonRounded as PersonIcon,
  BadgeRounded as BadgeIcon,
  LocationOnRounded as LocationOnIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import Profile from "../components/Profile";
import logo from "../assets/logo512.png";
import { useNavigate } from "react-router-dom";
import api_instance from "../api/api_instance";
import { User } from "../types/index";
import InfoCard from "../components/InfoCard";
import { useSnackbar } from "notistack";
import { BlobServiceClient } from "@azure/storage-blob";
import Spinner from "../components/Spinner";
import {Route} from "../types/index.js";

const usuario: User = {
  name: "",
  lastname: "",
  id: "",
  email: "",
  role: "",
  gender: "",
  photo: "",
  trips: 0,
  rating: 0,
  emergencyContact: "",
  emergencyName: "",
  vehicles: [],
  destinations: [],
  routes: [],
};

const PerfilUsuario = (): JSX.Element => {
  const navigate = useNavigate();
  var rutas: Route[] = [];
  const [isLoaded, setLoaded] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const email = localStorage.getItem("email");
  const url = `https://ulift.azurewebsites.net/api/User/${email}`;
  
  //const url = "http://localhost:3000/api/user/profile";
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const response = await api_instance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const inUcab = localStorage.getItem("inUCAB");

    if(inUcab === "true"){
      for (let i = 0; i < response.data.uRoutes.length; i++) {
        console.log("A")
        if (response.data.uRoutes[i].inUcab === true){
          rutas.push(
            response.data.uRoutes[i]
          );
        }
      }
    }else if(inUcab === "false"){
      for (let i = 0; i < response.data.uRoutes.length; i++) {
        if (response.data.uRoutes[i].inUcab === false){
          rutas.push(
            response.data.uRoutes[i]
          );

      }
    }
  }

    usuario.name = response.data.user.name;
    usuario.lastname = response.data.user.lastName;
    usuario.email = response.data.user.email;
    usuario.emergencyContact = response.data.user.emergencyContact;
    usuario.emergencyName = response.data.user.emergencyContactName; //Hayque agregarlo a la base de datos
    if (response.data.user.status === "D"){
      usuario.trips = response.data.user.liftCountAsDriver;
      usuario.rating = response.data.user.driverRating;
    }else{
      usuario.trips = response.data.user.liftCountAsPassenger
      usuario.rating = response.data.user.passengerRating;
    }
    usuario.gender = response.data.user.gender;
    usuario.photo = response.data.user.photoURL;
    usuario.vehicles = response.data.vehicles;
    usuario.destinations = response.data.destinations;
    usuario.routes = rutas;

    if (response.data.user.role === "E") {
      usuario.role = "Estudiante";
    } else if (response.data.user.role === "D") {
      usuario.role = "Docente";
    } else {
      usuario.role = "Trabajador";
    }
    setLoaded(true);
  };

  useEffect(() => {
    fetchUser();
  } , []);

  // (condicion)? (si se cumple): (si no se cumple)

  return (
    
    <Box>
      {(isLoaded)?(<>
        <NavBar />
        <Box justifyContent="space-between" flexDirection="column" flexGrow={1}>
          <Container maxWidth="md" sx={{ p: 2 }}>
            <Profile
              id={usuario.id}
              name={usuario.name}
              lastname={usuario.lastname}
              email={usuario.email}
              role={usuario.role}
              gender={usuario.gender}
              photo={usuario.photo}
              trips= {usuario.trips}
              rating={usuario.rating}
              emergencyContact={usuario.emergencyContact}
              emergencyName={usuario.emergencyName}
              vehicles={usuario.vehicles}
              destinations={usuario.destinations}
              routes={usuario.routes}
            />
            
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                m: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 2,
                }}
  
              >
                <EmailIcon color="primary" />
                <Typography ml={2}>
                  <b>Correo electrónico:</b> {usuario.email}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 2,
                }}
              >
                <BadgeIcon color="primary" />
                <Typography ml={2}>
                  <b>Rol:</b> {usuario.role}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 2,
                }}
              >
                <PersonIcon color="primary" />
                <Typography ml={2}>
                  <b>Contacto de emergencia:</b> {usuario.emergencyName}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 2,
                }}
              >
                <PhoneIcon color="primary" />
                <Typography ml={2}>
                  <b>Teléfono de emergencia:</b> {usuario.emergencyContact}
                </Typography>
              </Box>
            </Box>
  
            <Box>
              <Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Vehículos registrados
                </Typography>
                {/* Mapear los nombres de los vehículos registrados */}
                {usuario.vehicles.length === 0 && (
                  <Typography fontSize={{ xs: 14, md: 17 }} m={2}>
                    No hay vehículos registrados
                  </Typography>
                )}
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {usuario.vehicles?.map((v) => (
                    <InfoCard
                      key={v.plate}
                      title={"Placa: " + v.plate}
                      subtitile={"Modelo: " + v.model}
                    />
                  ))}
                </Grid>
              </Box>
  
              <Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Rutas registradas
                </Typography>
                {/* Mapear los nombres de las rutas registradas */}
                {usuario.routes.length === 0 && (
                  <Typography fontSize={{ xs: 14, md: 17 }} m={2}>
                    No hay rutas registradas
                  </Typography>
                )}
  
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {usuario.routes?.map((v) => (
                    <InfoCard
                      key={v.rNumber}
                      title={"Nombre de la ruta: " + v.name}
                      subtitile={"Activa" }
                    />
                  ))}
                </Grid>
              </Box>
  
              <Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Destinos registrados
                </Typography>
                {/* Mapear los nombres de las rutas registradas */}
                {usuario.destinations.length === 0 && (
                  <Typography fontSize={{ xs: 14, md: 17 }} m={2}>
                    Error al cargar destinos
                  </Typography>
                )}
  
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {usuario.destinations?.map((v, index) => (
                    <InfoCard
                      key={index}
                      title={"Nombre del destino: " + v.name}
                      subtitile={"Latitud y Longitud: " + v.lat + " " + v.lng}
                    />
                  ))}
                </Grid>
              </Box>
            </Box>
          </Container>
          <Box
            sx={{
              mt: 5,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Divider />
            <Card
              sx={{
                display: "flex",
                width: "100%",
                height: "80px",
                boxShadow: "none",
                p: 0,
              }}
              onClick={() => {
                navigate("/registroDestino");
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  boxShadow: "none",
                  width: "100%",
                  height: "80px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                <LocationIcon />
                <Typography sx={{ fontWeight: 600, fontSize: 16, ml: 2 }}>Agregar Destino</Typography>
              </CardContent>
            </Card>
            <Divider />
            <Card
              sx={{
                width: "100%",
                height: "70px",
                boxShadow: "none",
                p: 0,
              }}
              onClick={() => {
                navigate("/registroVehiculo");
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  boxShadow: "none",
                  width: "100%",
                  height: "70px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                <CarIcon />
                <Typography sx={{ fontWeight: 600, fontSize: 16, ml: 2 }}>
                  Agregar Vehículo{" "}
                </Typography>
              </CardContent>
            </Card>
            <Divider />
            <Card
              sx={{
                width: "100%",
                height: "80px",
                boxShadow: "none",
                p: 0,
              }}
              onClick={() => {
                if (usuario.vehicles.length === 0) {
                  enqueueSnackbar("Debe registrar un vehículo antes de registrar una ruta", {
                    variant: "warning",
                  });
                }
                if (usuario.vehicles.length >= 1) {
                  const inUcab = localStorage.getItem("inUCAB");
                  if(inUcab === "false"){
                    navigate("/registroRutaExterna");
                  }else if(inUcab === "true"){
                    navigate("/registroRutaUcab");
                  }
                }
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  boxShadow: "none",
                  width: "100%",
                  height: "80px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                <RutaIcon />
                <Typography sx={{ fontWeight: 600, fontSize: 16, ml: 2 }}>Agregar Ruta </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
        </>):(<Spinner />)}   
    </Box>
  )
};


export default PerfilUsuario;
