import React from "react";
import { Link } from "react-router-dom";
import "../App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
function View({ data, onDelete, onEdit }) {
  return (
    <div className="container">
      <h1 className="text-center mt-5">User details</h1>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((user, index) => (
            <tr key={index}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button  style={{width: "30%",
  padding: "10px",
            backgroundColor:  "#a41111" ,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
      }}
                 onClick={() => onDelete(user.id)}>Delete</button>
                <button style={{width: "30%",
  padding: "10px",
            backgroundColor:  "#2e0658" ,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
      }} 
          onClick={() => onEdit(user.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to ="/"><button>add</button></Link>
    </div>
  );
}
export default View;