import MyDocument from "./pdf";

import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';


function MostrarPDF() {
  return (
    <PDFViewer>
        <MyDocument />
    </PDFViewer>
  );
}
export default MostrarPDF;