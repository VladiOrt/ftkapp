import{
  Routes,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'


import Home from './views/home'
import Login from './views/login';
import Dashboard from './views/dashboard';
import MostrarPDF from './views/dashboard/capitulos/components/viewpdf';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />}> </Route>
          <Route path='/login' element={<Login />}> </Route>
          <Route path='/dashboard' element={<Dashboard />}> </Route>
          <Route path='/pdf' element={<MostrarPDF />}> </Route>
          

        </Routes>
      </Router>
    </div>
  );
}

export default App;
