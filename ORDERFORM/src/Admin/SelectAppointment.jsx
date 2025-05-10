import React, { useState, useEffect } from "react";
import axios from "axios";
import { APPOINTMENTS, EXECUTIVES } from "../utils/endpoints";

const styles = {
  container: {
    padding: "20px",
    background: "linear-gradient(to right, #e6f0ff, #f7faff)",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "2rem",
    color: "#1a237e",
    fontWeight: "600",
  },
  appointmentStatusBtn: {
    backgroundColor: "#2196f3", // Blue color
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "20px", // Space between the button and the title
    transition: "background-color 0.3s ease",
    display: "block",
    width: "200px",
    marginLeft: "auto",
    marginRight: "5rem", // Center align the button
  },
  appointmentStatusBtnHover: {
    backgroundColor: "#1565c0", // Darker blue on hover
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "15px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "5px",
    marginBottom: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    width: "calc(50% - 7.5px)",
    boxSizing: "border-box",
    transition: "transform 0.2s ease-in-out",
    fontSize: "0.9rem",
    minHeight: "230px",
  },
  cardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  },
  info: {
    marginBottom: "10px",
    fontSize: "1rem",
    color: "#333",
    lineHeight: "1.4",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  dropdown: {
    padding: "6px 10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "0.9rem",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    height: "35px",
  },
  assignBtn: {
    padding: "6px 15px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    height: "35px",
    whiteSpace: "nowrap",
    transition: "background-color 0.3s ease",
  },
  assignBtnHover: {
    backgroundColor: "#1565c0",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "30px 40px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "500",
    color: "#2e7d32",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  },
  assignedText: {
    marginTop: "12px",
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
};

const AppointmentRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [selectedExec, setSelectedExec] = useState({});
  const [assignedMap, setAssignedMap] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${APPOINTMENTS}/pending`);
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    const fetchExecutives = async () => {
      try {
        const response = await axios.get(EXECUTIVES);
        setExecutives(response.data);
      } catch (error) {
        console.error("Error fetching executives:", error);
      }
    };

    fetchAppointments();
    fetchExecutives();
  }, []);

  const handleAssign = async (appointmentId) => {
    const executiveName = selectedExec[appointmentId];
    if (!executiveName) return;

    try {
      const res = await axios.put(`${APPOINTMENTS}/${appointmentId}/assign`, {
        executiveName,
      });
      console.log("Assigned:", res.data);

      setAssignedMap((prev) => ({
        ...prev,
        [appointmentId]: executiveName,
      }));

      setPopupMessage(`🎉 Assigned to ${executiveName}`);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    } catch (err) {
      console.error("Error assigning executive:", err);
    }
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.appointmentStatusBtn}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2196f3")}
      >
        Appointment Status
      </button>

      <h1 style={styles.title}>📅 Appointment Requests</h1>

      {appointments.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", fontSize: "1.1rem" }}>
          No pending appointments.
        </p>
      ) : (
        <div style={styles.cardContainer}>
          {appointments.map((appt) => (
            <div
              key={appt._id}
              style={styles.card}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={styles.info}>
                <strong>👤 Contact:</strong> {appt.contactName}
              </div>
              <div style={styles.info}>
                <strong>🏢 Business:</strong> {appt.businessName}
              </div>
              <div style={styles.info}>
                <strong>📅 Date:</strong> {appt.date}
              </div>
              <div style={styles.info}>
                <strong>⏰ Time:</strong> {appt.time}
              </div>
              <div style={styles.info}>
                <strong>📍 Venue:</strong> {appt.venue}
              </div>

              {assignedMap[appt._id] ? (
                <div style={styles.assignedText}>
                  ✅ Assigned to {assignedMap[appt._id]}
                </div>
              ) : (
                <div style={styles.buttonGroup}>
                  <select
                    style={styles.dropdown}
                    value={selectedExec[appt._id] || ""}
                    onChange={(e) =>
                      setSelectedExec((prev) => ({
                        ...prev,
                        [appt._id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Executive</option>
                    {executives.map((exec) => (
                      <option key={exec._id} value={exec.name}>
                        {exec.name}
                      </option>
                    ))}
                  </select>
                  <button
                    style={styles.assignBtn}
                    onClick={() => handleAssign(appt._id)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1565c0")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1976d2")
                    }
                  >
                    Assign
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>{popupMessage}</div>
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;
