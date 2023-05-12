
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import './index.scss'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import 'moment-timezone';

import PdfsUsers from './pdf'
import VideoUsers from './video'  


function ArchivosUsers() {

  const[vista,setVista] = useState('')



 

  return (
    <div className="containerFiles">
      <div className="titleContainerFiles">
        <div className="title">Catalogo de Archivos</div>            
      </div>
      <div className="headerConatainerFiles">
        <div className="botones">          
          <button  className='Pdf' onClick={()=>setVista('Pdf')}>
            <label>PDF</label>
            <PictureAsPdfIcon />
          </button>
          <button className='Video' onClick={()=>setVista('Video')}>            
            <label>VIDEO</label>
            <PersonalVideoIcon />
          </button>                   
        </div>                         
      </div>
      <div className="bodyContainerFiles">
          {
            vista ==='Pdf' ?
              <>
                <PdfsUsers />
              </>
            :
              <>
    
              </>        
          }
          {
            vista ==='Video' ?
              <>
                <VideoUsers />
              </>
            :
              <>       
              </>        
          }
      </div>                 
    </div>
  );
}

export default ArchivosUsers;



