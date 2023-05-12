
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useModal } from 'react-hooks-use-modal';
import axios from "axios";
import './index.scss'
import 'reactjs-popup/dist/index.css';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Moment from 'react-moment';
import 'moment-timezone';


import VisibilityIcon from '@mui/icons-material/Visibility';



import { PDFReader } from 'react-read-pdf';



const  idUser = localStorage.getItem("idUser");
function PdfsUsers() {


  const[otherUserData,setOtherUsersData] = useState([])
  const[permisosData,setPermisosData] = useState([])
  const[datosSeleccionados, setDatosSeleccionados] = useState('')
  const[edicionSeleccion, setEdicionSeleccion] = useState([])
  const[vistaPopup, setVistaPopup] = useState([])
  const[archivos, setArchivos] =  useState(null)
  
  const subirArchivos = e =>{
    setArchivos(e)
  }


  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: false
  });

  const [data, setData] = useState([]);
  const [messageAddPdf, setMessageAddPdf] = useState("");
  
 
  const fetchData = async () => {
    const datos = await axios.get('http://localhost:5000/Permisos/pdf/user/'+idUser, {
      headers: {       
      }
    })
    let Dat = (datos.data).data
    setData(Dat);
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);


  async function AbrirPopup (dato,name){
    if(dato =='Pdf'){
      setVistaPopup('addPdf')
    }else if(dato =='Video'){
      setVistaPopup('addVideo')
    }else if(dato =='Permisos'){
      setVistaPopup('DeleteProjects')
    }else if(dato =='Eliminar'){            
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
    }else if(dato =='verPDF'){
      console.log("Entro")
      console.log("entro ----> " , name)
      setVistaPopup('visualizarPDF')
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
    let valorNuevo = elemento.idPermiso
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
        strvaloresNuevos = elemento.idPermiso
      }else{
        strvaloresNuevos = datosSeleccionados+","+elemento.idPermiso
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
      let IdDato = data[n].idPermiso
      for(let l=0;  l<idSeleccion.length ; l++){
        if(IdDato == idSeleccion[l]) arrayNuevo.push(data[n])
      }      
    }
    setEdicionSeleccion(arrayNuevo)
  }

  return (
    <div className="containerPdfs">
  
      <div className="headerConatainerPdfs">
        <div className="botones">
          <Button variant="outlined"  color='info' onClick={()=>AbrirPopup('Pdf')}>
            Ver PDF
            <VisibilityIcon />
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
              <div>Ver</div>             
            </div>
            <div className='bodyTableArchivos'>
              {
                data.length>0?
                  data.map((elemento)=>      
                    <div className='Fila' key={elemento.id_pdf}>
                      <div className='Columnaid'> <input type="checkbox" onClick={()=>agregarDatosSeleccionados(elemento)} ></input> </div>
                      <div>{elemento.nombreArchivo}</div>                    
                      <div><Moment format="YYYY/MM/DD">{elemento.fechaIngreso}</Moment></div>    
                      <div > 
                      </div>                                               
                    </div>
                  )
                  :"No se encontraron datos para mostrar"
              }        
            </div>           
          </div>
        </div>  
      </div>
         <Modal>
              <div id='containerPDFViewer'>
                {
                  vistaPopup == 'addPdf' ?
                  <div className="containerPDFOption">
                    <div className="sectionClose" > 
                      <button  onClick={()=>cerrarPopProyecto()}>
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>

                    <div className='Visualizador'>

                      { 
                        edicionSeleccion.length>0?
                          edicionSeleccion.map((elemento)=>                         

                          <div key={elemento.idPermiso}  >                                                
                            <label>Nombre del Documento : {elemento.nombreArchivo}</label>
                            <PDFReader url={"http://localhost:5000/Permisos/pdf/file/"+elemento.nombreArchivo}  />                
                          </div>
                          )
                          :""
                      }
                    </div>
                  </div>
                  :""
                }
              </div>
         </Modal>                  
    </div>
  );
}

export default PdfsUsers;


