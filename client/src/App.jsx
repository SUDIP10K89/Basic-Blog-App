import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import AddPost from "./pages/AddPost"


function App(){
  return (
    <div>
      <Router>
       <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/add-post" element={<AddPost/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
