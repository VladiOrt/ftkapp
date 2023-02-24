

import React, { useEffect, useState } from "react";
import Table from "./components/Table";
import axios from "axios";
import './index.scss'
function Usuarios() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    
    const datos = await axios.get('http://localhost:5000/user/All', {
      headers: {       
      }
    })
    let Dat = (datos.data).data
    setData(Dat);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="containerUsers">
      <div className="titleContainerUsers">
        <div className="title">Catalogo de Usuarios</div>            
      </div>
      <div className="headerConatainerUsers">
        <div className="button">
            Agregar
        </div>
        <div className="button">
            Editar
        </div>        
        <div className="button">
            Eliminar
        </div>
      </div>
      <div className="bodyContainerUser">
        <div>
          <Table mockData={data} />
        </div>  
      </div>
      
      
    </div>
  );
}

export default Usuarios;