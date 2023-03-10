
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




function Capitulos() {
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
    console.log("--->" , Datos)
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
    console.log("<-->", arrayNuevo)
    setEdicionSeleccion(arrayNuevo)
   
  }









  async function EditarProyecto(){
   
    let datosProcesar = (datosSeleccionados.toString()).split(',')
    console.log("Datos a procesar --->",datosProcesar)
   
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
            console.log("Datos a procesar --->",edicionSeleccion[f])
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
    console.log("Dat--- 1 >", datosSeleccionados)
    let DatosSeleccionadosNow = (datosSeleccionados.toString()).split(',')
    console.log("Dat--- 2 >", DatosSeleccionadosNow)
    for(let ns = 0 ; ns <DatosSeleccionadosNow.length; ns++ ){
        for(let n=0; n<Dat.length; n++ ){
          console.log("****" ,DatosSeleccionadosNow[ns] , "****",Dat[n].id_project )
          if(parseInt(DatosSeleccionadosNow[ns]) == Dat[n].id_project){
            arrayNuevoActualizado.push(Dat[n])
          }
        }
    }
    setEdicionSeleccion(arrayNuevoActualizado)

    console.log("----<" , datosSeleccionados,"<<<-")
    console.log("----<" , edicionSeleccion,"<<<-")

    
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
                  <div className="containerEditProjectsOption">
                    <div className="sectionClose" onClick={()=>cerrarPopProyecto()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                                        
                    <h1>Edicion de Proyectos</h1>
                    <div className='TablaEditProjects'>
                        {
                          edicionSeleccion.length>0?
                          <section className='Titulos'>                        
                            <div className='id'>Id: </div>
                            <div>Titulo Original : </div>
                            <div>Titulo Autorizado :  </div>
                            <div>Cliente : </div>
                            <div>Genero : </div>
                            <div>Duracion : </div>
                            <div>Capitulos :</div>
                          </section>
                          :
                          "No ha seleccionado elementos para editar"
                        }
                     
                      <section className=''>    
                        { 
                          edicionSeleccion.length>0?
                            edicionSeleccion.map((elemento)=>
                            <div key={elemento.id_project}  className='Fila'>
                              <input type="text" className='id' id={elemento.id_project+"-id_project"} />
                              <input type="text" placeholder={elemento.pjct_TituloOriginal}  id={elemento.id_project+"-pjct_TituloOriginal"} />
                              <input type="text" placeholder={elemento.pjct_TituloAutorizado} id={elemento.id_project+"-pjct_TituloAutorizado"} />
                              <input type="text" placeholder={elemento.pjct_Cliente} id={elemento.id_project+"-pjct_Cliente"}  />
                              <input type="text" placeholder={elemento.pjct_Genero} id={elemento.id_project+"-pjct_Genero"}  />
                              <input type="text" placeholder={elemento.pjct_Duracion} id={elemento.id_project+"-pjct_Duracion"}  />
                              <input type="text" placeholder={elemento.pjct_Capitulos} id={elemento.id_project+"-pjct_Capitulos"}  />
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
                        <div onClick={()=>EditarProyecto()}>Actualizar</div>
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
                          "No ha seleccionado elementos para afectar"
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

              </div>
            </Modal>                  
    </div>
  );
}

export default Capitulos;



