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

const OpcionesChatConductor = (): JSX.Element => {

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
              Elige el pasajero con el que quieras chatear
            </Typography>

            {/* {favoritos.length === 0 && (
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
                  trips={favorito.liftCount}
                  rating={favorito.passengerRating}
                  emergencyContact={favorito.emergencyContact}
                  emergencyName={favorito.emergencyContact}
                  vehicles={[]}
                  destinations={[]}
                  routes={[]}
                  />
                ))}
              </Box> */}
          </Container>
        </Box>
      </Fade>{" "}
    </Box>
  );
};

export default OpcionesChatConductor;
