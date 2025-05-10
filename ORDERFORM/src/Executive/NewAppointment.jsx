import React, { useEffect, useState } from "react";
import axios from "axios";
import { APPOINTMENTS } from "../utils/endpoints";

const styles = {
  container: {
    padding: "15px 15px",
    background: "linear-gradient(to bottom right, #f9fbe7, #ffffff)",
    minHeight: "50vh",
    fontFamily: "Poppins, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2.5rem",
    color: "#33691e",
    fontWeight: "800",
    letterSpacing: "1.2px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
  cardWrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start", // LEFT alignment
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    padding: "10px",
    borderRadius: "16px",
    border: "1px solid #dcedc8",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    flex: "0 0 calc(100% - 30px)",
    maxWidth: "250px",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
  },
  cardIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#7cb342",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.8rem",
    margin: "0 auto 20px auto",
  },
  info: {
    marginBottom: "6px",
    fontSize: "1rem",
    color: "#444",
    fontWeight: "500",
  },
  executiveAssigned: {
    marginTop: "12px",
    fontSize: "1rem",
    color: "#558b2f",
    fontWeight: "600",
    textAlign: "center",
  },
  statusDropdown: {
    marginTop: "10px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #dcedc8",
    fontSize: "1rem",
    fontFamily: "Poppins, sans-serif",
    fontWeight: "500",
    backgroundColor: "#f1f8e9",
    color: "#33691e",
    outline: "none",
    width: "100%",
  },
  sendButton: {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#558b2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    fontFamily: "Poppins, sans-serif",
    transition: "background-color 0.3s ease",
    width: "100%",
  },
  noData: {
    textAlign: "center",
    color: "#999",
    fontSize: "1.4rem",
    marginTop: "50px",
  },
  noDataIcon: {
    fontSize: "3rem",
    color: "#ccc",
    marginBottom: "15px",
  },
  loadingSpinner: {
    textAlign: "center",
    marginTop: "80px",
    fontSize: "2rem",
    color: "#558b2f",
    fontWeight: "600",
  },
};

const responsiveCardStyle = `
@media (min-width: 600px) {
  .card {
    flex: 0 0 calc(48% - 20px);
  }
}
@media (min-width: 900px) {
  .card {
    flex: 0 0 calc(23% - 20px);
  }
}
`;

const NewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState({});
  const [sending, setSending] = useState(false); // track sending status

  useEffect(() => {
    const fetchAssignedAppointments = async () => {
      try {
        const executiveName = localStorage.getItem("userName");
        const response = await axios.get(
          `${APPOINTMENTS}/assigned/${executiveName}`
        );
        setAppointments(response.data);

        const initialStatuses = {};
        response.data.forEach((appt) => {
          initialStatuses[appt._id] = appt.status || "Not Closed"; // set to existing status if present
        });
        setStatuses(initialStatuses);
      } catch (error) {
        console.error("Failed to fetch assigned appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedAppointments();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleSendStatus = (id) => {
    const selectedStatus = statuses[id];
    console.log("Sending status:", selectedStatus, "for appointment ID:", id);

    setSending(true); // Start sending status
    // Call backend API to update the status
    axios
      .put(`${APPOINTMENTS}/${id}/status`, { status: selectedStatus })
      .then((response) => {
        console.log("Status updated successfully:", response.data);
        setSending(false); // Stop sending status
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        setSending(false); // Stop sending status in case of error
      });
  };

  if (loading) {
    return <div style={styles.loadingSpinner}>Loading appointments...</div>;
  }

  return (
    <div style={styles.container}>
      <style>{responsiveCardStyle}</style>
      <h1 style={styles.title}>📋 New Appointments</h1>
      {appointments.length === 0 ? (
        <div style={styles.noData}>
          <div style={styles.noDataIcon}>📅</div>
          No new appointments assigned to you.
        </div>
      ) : (
        <div style={styles.cardWrapper}>
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="card"
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
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

              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#33691e",
                    marginBottom: "5px",
                  }}
                >
                  Status:
                </div>
                <select
                  value={statuses[appt._id] || "Not Closed"}
                  onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                  style={styles.statusDropdown}
                >
                  <option value="Select">Select</option>
                  <option value="New Lead">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Follow Up">Follow Up</option>
                  <option value="Negotiating">Negotiating</option>
                  <option value="Converted">Converted</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <button
                style={styles.sendButton}
                onClick={() => handleSendStatus(appt._id)}
                disabled={sending} // disable button when sending
              >
                {sending ? "Sending..." : "Send Status"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewAppointment;
