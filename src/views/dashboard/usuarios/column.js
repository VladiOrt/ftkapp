import { format } from "date-fns";

export const COLUMNS = [
  {
    Header: "id",
    accessor: "user_id",
    disableFilters: true
  },
  {
    Header: "Nombre",
    accessor: "usr_name",
  },
  {
    Header: "Apellido",
    accessor: "usr_lastname",
  },
  {
    Header: "Email",
    accessor: "usr_email",
  },
  {
    Header: "Contraseña",
    accessor: "usr_pass",
  },
  {
    Header: "Opcion",
    accessor: "user_id",
    Cell: ({ value }) => {
      return (
      <div id="checkOpcion">
        <input type="checkbox" onClick={()=>console.log("-->",value)} />
      </div>)}
  },
  /*
  {
    Header: "Contraseña",
    accessor: "date_of_birth",
    Cell: ({ value }) => {
      return format(new Date(value), "dd/MM/yyyy");
    },
    disableFilters: true
  },
  */
 /*
  {
    Header: "Age",
    accessor: "age",
    disableFilters: true
  },
  */
];