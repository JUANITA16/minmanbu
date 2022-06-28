/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useMsal } from "@azure/msal-react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


export default function IdleLogout() {
  const timeout = 5000;
  const [isIdle, setIsIdle] = useState(false);
  const [isPromptOpen, setisPromptOpen] = useState(false);

  const handleOnActive = () => setIsIdle(false);
  const handleOnIdle = () => setisPromptOpen(true);

  const { instance } = useMsal();
  let homeAccountId = instance.getActiveAccount()?.homeAccountId;
  const handleLogout = function (event) {
    const logoutRequest = {
      account: instance.getAccountByHomeId(homeAccountId),
      postLogoutRedirectUri: process.env.REACT_APP_REDIRECT_URI
    }
    instance.logoutRedirect(logoutRequest).catch((e)=>console.error(e));
    reset();
    setisPromptOpen(false);
  };

  const {
    start,
    reset
  } = useIdleTimer({
    timeout,
    onActive: handleOnActive,
    onIdle: handleOnIdle,
    startOnMount: true,
    startManually: false
  });


  useEffect(() => {
    start()
    }, []);

  return (
    <Dialog
      open={isPromptOpen}
      onClose={handleLogout}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">
        {"La sesión ha expirado."}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Señor usuario su sesión cerro por tiempo de inactividad.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
