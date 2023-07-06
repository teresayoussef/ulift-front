import React from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import { User } from "../types";
import { grey } from "@mui/material/colors";
import RatingDialogo from "./RatingDialogo";
import RatingPasajeros from "./RatingPasajeros";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

interface ColasDisponibles {
  color: string;
  date: Date;
  distanceLastNode: number;
  id: number | string;
  email: string;
  gender: string;
  lastname: string;
  liftID: number | string;
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

export interface solicitud {
  usuario: Root2;
  solicitudes: Root2[];
  elegidos: Root;
  setElegidos: React.Dispatch<React.SetStateAction<Root>>;
}


const CheckParaConductores = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [passengersData, setPassengersData] = React.useState<Root>([]);

  var pasajeros: ColasDisponibles[] = [];

  const [open, setOpen] = React.useState(false);

  const abrirDialogo = () => {
    setOpen(true);
  };
  const cerrarDialogo = () => {
    setOpen(false);
  };

  const liftID = localStorage.getItem("liftID");
    const finViaje = () => {
      const config = {
        method: "get",
        url: `https://ulift.azurewebsites.net/api/Lift/checkPassengerArriving?liftId=${liftID}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      };
      axios(config)
        .then(function (response) {
          const result = response.data;
  
          if (!result) {
            enqueueSnackbar("No todos tus pasajeros llegaron a su destino. Asegurate si deseas finalizar la cola", {
              variant: "success",
            });
          }
          else{
            enqueueSnackbar("Cola finalizada, recuerda calificar a tus pasajeros.", {
              variant: "success",
            });
            setTimeout(() => {
              navigate("/rating/conductor");
            }, 5000);
          }
          
        })
        .catch(function (error) {
          console.log(error);
        });


    // var config = {
    //   method: "put",
    //   url: `https://ulift.azurewebsites.net/api/Lift/complete/${localStorage.getItem("liftID")}`,
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //   },
    // };
    // axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //     enqueueSnackbar("Cola finalizada, recuerda calificar a tus pasajeros.", {
    //       variant: "success",
    //     });
    //     setTimeout(() => {
    //       navigate("/rating/conductor");
    //     }, 5000);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  const fetchUser = async () => {
    // var requestsString = JSON.parse(localStorage.getItem("requests")!);
    // requests = requestsString;
    // console.log("arreglo de requests" + requests);

    var elegidosString: Root = JSON.parse(localStorage.getItem("elegidos")!);
    setPassengersData(elegidosString);
  };

  React.useEffect(() => {
    fetchUser();
  } , []);

  return (
    <Box>
      <Typography fontSize={{ xs: 14, md: 17 }} textAlign="left">
        Marca los pasajeros a medida que los vas dejando en sus destinos.
      </Typography>
      <Container
        maxWidth="md"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <List dense sx={{ width: "100%", maxWidth: 360 }}>
          {passengersData.map((user) => (
            <UserListItem
              key={user.user.email}
              id={user.user.email}
              nameU={user.user.name}
              lastname={user.user.lastName}
              email={user.user.email}
              role={user.user.role}
              gender={user.user.gender}
              photo={user.user.photoURL}
              color={"Amarillo"}
              date={new Date()}
              distanceLastNode={15}
              liftID={user.waitingList.liftId}
              model={"Aveo"}
              path={"Aveo"}
              plate={"Aveo"}
              rName={"Aveo"}
              rate={user.user.passengerRating}
              seats={4}
              time={new Date()}
              waitingTime={15}
              newRate={user.user.passengerRating}
            />
          ))}
        </List>
      </Container>
      <Button variant="contained" sx={{ width: "100%", marginTop: "10px" }} onClick={finViaje}>
        Finalizar viaje
      </Button>
      {/* {open && <RatingPasajeros isOpen={open} closeDialog={cerrarDialogo} p={pasajeros} />} */}
    </Box>
  );
};

export default CheckParaConductores;

export const UserListItem = (user: ColasDisponibles): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const foto = user.photo;
  const [checked, setChecked] = React.useState([] as (string | number)[]);

  const handleToggle = (value: number | string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    const d = new Date();
    let hour = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    setChecked(newChecked);

    //Aquí se debe mandar a la bd o agregar a un arreglo la info de cuando se dejó

    // var config = {
    //   method: "post",
    //   url: "https://ulift-backend.up.railway.app/api/lift/driverCheck/" + value,
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // };

    // axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //     enqueueSnackbar("Viaje de " + value + " finalizado a las: " + hour, {
    //       variant: "info",
    //     });

    //     setChecked(newChecked);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Checkbox
          edge="end"
          onChange={handleToggle(user.id)}
          checked={checked.indexOf(user.id) !== -1}
          disabled={checked.indexOf(user.id) !== -1}
        />
      }
      sx={{
        width: "100%",
        height: "60px",
        mt: 1.5,
        backgroundColor: grey[100],
        borderRadius: 2,
      }}
    >
      <ListItemButton>
        <ListItemAvatar>
          <Avatar sx={{ width: 50, height: 50 }} src={foto} />
        </ListItemAvatar>
        <Typography sx={{ fontWeight: 600, marginLeft: 1 }}>
          {user.nameU} {user.lastname}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
};
