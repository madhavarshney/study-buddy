import {Link, Navigate, useNavigate  } from 'react-router-dom';

import {  
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Login from './Components/Login/index';
import SignUp from './Components/SignUp';

function App() {
  return (
    <Router>
        <div>
          <Routes> 
            <Route exact path ='/' element={<SignUp/>}/>
          </Routes>
        </div>
    </Router>
  );
}

export default App;
