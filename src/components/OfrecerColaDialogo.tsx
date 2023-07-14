import * as React from "react";

import {
  Autocomplete,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import {
  AlarmRounded as TimeIcon,
  EmojiPeopleRounded as PasajerosIcon,
  DirectionsCar as CarIcon,
  RampLeftRounded as RutaIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { useSnackbar } from "notistack";
import api_instance from "../api/api_instance";
import { useEffect } from "react";
import axios from "axios";

interface DialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}
var rutas: string[] = [];
var vehiculos: string[] = [];

const email = localStorage.getItem("email");
const OfrecerColaDialogo = ({ isOpen, closeDialog }: DialogProps) => {
  const url = `https://ulift.azurewebsites.net/api/User/${email}`;
  // const url = "http://localhost:3000/api/user/profile";
  const inUcab = localStorage.getItem("inUCAB");
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const response = await api_instance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(response.data);

    for (let i = 0; i <= vehiculos.length; i++) {
      vehiculos.pop();
    }

    for (let i = 0; i <= rutas.length; i++) {
      rutas.pop();
    }

    for (let i = 0; i < response.data.vehicles.length; i++) {
      vehiculos.push(response.data.vehicles[i].plate + " - " + response.data.vehicles[i].model);
    }

    console.log("ji");
    console.log(response.data.uRoutes);

    if (inUcab === "true") {
      console.log("entro");
      for (let i = 0; i < response.data.uRoutes.length; i++) {
        if (response.data.uRoutes[i].inUcab === true) {
          rutas.push(response.data.uRoutes[i].name);
        }
      }
    } else {
      for (let i = 0; i < response.data.uRoutes.length; i++) {
        if (response.data.uRoutes[i].inUcab === false) {
          console.log(response.data.uRoutes[i].name);
          console.log(response.data.uRoutes[i].inUcab);
          rutas.push(response.data.uRoutes[i].name);
        }
      }
    }
  };
  useEffect(() => {
    fetchUser();
  }, [isOpen]);

  //CAMBIAR ESTRUCTURA DEL COMPONENTE SIMILAR A LA BD
  interface ColasDisponibles {
    id: string;
    email: string;
    nameU: string;
    lastname: string;
    liftID: number;
    photo: string;
    role: string;
  }

  const [direccion, setDireccion] = React.useState("");
  const [vehiculo, setVehiculo] = React.useState("");
  const [puestos, setPuestos] = React.useState(0);
  const [tiempo, setTiempo] = React.useState(0);
  const [mujeresOnly, setMujeresOnly] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  var requests: ColasDisponibles[] = [];

  const irListaEspera = () => {
    if (direccion !== "" && vehiculo !== "" && puestos >= 1 && tiempo > 1) {
      //Aquí veo el estado de los hooks para mandar esta info a la BD
      //obtengo de la dirección(ruta) y vehículo el id correspondiente de su PK compuesta

      const token = localStorage.getItem("token");
      // const url = "http://localhost:3000/api/lift";
      var data = JSON.stringify({
        driverEmail: email,
        plate: vehiculo.split(" - ")[0],
        route: direccion.split(" - ")[0],
        seats: puestos,
        waitingTime: tiempo,
      });

      console.log(data);

      const config = {
        method: "post",
        url: "https://ulift.azurewebsites.net/api/Lift/Create",
        //url: "https://localhost:7007/api/Lift/Create",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      // var requestAConductores = {
      //   method: "get",
      //   //REESCRIBIR URL NUEVO - Todos los usuarios que te han pedido una cola
      //   url: "https://ulift-backend.up.railway.app/api/lift/requests",
      //   headers: { Authorization: `Bearer ${token}` },
      // };

      axios(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          enqueueSnackbar("Cola creada, espera que alguien te envie una solicitud", {
            variant: "success",
          });
          localStorage.setItem("liftID", response.data.liftId);
          //wait 3 seconds
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
          console.log(response.data);
          console.log(response.data.liftId);
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");

          setTimeout(() => {
            navigate("/listaEspera/conductor");
          }, 3000);
          // axios(requestAConductores).then((res) => {
          //   requests = res.data.requests;
          //   localStorage.setItem("requests", JSON.stringify(requests));

          // });
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar("¡Error a crear la cola!", { variant: "error" });
        });

      //Limpio los arreglos por si cambian
      for (let i = 0; i < vehiculos.length; i++) {
        vehiculos.pop();
      }

      for (let i = 0; i < rutas.length; i++) {
        rutas.pop();
      }
      rutas = [];
      vehiculos = [];
    } else {
      enqueueSnackbar("¡Espera, tienes que completar todos los campos de manera válida!", {
        variant: "error",
      });
    }
  };
  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <DialogTitle textAlign={"center"} color={"primary"}>
        ¿A donde puedes dar una cola?
      </DialogTitle>
      <DialogContent>
        <FormControl>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                margin: 2,
                width: "100%",
              }}
            >
              {" "}
              <RutaIcon color="warning" fontSize="large" />
              <FormControl fullWidth>
                <Autocomplete
                  onChange={(event, value) => setDireccion(value as string)}
                  options={rutas}
                  id="direccionDestino-label"
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Ruta" />}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                margin: 2,
                width: "100%",
              }}
            >
              <CarIcon color="secondary" fontSize="large" />
              <FormControl fullWidth>
                <Autocomplete
                  onChange={(event, value) => setVehiculo(value as string)}
                  options={vehiculos}
                  id="vehiculo-label"
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Vehículo" />}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                margin: 2,
                width: "100%",
              }}
            >
              <PasajerosIcon color="success" fontSize="large" />
              <TextField
                fullWidth
                id="cantPasajeros"
                label="Cantidad de pasajeros"
                variant="outlined"
                required
                type="number"
                onChange={(e) => setPuestos(parseInt(e.target.value))}
              />
            </Box>{" "}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                margin: 2,
                width: "100%",
              }}
            >
              <TimeIcon color="primary" fontSize="large" />
              <TextField
                fullWidth
                id="tiempoEspera"
                label="Tiempo a esperar (minutos)"
                variant="outlined"
                required
                type="number"
                onChange={(e) => setTiempo(parseInt(e.target.value))}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            ></Box>
            <LoadingButton onClick={irListaEspera} variant="text">
              Aceptar
            </LoadingButton>
          </Box>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};
export default OfrecerColaDialogo;
