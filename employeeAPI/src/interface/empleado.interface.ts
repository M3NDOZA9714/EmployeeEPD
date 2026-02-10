import { IDocumento } from "./documento.interface";

export interface IEmpleado {
  id?: string;
  nombreColaborador: string;
  fechaNacimiento: Date;
  dni: string;
  sexo: string;
  lugarNacimiento: string;
  rtn: string;
  tipoSangre: string;
  nacionalidad: string;
  estadoCivil: string;
  fechaIngreso: Date;
  fechaSalida: Date;
  empresa: string;
  tipoContrato: string;
  ihss: boolean;
  rap: boolean;
  seguroVidaAp: boolean;
  seguroVidaMedico: boolean;
  area: string;
  departamento: string;
  puesto: string;
  jefeInmediato: string;
  escolaridad: string;
  direccion: string;
  nombreContactoEmergencia: string;
  contactoEmergencia: string;
  parentescoEmergencia: string;
  contactoPersonal: string;
  correoPersonal: string;
  cantidadHijos: string;
  observaciones: string;
  estado: boolean;
  notaSalida: string;
}

export interface IEmpleadoDocumento extends IEmpleado {
  documentos: IDocumento[];
}
