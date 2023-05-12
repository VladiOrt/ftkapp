
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { render } from 'react-dom';
import { useModal } from 'react-hooks-use-modal';

import axios from "axios";
import './index.scss'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ArrowBackIosRounded } from '@mui/icons-material';
import { id } from 'date-fns/locale';

import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import BadgeIcon from '@mui/icons-material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';
import Moment from 'react-moment';
import 'moment-timezone';

function Video() {

  const[otherUserData,setOtherUsersData] = useState([])
  const[permisosData,setPermisosData] = useState([])
  const[archivos, setArchivos] =  useState(null)
  const[video, setVideo] =  useState(null)
  const subirArchivos = e =>{
    console.log("1--->")
    setArchivos(e)
  }

  const subirVideo = e =>{
    console.log("2--****--" , e)
    setVideo(e)
  }
  const insertarArchivos = async(tipo) =>{

    if(tipo==='pdf'){
      const f =  new FormData();
      f.append(undefined,archivos[0])
      const datos = await axios.post('http://localhost:5000/Video/upload', f)
      setMessageAddPdf(datos.data.message)
      if(datos.data.message=='Archivo Cargado'){
        const datos = await axios.get('http://localhost:5000/Video/files', {
          headers: {       
          }
        })
        let Dat = (datos.data).data
        setData(Dat);
      }
    }

    if(tipo==='video'){
      console.log("Entro--->")
      const f =  new FormData();
      f.append(undefined,archivos[0])
      const datos = await axios.post('http://localhost:5000/Video/upload', f)
      setMessageAddPdf(datos.data.message)
      if(datos.data.message=='Archivo Cargado'){
        const datos = await axios.get('http://localhost:5000/Video/files', {
          headers: {       
          }
        })
        let Dat = (datos.data).data
        setData(Dat);
      }
    }
   
  } 


  async function EnviarArchivos (){

  }



  const[datosSeleccionados, setDatosSeleccionados] = useState('')
  const[edicionSeleccion, setEdicionSeleccion] = useState([])
  const[vistaPopup, setVistaPopup] = useState([])
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: false
  });

  const [data, setData] = useState([]);
  const [messageAddPdf, setMessageAddPdf] = useState("");
  const [messageAddVideo, setMessageAddVideo] = useState("");
  const [messageAddUser, setMessageAddUser] = useState("");
  const [messageAddCapt, setMessageAddCapt] = useState("")
  const [messageEditUser, setMessageEditUser] = useState("");
  const [messageDeleteUser, setMessageDeleteUser] = useState("");


 
  const fetchData = async () => {
    
    const datos = await axios.get('http://localhost:5000/Video/files', {
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
    setMessageAddPdf("Procesando ...")
    let Archivo = document.getElementById("filePDF").value
    if(Archivo==''||  Archivo== null){
      setMessageAddPdf("Ingrese un archivo pdf por favor")
    }else{
      const enviarProyecto = await axios.post('http://localhost:5000/projects/createProject', {
        Archivo
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
        setMessageAddPdf("")
        close()
      }
    }
  }

  function AbrirPopup (dato){
    if(dato =='Video'){
      setVistaPopup('addVideo')
    }else if(dato =='Permisos'){
      setVistaPopup('permisosVideo')
    }else if(dato =='Eliminar'){
      setVistaPopup('deleteVideo')
    }
    
    open()
  }

  function cerrarPopProyecto(){
    close();
    setMessageAddPdf("");
  } 


  async function EliminarPermiso(id, idVideo){  
      const Eliminacion = await axios.post('http://localhost:5000/Permisos/delete/file/'+id, {
        id
      })
      let resEliminacion = (Eliminacion.data).data
      console.log("-->" ,resEliminacion )



      const datosPermisos = await axios.get('http://localhost:5000/Permisos/permisos/video/'+idVideo, {
        headers: {       
        }
      })
      let permisosPDF = (datosPermisos.data).data
      setPermisosData(permisosPDF);
      


      const datosUsuarios = await axios.get('http://localhost:5000/Permisos/otherUsers/video/'+idVideo, {
        headers: {       
        }
      })
      let dataSelect = (datosUsuarios.data).data
      setOtherUsersData(dataSelect);        
  }



  async function AgregarPermiso(nombre,idVideo){
    let idUser = document.getElementById('valorUsuario').value;
    console.log("---><" ,idUser  )
    console.log("---><" ,nombre  )
    console.log("---><" ,idVideo  )
    console.log("-.-.-.-.-." , idUser)
    if(idUser =='' || idUser ==null || idUser ==undefined) {
      alert("Selecciona un usuario")
      return 0
    }
    //setMessageAddPdf("Procesando ...")            
      const enviarProyecto = await axios.post('http://localhost:5000/Permisos/insert/video/'+idVideo, {
        nombrePdf: nombre,
        idUser: idUser
      })

      let insertarPermiso = (enviarProyecto.data)
      let Valid = insertarPermiso.valido
      if(Valid == 1){
        const datosPermisos = await axios.get('http://localhost:5000/Permisos/permisos/video/'+idVideo, {
          headers: {       
          }
        })
        let permisosPDF = (datosPermisos.data).data
        setPermisosData(permisosPDF);
        


        const datosUsuarios = await axios.get('http://localhost:5000/Permisos/otherUsers/video/'+idVideo, {
          headers: {       
          }
        })
        let dataSelect = (datosUsuarios.data).data
        setOtherUsersData(dataSelect);        
      }
    
  }






  function agregarDatosSeleccionados(elemento){
    let Valores = [datosSeleccionados]
    if(datosSeleccionados.length>0) Valores = datosSeleccionados.split(',')
    console.log("elementos--->" , elemento)
    let valorNuevo = elemento.id_video
    let valoresNuevos =[]
    let strvaloresNuevos =''
    let Existe=0
    for(let n=0 ; n<Valores.length; n++){
      if(valorNuevo === parseInt(Valores[n])){
        console.log("Existe")
        Existe=1
      }else{
        console.log("Entro")
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
        strvaloresNuevos = elemento.id_video
      }else{
        strvaloresNuevos = datosSeleccionados+","+elemento.id_video
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
      let IdDato = data[n].id_video
      for(let l=0;  l<idSeleccion.length ; l++){
        if(IdDato == idSeleccion[l]) arrayNuevo.push(data[n])
      }      
    }
    setEdicionSeleccion(arrayNuevo)
  }









  async function EditarProyecto(){
   
    let datosProcesar = (datosSeleccionados.toString()).split(',')
    for(let n=0;n<datosProcesar.length; n++){
      let TituloO = document.getElementById(datosProcesar[n]+"-pjct_TituloOriginal").value
      let TituloA= document.getElementById(datosProcesar[n]+"-pjct_TituloAutorizado").value
      let Cliente= document.getElementById(datosProcesar[n]+"-pjct_Cliente").value
      let Genero= document.getElementById(datosProcesar[n]+"-pjct_Genero").value
      let Duracion= document.getElementById(datosProcesar[n]+"-pjct_Duracion").value
      let Capitulos= document.getElementById(datosProcesar[n]+"-pjct_Capitulos").value

      if(TituloO =='' || TituloO==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].id_project == datosProcesar[n]){
            TituloO = edicionSeleccion[f].pjct_TituloOriginal
          }
        }
      }
      if(TituloA =='' || TituloA==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].id_project == datosProcesar[n]){
            TituloA = edicionSeleccion[f].pjct_TituloAutorizado
          }
        }
      }
      if(Cliente =='' || Cliente==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].id_project == datosProcesar[n]){
            Cliente = edicionSeleccion[f].pjct_Cliente
          }
        }
      }
      if(Genero =='' || Genero==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].id_project == datosProcesar[n]){
            Genero = edicionSeleccion[f].pjct_Genero
          }
        }
      }
      if(Duracion =='' || Duracion==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].id_project == datosProcesar[n]){
            Duracion = edicionSeleccion[f].pjct_Duracion
          }
        }
      }

      if(Capitulos =='' || Capitulos==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].id_project == datosProcesar[n]){
            Capitulos = edicionSeleccion[f].pjct_Capitulos
          }
        }
      }

      const datos = await axios.patch('http://localhost:5000/projects/updateProject', {
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






    const datos = await axios.get('http://localhost:5000/projects/All', {
      headers: {       
      }
    })

    let Dat = (datos.data).data
    setData(Dat);
    let arrayNuevoActualizado = []
    let DatosSeleccionadosNow = (datosSeleccionados.toString()).split(',')
    for(let ns = 0 ; ns <DatosSeleccionadosNow.length; ns++ ){
        for(let n=0; n<Dat.length; n++ ){
          if(parseInt(DatosSeleccionadosNow[ns]) == Dat[n].id_project){
            arrayNuevoActualizado.push(Dat[n])
          }
        }
    }
    setEdicionSeleccion(arrayNuevoActualizado)
    setMessageDeleteUser("")
    close()
   
  }





  async function EliminarProyecto(){
    let DatosSelect = datosSeleccionados.toString()
    let IDS =  DatosSelect.split(',')
    let validos = 0
    let errores = 0
    for(let n=0;n<IDS.length; n++){
      const datos = await axios.post('http://localhost:5000/Video/delete/'+IDS[n], {
        id: IDS[n]
      })
      let Dat = (datos.data).data
      if(Dat.affectedRows == 1){
        validos  = validos + 1
      }else{
        errores  = errores + 1
      }
    }
    const datos = await axios.get('http://localhost:5000/Pdf/files', {
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
  
  




  async function agregarcapitulos(){
    let DatosSelect = datosSeleccionados.toString()
    let IDS =  DatosSelect.split(',')
    let validos = 0
    let errores = 0



    for(let n=0;n<IDS.length; n++){
      
      let IdProyecto = IDS[n]
      let NombreCapt = document.getElementById(IDS[n]+"-Nombre").value
      let DuracionCapt = document.getElementById(IDS[n]+"-Duracion").value
      let DirectorCapt = document.getElementById(IDS[n]+"-Director").value
      let TraductorCapt = document.getElementById(IDS[n]+"-Traductor").value

      if(NombreCapt == null || NombreCapt == ''){
        setMessageAddCapt("por favor inserta un nombre de capitulo")        
      }else if(DuracionCapt == null || DuracionCapt == ''){
        setMessageAddCapt("por favor inserta unas duracion de Capitulo")        
      }else if(DirectorCapt == null || DirectorCapt == ''){
        setMessageAddCapt("por favor inserta un director del Capitulo")        
      }else if(TraductorCapt == null || TraductorCapt == ''){
        setMessageAddCapt("por favor inserta un Traductor del Capitulo")        
      }else{
        const datos = await axios.post('http://localhost:5000/capitulos/createCapt', {
          Nombre : NombreCapt,
          Duracion: DuracionCapt,
          Director: DirectorCapt,
          Traductor: TraductorCapt,
          id: parseInt(IdProyecto)
        })
        let Dat = (datos.data).data
      }
    }



    setMessageDeleteUser("")
    close()
   
  }
  
  

  return (
    <div className="containerVideo">
 
      <div className="headerConatainerVideo">
        <div className="botones">        
          <Button variant="outlined"  color='info' onClick={()=>AbrirPopup('Video')}>
            VIDEO
            <PersonalVideoIcon />
          </Button>
          <Button variant="outlined"  color='error' onClick={()=>AbrirPopup('Eliminar')}>
            ELIMINAR
            <DeleteIcon />
          </Button>
          <Button variant="outlined"  color='success' onClick={()=>AbrirPopup('Permisos')}>
            PERMISOS
            <BadgeIcon />
          </Button>
          
        </div>                         
      </div>

      <div className="bodyContainerVideo">
        <div className='TableVideo'>
          <div className='Tabla'>
            <div className='theadTableVideo'>
              <div className='containerID'>id</div>
              <div>Nombre de Archivo </div>
              <div>Fecha</div>
              <div>Descargar</div>             
            </div>
            <div className='bodyTableVideo'>
              {
                data.length>0?
                  data.map((elemento)=>      
                    <div className='Fila' key={elemento.id_pdf}>
                      <div className='Columnaid'> <input type="checkbox" onClick={()=>agregarDatosSeleccionados(elemento)} ></input> </div>
                      <div>{elemento.video_name}</div>                    
                      <div><Moment format="YYYY/MM/DD">{elemento.fechaIngreso}</Moment></div>    
                      <div></div>                                               
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
                  vistaPopup == 'addVideo' ?
                  <div className="containerAddUserOption">
                    <div className="sectionClose" > 
                      <button  onClick={()=>cerrarPopProyecto()}>
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregar Video</h1>
                    <div className='TablaAddUser'>
                      <section className='labels'>
                      <div>Archivo de Video : </div>                     
                      </section>
                      <section>
                        <div><input type="file"  id='archivoPDF' onChange={(e) => subirArchivos(e.target.files) }></input></div>                      
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddPdf}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>insertarArchivos('video')}>Subir Video</div>
                    </div>
                  </div>
                  :""
                }




                {
                  vistaPopup == 'EditProjects' ?
                  <div className="containerEditProjectsOption">
                    <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                                        
                    <h1>Agregar Video</h1>
                    <div className='TablaAddUser'>
                      <section className='labels'>
                      <div>Nombre de video : </div>
                      <div>Video : </div>
                     
                      </section>
                      <section>
                        <div><input type="text" id='NombreVideo'></input></div>                      
                      <div><input type="file"  id='archivoVideo' onChange={(e) => subirVideo(e.target.files) }></input></div>                         
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonAddVideo">
                        <div onClick={()=>AgregarProyecto()}>Subir PDF</div>
                    </div>
                  </div>
                  :""
                }












                {
                  vistaPopup == 'deleteVideo' ?
                  <div className="containerDeleteProjectsOption">
                    <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Eliminar Video(s)</h1>
                    <label>
                      Se eliminaran los siguientes elementos
                    </label>
                    <div className='TablaEditProjects'>
                        {
                          edicionSeleccion.length>0?
                          <section className='Titulos'>                        
                            <div className='id'>Id</div>
                            <div>Nombre</div>
                            <div>Fecha</div>
                          
                          </section>
                          :
                          "No ha seleccionado elementos para eliminar"
                        }
                     
                      <section className=''>    
                        { 
                          edicionSeleccion.length>0?
                            edicionSeleccion.map((elemento)=>
                            <div key={elemento.id_video}  className='Fila'>
                              <input type="text" className='id' value={elemento.id_video} disabled/>
                              <input type="text" placeholder={elemento.video_name} disabled />
                              <input type="text" placeholder={elemento.video_fechaingreso} disabled />                             
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
                        <div onClick={()=>EliminarProyecto()}>Eliminar video(s)</div>
                    </div>
                  </div>
                  :""
                }



















                {
                  vistaPopup == 'permisosVideo' ?
                  <div className="containerEditPermisosVideo">
                  <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                    <button >
                      <div className='lineaUno' />
                      <div className='lineaDos' />
                    </button>
                  </div>
                  
                  <h1>Agregar ó quitar permisos para ver los Videos</h1>
                  <label>
                    Se agregaran o quitaran los permisos seleccionados               
                  </label>
                  <div className='TablaEditPermisos'>                                                        
                         
                    <section className='Encabezado'>    
                    <div className="encabezadoArchivos">
                      <div>
                        Id de archivo : 
                        {
                          edicionSeleccion.length >0 ?
                            edicionSeleccion[0].id_video
                            :""
                        }
                      </div>
                      <div>
                        Nombre de archivo :
                        {
                          edicionSeleccion.length >0 ?
                            edicionSeleccion[0].video_name
                            :""
                        }               
                      </div>                        
                  </div>
                  
             
                      <div className='IngresarPermiso'>
                        <label> Usuarios: </label>
                        <select id="valorUsuario">
                          <option value="">Seleccione un usuario</option>
                          {
                            otherUserData.length>0? 
                              otherUserData.map((elemento)=>
                              <option value={elemento.user_id} >
                                {elemento.usr_name}
                              </option>)
                              :"Todos los usuarios cuentan con permisos"
                          }                          
                        </select>

                        <div className='botonAgregar' onClick={()=> AgregarPermiso(edicionSeleccion[0].pdf_name,edicionSeleccion[0].id_pdf) }>Agregar Permiso</div>
                      </div>                      

                        <br />
                        Permisos actuales:
                        <br />
                        <div className='headerPermisos'>
                          <div className='id'>Id</div>
                          <div>Usuario</div>
                          <div>Accion</div>
                        </div>
                      { 
                        permisosData.length>0?
                        permisosData.map((elemento)=>
                          <div key={elemento.idPermiso}  className='FilaPermisos'>
                            <input type="text" className='id' value={elemento.idUser} disabled/>
                            <input type="text" id={elemento.pdf_name+"-Nombre"} placeholder={elemento.usr_name + " " +elemento.usr_lastname} />         
                            <div className="botonEliminar" onClick={()=> EliminarPermiso(elemento.idPermiso, elemento.idPdf)}> Eliminar </div>
                          </div>
                          )
                        :""
                      }

                    </section>
                  </div>
                  <div className="conatinerMessage">
                    {messageAddCapt}
                  </div>               
                </div>
                  :""
                }















              </div>
         </Modal>                  
    </div>
  );
}

export default Video;



