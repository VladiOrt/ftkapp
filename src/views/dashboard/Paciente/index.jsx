
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useModal } from 'react-hooks-use-modal';
import axios from "axios";
import './index.scss'
import 'reactjs-popup/dist/index.css';
import moment from 'moment'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import AddCardIcon from '@mui/icons-material/AddCard';

function Paciente() {
  const[datosSeleccionados, setDatosSeleccionados] = useState('')
  const[edicionSeleccion, setEdicionSeleccion] = useState([])
  const[vistaPopup, setVistaPopup] = useState([])
  const[dataPacient, setDataPacient] = useState([])
  const[validaPaciente, setValidaPaciete]= useState('0')
  const[medicalHistory, setMedicalHistory] = useState([])
  const[messageCita, setMessageCita] = useState('')
  const [data, setData] = useState([]);
  const [messageAddUser, setMessageAddUser] = useState("");
  const [messageDeleteUser, setMessageDeleteUser] = useState("");
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: false
  });

  let MyDocumentPDF = (data) => (
    <Document>
      <Page>
        {console.log("datos --->" ,data.data)}
        <Text>Probando PDF</Text>
        <Text>{data.data.cit_diagnostico}</Text>
      </Page>
    </Document>
  );

  const fetchData = async () => {    
    const datos = await axios.get('http://localhost:5000/Pacientes/pacients', {
      headers: {       
      }
    })
    let Dat = (datos.data).data
    setData(Dat);
  };

  async function AgregarUsuario(){
    setMessageAddUser("Procesando ...") 
    let Nombre = document.getElementById("addPacientNombre").value
    let ApellidoP = document.getElementById("addPacientApellidoP").value
    let ApellidoM = document.getElementById("addPacientApellidoM").value
    let Email = document.getElementById("addPacientEmail").value
    let Celular = document.getElementById("addPacientPhone").value
    if(Nombre==''||  Nombre== null){
      setMessageAddUser("Ingrese un nombre")
    }else if(ApellidoP==''||  ApellidoP== null){
      setMessageAddUser("Ingrese un Apellido Paterno")
    }else if(Email==''||  Email== null){
      setMessageAddUser("Ingrese un Correo")
    }else if(Celular==''||  Celular== null){
        setMessageAddUser("Ingrese un Numero Celular")
    }else{
      const enviarUsuario = await axios.post('http://localhost:5000/Pacientes/createPacient', {
        nombre: Nombre,
        apellidoP: ApellidoP,
        apellidoM: ApellidoM,
        telefono: Celular,
        email: Email
      })
      let dadtosUsuario = (enviarUsuario.data)
      let Valid = dadtosUsuario.valido
      if(Valid == 1){
        const datos = await axios.get('http://localhost:5000/Pacientes/pacients', {
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

  async function getDataHistory(id){
    const response = await axios.get('http://localhost:5000/Cita/citas/'+id)
    const DatosContacto = response.data
    let Result = DatosContacto.data
    setMedicalHistory(Result)
  }

  async function AbrirPopup (dato){
    if(dato =='Add'){
      setVistaPopup('AddPaciente')
    }else if(dato =='Edit'){
      setVistaPopup('EditPaciente')
    }else if(dato =='DatosPaciente'){
      if(datosSeleccionados.length>1){
        setValidaPaciete('0')
        setVistaPopup('DatosPaciente')
      }else{
        let Data = edicionSeleccion
        setDataPacient(Data[0])
        setValidaPaciete('1')
        setVistaPopup('DatosPaciente')
      }      
    }else if(dato =='Cita'){      
      setVistaPopup('Cita')
    }else if(dato =='Historial'){
      let datosHistorial = await getDataHistory(datosSeleccionados)
      setVistaPopup('HistorialMedico')
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
    
    let valorNuevo = elemento.id_Paciente
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
        strvaloresNuevos = elemento.id_Paciente
      }else{
        strvaloresNuevos = datosSeleccionados+","+elemento.id_Paciente
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
      let IdDato = data[n].id_Paciente
      for(let l=0;  l<idSeleccion.length ; l++){
        if(IdDato == idSeleccion[l]) arrayNuevo.push(data[n])
      }      
    }
    setEdicionSeleccion(arrayNuevo)
    console.log(arrayNuevo)
  }

  async function EditarPaciente(){
    let  datosProcesar = (datosSeleccionados.toString()).split(',')
    console.log(datosProcesar)
    for(let n=0;n<datosProcesar.length; n++){
      let nombre = document.getElementById(datosProcesar[n]+"-pac_name").value
      let apellidoP= document.getElementById(datosProcesar[n]+"-pac_lastnameP").value
      let apellidoM= document.getElementById(datosProcesar[n]+"-pac_lastnameM").value
      let celular= document.getElementById(datosProcesar[n]+"-pac_telefono").value
      if(nombre =='' || nombre==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            nombre = edicionSeleccion[f].usr_name
          }
        }
      }
      if(apellidoP =='' || apellidoP==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            apellidoP = edicionSeleccion[f].usr_lastname
          }
        }
      }
      if(apellidoM =='' || apellidoM==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            apellidoM = edicionSeleccion[f].usr_email
          }
        }
      }
      if(celular =='' || celular==null){
        for(let f=0; f<edicionSeleccion.length; f++){
          if(edicionSeleccion[f].user_id == datosProcesar[n]){
            celular = edicionSeleccion[f].usr_pass
          }
        }
      }
      const datos = await axios.post('http://localhost:5000/Pacientes/updatePacient/', {
        nombre,
        apellidoP,
        apellidoM,
        celular,
        id: parseInt(datosProcesar[n])
      })
      let Dat = (datos.data).data
    }
    const datos = await axios.get('http://localhost:5000/Pacientes/pacients', {
      headers: {       
      }
    })
    let Dat = (datos.data).data
    setData(Dat);
    let arrayNuevoActualizado = []
    let DatosSeleccionadosNow = (datosSeleccionados.toString()).split(',')
    for(let ns = 0 ; ns <DatosSeleccionadosNow.length; ns++ ){
        for(let n=0; n<Dat.length; n++ ){
          if(parseInt(DatosSeleccionadosNow[ns]) == Dat[n].id_Paciente){
            arrayNuevoActualizado.push(Dat[n])
          }
        }
    }
    setEdicionSeleccion(arrayNuevoActualizado)
    setData(Dat);
    setMessageDeleteUser("")
    close()
   
  }

  async function ActualizarDatos(){
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
  
  async function GenerarNuevaCita(){
    let MedTratante = document.getElementById('medicoTratante').value
    let diag = document.getElementById('diagnostico').value
    let nota = document.getElementById('notaEvaluacion').value
    const datos = await axios.post('http://localhost:5000/Cita/createCita', {
      medicoTratante:MedTratante,
      diagnostico:diag,
      notaEvolucion:nota,
      pac_id: datosSeleccionados
    })
    let Dat = (datos.data).data
    if(Dat.affectedRows == 1){
      document.getElementById('medicoTratante').value=''
      document.getElementById('diagnostico').value=''
      document.getElementById('notaEvaluacion').value=''
      setMessageCita('Se genero la cita exitosamente !')
    }else{
      setMessageCita('Ocurrio un error al generar la cita')
    }     
  }
  
  useLayoutEffect(() => {
    fetchData();
  }, []);











  //Variables de tabla



  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  //Buscador Tabla
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  const filteredData = data.filter((item) =>
    item.pac_nombre.toLowerCase().includes(searchTerm.toLowerCase()) || item.telefono.toLowerCase().includes(searchTerm.toLowerCase())
  );

const lastIndex = currentPage * itemsPerPage;
const firstIndex = lastIndex - itemsPerPage;
const currentItems = filteredData.slice(firstIndex, lastIndex);
const totalPages = Math.ceil(filteredData.length / itemsPerPage);

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};
















  return (
    <div className="containerPacientes">
      <div className="titleContainerPacientes">
        <div className="title">Pacientes</div>            
      </div>
      <div className="headerConatainerPacientes">
        <div className='BotonesOpciones'>
          <Button variant="outlined" color='success'  onClick={()=>AbrirPopup('Add')}>
            PACIENTE
            <PersonAddIcon />
          </Button>
          <Button variant="outlined"  onClick={()=>AbrirPopup('Edit')}>
            Editar
            <SettingsAccessibilityIcon />
          </Button>
          <Button variant="outlined" onClick={()=>AbrirPopup('DatosPaciente')}>
            DATOS PACIENTE
            <EventNoteIcon />
          </Button>      
          <Button variant="outlined" onClick={()=>AbrirPopup('Cita')}>
            CITA
            <AddCardIcon />
          </Button>      
          <Button variant="outlined"  onClick={()=>AbrirPopup('Historial')}>
            Historial Medico
            <DateRangeIcon />
          </Button>   
                
        </div>
      </div>


      <div className="bodyContainerPacientes">
        <div className='TablePacientes'>












        <div>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            className='search-bar'
            onChange={handleSearch}
          />
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td> 
                    <input type="checkbox" onClick={()=>agregarDatosSeleccionados(item)} />
                  </td>
                  <td>{item.pac_nombre}</td>
                  <td>{item.pac_nombre}</td>
                  <td>{item.pac_apellidoP +" "+ item.pac_apellidoM}</td>
                  <td>{item.telefono}</td>
                  <td>
                    <a href={"https://api.whatsapp.com/send?phone="+item.telefono+"&text=Hola%20buenas%20tardes,%20nos%20puedes%20apoyar%20contestanto%20el%20siguiente%20formulario%20http://localhost:3000/Lead/"+item.email} target="_blank">
                      <LinkIcon />
                    </a>    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
    



          
        </div>  
      </div>
      















        <Modal>
              <div id='containerOptionPaciente'>
                {
                  vistaPopup == 'AddPaciente' ?
                  <div className="containerAddUserOption">
                    <div className="sectionClose" > 
                      <button  onClick={()=>cerrarPopUsuario()}>
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Agregar un nuevo Usuario</h1>
                    <div className='TablaAddPaciente'>
                      <section className='labels'>
                        <div>Nombre : </div>
                        <div>Apellido P: </div>
                        <div>Appellido M : </div>
                        <div>Email : </div>
                        <div>No Celular : </div>
                      </section>
                      <section>
                        <div><input type="text" id='addPacientNombre'></input></div>
                        <div><input type="text" id='addPacientApellidoP'></input></div>
                        <div><input type="text" id='addPacientApellidoM'></input></div>
                        <div><input type="email" id='addPacientEmail'></input></div>                      
                        <div><input type="phone" id='addPacientPhone'></input></div>                      
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
                  vistaPopup == 'EditPaciente' ?
                  <div className="containerEditPacientOption">
                    <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>Edicion de paciente</h1>
                    <div className='TablaEditPacient'>
                        {
                          edicionSeleccion.length>0?
                          <section className='Titulos'>                        
                            <div className='containerId'>Id</div>
                            <div>Nombre</div>
                            <div>Apellido P</div>
                            <div>Apellido M</div>
                            <div>Celular</div>
                          </section>
                          :
                          "No ha seleccionado elementos para editar"
                        }
                     
                      <section className=''>    
                        { 
                          edicionSeleccion.length>0?
                            edicionSeleccion.map((elemento)=>
                            <div key={elemento.id_Paciente}  className='Fila'>
                              <input type="text" className='id' value={elemento.id_Paciente} id={elemento.id_Paciente+"-pac_id"} readOnly />
                              <input type="text" defaultValue={elemento.pac_nombre}  id={elemento.id_Paciente+"-pac_name"} />
                              <input type="text" defaultValue={elemento.pac_apellidoP} id={elemento.id_Paciente+"-pac_lastnameP"} />
                              <input type="text" defaultValue={elemento.pac_apellidoM} id={elemento.id_Paciente+"-pac_lastnameM"}  />
                              <input type="text" defaultValue={elemento.telefono} id={elemento.id_Paciente+"-pac_telefono"}  />
                            </div>
                            )
                          :""
                        }
                      </section>
                    </div>
                    <div className="conatinerMessage">
                      {messageAddUser}
                    </div>
                    <div className="buttonEditPacient">
                        <div onClick={()=>EditarPaciente()}>Actualizar</div>
                    </div>
                  </div>
                  :""
                }









                {
                  vistaPopup == 'DatosPaciente' ?
                  <div className="containerPacient">
                    
                    {
                      validaPaciente=='0'?
                      <>
                        <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                          <button >
                            <div className='lineaUno' />
                            <div className='lineaDos' />
                          </button>
                        </div>
                        
                        <h1>DATOS DEL PACIENTE</h1>
                        <label>
                          Debe seleccionar solo un paciente para continuar
                        </label>
                      </>
                      :
                      <>                    
                        <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                          <button >
                            <div className='lineaUno' />
                            <div className='lineaDos' />
                          </button>
                        </div>                      
                        <h1>DATOS DEL PACIENTE</h1>
                        <label>
                          Datos del paciente:
                        </label>
                        <div className='TablaEditPacients'>
                          {
                            edicionSeleccion.length>0?
                            <section className='Titulos'>                        
                              <div>Sexo </div>
                              <div>Edad </div>
                              <div>Nacionalidad </div>
                              <div>Dirección </div>
                              <div>Ciudad </div>
                              <div>Lugar de Nacimiento </div>
                              <div>Teléfono </div>
                              <div>Estado civil </div>
                              <div>Grupo y Rh ( Tipo de sangre) </div>
                              <div>Religión </div>
                              <div>Has pasado por algún proceso quirúrgico </div>
                              <div>Realizas actividad fisica </div>
                              <div>Cual es tu objetivo al acudir a fisioterapia </div>
                              <div>Cuentas con estudios previos de laboratorio </div>
                              <div>Has acudido anteriormente a valoracion o consulta con otro especialista? </div>
                            </section>
                            :
                            "No ha seleccionado elementos para editar"
                          }                   
                          <section className=''>    
                            { 
                              edicionSeleccion.length>0?
                                edicionSeleccion.map((elemento)=>
                                <div key={elemento.user_id}  className='Fila'>                              
                                  <input type="text" placeholder={elemento.pac_sexo}  disabled />
                                  <input type="text" placeholder={elemento.pac_fechaNacimiento} disabled />
                                  <input type="text" placeholder={elemento.pac_nacionalidad} disabled />
                                  <input type="text" placeholder={elemento.pac_direccion} disabled />
                                  <input type="text" placeholder={elemento.pac_ciudad} disabled />
                                  <input type="text" placeholder={elemento.pac_lugarNacimiento} disabled />
                                  <input type="text" placeholder={elemento.telefono  } disabled />
                                  <input type="text" placeholder={elemento.pac_estadoCivil} disabled />
                                  <input type="text" placeholder={elemento.pac_tipoSangre} disabled />
                                  <input type="text" placeholder={elemento.pac_religion} disabled />
                                  <input type="text" placeholder={elemento.pac_procesoQuirurgico} disabled />
                                  <input type="text" placeholder={elemento.pac_estudiosLaboratorios } disabled />
                                  <input type="text" placeholder={elemento.pac_actividadFisica} disabled />
                                  <input type="text" placeholder={elemento.pac_objetivoFisioterapia} disabled />
                                  <input type="text" placeholder={elemento.pac_estudiosLaboratorios} disabled />
                                </div>
                                )
                              :""
                            }
                          </section>
                        </div>
                        <div className="conatinerMessage">
                          {messageAddUser}                          
                        </div>
                        <div className="buttonUpdatePaciente">
                            <div onClick={()=>ActualizarDatos()}>Actualizar Paciente</div>
                        </div>
                      </>

                    }



                  </div>
                  :""
                }










{
                  vistaPopup == 'Cita' ?
                  <div className="containerCitaOption">
                    
                    {
                      validaPaciente=='0'?
                      <>
                        <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                          <button >
                            <div className='lineaUno' />
                            <div className='lineaDos' />
                          </button>
                        </div>
                        
                        <h1>CITA</h1>
                        <label>
                          Debe seleccionar solo un paciente para continuar
                        </label>
                      </>
                      :
                      <>                    
                        <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                          <button >
                            <div className='lineaUno' />
                            <div className='lineaDos' />
                          </button>
                        </div>                      
                        <h1>CITA</h1>
                        <label>
                          Datos Cita:
                        </label>
                        <div className='TablaCita'>
                          {
                            edicionSeleccion.length>0?
                            <section className='TitulosCita'>                        
                              <div>Medico Tratante </div>
                              <div>Diagnostico </div>
                              <div>Nota de evolucion </div>                             
                            </section>
                            :
                            "No ha seleccionado elementos para editar"
                          }                   
                          <section className=''>    
                            { 
                              edicionSeleccion.length>0?
                                edicionSeleccion.map((elemento)=>
                                <div className='FilaCita'>                              
                                  <input type="text"  id="medicoTratante"  />
                                  <input type="text" id="diagnostico"  />
                                  <input type="text" id="notaEvaluacion" />                                 
                                </div>
                                )
                              :""
                            }
                          </section>
                        </div>
                        <div className="conatinerMessage">
                          {messageCita}                          
                        </div>
                        <div className="buttonUpdatePaciente">
                            <div onClick={()=>GenerarNuevaCita()}>Guardar nueva Cita Medica</div>
                        </div>
                      </>

                    }



                  </div>
                  :""
                }







{
                  vistaPopup == 'HistorialMedico' ?
                  <div className="containerMedicalHistory">
                    <div className="sectionClose" onClick={()=>cerrarPopUsuario()}> 
                      <button >
                        <div className='lineaUno' />
                        <div className='lineaDos' />
                      </button>
                    </div>
                    
                    <h1>HISTORIAL MEDICO</h1>
                    <label>
                      Historial de Citas Medicas
                    </label>
                    <div className='TablaHistorialMedico'>
                        {
                          edicionSeleccion.length>0?
                          <section className='TitulosHistorialMedico'>                        
                            <div>Id</div>
                            <div>Medica Tratante</div>
                            <div>Diagnostico</div>
                            <div>Evolucion</div>
                            <div>Fecha</div>
                          </section>
                          :
                          "No ha seleccionado elementos para editar"
                        }
                     
                      <section className=''>    
                        { 
                          medicalHistory.length>0?
                            medicalHistory.map((elemento)=>
                            <div key={elemento.user_id}  className='Fila'>
                              <div className='id' value={elemento.cita_id} >
                               
                                  <PDFDownloadLink document={<MyDocumentPDF data={elemento} />} fileName={"HistoriaMedica-"+elemento.cita_id+".pdf"}>                                                              
                                    <PictureAsPdfIcon  />
                                  </PDFDownloadLink>  
                                  
                                                  
                              </div>
                              <div value={elemento.cit_medicoTratante}  >{elemento.cit_medicoTratante}</div>
                              <div value={elemento.cit_diagnostico}   >{elemento.cit_diagnostico}</div>
                              <div value={elemento.cit_notaEvolucion}  >{elemento.cit_notaEvolucion}</div>
                              <div value={elemento.fechaInsert}  >{ moment(elemento.fechaInsert).format('MM/DD/YY, h:mm a')}</div>
                            </div>
                            )
                          :""
                        }
                        {console.log("--->" ,medicalHistory ) }
                      </section>
                    </div>
                  </div>
                  :""
                }
              </div>
        </Modal>                  
    </div>
  );
}

export default Paciente;


