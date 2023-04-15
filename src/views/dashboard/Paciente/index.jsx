import './index.scss'

const Paciente = ( ) => {
    return(
        <div className="containerPaciente">
            <section className="findPacient">
                Buscar Paciente


                

                <div>
                    <input type="text" placeholder='ejemplo@gmail.com' />
                    <input type="text" placeholder='5575655412' />
                </div>
            </section>
            <section className="createPacient">
                Crear Paciete

                <div>
                    <input type="text" placeholder='Nombre' />
                    <input type="text" placeholder='Apellido Paterno' />
                    <input type="text" placeholder='Apellido Materno' />
                    
                </div>

            </section>
            <section className="resultFind">
                Resultado de Busqueda
            </section>
        </div>
    )
}



export default Paciente