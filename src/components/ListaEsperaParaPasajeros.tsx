import * as React from "react"; 
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { ChatRounded, HailRounded as PedirColaIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { grey } from "@mui/material/colors";
import axios from "axios";
import { LiftContext } from "../contexts/LiftsContext";
import { Driver, Lift, Route, Vehicle } from "../pages/Inicio";

interface ColasDisponibles {
  color: string;
  date: Date;
  distanceLastNode: number;
  driverID: string;
  email: string;
  gender: string;
  lastName: string;
  liftID: string;
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

const ListaEsperaParaPasajeros = (): JSX.Element => {
  const {liftsList} = React.useContext(LiftContext);
  var pasajeros: ColasDisponibles[] = [];

  const fetchUser = async () => {
    var requestsString = JSON.parse(localStorage.getItem("conductores")!);
    pasajeros = requestsString;
  };

  fetchUser();
  React.useEffect(()=>{
    console.log({liftsList})
  }, [])

  return (
    <Box display={"flex"} flexDirection="column">
      {/* {JSON.stringify(liftsList)} */}
      {liftsList.map((cola, index) => (
        <Conductor
          key={index}
          color={cola.vehicle.color}
          date={cola.lift.createdAt}
          distanceLastNode={15}
          driverID={cola.driver.id}
          email={cola.driver.email}
          gender={cola.driver.gender}
          lastName={cola.driver.lastName}
          liftID={cola.lift.liftId}
          model={cola.vehicle.model}
          name={cola.driver.name}
          path={cola.route.path}
          photo={cola.driver.photoURL}
          plate={cola.vehicle.plate}
          rName={cola.route.name}
          rate={cola.driver.driverRating}
          role={cola.driver.role}
          seats={cola.lift.seats}
          time={cola.lift.createdAt}
          waitingTime={cola.lift.waitingTime}
        />
      ))}
    </Box>
  );
};

export default ListaEsperaParaPasajeros;

// foto del usuario
export const Conductor = (usuario: ColasDisponibles): JSX.Element => {
  const foto = usuario.photo;

  console.log({usuario})

  const navigate = useNavigate();

  const handleClick = (id: string) => () => {
    console.log({id});

    const Email = localStorage.getItem("email");
    console.log(usuario.liftID);
    const data = JSON.stringify({
      liftId: usuario.liftID,
      passengerEmail: Email,  
    });

    const token = localStorage.getItem("token");

    const config = {
      method: "post",
      url: "https://ulift.azurewebsites.net/api/WaitingList/Request",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data.message));
        setTimeout(() => {
          navigate("/colaEnProceso/SalaDeEspera");
        }, 5000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const goChat = (id: string) => () => {
    navigate("/chatPrivado/" + id);
  };

  return (
    <Card
      sx={{
        width: "95%",
        height: "60px",
        backgroundColor: grey[100],
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
          <Avatar sx={{ width: 50, height: 50, marginBottom: 1 }} src={foto} />
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
          {/* <IconButton sx={{ marginRight: 1 }} onClick={goChat(usuario.driverID.toString())}>
            <ChatRounded color="primary" />
          </IconButton> */}
          <IconButton sx={{ marginRight: 1 }} onClick={handleClick(usuario.liftID)}>
            <PedirColaIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};
