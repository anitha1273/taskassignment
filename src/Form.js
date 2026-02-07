import React, { useState, useEffect } from "react";
import { FORM_CONFIG } from "./config/formConfig";
import { createUser, updateUser, getUsers } from "./api";
import { useNavigate, useLocation } from "react-router-dom";

function Form({ onUserAdded }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
      if (location.state?.isEdit && location.state?.user) {
        setIsEdit(true);
        setUserId(location.state.userId);
        setFormData({
          firstName: location.state.user.firstName,
          lastName: location.state.user.lastName,
          email: location.state.user.email,
          phone: location.state.user.phone
        });
      }
    }, [location.state]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      for (let field of FORM_CONFIG.fields) {
        if (field.required && !formData[field.name]) {
          setMessageType("error");
          setMessage(`${field.label} is required`);
          setLoading(false);
          return;
        }
      }

      try {
        if (isEdit) {
          await updateUser(userId, formData);
          setMessageType("success");
          setMessage("User updated successfully!");
        } else {
          // Check if user already exists by email when creating
          const existingUsers = await getUsers();
          const userExists = existingUsers.data.some(user => user.email === formData.email);
          
          if (userExists) {
            setMessageType("error");
            setMessage("User with this email already exists");
            setLoading(false);
            return;
          }

          await createUser(formData);
          setMessageType("success");
          setMessage("User added successfully!");
        }
        if (onUserAdded) {
          onUserAdded();
        }
        navigate("/form");
      } catch (error) {
        console.error("Error:", error);
        setMessageType("error");
        setMessage(error.response?.data?.message || (isEdit ? "Failed to update user" : "Failed to add user"));
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="container">
        <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "20px auto" }}>
          {message && (
            <div style={{
              padding: "10px",
              marginBottom: "15px",
              color: messageType === "success" ? "green" : "red",
              border: `1px solid ${messageType === "success" ? "green" : "red"}`,
              borderRadius: "4px"
            }}>
              {message}
            </div>
          )}
          {FORM_CONFIG.fields.map(field => (
            <div key={field.name} style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                {field.label}
                {field.required && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                  fontSize: "14px"
                }}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {loading ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update User" : "Add User")}
          </button>
        </form>
      </div>
    );
}
export default Form;