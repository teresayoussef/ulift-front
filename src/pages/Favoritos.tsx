import { Box, Container, Typography, Fab, Button } from "@mui/material";
import Fade from "@mui/material/Fade";
import React, { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import PasajeroFavoritoDialogo from "../components/PasajeroFavoritoDialogo";
import { Add as AgregarUsuarioIcon } from "@mui/icons-material";
import ListaPasajeros from "../components/ListaPasajeros";
import axios from "axios";
import { User } from "../types";
import UsuarioTarjeta from "../components/UsuarioTarjeta";

export type Root = Root2[]

export interface Root2 {
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
  liftCountAsDriver: number
  liftCountAsPassenger: number
  status: string
}


export interface Id {
  timestamp: number
  machine: number
  pid: number
  increment: number
  creationTime: string
}

const Favoritos = (): JSX.Element => {

  const [favoritos, setFavoritos] = useState<Root>([]);

  const fetchFav = () => {
    const token = localStorage.getItem("token");

    const email = localStorage.getItem("email");

    var config = {
      method: "get",
      url: `https://u-lift.azurewebsites.net/api/Favorite/${email}`,
      headers: { Authorization: `Bearer ${token}` }
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const data: Root = response.data;
        setFavoritos(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [isDialogPasajeroFavoritoOpen, setDialogPasajeroFavoritoOpen] = useState(false);
  const [value, setValue] = React.useState("1");
  const openPasajeroFavoritoDialog = () => {
    setDialogPasajeroFavoritoOpen(true);
  };

  const closePasajeroFavoritoDialog = () => {
    setDialogPasajeroFavoritoOpen(false);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchFav();
  }, []);

  return (
    <Box>
      <NavBar />
      <Fade in timeout={800}>
        <Box>
          <Container maxWidth="md">
            <Typography
              color="primary"
              textAlign="left"
              fontSize={{ xs: 24 }}
              fontWeight={600}
              mb={{ xs: 2, sm: 3 }}
              mt={-2}
            >
              Favoritos
            </Typography>

            {favoritos.length === 0 && (
              <Typography fontSize={{ xs: 14, md: 17 }}>
                Aun no tienes usuarios favoritos
              </Typography>
            )}
          
            {favoritos.length > 0 && 
              <Box display={"flex"} flexDirection="column">{
                favoritos.map((favorito, index) => (
                  <UsuarioTarjeta
                  key={index}
                  id={favorito.email}
                  name={favorito.name}
                  lastname={favorito.lastName}
                  email={favorito.email}
                  role={favorito.role}
                  gender={favorito.gender}
                  photo={favorito.photoURL}
                  tripsAsDriver={favorito.liftCountAsDriver}
                  tripsAsPassenger={favorito.liftCountAsPassenger}
                  DriverRating={favorito.driverRating}
                  PassengerRating={favorito.passengerRating}
                  emergencyContact={favorito.emergencyContact}
                  emergencyName={favorito.emergencyContact}
                  vehicles={[]}
                  destinations={[]}
                  routes={[]}
                  />
                ))}
              </Box>
            }


            <Fab
              aria-label="agregar"
              color="secondary"
              size="large"
              sx={{
                position: "fixed",
                bottom: "8%",
                right: "5%",
              }}
              onClick={openPasajeroFavoritoDialog}
            >
              <AgregarUsuarioIcon />
            </Fab>
            <PasajeroFavoritoDialogo
              isOpen={isDialogPasajeroFavoritoOpen}
              closeDialog={closePasajeroFavoritoDialog}
            />
          </Container>
        </Box>
      </Fade>{" "}
    </Box>
  );
};

export default Favoritos;
