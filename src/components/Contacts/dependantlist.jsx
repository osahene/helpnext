"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetDependants, approveContact, rejectContact } from "@/redux/userSlice";
import DependantAction from "./modals";
import toast from "react-hot-toast";

const statusConfig = {
  approved: { color: "#1A9E5C", bg: "#E8F8F0", label: "Approved" },
  rejected: { color: "#CC2222", bg: "#FFF0F0", label: "Rejected" },
  pending:  { color: "#E07A1A", bg: "#FFF3E0", label: "Pending" },
};

const avatarColors = ["#5B3FE8", "#2C5FD4", "#D4368A", "#1A9E5C", "#E07A1A"];

export default function Dependents() {
  const dependants = useSelector((state) => state.contact.dependants) || [];
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, dependant: null, type: "" });

  useEffect(() => {
    dispatch(GetDependants()).catch(() => {});
  }, [dispatch]);

  const handleActionConfirm = async () => {
    const { dependant, type } = actionModal;
    try {
      const action = type === "approve" ? approveContact : rejectContact;
      await dispatch(action(dependant.pk)).unwrap();
      toast.success(`Contact ${type}d successfully!`, { duration: 5000 });
    } catch {
      toast.error(`Failed to ${type} contact.`, { duration: 5000 });
    } finally {
      setActionModal({ open: false, dependant: null, type: "" });
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div style={{ width: "4px", height: "18px", background: "#5B3FE8", borderRadius: "2px" }} />
          <p style={{ color: "#5B3FE8", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px" }}>
            MY DEPENDENTS
          </p>
        </div>
        <p style={{ color: "#8B94B2", fontSize: "12.5px", paddingLeft: "12px" }}>
          People who rely on you during emergencies
        </p>
      </div>

      {dependants.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: "20px", padding: "40px 20px",
          textAlign: "center", border: "1px solid #DDE3F5",
          boxShadow: "0 4px 16px rgba(44,95,212,0.06)",
        }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#F0F4FF", border: "2px solid #DDE3F5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg style={{ width: "32px", height: "32px", color: "#8B94B2" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>No Dependents in Records</p>
          <p style={{ color: "#8B94B2", fontSize: "13px", lineHeight: 1.6 }}>
            Dependents are people who have<br />added you as their emergency contact.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {dependants.map((dep) => {
            const name = `${dep.first_name} ${dep.last_name}`;
            const status = statusConfig[dep.status] || statusConfig.pending;
            const avatarColor = avatarColors[name.charCodeAt(0) % avatarColors.length];
            const isOpen = expanded === dep.pk;

            return (
              <div
                key={dep.pk}
                style={{
                  background: "#fff", borderRadius: "20px",
                  border: "1px solid #DDE3F5",
                  boxShadow: "0 4px 16px rgba(44,95,212,0.06)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : dep.pk)}
                  style={{
                    width: "100%", padding: "16px", display: "flex", alignItems: "center",
                    gap: "14px", background: "transparent", border: "none", cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                    background: `${avatarColor}15`, border: `1.5px solid ${avatarColor}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: avatarColor, fontWeight: 800, fontSize: "17px" }}>
                      {name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{name}</p>
                    <span style={{
                      background: status.bg, color: status.color,
                      fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
                      display: "inline-block",
                    }}>
                      {dep.status === "pending" && "⏳ "}{status.label}
                    </span>
                  </div>
                  <svg
                    style={{ width: "18px", height: "18px", color: "#8B94B2", flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div style={{ borderTop: "1px solid #F0F4FF", padding: "14px 16px 16px" }}>
                    <div style={{ background: "#F0F4FF", borderRadius: "14px", padding: "14px", marginBottom: "14px" }}>
                      {[
                        { label: dep.email, icon: "✉", color: "#2C5FD4" },
                        { label: dep.phone_number, icon: "📞", color: "#1A9E5C" },
                      ].map((row, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: i === 0 ? "10px" : 0 }}>
                          <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: `${row.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: "13px" }}>{row.icon}</span>
                          </div>
                          <span style={{ color: "#0F1B3E", fontSize: "13.5px", fontWeight: 500 }}>{row.label}</span>
                        </div>
                      ))}
                    </div>

                    {dep.status === "pending" && (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => setActionModal({ open: true, dependant: dep, type: "approve" })}
                          style={{ flex: 1, padding: "10px", borderRadius: "12px", background: "#E8F8F0", color: "#1A9E5C", fontWeight: 700, fontSize: "13.5px", border: "1px solid #B2EECC", cursor: "pointer" }}
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => setActionModal({ open: true, dependant: dep, type: "reject" })}
                          style={{ flex: 1, padding: "10px", borderRadius: "12px", background: "#FFF0F0", color: "#CC2222", fontWeight: 700, fontSize: "13.5px", border: "1px solid #FFCCCC", cursor: "pointer" }}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                    {dep.status === "approved" && (
                      <button
                        onClick={() => setActionModal({ open: true, dependant: dep, type: "reject" })}
                        style={{ width: "100%", padding: "10px", borderRadius: "12px", background: "#FFF0F0", color: "#CC2222", fontWeight: 700, fontSize: "13.5px", border: "1px solid #FFCCCC", cursor: "pointer" }}
                      >
                        Reject
                      </button>
                    )}
                    {dep.status === "rejected" && (
                      <button
                        onClick={() => setActionModal({ open: true, dependant: dep, type: "approve" })}
                        style={{ width: "100%", padding: "10px", borderRadius: "12px", background: "#E8F8F0", color: "#1A9E5C", fontWeight: 700, fontSize: "13.5px", border: "1px solid #B2EECC", cursor: "pointer" }}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {actionModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <DependantAction contact={actionModal.dependant} onAction={handleActionConfirm} onCancel={() => setActionModal({ open: false, dependant: null, type: "" })} actionType={actionModal.type} />
        </div>
      )}
    </div>
  );
}
