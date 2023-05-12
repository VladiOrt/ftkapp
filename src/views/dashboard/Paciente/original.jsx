




















import React, {useState} from 'react';
import './index.scss'
const Paciente = () => {
  const data = [
    { nombre: 'Juan', email: 'juan@example.com', edad: 25 },
    { nombre: 'María', email: 'maria@example.com', edad: 30 },
    { nombre: 'Pedro', email: 'pedro@example.com', edad: 28 },
    { nombre: 'ab', email: 'juan@example.com', edad: 25 },
    { nombre: 'bc', email: 'maria@example.com', edad: 30 },
    { nombre: 'cd', email: 'pedro@example.com', edad: 28 },
    { nombre: 'ef', email: 'juan@example.com', edad: 25 },
    { nombre: 'fg', email: 'maria@example.com', edad: 30 },
    { nombre: 'gh', email: 'pedro@example.com', edad: 28 },
    { nombre: 'hi', email: 'pedro@example.com', edad: 28 },
    { nombre: 'ij', email: 'pedro@example.com', edad: 28 },
    { nombre: 'jk', email: 'pedro@example.com', edad: 28 },
    { nombre: 'kl', email: 'pedro@example.com', edad: 28 },
    { nombre: 'lm', email: 'pedro@example.com', edad: 28 },
    { nombre: 'mn', email: 'pedro@example.com', edad: 28 },
  ];

  return (
    <div>
      <h1>Tabla de Datos</h1>
      <Table data={data} />
    </div>
  );
};




const Table = ({ data }) => {



  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
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
            <th>Nombre</th>
            <th>Email</th>
            <th>Edad</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.nombre}</td>
              <td>{item.email}</td>
              <td>{item.edad}</td>
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
  );
};












export default Paciente;
