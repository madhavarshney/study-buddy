import {Link, Navigate, useNavigate  } from 'react-router-dom';

import {  
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Login from './Components/Login/index';

function App() {
  return (
    <Router>
        <div>
          <Routes> 
            <Route exact path ='/' element={<Login/>}/>
          </Routes>
        </div>
    </Router>
  );
}

export default App;
