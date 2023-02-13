import './index.scss'

import {Link} from "react-router-dom"
import Login from '../login'

import Logo from '../../components/img/logo.svg'
const Home = () =>{
    return(
        <div className="containerHome">
            <section className="pageOne">
                <div className="contenOne">
                    <div className="logo">
                        <img src={Logo} ></img>
                        <label>LoopCount</label>
                    </div> 
                    <div className="title">
                        Streamline 
                        Dubbing 
                        Processes 
                        with
                        LoopCount
                    </div>
                    <div className="subtitle">
                        The tool for dubbing companies to help 
                        streamline the scripting process.
                    </div>
                </div>
                <div className="contenTwo">
                    <Link to='/login'>
                        <div className="button">
                            Login
                        </div>
                    </Link>                  
                </div>
            </section>
            <div className="pageTwo">
                <div className="contenOne">
                    <div className="logo"></div>
                    <div className="title">
                        Quickly count script loops.
                    </div>
                    <div className="subtitle">
                        LoopCount makes counting script loops 
                        easy and efficient. 
                        Our tool makes it simple to count loops 
                        quickly, saving time and resources.
                        <br />
                        <br />
                        Our user friendly interface helps to 
                        streamline the script editing process, 
                        allowing you to quickly and accurately 
                        edit scripts.
                    </div>
                </div>
                <div className="contenTwo">

                </div>
            </div>

        </div>
    )    
}
export default Home