import React from "react";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import AppointmentForm from "../components/AppointmentForm";

export default function _AppointmentEditForm() {
  return (
    <React.Fragment>
      <Grid item xs={12} md={12} lg={12}>
        <Typography component="h1" variant="h4">
          Editar consulta{" "}
        </Typography>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <AppointmentForm edit></AppointmentForm>
      </Grid>
    </React.Fragment>
  );
}
