import * as React from 'react';
import './index.scss'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { useLayoutEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

/*
let Columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

*/

export default function Usuarios() {


  const[rows,setRows]=useState(null)
  const[columns,setColumns]=useState(null)


useLayoutEffect(() => {
    let DatosRecibidos
    axios.get(`${process.env.REACT_APP_URL_API}/user/All`)
    .then(res => {         
      let Datos = res.data            
      if(Datos.valido==1){
        DatosRecibidos=Datos.data
        let NumeroUsuario = (Datos.data).length

        for(let n=0; n<NumeroUsuario; n++){


          let Columns: GridColDef[] = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'firstName', headerName: 'First name', width: 130 },
            { field: 'lastName', headerName: 'Last name', width: 130 },
            {
              field: 'age',
              headerName: 'Age',
              type: 'number',
              width: 90,
            },
            {
              field: 'fullName',
              headerName: 'Full name',
              description: 'This column has a value getter and is not sortable.',
              sortable: false,
              width: 160,
              valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
            },
          ];



/*
           let rowsNew = [
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
            { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
            { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
            { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
            { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
            { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
            { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
            { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
            { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
          ];
          
          setRows(rowsNew)
*/

        }

      }else{

      }
    })



}, []);









  return (
      <div className="containerUsuariosVista">
          <div className="headerVistaUsuarios">
              <div className="titulo">Usuarios</div>
          </div>
          <div className="containerTable">
           
                <div style={{ height: 400, width: '100%' }}>

                  {
                    rows != null ? 
                    <DataGrid
                        rows={ [
                          { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
                          { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
                          { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
                          { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
                          { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
                          { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
                          { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
                          { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
                          { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
                        ]}
                        Columns={
                          [
                            { field: 'id', headerName: 'ID', width: 70 },
                            { field: 'firstName', headerName: 'First name', width: 130 },
                            { field: 'lastName', headerName: 'Last name', width: 130 },
                            {
                              field: 'age',
                              headerName: 'Age',
                              type: 'number',
                              width: 90,
                            },
                            {
                              field: 'fullName',
                              headerName: 'Full name',
                              description: 'This column has a value getter and is not sortable.',
                              sortable: false,
                              width: 160,
                              valueGetter: (params: GridValueGetterParams) =>
                                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
                            },
                          ]

                        }
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                    />:""
                    
                  }
                    
                </div>
         
            
          </div>
       
      </div>
   
  );
}