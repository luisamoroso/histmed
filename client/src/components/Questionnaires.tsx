import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "../api/apiConfig";
import { useGlobalStyles } from "../styles/globalStyles";
import { CustomError, Questionnaire } from "../models/patient";
import Loading from "./Loading";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import AlertError from "./AlertError";
import Fab from "@material-ui/core/Fab";
import { Link } from "@material-ui/core";

export default function Questionnaires() {
  const globalClasses = useGlobalStyles();
  const [loading, setLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>();
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState<CustomError>({
    status: "",
    message: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const { data } = await axios.get(`/questionnaires`);
        console.log("🚀 ~ file: Questions.tsx ~ line 42 ~ data", data);
        setQuestionnaires(data);
      } catch (error) {
        setCustomError(error);
        setError(true);
        console.log(error);
      }
      setLoading(false);
    })();
  }, []);

  const questionnaireList = questionnaires?.map((questionnaire, index) => (
    <ListItem dense key={index}>
      <ListItemText
        primary={
          <div>
            <Link
              variant="subtitle1"
              color="secondary"
              component={RouterLink}
              to={`/questionnaires/${questionnaire._id}`}
            >
              {questionnaire.name}
            </Link>

            <IconButton
              component={RouterLink}
              to={`/questionnaires/${questionnaire._id}/edit`}
            >
              <EditIcon />
            </IconButton>

            <IconButton>
              <DeleteIcon />
            </IconButton>
          </div>
        }
        secondary={
          <List>
            {questionnaire.questions.map((question, index) => (
              <ListItem dense>
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      variant="body1"
                      color="textPrimary"
                    >
                      <strong>{index + 1}. </strong>
                      {question}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        }
      />
    </ListItem>
  ));

  return (
    <Paper className={globalClasses.paper}>
      <Typography component="h2" variant="h6" color="primary">
        Cuestionarios
        <Fab
          className={globalClasses.spacing}
          color="primary"
          aria-label="add"
          size="medium"
          component={RouterLink}
          to={`/questionnaires/new`}
        >
          <AddIcon />
        </Fab>
      </Typography>
      {error && (
        <AlertError
          status={customError.status}
          message={customError.message}
        ></AlertError>
      )}
      {loading ? <Loading></Loading> : <List>{questionnaireList}</List>}
    </Paper>
  );
}
