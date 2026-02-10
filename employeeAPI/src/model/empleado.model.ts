import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class EmpleadoModel extends Model<
  InferAttributes<EmpleadoModel>,
  InferCreationAttributes<EmpleadoModel>
> {
  declare id: CreationOptional<string>;
  declare nombreColaborador: string;
  declare fechaNacimiento: Date;
  declare dni: string;
  declare sexo: string;
  declare lugarNacimiento: string;
  declare rtn: string;
  declare tipoSangre: string;
  declare nacionalidad: string;
  declare estadoCivil: string;
  declare fechaIngreso: Date;
  declare empresa: string;
  declare tipoContrato: string;
  declare ihss: boolean;
  declare rap: boolean;
  declare seguroVidaAp: boolean;
  declare seguroVidaMedico: boolean;
  declare area: string;
  declare departamento: string;
  declare puesto: string;
  declare jefeInmediato: string;
  declare escolaridad: string;
  declare direccion: string;
  declare nombreContactoEmergencia: string;
  declare contactoEmergencia: string;
  declare parentescoEmergencia: string;
  declare contactoPersonal: string;
  declare correoPersonal: string;
  declare cantidadHijos: string;
  declare observaciones: string;
  declare estado: boolean;
  declare fechaSalida: Date;
  declare notaSalida: string;
}

EmpleadoModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: sql.uuidV4 },
    nombreColaborador: { type: DataTypes.STRING },
    fechaNacimiento: { type: DataTypes.DATE },
    dni: { type: DataTypes.STRING },
    sexo: { type: DataTypes.STRING },
    lugarNacimiento: { type: DataTypes.STRING },
    rtn: { type: DataTypes.STRING },
    tipoSangre: { type: DataTypes.STRING },
    nacionalidad: { type: DataTypes.STRING },
    estadoCivil: { type: DataTypes.STRING },
    fechaIngreso: { type: DataTypes.DATE },
    empresa: { type: DataTypes.STRING },
    tipoContrato: { type: DataTypes.STRING },
    ihss: { type: DataTypes.BOOLEAN },
    rap: { type: DataTypes.BOOLEAN },
    seguroVidaAp: { type: DataTypes.BOOLEAN },
    seguroVidaMedico: { type: DataTypes.BOOLEAN },
    area: { type: DataTypes.STRING },
    departamento: { type: DataTypes.STRING },
    puesto: { type: DataTypes.STRING },
    jefeInmediato: { type: DataTypes.STRING },
    escolaridad: { type: DataTypes.STRING },
    direccion: { type: DataTypes.STRING },
    nombreContactoEmergencia: { type: DataTypes.STRING },
    contactoEmergencia: { type: DataTypes.STRING },
    parentescoEmergencia: { type: DataTypes.STRING },
    contactoPersonal: { type: DataTypes.STRING },
    correoPersonal: { type: DataTypes.STRING },
    cantidadHijos: { type: DataTypes.STRING },
    observaciones: { type: DataTypes.STRING },
    estado: { type: DataTypes.BOOLEAN },
    fechaSalida: { type: DataTypes.DATE },
    notaSalida: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Empleado",
    tableName: "empleado",
    timestamps: false,
  }
);
