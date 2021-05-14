import {
  Patient,
  Gender,
  Appointment,
  AppointmentType,
  Status,
} from "../models/patient";

const initPatient: Patient = {
  avatar: "",
  reference: "",
  firstname: "init lui",
  lastname: "",
  birth: "",
  gender: Gender.Other,
  dni: "",
  email: "",
  phone: "",
  mobile: "",
  address: "",
  historyList: [],
  appointments: [],
  notes: "",
  lastModified: "",
};

const initAppointment: Appointment = {
  patient: initPatient,
  title: "",
  description: "",
  type: AppointmentType.PreliminaryTalk,
  createdAt: "",
  analysis: "",
  plan: "",
  comment: "",
  recommendation: "",
  attachments: [],
  status: Status.Open,
};

export { initPatient, initAppointment };
