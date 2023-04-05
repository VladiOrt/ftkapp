
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

import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import BadgeIcon from '@mui/icons-material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';


function Proyectos() {

  const[archivos, setArchivos] =  useState(null)


  const subirArchivos = e =>{
    setArchivos(e)
  }


  const insertarArchivos = async() =>{
    const f =  new FormData();
    f.append(archivos[0])

    const datos = await axios.post('http://localhost:5000/Pdf/upload', f)


    console.log(datos)


  } 


  async function EnviarArchivos (){

  }



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
  const [messageAddCapt, setMessageAddCapt] = useState("")
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
    let Archivo = document.getElementById("filePDF").value
    if(Archivo==''||  Archivo== null){
      setMessageAddUser("Ingrese un archivo pdf por favor")
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
        setMessageAddUser("")
        close()
      }
    }
  }

  function AbrirPopup (dato){
    if(dato =='Pdf'){
      setVistaPopup('AddUser')
    }else if(dato =='Video'){
      setVistaPopup('EditProjects')
    }else if(dato =='Permisos'){
      setVistaPopup('DeleteProjects')
    }else if(dato =='Eliminar'){
      setVistaPopup('AddCapitulos')
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
    let valorNuevo = elemento.id_project
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
        strvaloresNuevos = elemento.id_project
      }else{
        strvaloresNuevos = datosSeleccionados+","+elemento.id_project
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
      let IdDato = data[n].id_project
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
      const datos = await axios.patch('http://localhost:5000/projects/deleteProject', {
        id: IDS[n]
      })
      let Dat = (datos.data).data
      if(Dat.affectedRows == 1){
        validos  = validos + 1
      }else{
        errores  = errores + 1
      }
    }
    const datos = await axios.get('http://localhost:5000/projects/All', {
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
    <div className="containerProjects">
      <div className="titleContainerProjects">
        <div className="title">Catalogo de Archivos</div>            
      </div>
      <div className="headerConatainerProjects">
        <div className="botones">
          <Button variant="outlined"  color='info' onClick={()=>AbrirPopup('Pdf')}>
            PDF
            <PictureAsPdfIcon />
          </Button>
          <Button variant="outlined"  color='info' onClick={()=>AbrirPopup('Video')}>
            VIDEO
            <PersonalVideoIcon />
          </Button>
          <Button variant="outlined"  color='error' onClick={()=>AbrirPopup('Permisos')}>
            ELIMINAR
            <DeleteIcon />
          </Button>
          <Button variant="outlined"  color='success' onClick={()=>AbrirPopup('Eliminar')}>
            PERMISOS
            <BadgeIcon />
          </Button>
          
        </div>                         
      </div>

      <div className="bodyContainerUser">
        <div className='TableProyectos'>
          <div className='Tabla'>
            <div className='theadTableArchivos'>
              <div className='containerID'>id</div>
              <div>Nombre de Archivo </div>
              <div>Propietario</div>
              <div>Fecha</div>             
            </div>
            <div className='bodyTableArchivos'>
              {
                data.length>0?
                  data.map((elemento)=>      
                    <div className='Fila' key={elemento.id_project}>
                      <div className='Columnaid'> <input type="checkbox" onClick={()=>agregarDatosSeleccionados(elemento)} ></input> </div>
                      <div>{elemento.pjct_TituloOriginal}</div>                    
                      <div>{elemento.pjct_TituloAutorizado}</div>    
                      <div>{elemento.pjct_Cliente}</div>                                               
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
                    
                    <h1>Agregar PDF</h1>
                    <div className='TablaAddUser'>
                      <section className='labels'>
                      <div>Nombre de archivo : </div>
                      <div>Archivo : </div>
                     
                      </section>
                      <section>
                        <div><input type="text" id='NombrePDF'></input></div>                      
                        <div><input type="file"  id='archivoPDF' onChange={(e) => subirArchivos(e.target.files) }></input></div>                      
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>insertarArchivos()}>Subir PDF</div>
                    </div>
                  </div>
                  :""
                }



                {
                  vistaPopup == 'AddVideo' ?
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
                      <div>Nombre de video : </div>
                      <div>Video : </div>
                     
                      </section>
                      <section>
                        <div><input type="text" id='NombreVideo'></input></div>                      
                        <div><input id="filePDF" type="file"  /></div>                      
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
                        <div><input id="fileVideo" type="file" accept="video/mp4,video/mkv, video/x-m4v,video/*" /></div>                      
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
                  vistaPopup == 'DeleteProjects' ?
                  <div className="containerDeleteProjectsOption">
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
                    <div className='TablaEditProjects'>
                        {
                          edicionSeleccion.length>0?
                          <section className='Titulos'>                        
                            <div className='id'>Id</div>
                            <div>Titulo Original</div>
                            <div>Titulo Autorizado</div>
                            <div>Cliente</div>
                            <div>Genero</div>
                            <div>Duracion</div>
                            <div>Capitulos</div>
                          </section>
                          :
                          "No ha seleccionado elementos para eliminar"
                        }
                     
                      <section className=''>    
                        { 
                          edicionSeleccion.length>0?
                            edicionSeleccion.map((elemento)=>
                            <div key={elemento.id_project}  className='Fila'>
                              <input type="text" className='id' value={elemento.id_project} disabled/>
                              <input type="text" placeholder={elemento.pjct_TituloOriginal} disabled />
                              <input type="text" placeholder={elemento.pjct_TituloAutorizado} disabled />
                              <input type="text" placeholder={elemento.pjct_Cliente} disabled />
                              <input type="text" placeholder={elemento.pjct_Genero} disabled />
                              <input type="text" placeholder={elemento.pjct_Duracion} disabled  />
                              <input type="text" placeholder={elemento.pjct_Capitulos} disabled/>                            
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



















                {
                  vistaPopup == 'AddCapitulos' ?
                  <div className="containerDeleteProjectsOption">
                    <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregaro/Quitar Permisos para ver los Archivos</h1>
                    <label>
                      Se agregaran o quitaran los permisos seleccionados               
                    </label>
                    <div className='TablaEditProjects'>
                        {
                          edicionSeleccion.length>0?
                          <section className='Titulos'>                        
                            <div className='id'>Id-P</div>
                            <div>Nombre</div>
                            <div>Duracion</div>
                            <div>Director</div>
                            <div>Traductor</div>
                          </section>
                          :
                          "No ha seleccionado elementos para administrar permisos"
                        }
                     
                      <section className=''>    
                        { 
                          edicionSeleccion.length>0?
                            edicionSeleccion.map((elemento)=>
                            <div key={elemento.id_project}  className='Fila'>
                              <input type="text" className='id' value={elemento.id_project} disabled/>
                              <input type="text" id={elemento.id_project+"-Nombre"} placeholder="Nombre del capitulo" />
                              <input type="text" id={elemento.id_project+"-Duracion"} placeholder="Duracion"  />
                              <input type="text" id={elemento.id_project+"-Director"} placeholder="Director"  />
                              <input type="text" id={elemento.id_project+"-Traductor"} placeholder="Traductor" />
                                        
                            </div>
                            )
                          :""
                        }
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddCapt}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>agregarcapitulos()}>Agregar Permiso(s)</div>
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



