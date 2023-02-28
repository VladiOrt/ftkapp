
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { render } from 'react-dom';
import { useModal } from 'react-hooks-use-modal';

import Table from "./components/Table";
import axios from "axios";
import './index.scss'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ArrowBackIosRounded } from '@mui/icons-material';




function Usuarios() {
  const[datosGenerales, setDatosGenerales] = useState([])
  const[datosTabla, setDatosTabla] = useState([])
  const[datosSeleccionados, setDatosSeleccionados] = useState('')
  const[vistaPopup, setVistaPopup] = useState([])
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: false
  });

  const [data, setData] = useState([]);
  const [messageAddUser, setMessageAddUser] = useState("");




 
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
        contraseña: Pass
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
    let Valores = datosSeleccionados.split(',')
    let valorNuevo = elemento.user_id
    let valoresNuevos =[]
    let strvaloresNuevos =''
    //Se encuentra en el array ?
    let Existe=0

    for(let n=0 ; n<Valores.length; n++){
      console.log(valorNuevo ,Valores[n])
      if(valorNuevo === parseInt(Valores[n])){
        Existe=1
      }else{
        valoresNuevos.push(Valores[n])
      }
    }
    console.log(Existe)
    if(Existe ===1){
      console.log("Existe")
      for(let n=0 ; n<valoresNuevos.length; n++){
        strvaloresNuevos = strvaloresNuevos+","+valoresNuevos[n]
      }
    }else{
      strvaloresNuevos = datosSeleccionados
      +","+elemento.user_id
    }
    
    setDatosSeleccionados(strvaloresNuevos)
  }

  return (
    <div className="containerUsers">
      <div className="titleContainerUsers">
        <div className="title">Catalogo de Usuarios</div>            
      </div>
      <div className="headerConatainerUsers">
        <div className="button" onClick={()=>AbrirPopup('Add')}>
          <div className='containerPopUsers'>
            <button >OPEN</button>             
          </div>                  
        </div>
        <div className="button" onClick={()=>AbrirPopup('Edit')}>
            Editar
        </div>        
        <div className="button" onClick={()=>AbrirPopup('Delete')}>
            Eliminar
        </div>
      </div>

      {datosSeleccionados}
      <div className="bodyContainerUser">
        <div className='TableUsuarios'>
          <div className='Tabla'>
            <div className='theadTable'>
              <div>id</div>
              <div>Nombre</div>
              <div>Apellido</div>
              <div>Email</div>
              <div>Contraseña</div>
            </div>
            <div className='bodyTable'>
              {
                data.length>0?
                  data.map((elemento)=>      
                    <div className='Fila' key={elemento.user_id}>
                      <div className='Columna'> <input type="checkbox" onClick={()=>agregarDatosSeleccionados(elemento)} ></input> </div>
                      <div>{elemento.usr_name}</div>                    
                      <div>{elemento.usr_lastname}</div>    
                      <div>{elemento.usr_email}</div>    
                      <div>{elemento.usr_pass}</div>    
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
                    <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregar un nuevo Usuario</h1>
                    <div className='TablaAddUser'>
                      <section>
                        <div>Nombre</div>
                        <div>Apellido</div>
                        <div>Email</div>
                        <div>Contraseña</div>
                      </section>
                      <section>
                        <div><input type="text" id='addUserNombre'></input></div>
                        <div><input type="text" id='addUserApellido'></input></div>
                        <div><input type="email" id='addUserEmail'></input></div>
                        <div><input type="password" id='addUserPassword'></input></div>
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
                    <div className='TablaAddUser'>
                      <section>
                        <div>Nombre</div>
                        <div>Apellido</div>
                        <div>Email</div>
                        <div>Contraseña</div>
                      </section>
                      <section>
                        <div><input type="text" id='addUserNombre'></input></div>
                        <div><input type="text" id='addUserApellido'></input></div>
                        <div><input type="email" id='addUserEmail'></input></div>
                        <div><input type="password" id='addUserPassword'></input></div>
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>AgregarUsuario()}>Actualizar</div>
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
                    
                    <h1>Agregar un nuevo Usuario</h1>
                    <div className='TablaAddUser'>
                      <section>
                        <div>Nombre</div>
                        <div>Apellido</div>
                        <div>Email</div>
                        <div>Contraseña</div>
                      </section>
                      <section>
                        <div><input type="text" id='addUserNombre'></input></div>
                        <div><input type="text" id='addUserApellido'></input></div>
                        <div><input type="email" id='addUserEmail'></input></div>
                        <div><input type="password" id='addUserPassword'></input></div>
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

              </div>
            </Modal>
      
    </div>
  );
}

export default Usuarios;






/*

        <Modal>
              <div id='containerOptionUser'>
                {
                  vistaPopup == 'AddUser' ?
                  <div className="containerAddUserOption">
                    <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregar un nuevo Usuario</h1>
                    <div className='TablaAddUser'>
                      <section>
                        <div>Nombre</div>
                        <div>Apellido</div>
                        <div>Email</div>
                        <div>Contraseña</div>
                      </section>
                      <section>
                        <div><input type="text" id='addUserNombre'></input></div>
                        <div><input type="text" id='addUserApellido'></input></div>
                        <div><input type="email" id='addUserEmail'></input></div>
                        <div><input type="password" id='addUserPassword'></input></div>
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
                    <div className='TablaAddUser'>
                      <section>
                        <div>Nombre</div>
                        <div>Apellido</div>
                        <div>Email</div>
                        <div>Contraseña</div>
                      </section>
                      <section>
                        <div><input type="text" id='addUserNombre'></input></div>
                        <div><input type="text" id='addUserApellido'></input></div>
                        <div><input type="email" id='addUserEmail'></input></div>
                        <div><input type="password" id='addUserPassword'></input></div>
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>AgregarUsuario()}>Actualizar</div>
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
                    
                    <h1>Agregar un nuevo Usuario</h1>
                    <div className='TablaAddUser'>
                      <section>
                        <div>Nombre</div>
                        <div>Apellido</div>
                        <div>Email</div>
                        <div>Contraseña</div>
                      </section>
                      <section>
                        <div><input type="text" id='addUserNombre'></input></div>
                        <div><input type="text" id='addUserApellido'></input></div>
                        <div><input type="email" id='addUserEmail'></input></div>
                        <div><input type="password" id='addUserPassword'></input></div>
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

              </div>
            </Modal>


*/