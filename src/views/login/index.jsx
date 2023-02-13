import './index.scss'

const Login =() =>{
    return(
        <div className="containerLogin">
            <div className="login">
                <div className="avatar"></div>
                <div className="formulario">
                    <label>Usuario</label>
                    <input type="text"></input>
                    <label>Contraseña</label>
                    <input type="text"></input>
                </div>                
                <div className="mensajes">
                
                </div>
            </div>
            <div className="image"></div>
        </div>
    )
}
export default Login;