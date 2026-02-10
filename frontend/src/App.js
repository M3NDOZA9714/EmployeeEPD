import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  User,
  Upload,
  FileText,
  Users,
  UserX,
  Plus,
  Download,
  Search,
  Edit,
  Trash2,
  X,
  SheetIcon,
} from "lucide-react";
const apiUrl = "http://89.167.20.163:3002/api/apirequest/";

const EmployeeDatabase = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [inactiveEmployees, setInactiveEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [bulkEmpleados, setBulkEmpleados] = useState([]);

  const [docs, setDocs] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}documento/obtenerTodos`, {
      method: "GET",
      credentials: "include",
    })
      .then((rs) => {
        return rs.json();
      })
      .then((data) => setDocs(data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const [empleados, setEmpleados] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}empleado/obtenerTodos`, {
      method: "GET",
      credentials: "include",
    })
      .then((rs) => rs.json())
      .then((data) => {
        setEmpleados(data.filter((emp) => emp.estado === true));
        setInactiveEmployees(data.filter((emp) => emp.estado === false));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const [formData, setFormData] = useState({
    id: undefined,
    nombreColaborador: "",
    fechaNacimiento: "",
    dni: "",
    sexo: "",
    lugarNacimiento: "",
    rtn: "",
    tipoSangre: "",
    nacionalidad: "",
    estadoCivil: "",
    fechaIngreso: "",
    empresa: "",
    tipoContrato: "indefinido",
    ihss: false,
    rap: false,
    seguroVidaAp: false,
    seguroVidaMedico: false,
    area: "",
    departamento: "",
    puesto: "",
    jefeInmediato: "",
    escolaridad: "",
    direccion: "",
    nombreContactoEmergencia: "",
    contactoEmergencia: "",
    parentesco: "",
    contactoPersonal: "",
    correoPersonal: "",
    cantidadHijos: "",
    observaciones: "",
    documentos: [],
  });

  const [exitData, setExitData] = useState({
    fechaSalida: "",
    notaSalida: "",
  });

  // Calcular fecha de finalización del período de prueba (58 días)
  const calculateTrialEndDate = (startDate) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 58);
    return end.toISOString().split("T")[0];
  };

  // Calcular antigüedad
  const calculateSeniority = (startDate) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    if (years > 0) {
      return `${years} años, ${months} meses, ${days} días`;
    } else if (months > 0) {
      return `${months} meses, ${days} días`;
    } else {
      return `${days} días`;
    }
  };

  // Obtener fecha actual
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = {
      empleado: formData,
    };
    if (editingEmployee) {
      fetch(`${apiUrl}empleado/actualizar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify(newEmployee),
      })
        .then((rs) => rs.json())
        .then((data) => {
          if (data && data > 0) {
            setEmpleados(
              empleados.map((a) =>
                a.id === newEmployee.empleado.id ? newEmployee.empleado : a,
              ),
            );
            setEditingEmployee(null);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      fetch(`${apiUrl}empleado/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify(newEmployee),
      })
        .then((rs) => rs.json())
        .then((data) => {
          if (data && data.id) {
            setEmpleados((prev) => [...prev, data]);
          }
        });
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      nombreColaborador: "",
      fechaNacimiento: "",
      dni: "",
      sexo: "",
      lugarNacimiento: "",
      rtn: "",
      tipoSangre: "",
      nacionalidad: "",
      estadoCivil: "",
      fechaIngreso: "",
      empresa: "",
      tipoContrato: "indefinido",
      ihss: false,
      rap: false,
      seguroVidaAp: false,
      seguroVidaMedico: false,
      area: "",
      departamento: "",
      puesto: "",
      jefeInmediato: "",
      escolaridad: "",
      direccion: "",
      nombreContactoEmergencia: "",
      contactoEmergencia: "",
      parentesco: "",
      contactoPersonal: "",
      correoPersonal: "",
      cantidadHijos: "",
      observaciones: "",
      documentos: [],
    });
  };

  const handleEdit = (employee) => {
    employee.fechaIngreso = employee.fechaIngreso.split("T")[0];
    employee.fechaNacimiento = employee.fechaNacimiento.split("T")[0];
    setEditingEmployee(employee);
    setFormData(employee);
    setShowForm(true);
  };

  const handleDeactivate = (employee) => {
    setSelectedEmployee(employee);
    setShowExitModal(true);
  };

  const confirmDeactivation = () => {
    if (!selectedEmployee) return;

    fetch(`${apiUrl}empleado/deshabilitar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        id: selectedEmployee.id,
        fechaSalida: exitData.fechaSalida,
        notaSalida: exitData.notaSalida,
      }),
    })
      .then((rs) => rs.json())
      .then((data) => {
        if (data && data > 0) {
          setInactiveEmployees((prev) => [...prev, selectedEmployee]);
          setEmpleados((prev) =>
            prev.filter((emp) => emp.id !== selectedEmployee.id),
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });

    setShowExitModal(false);
    setSelectedEmployee(null);
    setExitData({ fechaSalida: "", notaSalida: "" });
  };

  const handleDelete = (id, isInactive = false) => {
    fetch(`${apiUrl}empleado/eliminar?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((rs) => rs.json())
      .then((data) => {
        if (!data) return;
        if (data < 1) return;
        if (isInactive)
          setInactiveEmployees((prev) => prev.filter((emp) => emp.id !== id));

        if (!isInactive)
          setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleBulkCreate = (empleados) => {
    fetch(`${apiUrl}empleado/crearVarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({ empleados }),
    })
      .then((rs) => rs.json())
      .then((data) => {
        if (data.length && data[0].id) {
          setEmpleados((prev) => [...prev, ...data]);
        }
        setShowUploadModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;

        const workbook = XLSX.read(bstr, { type: "binary", cellDates: true });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet);

        const empleadosProcesados = data.map((row) => {
          const documentos = [];

          Object.keys(row).map((a, i) => {
            if (i >= 28) {
              documentos.push(
                ...docs.filter((b) => a === b.nombre && row[a] === 1),
              );
            }
          });

          return {
            nombreColaborador: row["Nombre"],
            fechaNacimiento: new Date(row["Fecha Nacimiento"])
              .toISOString()
              .split("T")[0],
            dni: row["DNI"],
            sexo: row["Sexo"],
            lugarNacimiento: row["Lugar Nacimiento"],
            rtn: row["RTN"],
            tipoSangre: row["Tipo Sangre"],
            fechaIngreso: new Date(row["Fecha Ingreso"])
              .toISOString()
              .split("T")[0],
            nacionalidad: row["Nacionalidad"],
            empresa: row["Empresa"],
            ihss: row["IHSS"] == 1 ? true : false,
            rap: row["RAP"] == 1 ? true : false,
            seguroVidaAp: row["Seguro Vida"] == 1 ? true : false,
            seguroVidaMedico: row["Seguro Vida/Médico"] == 1 ? true : false,
            area: row["Área"],
            departamento: row["Departamento"],
            puesto: row["Puesto"],
            jefeInmediato: row["Jefe Inmediato"],
            escolaridad: row["Escolaridad"],
            direccion: row["Dirección"],
            nombreContactoEmergencia: row["Contacto Emergencia"],
            contactoEmergencia: row["Teléfono Emergencia"].toString(),
            parentescoEmergencia: row["Parentesco"],
            contactoPersonal: row["Contacto Personal"].toString(),
            correoPersonal: row["Correo Personal"],
            estadoCivil: row["Estado Civil"],
            cantidadHijos: row["Hijos/Edad"].toString(),
            observaciones: row["Observaciones"],
            tipoContrato: row["Tipo Contrato"],
            documentos,
          };
        });
        setBulkEmpleados(empleadosProcesados);
      } catch (error) {
        console.error("Error al procesar el Excel:", error);
      }
    };

    reader.readAsBinaryString(file);
  };

  function convertDate(dateString) {
    return dateString.split("T")[0].split("-").reverse().join("/");
  }

  const exportToExcel = () => {
    const dataToExport = activeTab === "active" ? empleados : inactiveEmployees;
    console.log(calculateSeniority(dataToExport[0].antiguedad));
    const csv = [
      // Encabezados
      "Nombre,Fecha Nacimiento,DNI,Sexo,Lugar Nacimiento,RTN,Tipo Sangre,Fecha Ingreso,Finalización Prueba,Fecha Actual,Antigüedad,Nacionalidad,Empresa,IHSS,RAP,Seguro Vida,Seguro Vida/Médico,Área,Departamento,Puesto,Jefe Inmediato,Escolaridad,Dirección,Contacto Emergencia,Teléfono Emergencia,Parentesco,Contacto Personal,Correo Personal,Estado Civil,Hijos/Edad,Observaciones,Tipo Contrato",
      // Datos
      ...dataToExport.map(
        (emp) =>
          `"${emp.nombreColaborador}","${emp.fechaNacimiento
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/")}","${emp.dni}","${emp.sexo}","${emp.lugarNacimiento}","${
            emp.rtn
          }","${emp.tipoSangre}","${
            emp.fechaIngreso.split("T")[0]
          }","${calculateTrialEndDate(emp.fechaIngreso)}","${
            new Date().toISOString().split("T")[0]
          }","${calculateSeniority(emp.fechaIngreso)}","${emp.nacionalidad}","${
            emp.empresa
          }","${emp.ihss}","${emp.rap}","${emp.seguroVidaAp}","${
            emp.seguroVidaMedico
          }","${emp.area}","${emp.departamento}","${emp.puesto}","${
            emp.jefeInmediato
          }","${emp.escolaridad}","${emp.direccion}","${
            emp.nombreContactoEmergencia
          }","${emp.contactoEmergencia}","${emp.parentescoEmergencia}","${
            emp.contactoPersonal
          }","${emp.correoPersonal}","${emp.estadoCivil}","${
            emp.CantidadHijos
          }","${emp.observaciones}","${emp.tipoContrato}"`,
      ),
    ].join("\n");

    const bom = "\uFEFF";
    const csvWithBOM = bom + csv;

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `colaboradores_${activeTab}_${getCurrentDate()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredEmployees = (
    activeTab === "active" ? empleados : inactiveEmployees
  ).filter((emp) =>
    emp.nombreColaborador.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Base de Datos de Colaboradores
              </h1>
            </div>
            <div className="flex space-x-3">
              <a
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer flex items-center space-x-2 gap-2"
                rel="noreferrer"
                href="/Plantilla empleados.xlsx">
                Descargar Plantilla
                <SheetIcon className="h-4 w-4" />
              </a>
              <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Subir Excel</span>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className=""></button>
              </label>
              <button
                onClick={exportToExcel}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nuevo Colaborador</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-6 py-3 font-medium ${
                activeTab === "active"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              Colaboradores Activos ({empleados.length})
            </button>
            <button
              onClick={() => setActiveTab("inactive")}
              className={`px-6 py-3 font-medium ${
                activeTab === "inactive"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              Colaboradores Inactivos ({inactiveEmployees.length})
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colaborador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puesto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Antigüedad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.nombreColaborador}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.correoPersonal}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.dni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.puesto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.departamento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {convertDate(employee.fechaIngreso)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {calculateSeniority(employee.fechaIngreso)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {activeTab === "active" && (
                          <>
                            <button
                              onClick={() => handleEdit(employee)}
                              className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeactivate(employee)}
                              className="text-orange-600 hover:text-orange-900">
                              <UserX className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() =>
                            handleDelete(employee.id, activeTab === "inactive")
                          }
                          className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingEmployee ? "Editar Colaborador" : "Nuevo Colaborador"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingEmployee(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Información Personal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre del Colaborador *
                      </label>
                      <input
                        type="text"
                        name="nombreColaborador"
                        value={formData.nombreColaborador}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        DNI
                      </label>
                      <input
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sexo
                      </label>
                      <select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Seleccionar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Lugar de Nacimiento
                      </label>
                      <input
                        type="text"
                        name="lugarNacimiento"
                        value={formData.lugarNacimiento}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        RTN
                      </label>
                      <input
                        type="text"
                        name="rtn"
                        value={formData.rtn}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Sangre
                      </label>
                      <select
                        name="tipoSangre"
                        value={formData.tipoSangre}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Seleccionar</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nacionalidad
                      </label>
                      <input
                        type="text"
                        name="nacionalidad"
                        value={formData.nacionalidad}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estado Civil
                      </label>
                      <select
                        name="estadoCivil"
                        value={formData.estadoCivil}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Seleccionar</option>
                        <option value="Soltero">Soltero</option>
                        <option value="Casado">Casado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viudo">Viudo</option>
                        <option value="Unión Libre">Unión Libre</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Información Laboral */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Información Laboral
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha de Ingreso *
                      </label>
                      <input
                        type="date"
                        name="fechaIngreso"
                        value={formData.fechaIngreso}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Finalización del Período de Prueba
                      </label>
                      <input
                        type="text"
                        value={calculateTrialEndDate(formData.fechaIngreso)}
                        disabled
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha Actual
                      </label>
                      <input
                        type="text"
                        value={getCurrentDate()}
                        disabled
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Antigüedad
                      </label>
                      <input
                        type="text"
                        value={calculateSeniority(formData.fechaIngreso)}
                        disabled
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Empresa
                      </label>
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Contrato
                      </label>
                      <select
                        name="tipoContrato"
                        value={formData.tipoContrato}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="indefinido">Indefinido</option>
                        <option value="temporal">Temporal</option>
                        <option value="eventual">Eventual (por día)</option>
                        <option value="pasantia">Pasantía</option>
                        <option value="practica">Práctica Profesional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        IHSS
                      </label>
                      <select
                        name="ihss"
                        value={formData.ihss}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "ihss",
                              value: e.target.value === "true",
                            },
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="true">SI</option>
                        <option value="false">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        RAP
                      </label>
                      <select
                        name="rap"
                        value={formData.rap}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "rap",
                              value: e.target.value === "true",
                            },
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="true">SI</option>
                        <option value="false">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Seguro Vida/AP
                      </label>
                      <select
                        name="seguroVidaAp"
                        value={formData.seguroVidaAp}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "seguroVidaAp",
                              value: e.target.value === "true",
                            },
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="true">SI</option>
                        <option value="false">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Seguro Vida/AP/Médico
                      </label>
                      <select
                        name="seguroVidaMedico"
                        value={formData.seguroVidaMedico}
                        onChange={(e) =>
                          handleInputChange({
                            target: {
                              name: "seguroVidaMedico",
                              value: e.target.value === "true",
                            },
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="true">SI</option>
                        <option value="false">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Área
                      </label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Departamento
                      </label>
                      <input
                        type="text"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Puesto
                      </label>
                      <input
                        type="text"
                        name="puesto"
                        value={formData.puesto}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Jefe Inmediato
                      </label>
                      <input
                        type="text"
                        name="jefeInmediato"
                        value={formData.jefeInmediato}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Escolaridad
                      </label>
                      <select
                        name="escolaridad"
                        value={formData.escolaridad}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Seleccionar</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Bachillerato">Bachillerato</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Universitario">Universitario</option>
                        <option value="Postgrado">Postgrado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Información de Contacto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Dirección
                      </label>
                      <textarea
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        rows={2}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre Contacto de Emergencia
                      </label>
                      <input
                        type="text"
                        name="nombreContactoEmergencia"
                        value={formData.nombreContactoEmergencia}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contacto de Emergencia
                      </label>
                      <input
                        type="tel"
                        name="contactoEmergencia"
                        value={formData.contactoEmergencia}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Parentesco
                      </label>
                      <input
                        type="text"
                        name="parentescoEmergencia"
                        value={formData.parentescoEmergencia}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contacto Personal
                      </label>
                      <input
                        type="tel"
                        name="contactoPersonal"
                        value={formData.contactoPersonal}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Correo Personal
                      </label>
                      <input
                        type="email"
                        name="correoPersonal"
                        value={formData.correoPersonal}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Información Adicional
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hijos / Edad
                      </label>
                      <input
                        type="text"
                        name="cantidadHijos"
                        value={formData.cantidadHijos}
                        onChange={handleInputChange}
                        placeholder="Ej: Juan 12 años, María 8 años"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Observaciones
                      </label>
                      <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Documentos Obligatorios */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    <FileText className="inline h-5 w-5 mr-2" />
                    Documentos Obligatorios
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {docs
                      .filter((a) => a.tipo === 1)
                      .map((doc) => (
                        <div key={doc.id} className="flex items-center">
                          <input
                            id={doc.id}
                            checked={formData.documentos.some(
                              (a) => a.id === doc.id,
                            )}
                            onChange={(a) => {
                              let updated;
                              if (!a.target.checked) {
                                updated = formData.documentos.filter(
                                  (b) => b.id !== doc.id,
                                );
                              } else {
                                updated = [...formData.documentos, doc];
                              }
                              setFormData({ ...formData, documentos: updated });
                            }}
                            type="checkbox"
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 rounded"
                          />
                          <label
                            htmlFor={doc.id}
                            className="ml-2 text-sm text-gray-700">
                            {doc.nombre}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Documentos Adicionales */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    <FileText className="inline h-5 w-5 mr-2" />
                    Documentos Adicionales (si aplica)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {docs
                      .filter((a) => a.tipo === 2)
                      .map((doc) => (
                        <div key={doc.id} className="flex items-center">
                          <input
                            id={doc.id}
                            checked={formData.documentos.some(
                              (a) => a.id === doc.id,
                            )}
                            type="checkbox"
                            onChange={(a) => {
                              let updated;
                              if (!a.target.checked) {
                                updated = formData.documentos.filter(
                                  (b) => b.id !== doc.id,
                                );
                              } else {
                                updated = [...formData.documentos, doc];
                              }
                              setFormData({ ...formData, documentos: updated });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`additional-${doc}`}
                            className="ml-2 text-sm text-gray-700">
                            {doc.nombre}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingEmployee(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    onSubmit={handleSubmit}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {editingEmployee ? "Actualizar" : "Guardar"} Colaborador
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Exit Modal */}
        {showExitModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Dar de Baja Colaborador
                </h3>
                <button
                  onClick={() => setShowExitModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  ¿Está seguro que desea dar de baja a{" "}
                  <strong>{selectedEmployee?.nombre}</strong>?
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de Salida *
                    </label>
                    <input
                      type="date"
                      value={exitData.fechaSalida}
                      onChange={(e) =>
                        setExitData((prev) => ({
                          ...prev,
                          fechaSalida: e.target.value,
                        }))
                      }
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notas de Salida
                    </label>
                    <textarea
                      value={exitData.notaSalida}
                      onChange={(e) =>
                        setExitData((prev) => ({
                          ...prev,
                          notaSalida: e.target.value,
                        }))
                      }
                      rows={4}
                      placeholder="Motivo de la salida, observaciones adicionales..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Cancelar
                </button>
                <button
                  onClick={confirmDeactivation}
                  disabled={!exitData.fechaSalida}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Confirmar Baja
                </button>
              </div>
            </div>
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Importación de usuarios
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Subir Excel</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Cancelar
                </button>
                <button
                  onClick={() => handleBulkCreate(bulkEmpleados)}
                  disabled={!bulkEmpleados.length}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Confirmar Importación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDatabase;
