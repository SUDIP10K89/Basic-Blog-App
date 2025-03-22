import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import AddPost from "./pages/AddPost"
import EditBlog from "./pages/EditBlog"
import ShowFullBlog from "./pages/ShowFullBlog"
import MyBlog from "./pages/MyBlog"
import PrivateRoute from "./components/PrivateRoute"

function App(){
  return (
     <div>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/edit/:id" element={<EditBlog />} />
            <Route path="/show/:id" element={<ShowFullBlog />} />
            <Route path="/myblog" element={<MyBlog />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
