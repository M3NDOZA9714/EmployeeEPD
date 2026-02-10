"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const documento_model_1 = require("@model/documento.model");
const documentoXempleado_model_1 = require("@model/documentoXempleado.model");
const empleado_model_1 = require("@model/empleado.model");
empleado_model_1.EmpleadoModel.belongsToMany(documento_model_1.DocumentoModel, {
    through: { model: documentoXempleado_model_1.DocumentoXEmpleadoModel, unique: false },
    foreignKey: "idEmpleado",
    otherKey: "idDocumento",
    as: "documentos",
});
