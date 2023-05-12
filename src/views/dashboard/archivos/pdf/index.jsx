
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useModal } from 'react-hooks-use-modal';
import axios from "axios";
import './index.scss'
import 'reactjs-popup/dist/index.css';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BadgeIcon from '@mui/icons-material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';
import Moment from 'react-moment';
import 'moment-timezone';

function Pdfs() {


  const[otherUserData,setOtherUsersData] = useState([])
  const[permisosData,setPermisosData] = useState([])
  const[datosSeleccionados, setDatosSeleccionados] = useState('')
  const[edicionSeleccion, setEdicionSeleccion] = useState([])
  const[vistaPopup, setVistaPopup] = useState([])
  const[archivos, setArchivos] =  useState(null)
  
  const subirArchivos = e =>{
    setArchivos(e)
  }

  const insertarArchivos = async(tipo) =>{
    if(tipo==='pdf'){
      const f =  new FormData();
      f.append(undefined,archivos[0])
      const datos = await axios.post('http://localhost:5000/Pdf/upload', f)
      setMessageAddPdf(datos.data.message)
      if(datos.data.message=='Archivo Cargado'){
        const datos = await axios.get('http://localhost:5000/Pdf/files', {
          headers: {       
          }
        })
        let Dat = (datos.data).data
        setData(Dat);
      }
    }

    if(tipo==='video'){
      const f =  new FormData();
      f.append(undefined,archivos[0])
      const datos = await axios.post('http://localhost:5000/Video/upload', f)
      setMessageAddPdf(datos.data.message)
      if(datos.data.message=='Archivo Cargado'){
        const datos = await axios.get('http://localhost:5000/Pdf/files', {
          headers: {       
          }
        })
        let Dat = (datos.data).data
        setData(Dat);
      }
    }
  } 



  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: false
  });

  const [data, setData] = useState([]);
  const [messageAddPdf, setMessageAddPdf] = useState("");
  const [messageAddVideo, setMessageAddVideo] = useState("");
  const [messageAddUser, setMessageAddUser] = useState("");
  const [messageAddCapt, setMessageAddCapt] = useState("")
  const [messageDeleteUser, setMessageDeleteUser] = useState("");


 
  const fetchData = async () => {
    
    const datos = await axios.get('http://localhost:5000/Pdf/files', {
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
        const datos = await axios.get('http://localhost:5000/Pdf/files', {
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

  async function AbrirPopup (dato){
    if(dato =='Pdf'){
      setVistaPopup('addPdf')
    }else if(dato =='Video'){
      setVistaPopup('addVideo')
    }else if(dato =='Eliminar'){
      setVistaPopup('DeleteProjects')
    }else if(dato =='Permisos'){            
      if(edicionSeleccion.length>1){
        alert("Solo es posible editar permisos de un archivo a la vez")
        return 0
      }else if(edicionSeleccion.length==0){
        alert("Por favor selecciones un archivo")
        return 0
      }else if(edicionSeleccion.length==1){
        const Usuarios = await axios.get('http://localhost:5000/Permisos/otherUsers/pdf/'+edicionSeleccion[0].id_pdf,{})
        let dataOtherUsers = (Usuarios.data).data
        setOtherUsersData(dataOtherUsers)

        const Permisos = await axios.get('http://localhost:5000/Permisos/permisos/pdf/'+edicionSeleccion[0].id_pdf,{})
        let permisosFile = (Permisos.data).data
        setPermisosData(permisosFile)

        setVistaPopup('AddPermisos')
      }
      
    }
    
    open()
  }

  function cerrarPopProyecto(){
    close();
    setMessageAddPdf("");
  } 







  function agregarDatosSeleccionados(elemento){
    let Valores = [datosSeleccionados]
    if(datosSeleccionados.length>0) Valores = datosSeleccionados.split(',')
    let valorNuevo = elemento.id_pdf
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
        strvaloresNuevos = elemento.id_pdf
      }else{
        strvaloresNuevos = datosSeleccionados+","+elemento.id_pdf
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
      let IdDato = data[n].id_pdf
      for(let l=0;  l<idSeleccion.length ; l++){
        if(IdDato == idSeleccion[l]) arrayNuevo.push(data[n])
      }      
    }
    setEdicionSeleccion(arrayNuevo)
  }

  async function EliminarProyecto(){
    let DatosSelect = datosSeleccionados.toString()
    let IDS =  DatosSelect.split(',')
    let validos = 0
    let errores = 0
    for(let n=0;n<IDS.length; n++){
      const datos = await axios.post('http://localhost:5000/Pdf/delete/'+IDS[n], {
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
  

  


  async function EliminarPermiso(id, idPdf){  
      const Eliminacion = await axios.post('http://localhost:5000/Permisos/delete/file/'+id, {
        id
      })
      let resEliminacion = (Eliminacion.data).data
      console.log("-->" ,resEliminacion )



      const datosPermisos = await axios.get('http://localhost:5000/Permisos/permisos/pdf/'+idPdf, {
        headers: {       
        }
      })
      let permisosPDF = (datosPermisos.data).data
      setPermisosData(permisosPDF);
      


      const datosUsuarios = await axios.get('http://localhost:5000/Permisos/otherUsers/pdf/'+idPdf, {
        headers: {       
        }
      })
      let dataSelect = (datosUsuarios.data).data
      setOtherUsersData(dataSelect);        
  }



  async function AgregarPermiso(nombre,idPdf){
    let idUser = document.getElementById('valorUsuario').value;
    console.log("---><" ,idUser  )
    console.log("---><" ,nombre  )
    console.log("---><" ,idPdf  )
    console.log("-.-.-.-.-." , idUser)
    if(idUser =='' || idUser ==null || idUser ==undefined) {
      alert("Selecciona un usuario")
      return 0
    }
    //setMessageAddPdf("Procesando ...")            
      const enviarProyecto = await axios.post('http://localhost:5000/Permisos/insert/pdf/'+idPdf, {
        nombrePdf: nombre,
        idUser: idUser
      })

      let insertarPermiso = (enviarProyecto.data)
      let Valid = insertarPermiso.valido
      if(Valid == 1){
        const datosPermisos = await axios.get('http://localhost:5000/Permisos/permisos/pdf/'+idPdf, {
          headers: {       
          }
        })
        let permisosPDF = (datosPermisos.data).data
        setPermisosData(permisosPDF);
        


        const datosUsuarios = await axios.get('http://localhost:5000/Permisos/otherUsers/pdf/'+idPdf, {
          headers: {       
          }
        })
        let dataSelect = (datosUsuarios.data).data
        setOtherUsersData(dataSelect);        
      }
    
  }

  

  return (
    <div className="containerPdfs">
  
      <div className="headerConatainerPdfs">
        <div className="botones">
          <Button variant="outlined"  color='info' onClick={()=>AbrirPopup('Pdf')}>
            PDF
            <PictureAsPdfIcon />
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

      <div className="bodyContainerPdfs">
        <div className='TablePdfs'>
          <div className='Tabla'>
            <div className='theadTableArchivos'>
              <div className='containerID'>id</div>
              <div>Nombre de Archivo </div>
              <div>Fecha</div>
              <div>Descargar</div>             
            </div>
            <div className='bodyTableArchivos'>
              {
                data.length>0?
                  data.map((elemento)=>      
                    <div className='Fila' key={elemento.id_pdf}>
                      <div className='Columnaid'> <input type="checkbox" onClick={()=>agregarDatosSeleccionados(elemento)} ></input> </div>
                      <div>{elemento.pdf_name}</div>                    
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
              <div id='containerOptionPdfs'>
                {
                  vistaPopup == 'addPdf' ?
                  <div className="containerAddPdfOption">
                    <div className="sectionClose" > 
                      <button  onClick={()=>cerrarPopProyecto()}>
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregar PDF</h1>
                    <div className='TablaAddUser'>
                      <section className='labels'>
                      <div>Archivo PDF : </div>                     
                      </section>
                      <section>
                        <div><input type="file"  id='archivoPDF' onChange={(e) => subirArchivos(e.target.files) }></input></div>                      
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddPdf}
                    </div>
                    <div className="buttonAddUser">
                        <div onClick={()=>insertarArchivos('pdf')}>Subir PDF</div>
                    </div>
                  </div>
                  :""
                }


                {
                  vistaPopup == 'DeleteProjects' ?
                  <div className="containerDeletePdfsOption">
                    <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Eliminar PDF(s)</h1>
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
                            <div key={elemento.id_pdf}  className='Fila'>
                              <input type="text" className='id' value={elemento.id_pdf} disabled/>
                              <input type="text" placeholder={elemento.pdf_name} disabled />
                              <input type="text" placeholder={elemento.fechaIngreso} disabled />                             
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
                  vistaPopup == 'AddPermisos' ?
                  <div className="containerEditPermisos">
                    <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregar ó quitar permisos para ver los Pdfs</h1>
                    <label>
                      Se agregaran o quitaran los permisos seleccionados               
                    </label>
                    <div className='TablaEditPermisos'>                                                        
                           
                      <section className='Encabezado'>    
                      <div className="encabezadoArchivos">
                        <div>
                          Id de archivo : {edicionSeleccion[0].id_pdf}
                        </div>
                        <div>
                          Nombre de archivo : {edicionSeleccion[0].pdf_name}                   
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

export default Pdfs;



