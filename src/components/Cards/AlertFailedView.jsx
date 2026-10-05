"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { serviceForSituation } from "@/utils/emergencyServices";

// Shown in place of the alert card's content when an alert couldn't be sent
// at all — nobody was notified, so offer a retry and the right national
// service to call directly. Mirrors helpflutter's _AlertFailedDialog.
// On phones a tel: link opens the dialer with the number filled in.
export default function AlertFailedView({ situation, message, onRetry, onClose, retrying }) {
  const service = serviceForSituation(situation);

  return (
    <div className="flex flex-col items-center text-center px-2 pb-2">
      <div style={{
        width: "72px", height: "72px", borderRadius: "50%",
        background: "rgba(204,34,34,0.1)", border: "2px solid rgba(204,34,34,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "16px",
      }}>
        <FontAwesomeIcon icon={faTriangleExclamation} size="xl" style={{ color: "#CC2222" }} />
      </div>
      <p style={{ color: "#0F1B3E", fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>
        Alert not sent
      </p>
      <p style={{ color: "#8B94B2", fontSize: "14px", lineHeight: 1.6, marginBottom: "18px" }}>
        {message}
      </p>

      <p style={{ color: "#0F1B3E", fontSize: "13px", fontWeight: 700, marginBottom: "10px", alignSelf: "flex-start" }}>
        Call {service.name} now
      </p>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {service.contacts.map((number) => (
          <a
            key={number}
            href={`tel:${number}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              padding: "12px", borderRadius: "14px", background: "#CC2222",
              color: "#fff", fontWeight: 700, fontSize: "16px", textDecoration: "none",
            }}
          >
            <FontAwesomeIcon icon={faPhone} />
            {number}
          </a>
        ))}
      </div>

      <div style={{ width: "100%", display: "flex", gap: "10px" }}>
        <button
          onClick={onClose}
          style={{
            flex: 1, padding: "12px", borderRadius: "14px", border: "1px solid #DDE3F5",
            background: "#fff", color: "#0F1B3E", fontWeight: 700, fontSize: "14px",
          }}
        >
          Close
        </button>
        <button
          onClick={onRetry}
          disabled={retrying}
          style={{
            flex: 1, padding: "12px", borderRadius: "14px",
            background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
            color: "#fff", fontWeight: 700, fontSize: "14px",
            opacity: retrying ? 0.6 : 1, cursor: retrying ? "not-allowed" : "pointer",
          }}
        >
          {retrying ? "Sending…" : "Try again"}
        </button>
      </div>
    </div>
  );
}
