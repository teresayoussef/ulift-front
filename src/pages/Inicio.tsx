import { Box, Container, Fab, Fade, Grid, Tooltip, Typography, Tabs } from "@mui/material";
import React, { useEffect } from "react";
import { NavBar } from "../components/NavBar";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CircularProgress from '@mui/material/CircularProgress';
import {
  DriveEtaRounded as OfrecerColaIcon,
  HailRounded as PedirColaIcon,
} from "@mui/icons-material";
import { useState } from "react";
import BuscarColaDialogo from "../components/BuscarColaDialogo";
import OfrecerColaDialogo from "../components/OfrecerColaDialogo";
import ConductorDisponible from "../components/ConductorDisponible";
import InfoUserDialogo from "../components/InfoUserDialogo";
import axios from "axios";
// import { Lift, Route, Vehicle } from "../types";
import AlertaDialogo from "../components/AlertaDialogo";
import { set } from "date-fns";
import Spinner from "../components/Spinner";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";

// interface Colas {
//   color: string;
//   date: Date;
//   distanceLastNode: number;
//   driverID: number;
//   email: string;
//   gender: string;
//   lastName: string;
//   liftID: number;
//   model: string;
//   name: string;
//   path: string;
//   photo: string;
//   plate: string;
//   rName: string;
//   rate: number;
//   role: string;
//   seats: number;
//   time: Date;
//   waitingTime: number;
// }

export interface Root {
  colas: Cola[]
}

export interface Cola {
  lift: Lift
  driver: Driver
  route: Route
  vehicle: Vehicle
}

export interface Lift {
  email1: string
  rating1: number
  email2: string
  rating2: number
  email3: string
  rating3: number
  email4: string
  rating4: number
  email5: string
  rating5: number
  driverEmail: string
  driverRating: number
  status: string
  plate: string
  route: string
  seats: number
  waitingTime: number
  liftId: string
  createdAt: Date
}

export interface Driver {
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
  id: string
}

export interface Route {
  email: string
  path: string
  name: string
}

export interface Vehicle {
  plate: string
  email: string
  color: string
  model: string
  seats: number
}

var vehiculos: Vehicle[] = [];
var rutas: Route[] = [];
var colas: Cola[] = [];


