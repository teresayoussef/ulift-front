import { useState } from "react";
import {
  ListItem,
  Avatar,
  ListItemAvatar,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { User } from "../types";
import { grey } from "@mui/material/colors";
import InfoFavoritoDialogo from "./InfoFavoritoDialogo";

const UsuarioTarjeta = (user?: User): JSX.Element => {
  const [isInfoUserOpen, setDialogInfoUser] = useState(false);
  const openInfoUserDialog = () => {
    setDialogInfoUser(true);
  };

  const closeInfoUserDialog = () => {
    setDialogInfoUser(false);
  };

  const foto = user?.photo;

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "70px",
          boxShadow: "none",
          p: 0,
          mb: 0.5,
          borderRadius: 2,
          backgroundColor: grey[100],
        }}
        onClick={openInfoUserDialog}
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
            p: 0,
            m: 0,
          }}
        >
          <ListItem sx={{ mt: 2, height: 60 }}>
            <ListItemAvatar>
              <Avatar sx={{ width: 50, height: 50, mr:5 }} src={foto} />
            </ListItemAvatar>
            <Box >
              <Typography textAlign={"center"}>
                {user?.name} {user?.lastname}
              </Typography>
            </Box>
          </ListItem>
        </CardContent>
      </Card>
      <InfoFavoritoDialogo
        isOpen={isInfoUserOpen}
        closeDialog={closeInfoUserDialog}
        name={user?.name || ""}
        lastname={user?.lastname || ""}
        tripsAsDriver={user?.tripsAsDriver || 0}
        tripsAsPassenger={user?.tripsAsPassenger || 0}
        role={user?.role || ""}
        photo={user?.photo || ""}
        driverRating={user?.DriverRating || 0}
        passengerRating={user?.PassengerRating || 0}
      />
    </Grid>
  );
};

export default UsuarioTarjeta;
