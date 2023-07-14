import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  Typography,
} from "@mui/material";
import { ChatRounded, CheckBox, DriveEtaRounded as LocIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { User } from "../types";
import axios from "axios";
import { useSnackbar } from "notistack";

interface ColasDisponibles {
  color: string;
  date: Date;
  distanceLastNode: number;
  id: number;
  email: string;
  gender: string;
  lastname: string;
  liftID: number;
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

interface SolicitudUsuarios {
  usuario: ColasDisponibles;
  solicitudes: ColasDisponibles[];
}

export type Root = Root2[];

export interface Root2 {
  waitingList: WaitingList;
  user: UserData;
}

export interface WaitingList {
  liftId: string;
  passengerEmail: string;
}

export interface UserData {
  email: string;
  password: string;
  name: string;
  lastName: string;
  photoURL: string;
  gender: string;
  role: string;
  emergencyContact: string;
  passengerRating: number;
  driverRating: number;
  confirmedUser: boolean;
  liftCount: number;
  status: string;
}

export interface solicitud {
  usuario: Root2;
  solicitudes: Root2[];
  elegidos: Root;
  setElegidos: React.Dispatch<React.SetStateAction<Root>>;
}

var elegidos: ColasDisponibles[] = [];
var flag: boolean = false;
var requests: ColasDisponibles[] = [];

const ListaEsperaParaConductores = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const fetchUser = async () => {
    requests = [];
  };
  fetchUser();
  const navigate = useNavigate();

  const [requestsData, setRequestsData] = useState<Root>([] as Root);
  const [selecteds, setSelecteds] = useState<Root>([] as Root);

  const getRequests = async () => {
    console.log("hola");

    //api/Lift/Requests/{liftId}
    const liftId = localStorage.getItem("liftID");

    const config = {
      method: "get",
      url: `https://ulift.azurewebsites.net/api/WaitingList/Requests/${liftId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log("-------------------");
        console.log(JSON.stringify(response.data));

        const data: Root = response.data;

        setRequestsData([...data] as Root);

        // requests = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getRequests();
  }, []);

  function empezarViaje() {
    //aqui se debe pasar la lista de elegidos a la cola en proceso
    let j = 0;
    for (let i = 0; i < elegidos.length; i++) {
      var data = JSON.stringify({
        id: elegidos[i].id,
        dNumber: 1,
      });
      console.log(data);
      //WaitingList/Requests/{liftId}
      // //AcceptRequest
      // var config = {
      //   method: "post",
      //   url: "https://ulift-backend.up.railway.app/api/lift/accept",
      //   //https://ulift.azurewebsites.net/api/Lift/AcceptRequest
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     "Content-Type": "application/json",
      //   },
      //   data: data,
      // };

      // //StartLift
      // var startLift = {
      //   method: "post",
      //   url: "https://ulift-backend.up.railway.app/api/lift/start",
      //   //https://ulift.azurewebsites.net/api/Lift/StartLift
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // };

      // axios(config).then(function (response) {
      //   console.log("Ejecutando accept");
      //   console.log(JSON.stringify(response.data.message));
      // });

      // axios(startLift).then(function (response) {
      //   console.log("Ejecutando start");
      //   console.log(JSON.stringify(response.data));
      // });
    }

    var dataLift = JSON.stringify({
      liftID: localStorage.getItem("liftID"),
    });

    // var createRatings = {
    //   method: "post",
    //   url: "https://ulift-backend.up.railway.app/api/lift/createR",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     "Content-Type": "application/json",
    //   },
    //   data: dataLift,
    // };

    // axios(createRatings).then(function (response) {
    //   console.log("Ejecutando create ratings");
    //   console.log(JSON.stringify(response.data));
    //   enqueueSnackbar("El viaje ya va a comenzar ", { variant: "info" });
    //   setTimeout(() => {
    //     localStorage.setItem("elegidos", JSON.stringify(elegidos));
    //     flag = true;
    //     navigate("/colaEnProceso/conductor");
    //   }, 8000);
    // });
  }

  const startTrip = async () => {
    const token = localStorage.getItem("token");
    const liftId = localStorage.getItem("liftID");

    if (selecteds.length > 0) {
      const processRequest = async (index:number) => {
        if (index >= selecteds.length) {
          // All requests processed
          console.log("All requests processed");
          enqueueSnackbar("Se han aceptado las solicitudes", { variant: "success" });
    
          setTimeout(() => {
            const config = {
              method: "post",
              url: `https://ulift.azurewebsites.net/api/Lift/StartLift/${liftId}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            };
            axios(config)
              .then(function (response) {
                console.log(response.data);
                enqueueSnackbar("El viaje ya va a comenzar ", { variant: "info" });
                setTimeout(() => {
                  localStorage.setItem("elegidos", JSON.stringify(selecteds));
                  flag = true;
                  navigate("/colaEnProceso/conductor");
                }, 6000);
              })
              .catch(function (error) {
                console.log(error);
                enqueueSnackbar("Ha ocurrido un error", { variant: "error" });
              });
          }, 3000);
    
          return;
        }
    
        const user = selecteds[index];
    
        const config = {
          method: "post",
          url: `https://ulift.azurewebsites.net/api/Lift/AcceptRequest/${user.waitingList.liftId}/${user.waitingList.passengerEmail}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
    
        try {
          const response = await axios(config);
          console.log(`Request ${index + 1} success:`, response.data);
        } catch (error) {
          console.log(`Request ${index + 1} error:`, error);
          enqueueSnackbar("Ha ocurrido un error", { variant: "error" });
        }
    
        // Process next request
        processRequest(index + 1);
      };
    
      processRequest(0);
    } else {
      enqueueSnackbar("No ha seleccionado ningún pasajero", { variant: "error" });
    }
    

  }

  return (
    <Box display={"flex"} flexDirection="column" alignItems="center" justifyContent="center">
      {/* Cuando haya seleccionado al menos uno o el límite indicado y si es conductor , debe habilitarse esta opción */}
      {flag && (
        <Typography fontSize={{ xs: 14, md: 17 }} mb={{ xs: 2, sm: 3 }}>
          Proceso terminado
        </Typography>
      )}
      {!flag && (
        <List dense sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          {/* {requests.map((user, index) => (
            // <PasajeroListaEspera usuario={user} solicitudes={requests} key={index} />
          ))} */}
          {requestsData.map((request, index) => (
            <PasajeroListaEspera
              usuario={request}
              solicitudes={requestsData}
              elegidos={selecteds}
              setElegidos={setSelecteds}
              key={index}
            />
          ))}
        </List>
      )}

      {!flag && requestsData.length > 0 && (
        <Button
          variant="contained"
          onClick={startTrip}
          style={{
            marginTop: "20px",
          }}
        >
          Empezar viaje
        </Button>
      )}
    </Box>
  );
};

export default ListaEsperaParaConductores;

export const PasajeroListaEspera = ({
  usuario,
  solicitudes,
  elegidos,
  setElegidos,
}: solicitud): JSX.Element => {
  const foto = usuario.user.photoURL;
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  // console.log(
  //   "arreglo de requests " + requests.flatMap((usuario) => usuario.nameU + " " + usuario.id)
  // );
  const handleClick = (email: string) => () => {
    if (isActive === false) {
      setIsActive((current) => !current);
      setElegidos((current) => [...current, usuario]);
      // console.log(elegidos.flatMap((usuario) => usuario.nameU + " " + usuario.id));
    } else {
      if (solicitudes.find((usuario) => usuario.user.email === email)) {
        setIsActive((current) => !current);
        // elegidos.splice(
        //   elegidos.indexOf(solicitudes.find((usuario) => usuario.id === id) as ColasDisponibles),
        //   1
        // );
        // use setElegidos to update the state deleting the user with email === email
        setElegidos((current) => current.filter((user) => user.user.email !== email));
      }
    }

    // setIsActive(true);
  };
  const goChat = (id: number) => () => {
    navigate("/chatPrivado/" + id);
  };

  return (
    <Card
      sx={{
        width: "95%",
        height: "60px",
        backgroundColor: isActive ? "#40B4E5" : grey[100],
        color: isActive ? "white" : "",
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
            {usuario.user.name} {usuario.user.lastName}
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
          <Button sx={{ marginRight: 1 }} onClick={handleClick(usuario.user.email)}>
            Seleccionar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
