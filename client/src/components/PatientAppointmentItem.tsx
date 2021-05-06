import React from "react";

import {
  Avatar,
  createStyles,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import {
  BeachAccess,
  Image,
  ImportContacts,
  SettingsInputSvideo,
} from "@material-ui/icons";
import { green, pink } from "@material-ui/core/colors";
import { Appointment, AppointmentType } from "../models/patient";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    pink: {
      color: theme.palette.getContrastText(pink[500]),
      backgroundColor: pink[500],
    },
    green: {
      color: "#fff",
      backgroundColor: green[500],
    },
  })
);

type Props = {
  title: string;
  date: string;
  type: string;
};
export default function PatientAppointmentItem({ title, date, type }: Props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ListItem>
        <ListItemAvatar>
          <Avatar className={classes.green}>
            <SettingsInputSvideo />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={title} secondary={date} />
      </ListItem>
    </React.Fragment>
  );
}
