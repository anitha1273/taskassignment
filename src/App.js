import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "./api";
import View from "./views/view";
import Form from "./Form";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";


function AppContent() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      getdata();
    }, []);

    let getdata = async () => {
      let res = await getUsers();
      setData(res.data);
    };

    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        try {
          await deleteUser(id);
          setData(data.filter(user => user.id !== id));
          alert("User deleted successfully!");
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user");
        }
      }
    };

    const handleEdit = (id) => {
      const user = data.find(u => u.id === id);
      if (!user) return;
      navigate(`/`, { state: { user, isEdit: true, userId: id } });
    };

    const handleUserAdded = () => {
      getdata();
    };
    
  return (
    <div className="container">
      <h1 className="text-center mt-5">Aplication form</h1>
      <Routes>
        <Route path="/form" element={<View data={data} onDelete={handleDelete} onEdit={handleEdit} />} />
        <Route path="/" element={<Form onUserAdded={handleUserAdded} />} />
      </Routes>
      <hr style={{ margin: "30px 0" }} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;