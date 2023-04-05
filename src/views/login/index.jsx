import './index.scss'
import { useState } from 'react';
import axios from 'axios';


import Button from '@mui/material/Button';


const Login =() =>{
    const[mensaje,setMensaje] =useState('')
 
    function Login(datos){
        axios.post(`${process.env.REACT_APP_URL_API}/auth/validateUser`, datos)
        .then(res => {
            let Datos=res.data                
            if(Datos.valido==1){
                setMensaje(Datos.mensaje)
                let DatosRes = Datos.data
                localStorage.setItem("apiKeyAcceso", DatosRes[0].keyPass);
                localStorage.setItem("idUser", DatosRes[0].user_id);
                localStorage.setItem("empresa", DatosRes[0].empresa);
                localStorage.setItem("nameUser", (DatosRes[0].usr_name + " " + DatosRes[0].usr_lastname));
                setMensaje(Datos.mensaje)
                //let miNombre = localStorage.getItem("apiKeyAcceso");
                setTimeout(window.location.replace(`/dashboard`),3000)                
            }else{
                setMensaje("Usuario o Contraseña Incorrecta")
            }        
        })
    }
    function validarDatos(){
        let Correo = document.getElementById("valEmail").value
        let Contraseña = document.getElementById("valPass").value
        if(Correo ==null || Correo==''){
            setMensaje('Ingrese un correo por favor')
        }else if(Contraseña ==null || Contraseña==''){
            setMensaje('Ingrese una Contraseña por favor')
        }else{
            let Datos = {
                "correo":Correo,
                "contraseña":Contraseña
            }
            Login(Datos)
        }
    }
    return(
        <div className="containerLogin">
            <div className="login">
                <div className="avatar"></div>
                <div className="formulario">
                    <label>Email : </label>
                    <input type="text" id="valEmail"></input>
                    <label>Contraseña :</label>
                    <input type="text" id="valPass"></input>
                </div>       
                <div className="mensajes">
                    {mensaje}
                </div>         
               
                <Button variant="outlined" color="success" href="#outlined-buttons" onClick={()=>validarDatos()}>
                    INGRESAR
                </Button>
          
            </div>
            <div className="image"></div>
        </div>
    )
}
export default Login;