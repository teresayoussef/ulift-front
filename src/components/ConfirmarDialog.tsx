import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface DialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  startTrip: () => void;
  selected: number;
}

const ConfirmarDialogo = ({ isOpen, closeDialog, startTrip, selected }: DialogProps) => {
  const [puestos, setPuestos] = useState<number>(() => {
    const puestos = localStorage.getItem("puestos");

    if (puestos) {
      return parseInt(puestos);
    }
    return 0;
  });

  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <DialogTitle>Confirmar pasajeros</DialogTitle>
      <DialogContent>
        <DialogContentText>¿Está seguro que desea aceptar a estos pasajeros?</DialogContentText>
        {selected < puestos && (
          <DialogContentText>
            No has llenado tus asientos {selected}/{puestos}{" "}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancelar</Button>
        <Button onClick={startTrip}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmarDialogo;
