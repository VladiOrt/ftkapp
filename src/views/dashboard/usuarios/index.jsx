
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useModal } from 'react-hooks-use-modal';

import axios from "axios";
import './index.scss'
import 'reactjs-popup/dist/index.css';
import { id } from 'date-fns/locale';

import { Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';


//import Button from 

function Usuarios() {
  const[datosGenerales, setDatosGenerales] = useState([])
  const[datosTabla, setDatosTabla] = useState([])
  const[datosSeleccionados, setDatosSeleccionados] = useState('')
  const[edicionSeleccion, setEdicionSeleccion] = useState([])
  const[vistaPopup, setVistaPopup] = useState([])
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: false
  });

  const [data, setData] = useState([]);
  const [messageAddUser, setMessageAddUser] = useState("");
  const [messageEditUser, setMessageEditUser] = useState("");
  const [messageDeleteUser, setMessageDeleteUser] = useState("");


 
  const fetchData = async () => {
    
    const datos = await axios.get('http://localhost:5000/user/All', {
      headers: {       
      }
    })
    let Dat = (datos.data).data
    setData(Dat);
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);


  async function AgregarUsuario(){
    setMessageAddUser("Procesando ...")

    let Nombre = document.getElementById("addUserNombre").value
    let Apellido = document.getElementById("addUserApellido").value
    let Correo = document.getElementById("addUserEmail").value
    let Pass = document.getElementById("addUserPassword").value
    let Empresa = document.getElementById("addUserEmpresa").value

    if(Nombre==''||  Nombre== null){
      setMessageAddUser("Ingrese un nombre")
    }else if(Apellido==''||  Apellido== null){
      setMessageAddUser("Ingrese un Apellido")
    }else if(Correo==''||  Correo== null){
      setMessageAddUser("Ingrese un Correo")
    }else if(Pass==''||  Pass== null){
      setMessageAddUser("Ingrese una Contraseña")
    }else{
      const enviarUsuario = await axios.post('http://localhost:5000/user/createUser', {
        nombre: Nombre,
        apellido: Apellido,
        email: Correo,
        contraseña: Pass,
        Empresa
      })
      let dadtosUsuario = (enviarUsuario.data)
      let Valid = dadtosUsuario.valido
      if(Valid == 1){
        const datos = await axios.get('http://localhost:5000/user/All', {
          headers: {       
          }
        })
        let Dat = (datos.data).data
        setData(Dat);
        setMessageAddUser("")
        close()
      }
    }
  }

  function AbrirPopup (dato){
    if(dato =='Add'){
      setVistaPopup('AddUser')
    }else if(dato =='Edit'){
      setVistaPopup('EditUsers')
    }else if(dato =='Delete'){
      setVistaPopup('DeleteUsers')
    }
    
    open()
  }

  function cerrarPopUsuario(){
    close();
    setMessageAddUser("");
  } 

  function agregarDatosSeleccionados(elemento){
    let Valores = [datosSeleccionados]
    if(datosSeleccionados.length>0) Valores = datosSeleccionados.split(',')
    
    let valorNuevo = elemento.user_id
    let valoresNuevos =[]
    let strvaloresNuevos =''
    let Existe=0
    for(let n=0 ; n<Valores.length; n++){
      if(valorNuevo === parseInt(Valores[n])){
        Existe=1
      }else{
        valoresNuevos.push(Valores[n])
      }
    }
    if(Existe ===1){
      for(let n=0 ; n<valoresNuevos.length; n++){
        if(n==0){strvaloresNuevos = valoresNuevos[n]}
        else{
          strvaloresNuevos = strvaloresNuevos+","+valoresNuevos[n]
        }
      }
    }else{
      if(datosSeleccionados.length == 0){
        strvaloresNuevos = elemento.user_id
      }else{
        strvaloresNuevos = datosSeleccionados+","+elemento.user_id
      }      
    }
    OrdenarDatosSeleccionados(strvaloresNuevos) 
    setDatosSeleccionados(strvaloresNuevos)
  }

  function OrdenarDatosSeleccionados(Datos){
    let valores = Datos.toString()
    let idSeleccion = valores.split(',')
    idSeleccion.sort(function(a,b){
      return a - b; 
    })
    let arrayNuevo = []
    for(let n=0; n<data.length; n++ ){
      let IdDato = data[n].user_id
      for(let l=0;  l<idSeleccion.length ; l++){
        if(IdDato == idSeleccion[l]) arrayNuevo.push(data[n])
      }      
    }
    setEdicionSeleccion(arrayNuevo)
    console.log(arrayNuevo)
  }









  async function EditarUsuario(){
   
    let  datosProcesar = (datosSeleccionados.toString()).split(',')
    console.log(datosProcesar)
    for(let n=0;n<datosProcesar.length; n++){
      let nombre = document.getElementById(datosProcesar[n]+"-usr_name").value
      let apellido= document.getElementById(datosProcesar[n]+"-usr_lastname").value
      let email= document.getElementById(datosProcesar[n]+"-usr_email").value
      let contraseña= document.getElementById(datosProcesar[n]+"-usr_pass").value
      let Empresa= document.getElementById(datosProcesar[n]+"-empresa").value

      if(nombre =='' || nombre==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            nombre = edicionSeleccion[f].usr_name
          }
        }
      }
      if(apellido =='' || apellido==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            apellido = edicionSeleccion[f].usr_lastname
          }
        }
      }
      if(email =='' || email==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            email = edicionSeleccion[f].usr_email
          }
        }
      }
      if(contraseña =='' || contraseña==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            contraseña = edicionSeleccion[f].usr_pass
          }
        }
      }


      const datos = await axios.patch('http://localhost:5000/user/updateUser', {
        nombre,
        apellido,
        email,
        contraseña,
        id: parseInt(datosProcesar[n]),
        Empresa
      })
      let Dat = (datos.data).data
    }







    const datos = await axios.get('http://localhost:5000/user/All', {
      headers: {       
      }
    })

    let Dat = (datos.data).data
    setData(Dat);
    let arrayNuevoActualizado = []
    let DatosSeleccionadosNow = (datosSeleccionados.toString()).split(',')
    for(let ns = 0 ; ns <DatosSeleccionadosNow.length; ns++ ){
        for(let n=0; n<Dat.length; n++ ){
          if(parseInt(DatosSeleccionadosNow[ns]) == Dat[n].user_id){
            arrayNuevoActualizado.push(Dat[n])
          }
        }
    }
    setEdicionSeleccion(arrayNuevoActualizado)


    setData(Dat);
    setMessageDeleteUser("")
    close()
   
  }





  async function EliminarUsuario(){
    let DatosSelect = datosSeleccionados.toString()
    let IDS =  DatosSelect.split(',')
    let validos = 0
    let errores = 0
    for(let n=0;n<IDS.length; n++){
      const datos = await axios.patch('http://localhost:5000/user/deleteUser', {
        id: IDS[n]
      })
      let Dat = (datos.data).data
      if(Dat.affectedRows == 1){
        validos  = validos + 1
      }else{
        errores  = errores + 1
      }
    }
    const datos = await axios.get('http://localhost:5000/user/All', {
      headers: {       
      }
    })
    let Dat = (datos.data).data
    setData(Dat);
    setDatosSeleccionados('')
    setEdicionSeleccion([])
    setMessageDeleteUser("")
    close()
   
  }
  
  




  return (
    <div className="containerUsers">
      <div className="titleContainerUsers">
        <div className="title">Catalogo de Usuarios</div>            
      </div>
      <div className="headerConatainerUsers">
        <div className='BotonesOpciones'>
          <Button variant="outlined" color='success'  onClick={()=>AbrirPopup('Add')}>
            Agregar
            <PersonAddIcon />
          </Button>
          <Button variant="outlined"  onClick={()=>AbrirPopup('Edit')}>
            Editar
            <SettingsAccessibilityIcon />
          </Button>
          <Button variant="outlined" color='error' onClick={()=>AbrirPopup('Delete')}>
            Eliminar
            <PersonAddDisabledIcon />
          </Button>                    
        </div>
      </div>

      <div className="bodyContainerUser">
        <div className='TableUsuarios'>
          <div className='Tabla'>
            <div className='theadTable'>
              <div className='containerID'>Id</div>
              <div>Nombre</div>
              <div>Apellido</div>
              <div>Email</div>
              <div>Contraseña</div>
              <div>Empresa</div>
            </div>
            <div className='bodyTable'>
              {
                data.length>0?
                  data.map((elemento)=>      
                    <div className='Fila' key={elemento.user_id}>
                      <div className='Columnaid'> <input type="checkbox" onClick={()=>agregarDatosSeleccionados(elemento)} ></input> </div>
                      <div>{elemento.usr_name}</div>                    
                      <div>{elemento.usr_lastname}</div>    
                      <div>{elemento.usr_email}</div>    
                      <div>{elemento.usr_pass}</div>    
                      <div>{elemento.empresa}</div>   
                    </div>
                  )
                  :"No se encontraron datos para mostrar"
              }        
            </div>           
          </div>
        </div>  
      </div>
      







         <Modal>
              <div id='containerOptionUser'>
                {
                  vistaPopup == 'AddUser' ?
                  <div className="containerAddUserOption">
                    <div className="sectionClose" > 
                      <button  onClick={()=>cerrarPopUsuario()}>
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregar un nuevo Usuario</h1>
                    <div className='TablaAddUser'>
                      <section className='labels'>
                        <div>Nombre : </div>
                        <div>Apellido : </div>
                        <div>Email : </div>
                        <div>Contraseña : </div>
                        <div>Empresa</div>



                        


                      </section>
                      <section>
                        <div><input type="text" id='addUserNombre'></input></div>
                        <div><input type="text" id='addUserApellido'></input></div>
                        <div><input type="email" id='addUserEmail'></input></div>
                        <div><input type="password" id='addUserPassword'></input></div>
                        <div>                        
                          <select  id='addUserEmpresa'>
                            <option value="Resvera">Resvera</option>
                            <option value="Vine Vera - Orogold">Vine Vera - Orogold</option>
                            <option value="FTK">FTK</option>
                            <option value="G. Insurgentes y T. Manacar- VV">TBE</option>
                            <option value="G. Insurgentes y T. Manacar- VV">Noir Niche</option>
                          </select>
                        </div>
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>AgregarUsuario()}>Agregar Usuario</div>
                    </div>
                  </div>
                  :""
                }

                {
                  vistaPopup == 'EditUsers' ?
                  <div className="containerEditUserOption">
                    <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Edicion de Usuarios</h1>
                    <div className='TablaEditUser'>
                        {
                          edicionSeleccion.length>0?
                          <section className='Titulos'>                        
                            <div className='containerId'>Id</div>
                            <div>Nombre</div>
                            <div>Apellido</div>
                            <div>Email</div>
                            <div>Contraseña</div>
                            <div>Empresa</div>
                          </section>
                          :
                          "No ha seleccionado elementos para editar"
                        }
                     
                      <section className=''>    
                        { 
                          edicionSeleccion.length>0?
                            edicionSeleccion.map((elemento)=>
                            <div key={elemento.user_id}  className='Fila'>
                              <input type="text" className='id' value={elemento.user_id} id={elemento.user_id+"-user_id"} readOnly />
                              <input type="text" defaultValue={elemento.usr_name}  id={elemento.user_id+"-usr_name"} />
                              <input type="text" defaultValue={elemento.usr_lastname} id={elemento.user_id+"-usr_lastname"} />
                              <input type="text" defaultValue={elemento.usr_email} id={elemento.user_id+"-usr_email"}  />
                              <input type="text" defaultValue={elemento.usr_pass} id={elemento.user_id+"-usr_pass"}  />
                              <input type="text" defaultValue={elemento.empresa} id={elemento.user_id+"-empresa"}  />
                            </div>
                            )
                          :""
                        }
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonEditUser">
                        <div onClick={()=>EditarUsuario()}>Actualizar</div>
                    </div>
                  </div>
                  :""
                }
                {
                  vistaPopup == 'DeleteUsers' ?
                  <div className="containerDeleteUserOption">
                    <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Eliminar Usuario(s)</h1>
                    <label>
                      Se eliminaran los siguientes elementos
                    </label>
                    <div className='TablaEditUser'>
                        {
                          edicionSeleccion.length>0?
                          <section className='Titulos'>                        
                            <div>Nombre</div>
                            <div>Apellido</div>
                            <div>Email</div>
                            <div>Contraseña</div>
                          </section>
                          :
                          "No ha seleccionado elementos para editar"
                        }
                     
                      <section className=''>    
                        { 
                          edicionSeleccion.length>0?
                            edicionSeleccion.map((elemento)=>
                            <div key={elemento.user_id}  className='Fila'>
                              <input type="text" className='id' value={elemento.user_id}  disabled />
                              <input type="text" placeholder={elemento.usr_name} disabled />
                              <input type="text" placeholder={elemento.usr_lastname}  disabled />
                              <input type="text" placeholder={elemento.usr_email} disabled />
                              <input type="text" placeholder={elemento.usr_pass} disabled />
                            </div>
                            )
                          :""
                        }
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonDeleteUser">
                        <div onClick={()=>EliminarUsuario()}>Eliminar Usuario(s)</div>
                    </div>
                  </div>
                  :""
                }

              </div>
            </Modal>                  
    </div>
  );
}

export default Usuarios;




