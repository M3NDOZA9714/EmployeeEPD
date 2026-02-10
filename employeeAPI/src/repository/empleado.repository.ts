import { sequelize } from "@database/index";
import { DocumentoModel } from "@model/documento.model";
import { DocumentoXEmpleadoModel } from "@model/documentoXempleado.model";
import { EmpleadoModel } from "@model/empleado.model";
import { IDocumentoXempleado } from "interface/documentoXempleado.interface";
import { IEmpleado, IEmpleadoDocumento } from "interface/empleado.interface";

class EmpleadoRepository {
  async obtenerTodos() {
    return await EmpleadoModel.findAll({
      include: {
        model: DocumentoModel,
        as: "documentos",
        through: { attributes: [] },
      },
    });
  }

  async crear(empleado: IEmpleadoDocumento) {
    try {
      return await sequelize.transaction(async () => {
        const employee = await EmpleadoModel.create({
          ...empleado,
          estado: true,
        });

        const docXemp: IDocumentoXempleado[] = empleado.documentos.map((a) => ({
          idEmpleado: employee.id,
          idDocumento: a.id as string,
        }));
        await DocumentoXEmpleadoModel.bulkCreate(docXemp);
        return employee;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async crearVarios(empleados: IEmpleadoDocumento[]) {
    try {
      return await sequelize.transaction(async () => {
        const empleadosData = empleados.map((emp) => ({
          ...emp,
          estado: true,
        }));

        console.log(empleadosData)

        const creados = await EmpleadoModel.bulkCreate(empleadosData);

        const documentosRelacion: IDocumentoXempleado[] = [];

        creados.forEach((empleadoCreado, index) => {
          const docsOriginales = empleados[index].documentos;

          if (docsOriginales && docsOriginales.length > 0) {
            docsOriginales.forEach((doc) => {
              documentosRelacion.push({
                idEmpleado: empleadoCreado.id,
                idDocumento: doc.id as string,
              });
            });
          }
        });
        if (documentosRelacion.length > 0) {
          await DocumentoXEmpleadoModel.bulkCreate(documentosRelacion);
        }

        return creados;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async actualizar(empleado: IEmpleadoDocumento) {
    try {
      return await sequelize.transaction(async () => {
        const employee = (
          await EmpleadoModel.update(empleado, {
            where: { id: empleado.id },
          })
        )[0];

        const docXemp: IDocumentoXempleado[] = empleado.documentos.map((a) => ({
          idEmpleado: empleado.id as string,
          idDocumento: a.id as string,
        }));

        await DocumentoXEmpleadoModel.destroy({
          where: { idEmpleado: empleado.id },
        });
        await DocumentoXEmpleadoModel.bulkCreate(docXemp);
        return employee;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async eliminar(id: string): Promise<number> {
    try {
      return await sequelize.transaction(async () => {
        await DocumentoXEmpleadoModel.destroy({
          where: { idEmpleado: id },
        });

        const employee = await EmpleadoModel.destroy({ where: { id } });

        return employee;
      });
    } catch (error) {
      return new Promise(() => 0);
    }
  }

  async deshabilitar(id: string, notaSalida: string, fechaSalida: Date) {
    return (
      await EmpleadoModel.update(
        { notaSalida, fechaSalida, estado: false },
        {
          where: { id },
        },
      )
    )[0];
  }
}

export const empleadoRepository = new EmpleadoRepository();
