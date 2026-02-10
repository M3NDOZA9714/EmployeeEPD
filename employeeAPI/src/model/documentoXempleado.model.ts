import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class DocumentoXEmpleadoModel extends Model<
  InferAttributes<DocumentoXEmpleadoModel>,
  InferCreationAttributes<DocumentoXEmpleadoModel>
> {
  declare id: CreationOptional<string>;
  declare idEmpleado: string;
  declare idDocumento: string;
}

DocumentoXEmpleadoModel.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: sql.uuidV4 },
    idEmpleado: { type: DataTypes.STRING },
    idDocumento: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "DocumentoXEmpleado",
    tableName: "documentoxempleado",
    timestamps: false,
  }
);
