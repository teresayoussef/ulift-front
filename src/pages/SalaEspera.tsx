import React from "react";
import { Box, Button, Container, Typography, Fade } from "@mui/material";
import { User } from "../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import "animate.css";
import { useSnackbar } from "notistack";

const SalaDeEspera = (): JSX.Element => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {}, []);

  var config = {
    method: "get",
    url: `https://ulift.azurewebsites.net/api/Lift/checkAcceptCola?email=${localStorage.getItem(
      "email"
    )}&liftId=${localStorage.getItem("liftID")}`,
  };

  axios(config).then(function (response) {
    console.log(JSON.stringify(response.data));
    const data: boolean = response.data;
    if (data) {
      navigate("/colaEnProceso/pasajero");
    } else {
      enqueueSnackbar("El conductor no ha aceptado tu solicitud", {
        variant: "error",
      });
    }
  });
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
          <Container maxWidth="md" sx={{ p: 3, alignItems: "center", justifyContent: "center" }}>
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
              className="animate__animated animate__flash animate__infinite animate__slower"
            >
              <EmojiPeopleIcon sx={{ fontSize: 200 }} color="primary" />
            </Box>

            <Typography color="primary" textAlign="center" variant="h4" sx={{ mt: 5, mb: 5 }}>
              Esperando a que el conductor acepte...
            </Typography>
          </Container>
          <Button
            onClick={() => {
              window.location.reload();
            }}
            sx={{
              mt: 5,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            Refrescar
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};

export default SalaDeEspera;
