import react, {useState} from 'react'


import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import './index.scss'


import Catalogos from './catalogos'
import Usuarios from './usuarios'
import Ventas from './ventas'
import Proyectos from './archivos'
import Paciente from './Paciente';
import ArchivosUsers from './archivosusers'



const Dashboard = () =>{

    const[vista,setVista] = useState(0)


    let keyAcceso = localStorage.getItem("apiKeyAcceso");
    let Nombre = localStorage.getItem("nameUser");
    let idUser = localStorage.getItem("idUser");
    let Empresa = localStorage.getItem("empresa");

    const changeVista = (id) =>{
        setVista(id)
    }

    return(
        <div className='containerDashBoard'>
            <div className="containerMenu">
                <div className="containerAvatar">
                <AccountCircleIcon sx={{color:"#FFF", fontSize:"120px"}}></AccountCircleIcon>
                <div>
                    <label>Usuario : {Nombre}</label>
                    <br />
                    <label>Empresa : {Empresa}</label>
                </div>
                </div>
                <ul>
                    <li onClick={()=>changeVista(1)}>CATALOGOS</li>
                    <li onClick={()=>changeVista(2)}>VENTAS</li>
                    <li onClick={()=>changeVista(3)}>USUARIOS</li>                                   
                    <li onClick={()=>changeVista(4)}>ARCHIVOS</li>                       
                    <li onClick={()=>changeVista(7)}>ARCHIVOS USERS</li>      
                    <li onClick={()=>changeVista(6)}>PACIENTE</li>  
                </ul>             




                

                   
            </div>
            <div className="footerMenu"></div>
            <div className="containerPageOne">
                <div className="containerPageOneContent">
                    <div className="containerPageOneContentHeader"></div>
                    <div className="containerPageOneContentView">
                        {
                            vista===0? <>Bienvendido {Nombre} </> : ""
                        }
                        {
                            vista===1?<Catalogos />:""
                        }
                        {
                            vista===2?<Ventas />: ""
                        }
                        {
                            vista===3?<Usuarios />:""
                        }
                        {
                            vista===4?<Proyectos />:""
                        }
                        {
                            vista===6?<Paciente />:""
                        }
                         {
                            vista===7?<ArchivosUsers />:""
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}


export default Dashboard