import React, { useState , useLayoutEffect} from 'react';
import './index.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom';




const Formulario = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [sexo, setSexo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [lugarNacimiento, setLugarNacimiento] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [religion, setReligion] = useState('');
  const [procesoQuirurgico, setProcesoQuirurgico] = useState('');
  const [actividadFisica, setActividadFisica] = useState('');
  const [objetivoFisioterapia, setObjetivoFisioterapia] = useState('');
  const [estudiosLaboratorio, setEstudiosLaboratorio] = useState('');

  const [leadCompleto, setLeadCompleto] = useState('0')


  const { email } = useParams();

  async function handleSubmit(e){
    e.preventDefault();



    
    let Datos = {
      sexo:sexo,
      fechaNacimiento:fechaNacimiento,
      nacionalidad:nacionalidad,
      direccion:direccion,
      ciudad:ciudad,
      lugarNacimiento:lugarNacimiento,
      estadoCivil:estadoCivil,
      tipoSangre:tipoSangre,
      religion:religion,
      procesoQuirurgico:procesoQuirurgico,
      actividadFisica:actividadFisica,
      objetivoFisioterapia:objetivoFisioterapia,
      estudiosLaboratorio:estudiosLaboratorio    
    }
    console.log("--- Datoos ----> " , Datos)
    const response = await axios.post('http://localhost:5000/Pacientes/updatePacient/'+correo,Datos)
    const respuesta = response.data


    let Result = respuesta.data

    if(Result.affectedRows==1){
      setLeadCompleto('1')
    }
  };






async function fetchData(correo){
    try{
        
        let Correo = correo 
        console.log(Correo)
        
        const response = await axios.get('http://localhost:5000/Pacientes/pacients/'+correo)
        const DatosContacto = response.data
        let Result = DatosContacto.data
        setNombre((Result[0].pac_nombre +" "+Result[0].pac_apellidoP+" "+Result[0].pac_apellidoM))
        setCorreo(Result[0].email)

        if(Result[0].leadCompleto==1)setLeadCompleto('1')
        console.log(Result)
    }catch(error){
        console.error(error)
    }
}


    useLayoutEffect(() => {
        fetchData(email)
    }, [email])


  return (
    <form  className="formulario" onSubmit={handleSubmit}>

      {
        leadCompleto =='1'?
        <>
         Formulario Contestado
        </>
        :
        <>
  <label>
        Nombre: {nombre}       
      </label>
      <label>
        Email: {correo}
      </label>
      <label>
        Sexo:
        <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
          <option value="">Selecciona</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </label>
      <label>
        Fecha de Nacimiento:
        <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
      </label>
      <label>
        Nacionalidad:
        <input type="text" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} />
      </label>
      <label>
        Dirección:
        <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
      </label>
      <label>
        Ciudad:
        <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
      </label>
      <label>
        Lugar de Nacimiento:
        <input type="text" value={lugarNacimiento} onChange={(e) => setLugarNacimiento(e.target.value)} />
      </label>
      <label>
       Estado Civil:        
       <select value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)}>
          <option value="">Selecciona</option>
          <option value="Soltero">Soltero</option>
          <option value="Casado">Casado</option>
          <option value="Divorciado">Divorciado</option>
          <option value="otro">Otro</option>
        </select>
      </label>
      <label>
        Tipo de Sangre:
        <input type="text" value={tipoSangre} onChange={(e) => setTipoSangre(e.target.value)} />
      </label>

      <label>
        Religion:
        <input type="text" value={religion} onChange={(e) => setReligion(e.target.value)} />
      </label>
      <label>
        Haz realizado algun proceso quirurgico? :        
        <select value={procesoQuirurgico} onChange={(e) => setProcesoQuirurgico(e.target.value)}>
          <option value="">Selecciona</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
      </label>
      <label>
        Con que frecuencia realizas actividad fisica?        
        <select value={actividadFisica} onChange={(e) => setActividadFisica(e.target.value)}>
          <option value="">Selecciona</option>
          <option value="Nunca">Nunca</option>
          <option value="raro">Muy raro</option>
          <option value="frecuente">Frecuentemente</option>
          <option value="diario">Diario</option>
        </select>
      </label>
      <label>
        Cual es tu objetivo con la Fisioterapia:
        <input type="text" value={objetivoFisioterapia} onChange={(e) => setObjetivoFisioterapia(e.target.value)} />
      </label>
      <label>
        Te haz realizado estudios en un Laboratorio?
        <select value={estudiosLaboratorio} onChange={(e) => setEstudiosLaboratorio(e.target.value)}>
          <option value="">Selecciona</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
      </label>


      {/* Aquí puedes agregar los demás campos del formulario de manera similar */}
      <button type="submit">Enviar</button>

        </>
      }
    
    </form>
  );
}

export default Formulario;
