
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { render } from 'react-dom';
import { useModal } from 'react-hooks-use-modal';

import Table from "./components/Table";
import axios from "axios";
import './index.scss'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ArrowBackIosRounded } from '@mui/icons-material';
import { id } from 'date-fns/locale';




function Proyectos() {
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
    
    const datos = await axios.get('http://localhost:5000/projects/All', {
      headers: {       
      }
    })
    let Dat = (datos.data).data
    setData(Dat);
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);


  async function AgregarProyecto(){
    setMessageAddUser("Procesando ...")



    let TituloO = document.getElementById("addProjectTO").value
    let TituloA = document.getElementById("addProjectTA").value
    let Cliente = document.getElementById("addProjectCliente").value
    let Genero = document.getElementById("addProjectGenero").value
    let Duracion = document.getElementById("addProjectDuracion").value
    let Capitulo = document.getElementById("addProjectCapitulos").value

    if(TituloO==''||  TituloO== null){
      setMessageAddUser("Ingrese el Titulo Original")
    }else if(TituloA==''||  TituloA== null){
      setMessageAddUser("Ingrese el Titulo Autorizado")
    }else if(Cliente==''||  Cliente== null){
      setMessageAddUser("Ingrese un Cliente")
    }else if(Genero==''||  Genero== null){
      setMessageAddUser("Ingrese un Genero")
    }else if(Duracion==''||  Duracion== null){
      setMessageAddUser("Ingrese una Duracion")
    }else if(Capitulo==''||  Capitulo== null){
      setMessageAddUser("Ingrese una Capitulo")
    }else{
      const enviarProyecto = await axios.post('http://localhost:5000/projects/createProject', {
        TituloOriginal: TituloO,
        TituloAutorizado: TituloA,
        Cliente: Cliente,
        Genero: Genero,
        Duracion: Duracion,
        Capitulos: Capitulo
      })
      let dadtosProyecto = (enviarProyecto.data)
      let Valid = dadtosProyecto.valido
      if(Valid == 1){
        const datos = await axios.get('http://localhost:5000/projects/All', {
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
      setVistaPopup('EditProjects')
    }else if(dato =='Delete'){
      setVistaPopup('DeleteProjects')
    }
    
    open()
  }

  function cerrarPopProyecto(){
    close();
    setMessageAddUser("");
  } 







  function agregarDatosSeleccionados(elemento){
    let Valores = [datosSeleccionados]
    if(datosSeleccionados.length>0) Valores = datosSeleccionados.split(',')
    console.log("<<<<<<" , datosSeleccionados)
    let valorNuevo = elemento.id_project
    let valoresNuevos =[]
    let strvaloresNuevos =''
    let Existe=0
    for(let n=0 ; n<Valores.length; n++){
      console.log("*****" , valorNuevo, "**", Valores[n])
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
        strvaloresNuevos = elemento.id_project
      }else{
        strvaloresNuevos = datosSeleccionados+","+elemento.id_project
      }      
    }
    OrdenarDatosSeleccionados(strvaloresNuevos) 
    setDatosSeleccionados(strvaloresNuevos)
  }



  function OrdenarDatosSeleccionados(Datos){
    console.log("--->" , Datos)
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









  async function EditarProyecto(){
   
    let  datosProcesar = (datosSeleccionados.toString()).split(',')
    console.log(datosProcesar)
    for(let n=0;n<datosProcesar.length; n++){
      let TituloO = document.getElementById(datosProcesar[n]+"-usr_name").value
      let TituloA= document.getElementById(datosProcesar[n]+"-usr_lastname").value
      let Cliente= document.getElementById(datosProcesar[n]+"-usr_email").value
      let Genero= document.getElementById(datosProcesar[n]+"-usr_pass").value
      let Duracion= document.getElementById(datosProcesar[n]+"-usr_pass").value
      let Capitulos= document.getElementById(datosProcesar[n]+"-usr_pass").value

      if(TituloO =='' || TituloO==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].TituloO == datosProcesar[n]){
            TituloO = edicionSeleccion[f].TituloO
          }
        }
      }
      if(TituloA =='' || TituloA==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            TituloA = edicionSeleccion[f].usr_lastname
          }
        }
      }
      if(Cliente =='' || Cliente==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].TituloA == datosProcesar[n]){
            Cliente = edicionSeleccion[f].usr_email
          }
        }
      }
      if(Genero =='' || Genero==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            Genero = edicionSeleccion[f].usr_pass
          }
        }
      }
      if(Duracion =='' || Duracion==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            Duracion = edicionSeleccion[f].usr_pass
          }
        }
      }

      if(Capitulos =='' || Capitulos==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            Capitulos = edicionSeleccion[f].usr_pass
          }
        }
      }

      const datos = await axios.patch('http://localhost:5000/user/updateUser', {
        TituloOriginal : TituloO,
        TituloAutorizado: TituloA,
        Cliente,
        Genero,
        Duracion,
        Capitulos,
        id: parseInt(datosProcesar[n])
      })
      let Dat = (datos.data).data
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





  async function EliminarProyecto(){
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
    <div className="containerProjects">
      <div className="titleContainerProjects">
        <div className="title">Catalogo de Proyectos</div>            
      </div>
      <div className="headerConatainerProjects">
        <div className="button" onClick={()=>AbrirPopup('Add')}>
          <div className='containerPopProjects'>
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

      <div className="bodyContainerUser">
        <div className='TableProyectos'>
          <div className='Tabla'>
            <div className='theadTable'>
              <div className='containerID'>id</div>
              <div>Titulo Original </div>
              <div>Titulo Autorizado </div>
              <div>Cliente</div>
              <div>Genero</div>
              <div>Duracion</div>
              <div>Capitulos</div>
            </div>
            <div className='bodyTable'>
              {
                data.length>0?
                  data.map((elemento)=>      
                    <div className='Fila' key={elemento.id_project}>
                      <div className='Columnaid'> <input type="checkbox" onClick={()=>agregarDatosSeleccionados(elemento)} ></input> </div>
                      <div>{elemento.pjct_TituloOriginal}</div>                    
                      <div>{elemento.pjct_TituloAutorizado}</div>    
                      <div>{elemento.pjct_Cliente}</div>    
                      <div>{elemento.pjct_Genero}</div>    
                      <div>{elemento.pjct_Duracion}</div>    
                      <div>{elemento.pjct_Capitulos}</div>    
                     
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
                      <button  onClick={()=>cerrarPopProyecto()}>
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregar un nuevo Proyecto</h1>
                    <div className='TablaAddUser'>
                      <section className='labels'>
                      <div>Titulo Original : </div>
                      <div>Titulo Autorizado :  </div>
                      <div>Cliente : </div>
                      <div>Genero : </div>
                      <div>Duracion : </div>
                      <div>Capitulos :</div>
                      </section>
                      <section>
                        <div><input type="text" id='addProjectTO'></input></div>
                        <div><input type="text" id='addProjectTA'></input></div>
                        <div><input type="text" id='addProjectCliente'></input></div>
                        <div><input type="text" id='addProjectGenero'></input></div>
                        <div><input type="text" id='addProjectDuracion'></input></div>
                        <div><input type="text" id='addProjectCapitulos'></input></div>
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>AgregarProyecto()}>Agregar Proyecto</div>
                    </div>
                  </div>
                  :""
                }

                {
                  vistaPopup == 'EditProjects' ?
                  <div className="containerEditUserOption">
                    <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Edicion de Proyectos</h1>
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
                              <input type="text" className='id' value={elemento.user_id} id={elemento.user_id+"-user_id"} />
                              <input type="text" placeholder={elemento.usr_name}  id={elemento.user_id+"-usr_name"} />
                              <input type="text" placeholder={elemento.usr_lastname} id={elemento.user_id+"-usr_lastname"} />
                              <input type="text" placeholder={elemento.usr_email} id={elemento.user_id+"-usr_email"}  />
                              <input type="text" placeholder={elemento.usr_pass} id={elemento.user_id+"-usr_pass"}  />
                            </div>
                            )
                          :""
                        }
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>EditarProyecto()}>Actualizar</div>
                    </div>
                  </div>
                  :""
                }
                {
                  vistaPopup == 'DeleteProjects' ?
                  <div className="containerDeleteUserOption">
                    <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Eliminar Proyecto(s)</h1>
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
                    <div className="buttonAddUser">
                        <div onClick={()=>EliminarProyecto()}>Eliminar Proyecto(s)</div>
                    </div>
                  </div>
                  :""
                }

              </div>
            </Modal>                  
    </div>
  );
}

export default Proyectos;



