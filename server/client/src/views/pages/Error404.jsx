import { useMsal } from "@azure/msal-react";
import React, { useEffect } from "react";
import { CardHeader } from "../components/index";

export default function Error404() {
  const { instance } = useMsal();
  const { name } = instance.getActiveAccount().idTokenClaims;
  const title = 'Error 404';
  const description = name +' No tiene permisos para acceder, comuniquese con el administrador.';

  useEffect(() => {
    document.title = title
  }, []);

  return (
    <React.Fragment>
      <CardHeader title={title} description={description} />
    </React.Fragment>
  )
}