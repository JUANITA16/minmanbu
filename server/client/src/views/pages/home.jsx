import React, { useEffect } from "react";
import { CardHeader } from "../components/index";
import { useMsal } from "@azure/msal-react";

export default function Home() {
  const { instance } = useMsal();
  const { name } = instance.getActiveAccount().idTokenClaims;
  const base = process.env.PUBLIC_URL;
  const title = 'Inicio';
  const description = 'Bienvenido ' +name+' a MinMambu página principal.';

  useEffect(() => {
    document.title = title
  }, []);

  return (
    <React.Fragment>
      <CardHeader title={title} description={description } />
    </React.Fragment>
  )
}