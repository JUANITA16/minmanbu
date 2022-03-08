import React, { useEffect } from "react";
import { CardHeader } from "../components/index";

export default function Home() {
  const title = 'Error 404';
  const description = 'No tiene permisos para acceder, comuniquese con el administrador.';

  useEffect(() => {
    document.title = title
  }, []);

  return (
    <React.Fragment>
      <CardHeader title={title} description={description} />
    </React.Fragment>
  )
}