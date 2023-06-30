import * as React from "react";
import {
  Checkbox,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  FormControl,
  TextField,
  Autocomplete,
} from "@mui/material";
import {
  DirectionsWalkRounded as CaminarIcon,
  LocationOnRounded as LocIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api_instance from "../api/api_instance";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import axios from "axios";
import { Driver, Lift, Route, Vehicle } from "../pages/Inicio";
import { LiftContext } from "../contexts/LiftsContext";

interface DialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}
//CAMBIAR ESTRUCTURA DEL COMPONENTE SIMILAR A LA BD
interface ColasDisponibles {
  color: string;
  date: Date;
  distanceLastNode: number;
  driverID: number;
  email: string;
  gender: string;
  lastname: string;
  liftID: number;
  model: string;
  name: string;
  path: string;
  photo: string;
  plate: string;
  rName: string;
  rate: number;
  role: string;
  seats: number;
  time: Date;
  waitingTime: number;
}

export interface lifts {
  lift: Lift
  driver: Driver
  route: Route
  vehicle: Vehicle
}


var destinos: string[] = [];
var conductores: lifts[] = [];

interface latLng {
  lat:number;
  lng:number;
}

const BuscarColaDialogo = ({ isOpen, closeDialog }: DialogProps) => {
  //var destinos: Destination[] = [];
  const {setLiftList, liftsList} = React.useContext(LiftContext)
  const [destinationsLatLng, setDestinationsLatLng] = React.useState<latLng[]>([])

  const email = localStorage.getItem("email");
  const url = `https://ulift.azurewebsites.net/api/User/${email}`;
  //const url = "http://localhost:3000/api/user/profile";
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const response = await api_instance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    for (let i = 0; i <= destinos.length; i++) {
      destinos.pop();
    }

    for (let i = 0; i < response.data.destinations.length; i++) {

      const dest: latLng = {
        lat: response.data.destinations[i].lat,
        lng: response.data.destinations[i].lng
      }
      setDestinationsLatLng([...destinationsLatLng, dest])

      destinos.push(
        i + " - " + response.data.destinations[i].name
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const [direccion, setDireccion] = React.useState("");
  const [metros, setMetros] = React.useState(0);
  const [mujeresOnly, setMujeresOnly] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const pedirCola = async (url: string, token: string) => {
    var config = {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then(function (response) {
        enqueueSnackbar("¡Solicitud de cola creada con exito! Espera que un conductor te acepte.", {
          variant: "success",
        });
        //guardo en localStorage los conductores disponibles

        conductores = response.data.lifts;
        setLiftList(conductores);

        setTimeout(() => {
          navigate("/listaEspera/pasajero");
        }, 5000);
      })
      .catch(function (error) {
        enqueueSnackbar("¡No se pudo crear la solicitud de cola!", {
          variant: "error",
        });
      });
  };

  const irListaEspera = () => {
    if (direccion !== "" && metros.toString() !== "") {
      const token = localStorage.getItem("token");
      //AQUI MANDA 0 SI NO SELECCIONA LA OPCION Y 1 SI ESTA ACTIVADA
      var mujeres = false;
      if (mujeresOnly) {
        mujeres = true;
      }
      var lat: number = 0;
      var lng: number = 0;

      console.log(direccion)

      const index = direccion[0]

      if(typeof(index) === 'number'){
        const dest = destinationsLatLng[index as number]
        lat = dest.lat
        lng = dest.lng
      }

      const url =
      "https://ulift.azurewebsites.net/api/Lift/" +           
      lat +
      "/" +
      lng +
      "/" +
      mujeres +
      "/" +
      metros;
      pedirCola(url, token!);
     

      destinos = [];
    } else {
      enqueueSnackbar("¡Espera, tienes que completar todos los campos de manera válida!", {
        variant: "error",
      });
    }
  };
  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <DialogTitle textAlign={"center"} color={"primary"}>
        ¿A donde necesitas una cola?
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-around",
            margin: 2,
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
            <LocIcon color="warning" fontSize="large" />
            <FormControl fullWidth>
              <Autocomplete
                onChange={(event, value) => setDireccion(value as string)}
                options={destinos}
                id="direccionDestino-label"
                fullWidth
                renderInput={(params) => <TextField {...params} label="Destino" />}
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
            <CaminarIcon color="info" fontSize="large" />
            <TextField
              fullWidth
              id="metros"
              label="Metros dispuestos a caminar"
              variant="outlined"
              required
              type="number"
              onChange={(e) => setMetros(parseInt(e.target.value))}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Checkbox
              sx={{ "& .MuiSvgIcon-root": { fontSize: 24 } }}
              inputProps={{
                "aria-label": "Solo aceptar mujeres",
              }}
              id="mujeresOnly"
              onChange={(e) => setMujeresOnly(e.target.checked)}
            />
            <Typography>Solo aceptar mujeres</Typography>
          </Box>

          <LoadingButton onClick={irListaEspera} variant="text">
            Aceptar
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default BuscarColaDialogo;
