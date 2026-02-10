import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class DocumentoModel extends Model<
  InferAttributes<DocumentoModel>,
  InferCreationAttributes<DocumentoModel>
> {
  declare id: CreationOptional<string>;
  declare nombre: string;
  declare tipo: number;
}

DocumentoModel.init(
  {
    id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: sql.uuidV4 },
    nombre: { type: DataTypes.STRING },
    tipo: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    modelName: "Documento",
    tableName: "documento",
    timestamps: false,
  }
);
