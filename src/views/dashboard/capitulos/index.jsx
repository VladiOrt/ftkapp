
import React, { useState, useLayoutEffect } from 'react';
import { useModal } from 'react-hooks-use-modal';

import { 
  Paragraph, 
  Document, 
  Packer , 
  Table,
  TableCell, 
  TableRow, 
  WidthType 
} from "docx";
import { saveAs } from "file-saver";


import * as XLSX from "xlsx";



import axios from "axios";
import './index.scss'
import 'reactjs-popup/dist/index.css';



function Capitulos() {
  const[messageScript, setMessageScript] = useState('')
  const[scriptProcesado, setScriptProcesado] = useState(null)
  const[versionesCapitulo, setVersoionesCapitulo] = useState(null)
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


 
  const fetchData = async () => {
    
    const datos = await axios.get('http://localhost:5000/capitulos/All', {
      headers: {       
      }
    })
    let Dat = (datos.data).data
    setData(Dat);
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);


  async function GuardarScript(){
      let Id = edicionSeleccion[0].id_cap
      const enviarProyecto = await axios.post('http://localhost:5000/Excel/id/'+Id, {
        scriptProcesado       
      })
      let dadtosProyecto = (enviarProyecto.data)
      let Valid = dadtosProyecto.valido

      if(Valid ===1){
        setScriptProcesado("Script guardado con Exito!")
        close()
      }else{
        setScriptProcesado("Ocurrio un error al guardar el Script")
      }       
  }

  async function AbrirPopup (dato){
    if(dato =='Add'){
      setVistaPopup('AddUser')
    }else if(dato =='Edit'){
      setVistaPopup('EditProjects')
    }else if(dato =='Delete'){


 
    
      let conseguirVersiones = await getVersions();

      setVistaPopup('DeleteProjects')
    }
    
    open()
  }

  function cerrarPopProyecto(){
    close();
    setMessageAddUser("");
  } 



async function getVersions(){
  let Id = edicionSeleccion[0].id_cap
  const enviarProyecto = await axios.get('http://localhost:5000/Excel/versiones/'+Id, {
  })
  let datosProyecto = (enviarProyecto.data)
  setVersoionesCapitulo(datosProyecto.data)
}



  function agregarDatosSeleccionados(elemento){
  
    let  strvaloresNuevos = ""+elemento.id_cap
    
    console.log(strvaloresNuevos)
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
      let IdDato = data[n].id_cap
      for(let l=0;  l<idSeleccion.length ; l++){
        if(IdDato == idSeleccion[l]) arrayNuevo.push(data[n])
      }      
    }
    setEdicionSeleccion(arrayNuevo)
   
  }















































  const onChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      let CeldasV = CeldasVacia(data);
      if(CeldasV.FilasVacias == ''|| CeldasV.FilasVacias==null){
        setMessageScript("Archivo cargado correctamente")
        setScriptProcesado(CeldasV.datos)
      }else{
        console.log("Filas con datos vacios",CeldasV.FilasVacias)
        setMessageScript('Celdas vacias encontradas en las Filas: ' + CeldasV.FilasVacias)
      }
    };
    reader.readAsBinaryString(file);
  };

  
