/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useMsal } from "@azure/msal-react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


const MINUTES = 10;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;
export default function IdleLogout() {
  // timeout is set in mins * seconds * 1000, time is measured in miliseconds.
  const timeout = MINUTES * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;

  // React Hooks for idle timer
  const [setIsIdle] = useState(false);
  const [isPromptOpen, setisPromptOpen] = useState(false);

  // functions to execute when is idle or active
  const handleOnActive = () => setIsIdle(false);
  const handleOnIdle = () => setisPromptOpen(true);

  // Azure AD instance obtained
  const { instance } = useMsal();
  const homeAccountId = instance.getActiveAccount()?.homeAccountId;


  const handleLogout = function (_event) {
    const logoutRequest = {
      account: instance.getAccountByHomeId(homeAccountId),
      postLogoutRedirectUri: process.env.REACT_APP_REDIRECT_URI
    }
    instance.logoutRedirect(logoutRequest).catch((e)=>{console.error('Logout error:', e);});
    reset();
    setisPromptOpen(false);
  };

  // Idle timer hook started
  const {
    start,
    reset
  } = useIdleTimer({
    timeout,
    onActive: handleOnActive,
    onIdle: handleOnIdle,
    startOnMount: true,
    startManually: false,
    events: [
      'keydown',
      'wheel',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'visibilitychange'
    ],
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
          Señor usuario su sesión cerró por tiempo de inactividad.
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
