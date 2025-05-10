import React, { useState } from "react";
import axios from "axios";
import {
  ADD_ACCOUNT,
  ADD_ADMIN,
  ADD_DESIGNER,
  ADD_EXECUTIVE,
  SALES_MANAGER,
  SERVICE_EXECUTIVE,
  SERVICE_MANAGER,
} from "../utils/endpoints";

const AddExecutiveAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "executive", // Default role
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting:", formData); // Log form data to check its structure

    // Determine endpoint based on selected role
    let endpoint = "";
    switch (formData.role) {
      case "executive":
        endpoint = ADD_EXECUTIVE;
        break;
      case "admin":
        endpoint = ADD_ADMIN;
        break;
      case "designer":
        endpoint = ADD_DESIGNER;
        break;
      case "account":
        endpoint = ADD_ACCOUNT;
        break;
      case "Service Executive":
        endpoint = SERVICE_EXECUTIVE;
        break;
      case "Service Manager":
        endpoint = SERVICE_MANAGER;
        break;
      case "Sales Manager":
        endpoint = SALES_MANAGER;
        break;
      default:
        throw new Error("Invalid role selected");
    }

    try {
      // Make POST request to the appropriate endpoint
      await axios.post(endpoint, {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
      });

      // Capitalize role for display in popup
      const capitalizedRole =
        formData.role.charAt(0).toUpperCase() + formData.role.slice(1);
      setPopupMessage(`${capitalizedRole} added successfully!`);
      setShowPopup(true);

      // Clear form fields after successful submission
      setFormData({
        name: "",
        phone: "",
        password: "",
        role: "executive",
      });
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response ? error.response.data : error.message
      );

      // Display a detailed error message in popup
      setPopupMessage(
        "Error adding user: " +
          (error.response ? error.response.data : error.message)
      );
      setShowPopup(true);
    }
  };

  const styles = {
    formContainer: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      maxWidth: "500px",
      width: "100%",
      margin: "0 auto",
      position: "relative",
    },
    formTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#003366",
      marginBottom: "20px",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "#333",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "16px",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#003366",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    popup: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#f0f0f0",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      zIndex: 999,
      textAlign: "center",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 998,
    },
    closeBtn: {
      marginTop: "20px",
      backgroundColor: "#003366",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.formTitle}>Add New Employee</div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input type="text" name="fakeuser" style={{ display: "none" }} />
        <input
          type="password"
          name="fakepassword"
          style={{ display: "none" }}
        />

        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            style={styles.input}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            style={styles.input}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            maxLength={10}
            placeholder="Enter 10-digit phone number"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            style={styles.input}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Role</label>
          <select
            name="role"
            value={formData.role}
            style={styles.input}
            onChange={handleChange}
          >
            <option value="executive">Sales Executive</option>
            <option value="admin">Admin</option>
            <option value="designer">Designer</option>
            <option value="account">Account</option>
            <option value="Service Executive">Service Executive</option>
            <option value="Service Manager">Service Manager</option>
            <option value="Sales Manager">Sales Manager</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>
          Add User
        </button>
      </form>

      {showPopup && (
        <>
          <div style={styles.overlay} />
          <div style={styles.popup}>
            <h3>{popupMessage}</h3>
            <button style={styles.closeBtn} onClick={() => setShowPopup(false)}>
              OK
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddExecutiveAdmin;