//https://github.com/lasfito/tutoriales/tree/master/10-react-pdf

  function CeldasVacia(data){
    let script=[]
    let Filas =''
    for(let n=0 ; n<data.length; n++){   
      if(data[n][0]==undefined && data[n][1]==undefined && data[n][2]===undefined){
      //Filas Vacias
      }else{
        script.push(data[n])
        if(data[n][0]==undefined || data[n][1]==undefined || data[n][2]===undefined){
          if(Filas ==''){
            Filas = (n+1)
          }else{
            Filas = Filas+","+(n+1)
          }  
        }               
      }
    }
   
    let Respuesta ={datos:{script}, FilasVacias:Filas}
    console.log(Respuesta)
    return Respuesta
  }


  async function getScriptByCapt(version){
    let Id = edicionSeleccion[0].id_cap
    const getSCRIPT = await axios.post('http://localhost:5000/Excel/script/'+Id, {
      Capitulo:Id,
      Version:version
    })
    let datosScript = (getSCRIPT.data)
    return datosScript
  }
  async function getScriptMasterByCapt(version){
    let Id = edicionSeleccion[0].id_cap
    const getSCRIPT = await axios.post('http://localhost:5000/Excel/scriptMaster/'+Id, {
      Capitulo:Id,
      Version:version
    })
    let datosScript = (getSCRIPT.data)
    return datosScript
  }





  async function generateScript(version){
    let DataScript = await getScriptByCapt( version)     
    
    //Header Tabla Script
    const AdaptacionScript = [
      new TableRow({
          children: [
              new TableCell({
                  width: {
                      size: 3505,
                      type: WidthType.DXA,
                  },
                  children: [new Paragraph("TC")],
              }),
              new TableCell({
                  width: {
                      size: 5505,
                      type: WidthType.DXA,
                  },
                  children: [new Paragraph("Personaje")],
              }),
              new TableCell({
                width: {
                    size: 5505,
                    type: WidthType.DXA,
                },
                children: [new Paragraph("Dialogo")],
            }),
          ],
      }),
    ]
    //Adaptacion de Script en la Tabla    
    for(let n=0 ; n<(DataScript.data).length; n++){
      let Dato = DataScript.data
      const{tc,dialogo,personaje} = Dato[n]
      console.log("--->" , Dato[n])
     
      AdaptacionScript.push(
        new TableRow({
          children: [
            new TableCell({
                width: {
                    size: 3505,
                    type: WidthType.DXA,
                },
                children: [new Paragraph(tc)],
            }),
            new TableCell({
                width: {
                    size: 5505,
                    type: WidthType.DXA,
                },
                children: [new Paragraph(personaje)],
            }),
            new TableCell({
              width: {
                  size: 5505,
                  type: WidthType.DXA,
              },
              children: [new Paragraph(dialogo)],
          }),
        ], 
      })
      )      
    }  
    //Inserccion de datos para Tabla
    const TableScript = new Table({
      rows: AdaptacionScript,
    })
    //Inserccion de Tabla
    const doc = new Document({
      creator: "Vladimir Ortega Campos",
      description: "Script de doblaje",
      title: "Script",
      sections: [{
        children : [TableScript],
      }]
    });
    //Descargar Archivo
    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });

    
  };

  async function generateMaster(version){
    let DataScript = await getScriptMasterByCapt(version)     
    
    //Header Tabla Script
    const AdaptacionScript = [
      new TableRow({
          children: [
              new TableCell({
                  width: {
                      size: 3505,
                      type: WidthType.DXA,
                  },
                  children: [new Paragraph("TC")],
              }),
              new TableCell({
                  width: {
                      size: 5505,
                      type: WidthType.DXA,
                  },
                  children: [new Paragraph("Personaje")],
              }),
              new TableCell({
                width: {
                    size: 5505,
                    type: WidthType.DXA,
                },
                children: [new Paragraph("Dialogo")],
            }),
          ],
      }),
    ]
    //Adaptacion de Script en la Tabla    
    for(let n=0 ; n<(DataScript.data).length; n++){
      let Dato = DataScript.data
      const{tc,dialogo,personaje} = Dato[n]
      console.log("--->" , Dato[n])
     
      AdaptacionScript.push(
        new TableRow({
          children: [
            new TableCell({
                width: {
                    size: 3505,
                    type: WidthType.DXA,
                },
                children: [new Paragraph(tc)],
            }),
            new TableCell({
                width: {
                    size: 5505,
                    type: WidthType.DXA,
                },
                children: [new Paragraph(personaje)],
            }),
            new TableCell({
              width: {
                  size: 5505,
                  type: WidthType.DXA,
              },
              children: [new Paragraph(dialogo)],
          }),
        ], 
      })
      )      
    }  
    //Inserccion de datos para Tabla
    const TableScript = new Table({
      rows: AdaptacionScript,
    })
    //Inserccion de Tabla
    const doc = new Document({
      creator: "Vladimir Ortega Campos",
      description: "Script de doblaje",
      title: "Script",
      sections: [{
        children : [TableScript],
      }]
    });
    //Descargar Archivo
    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });

    
  };




















  return (
    <div className="containerProjects">
      <div className="titleContainerProjects">
        <div className="title">Catalogo de Proyectos</div>            
      </div>
      <div className="headerConatainerProjects">
        <div className="button" onClick={()=>AbrirPopup('Add')}>
          <div className='containerPopProjects'>
            <button>
              LOAD SCRIPT
            </button>             
          </div>                  
        </div>
        <div className="button" onClick={()=>AbrirPopup('Edit')}>
            OPEN SCRIPT
        </div>        
        <div className="button" onClick={()=>AbrirPopup('Delete')}>
            FILES
        </div>        
      </div>

      <div className="bodyContainerUser">
        <div className='TableProyectos'>
          <div className='Tabla'>
            <div className='theadTable'>
              <div className='containerID'>id</div>
              <div>Nombre</div>
              <div>Duracion</div>
              <div>Director</div>
              <div>Traductor</div>
              <div>Fecha Creacion</div>
              <div>Proyecto</div>
            </div>
            <div className='bodyTable'>
              {
                data.length>0?
                  data.map((elemento)=>      
                    <div className='Fila' key={elemento.id_cap}>
                      <div className='Columnaid'> <input type="radio" name="capitulo" onClick={()=>agregarDatosSeleccionados(elemento)} ></input> </div>
                      <div>{elemento.cap_Nombre}</div>                    
                      <div>{elemento.cap_duracion}</div>    
                      <div>{elemento.cap_director}</div>    
                      <div>{elemento.cap_traductor}</div>    
                      <div>{elemento.cap_fechaCreacion}</div>    
                      <div>{elemento.pjct_TituloOriginal}</div>    
                     
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

                    <h1>Agregar script al proyecto</h1>
                    <div className='TablaAddUser'>
                      {
                        edicionSeleccion.length>0?
                        <section className='labels'>
                          <input type="file" onChange={onChange} />
                        </section> 
                        :
                        <section className='labels'>
                          Seleccione un capitulo
                        </section> 
                      }
                     
                      <section>
                          {messageScript}
                      </section>
                      <section>                       
                      {
                        scriptProcesado != null?
                        <button onClick={()=>GuardarScript()}>Guardar Scrript</button>:""
                      }
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
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
                                        
                    <h1>Edicion de Script</h1>
                    <div className='TablaEditProjects'>
                        {
                          edicionSeleccion.length>0?
                          <section className='Titulos'>                        
                            <div className='id'>FILA</div>
                            <div>TC</div>
                            <div>PERSONAJE</div>
                            <div>DIALOGO</div>                        
                          </section>
                          :
                          "No ha seleccionado elementos para editar"
                        }
                     
                      <section className='TableScript'>    
                        { 
                          edicionSeleccion.length>0?
                            edicionSeleccion.map((elemento)=>
                            <div key={elemento.Fila}  className='Fila'>
                              <input type="text" className='id' id={elemento.id_project+"-id_project"} />
                              <input type="text" placeholder={elemento.pjct_TituloOriginal}  id={elemento.id_project+"-pjct_TituloOriginal"} />
                              <input type="text" placeholder={elemento.pjct_TituloAutorizado} id={elemento.id_project+"-pjct_TituloAutorizado"} />                              
                              <input type="text"  className='Dialogo' placeholder={elemento.pjct_TituloAutorizado} id={elemento.id_project+"-pjct_TituloAutorizado"} />                              
                            </div>
                            )
                          :""
                        }
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonAddProject">
                        <div >Actualizar</div>
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
                    
                    <h1>Archivos</h1>

                    <label>
                      Seleccione el archivo que desea descargar
                    </label>
                    <div className='opcionesFiles'>

                        <div className='OpcionesVersiones'>
                          <div>Version</div>
                          <div>Archivos</div>
                        </div>
                        {                         
                          versionesCapitulo.length>0?
                          versionesCapitulo.map((elemento)=>
                            <div key={elemento.Version} className='Fila'>
                                <div> {elemento.Version}</div>
                                <div className='Opciones'>
                                  <div className='ButtonMaster' onClick={()=>generateMaster(elemento.Version)}>Master</div>
                                  <div className='ButtonScript' onClick={()=>generateScript(elemento.Version)}>Script</div>
                                </div>
                            </div>
                            )
                          :""
                        }
                     
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>                  
                  </div>
                  :""
                }

              </div>
          
          </Modal>                  
    </div>
  );
}

export default Capitulos;