const Inicio = (): JSX.Element => {
  const [isDialogOfrecerOpen, setDialogOfrecerOpen] = useState(false);
  const [isDialogPedirOpen, setDialogPedirOpen] = useState(false);
  const [flagVehiculos, setFlagVehiculos] = useState(false);
  const [flagRutas, setFlagRutas] = useState(false);
  const [flagColas, setFlagColas] = useState(false);

  
  
  const fetchInfo = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude.toString();
      const longitude = position.coords.longitude.toString();
      localStorage.setItem("coordenadas", latitude + "," + longitude);
    });

    function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
      var R = 6371 * 1000; // Radius of the earth in m
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *  
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in m
      console.log(d);
      return d;
    }

    function deg2rad(deg: number) {
      return deg * (Math.PI / 180);
    }

    // var lat1 = localStorage.getItem("coordenadas")!.split(",")[0];
    // var lon1 = localStorage.getItem("coordenadas")!.split(",")[1];

    //Coordenadas Orinokia
    var lat1 =  8.292362164394163;
    var lon1 = -62.742359070043264;

    //Coordenadas CDE
    // var lat1 = 8.296688605749425;
    // var lon1 = -62.71208489602171

    //Coordenadas del Centro de la UCAB
    var lat2 =8.296814168450002;
    var lon2 = -62.71148732766616;
    var distance = getDistance(Number(lat1), Number(lon1), lat2, lon2);
    console.log(distance);

    var radius = 290;
    if (distance <= radius) {
      localStorage.setItem("inUCAB", "true");
    } else {
      localStorage.setItem("inUCAB", "false");
    }

    var inUcab = localStorage.getItem("inUCAB");

    var queryVehiculos = {
      method: "get",
      url: `https://u-lift.azurewebsites.net/api/Vehicle/${email}`,
      headers: { Authorization: `Bearer ${token}` },
    };
  
    var queryRutas = {
      method: "get",
      url: `https://u-lift.azurewebsites.net/api/URoute/${email}/${inUcab}`,
      headers: { Authorization: `Bearer ${token}` },
    };
  
    var queryColas = {
      method: "get",
      //url: "https://ulift-backend.up.railway.app/api/lift/match/0/0/0/0",
      url: `https://u-lift.azurewebsites.net/api/Lift/Available/?inUcab=${inUcab}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(queryVehiculos)
      .then(function (response) {
        vehiculos = response.data;
        console.log(vehiculos);
        setFlagVehiculos(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  
    axios(queryRutas)
      .then(function (response) {
        console.log('pruebaaaaa');
        rutas = response.data;
        console.log(rutas);
        console.log(rutas.length)
        setFlagRutas(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  
    axios(queryColas)
      .then(function (response) {
        colas = response.data;
        console.log('colas');
        console.log({colas});
        setFlagColas(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  

  const openOfrecerDialog = () => {
    if (vehiculos.length === 0) {
      alert(
        "No tienes vehiculos registrados. Para poder proceder, debe registrar un vehículo en su perfil."
      );
    } else if (rutas.length === 0) {
      alert(
        "No tienes rutas registradas. Para poder proceder, debe registrar una ruta en su perfil."
      );
    } else {
      setDialogOfrecerOpen(true);
    }
  };

  const closeOfrecerDialog = () => {
    setDialogOfrecerOpen(false);
  };

  const openPedirDialog = () => {
    setDialogPedirOpen(true);
  };

  const closePedirDialog = () => {
    setDialogPedirOpen(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return ((flagColas && flagRutas && flagVehiculos)?(    
    <Box>
      <NavBar />
      <Fade in timeout={800}>
        <Box>
          <Container maxWidth="md" sx={{ p: 2 }}>
            <Box display={"flex"} flexDirection="column">
              <Typography
                color="primary"
                textAlign="left"
                fontSize={{ xs: 24 }}
                fontWeight={600}
                mb={{ xs: 2, sm: 3 }}
                mt={-5}
              >
                Conductores disponibles
              </Typography>
              {/* Si no hay nada en proceso aún */}

              {colas.length === 0 && (
                <Typography fontSize={{ xs: 14, md: 17 }}>
                  No hay ningún conductor disponible
                </Typography>
              )}

              {/* Si hay conductores disponibles, se saca de la API directamente y se muestra 
              la siguiente información */}
              {colas.length > 0 && (
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {colas.map((cola, index) => (
                    <ConductorDisponible
                      key={index}
                      color={cola.vehicle.color}
                      date={cola.lift.createdAt}
                      distanceLastNode={15}
                      driverID={cola.driver.id}
                      email={cola.driver.email}
                      gender={cola.driver.gender}
                      lastname={cola.driver.lastName}
                      liftID={cola.lift.liftId}
                      model={cola.vehicle.model}
                      name={cola.driver.name}
                      path={cola.route.path}
                      photo={cola.driver.photoURL}
                      plate={cola.vehicle.plate}
                      rName={cola.route.name}
                      rate={cola.driver.driverRating}
                      role={cola.driver.role}
                      seats={cola.vehicle.seats}
                      time={new Date()}
                      waitingTime={cola.lift.waitingTime}
                    />
                  ))}
                </Grid>
              )}
            </Box>
            <SpeedDial
              ariaLabel="acciones"
              sx={{ position: "fixed", bottom: "8%", right: "5%" }}
              icon={<SpeedDialIcon />}
              FabProps={{
                color: "secondary",
                size: "large",
              }}
            >
              <SpeedDialAction
                icon={<PedirColaIcon />}
                onClick={openPedirDialog}
                tooltipTitle="Buscar"
                tooltipOpen
              />
              {isDialogPedirOpen && (
                <BuscarColaDialogo isOpen={isDialogPedirOpen} closeDialog={closePedirDialog} />
              )}
              <SpeedDialAction
                icon={<OfrecerColaIcon />}
                onClick={openOfrecerDialog}
                tooltipTitle="Ofrecer"
                tooltipOpen
              />
              {isDialogOfrecerOpen && (
                <OfrecerColaDialogo isOpen={isDialogOfrecerOpen} closeDialog={closeOfrecerDialog} />
              )}
            </SpeedDial>
            {/* {alerta && (
              <AlertaDialogo
                isOpen={alerta}
                titulo="¡No puede ofrecer una cola aún!"
                mensaje="No tienes vehiculos registrados. Para poder proceder, debe registrar un vehículo en su perfil."
              />
            )} */}
          </Container>
        </Box>
      </Fade>
    </Box>
  ):(
  <Spinner />
  ));
};
export default Inicio;
