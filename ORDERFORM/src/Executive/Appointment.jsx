import React, { useState, useEffect } from "react";
import axios from "axios";
import { APPOINTMENTS } from "../utils/endpoints";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // use minHeight
    backgroundColor: "#f5f5f5",
    padding: "20px",
    overflowY: "auto", // allow scrolling if content overflows
  },
  formContainer: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px",
  },
  formTitle: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  inputLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#003366",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "1.2rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  // add css to data
  closeButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s ease",
  },
  popupContainer: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "1.2rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    animation: "fadeIn 0.5s ease-in-out",
    maxWidth: "400px",
    width: "90%",
  },

  congratsText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: "10px",
  },

  subText: {
    fontSize: "18px",
    color: "#555",
  },
};

const Appointment = () => {
  const [formData, setFormData] = useState({
    executiveName: "",
    contactName: "",
    businessName: "",
    phoneNumber: "", // Added phone number
    date: "",
    time: "",
    venue: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  // adding the data
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  useEffect(() => {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const formattedToday = today.toISOString().split("T")[0];
    const formattedTwoDaysAgo = twoDaysAgo.toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      date: formattedToday,
      time: today.toTimeString().slice(0, 5),
    }));

    const dateInput = document.getElementById("appointmentDate");
    if (dateInput) {
      dateInput.min = formattedTwoDaysAgo;
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(APPOINTMENTS, formData);
      setShowPopup(true);

      // Reset form after scheduling
      const today = new Date();
      setFormData({
        executiveName: "",
        contactName: "",
        businessName: "",
        phoneNumber: "", // Reset phone number
        date: today.toISOString().split("T")[0],
        time: today.toTimeString().slice(0, 5),
        venue: "",
      });

      // Hide popup after 2.5 seconds
      setTimeout(() => setShowPopup(false), 2500);
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Error scheduling appointment");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>Schedule Appointment</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={styles.inputLabel}>Executive Name</label>
            <input
              type="text"
              name="executiveName"
              value={formData.executiveName}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Contact Person Name</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Date</label>
            <input
              type="date"
              id="appointmentDate"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.inputLabel}>Address</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Schedule Appointment
          </button>
        </form>
      </div>

      {showPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.popupContainer}>
            <div className="confetti"></div>
            <h2 style={styles.congratsText}>🎉 Congratulations! 🎉</h2>
            <p style={styles.subText}>
              Your appointment has been successfully scheduled! 🎊
            </p>
            <button
              style={styles.closeButton}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
