import * as React from "react";

import { grey } from "@mui/material/colors";

import {
  Dialog,
  styled,
  Box,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Avatar,
  Typography,
} from "@mui/material";
import { LocationOnRounded as LocIcon } from "@mui/icons-material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

interface DialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  name: string;
  lastname: string;
  tripsAsDriver: number;
  tripsAsPassenger: number;
  role: string;
  photo: string;
  driverRating: number;
  passengerRating: number;
}

const InfoFavoritoDialogo = (props: DialogProps) => {
  return (
    <Dialog open={props.isOpen} onClose={props.closeDialog}>
      <DialogTitle textAlign={"center"} color={"primary"}>
        Perfil
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          alignContent: "center",
          marginBottom: "3px",
        }}
      >
        {/* Aquí se tiene que cambiar para colocar la imagen */}

        <Avatar sx={{ width: 50, height: 50 }} src={props.photo} />
        <br></br>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "18px",
            marginBottom: "2px",
          }}
        >
          {props.name}
        </Typography>
        <Typography>N° de viajes como Conductor: {props.tripsAsDriver}</Typography>
        <Typography>Rating de Conductor: {props.driverRating.toFixed(1)}</Typography>
        <br></br>
        <Typography>N° de viajes como Pasajero: {props.tripsAsPassenger}</Typography>
        <Typography>Rating de Pasajero: {props.passengerRating.toFixed(1)}</Typography>
      </DialogContent>
    </Dialog>
  );
};
export default InfoFavoritoDialogo;
