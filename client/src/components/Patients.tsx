import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import axios from "../api/apiConfig";
import { useGlobalStyles } from "../styles/globalStyles";
import { initCustomError } from "../api/patientService";
import Loading from "./Loading";
import { CustomError, Patient } from "../models/patient";
import CustomAlertError from "./CustomAlertError";

import Grid from "@material-ui/core/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import PatientCard from "./PatientCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    formControl: {
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function Patients() {
  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState<CustomError>(initCustomError);
  const [open, setOpen] = React.useState(false);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nameAsc");

  /** Get patients */
  const getPatients = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await axios.get<Patient[]>("/patients");
      setPatients(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setCustomError(error);
      setError(true);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPatients();
  }, []);

  /** Filter patients */
  const handleSearch = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearchTerm(event.target.value as string);
  };

  const handleSortBy = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortBy(event.target.value as string);
  };

  useEffect(() => {
    const results = patients.filter((patient) => {
      const firtname = patient.firstname.toLowerCase();
      const lastname = patient.lastname.toLowerCase();
      const reference = patient.reference?.toLowerCase();
      const name = firtname.concat(lastname).concat(reference);
      return name.includes(searchTerm.trim().toLowerCase());
    });

    switch (sortBy) {
      case "nameDesc":
        results.sort(sortByNameDesc);
        break;
      case "dateAsc":
        results.sort(sortByDateAsc);
        break;
      case "dateDesc":
        results.sort(sortByDateDesc);
        break;

      default:
        results.sort(sortByNameAsc);
        break;
    }

    setFilteredPatients(results);
  }, [searchTerm, sortBy, patients]);

  function sortByNameAsc(p1: Patient, p2: Patient) {
    return p1.firstname.localeCompare(p2.firstname);
  }

  function sortByNameDesc(p1: Patient, p2: Patient) {
    return p1.firstname.localeCompare(p2.firstname) * -1;
  }

  function sortByDateAsc(p1: Patient, p2: Patient) {
    const d1 = new Date(p1.lastModified).getTime();
    const d2 = new Date(p2.lastModified).getTime();
    return d1 - d2;
  }

  function sortByDateDesc(p1: Patient, p2: Patient) {
    const d1 = new Date(p1.lastModified).getTime();
    const d2 = new Date(p2.lastModified).getTime();
    return (d1 - d2) * -1;
  }

  /** Delete patient */
  const handlePatientDelete = (patientId: number) => {
    (async () => {
      try {
        await axios.delete(`/patients/${patientId}`);
        const results = patients.filter((patient) => patient.id !== patientId);
        setPatients(results);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const searchBar = (
    <Paper elevation={3} component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Búsqueda de pacientes por nombre, apellido y referencia"
        inputProps={{ "aria-label": "búsqueda" }}
        value={searchTerm}
        onChange={handleSearch}
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );

  const sortComponent = (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Sortear por</InputLabel>
      <Select
        native
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={sortBy}
        onChange={handleSortBy}
      >
        <option value={"nameAsc"}>Nombre A-Z</option>
        <option value={"nameDesc"}>Nombre Z-A</option>
        <option value={"dateAsc"}>Fecha asc</option>
        <option value={"dateDesc"}>Ultima modificación</option>
      </Select>
    </FormControl>
  );

  const filteredPatientsComponent = filteredPatients.map((patient, index) => (
    <Grid item xs={12} md={4} lg={3} key={index}>
      <PatientCard
        key={patient.id}
        patient={patient}
        onPatientDelete={handlePatientDelete}
      ></PatientCard>
    </Grid>
  ));

  const header = (
    <Typography component="h2" variant="h6" color="primary">
      Pacientes
      <Fab
        className={globalClasses.fab}
        color="primary"
        aria-label="add"
        size="medium"
        component={RouterLink}
        to={`/patients/new`}
      >
        <AddIcon />
      </Fab>
    </Typography>
  );

  const actionBar = (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12} md={12} lg={2}></Grid>
      <Grid item xs={12} md={12} lg={6}>
        {searchBar}
      </Grid>
      <Grid item xs={12} md={12} lg={2}>
        {sortComponent}
      </Grid>
      <Grid item xs={12} md={12} lg={4}></Grid>
    </Grid>
  );

  return (
    <div>
      {header}
      {error && (
        <CustomAlertError
          status={customError.status}
          message={customError.message}
        ></CustomAlertError>
      )}
      {loading ? (
        <Loading></Loading>
      ) : (
        <React.Fragment>
          {actionBar}

          <Grid container direction="row" spacing={3}>
            {filteredPatients.length > 0 ? (
              filteredPatientsComponent
            ) : (
              <Grid item xs={12} md={4} lg={6}>
                No existen pacientes
              </Grid>
            )}
          </Grid>
        </React.Fragment>
      )}
    </div>
  );
}
