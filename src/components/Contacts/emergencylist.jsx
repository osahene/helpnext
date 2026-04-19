"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetContact, DeleteContact, EditContactInfo } from "@/redux/userSlice";
import EditContact from "./editInfo";
import RemoveInfo from "./removeInfo";
import toast from "react-hot-toast";

const statusConfig = {
  approved: { color: "#1A9E5C", bg: "#E8F8F0", icon: "✓", label: "Approved" },
  rejected: { color: "#CC2222", bg: "#FFF0F0", icon: "✕", label: "Rejected" },
  pending:  { color: "#E07A1A", bg: "#FFF3E0", icon: "⏳", label: "Pending" },
};

const avatarColors = ["#2C5FD4", "#5B3FE8", "#1A9E5C", "#D4368A", "#E07A1A"];

export default function Emergency() {
  const contacts = useSelector((state) => state.contact.contacts) || [];
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetContact()).catch(() => {});
  }, [dispatch]);

  const handleEditSubmit = async (updated) => {
    try {
      await dispatch(EditContactInfo(updated));
      toast.success("Contact updated successfully!", { duration: 5000 });
    } catch {
      toast.error("Failed to update contact.", { duration: 5000 });
    } finally { setIsEditing(false); }
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(DeleteContact(currentContact));
      toast.success("Contact deleted successfully!", { duration: 5000 });
    } catch {
      toast.error("Failed to delete contact.", { duration: 5000 });
    } finally { setIsDeleting(false); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div style={{ width: "4px", height: "18px", background: "#CC2222", borderRadius: "2px" }} />
          <p style={{ color: "#CC2222", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px" }}>
            MY EMERGENCY CONTACTS
          </p>
        </div>
        <p style={{ color: "#8B94B2", fontSize: "12.5px", paddingLeft: "12px" }}>
          {contacts.length} contact{contacts.length !== 1 ? "s" : ""} registered
        </p>
      </div>

      {contacts.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: "20px", padding: "40px 20px",
          textAlign: "center", border: "1px solid #DDE3F5",
          boxShadow: "0 4px 16px rgba(44,95,212,0.06)",
        }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#F0F4FF", border: "2px solid #DDE3F5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg style={{ width: "32px", height: "32px", color: "#8B94B2" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>No Contacts in Records</p>
          <p style={{ color: "#8B94B2", fontSize: "13px", lineHeight: 1.6 }}>Register your first emergency contact<br />using the Register tab.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {contacts.map((contact, idx) => {
            const name = `${contact.first_name} ${contact.last_name}`;
            const status = statusConfig[contact.status] || statusConfig.pending;
            const avatarColor = avatarColors[name.charCodeAt(0) % avatarColors.length];
            const isOpen = expanded === contact.pk;

            return (
              <div
                key={contact.pk}
                style={{
                  background: "#fff", borderRadius: "20px",
                  border: "1px solid #DDE3F5",
                  boxShadow: "0 4px 16px rgba(44,95,212,0.06)",
                  overflow: "hidden",
                }}
              >
                {/* Card header */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : contact.pk)}
                  style={{
                    width: "100%", padding: "16px", display: "flex", alignItems: "center",
                    gap: "14px", background: "transparent", border: "none", cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                    background: `${avatarColor}15`,
                    border: `1.5px solid ${avatarColor}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: avatarColor, fontWeight: 800, fontSize: "17px" }}>
                      {name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#0F1B3E", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#8B94B2", fontSize: "12.5px" }}>{contact.relation}</span>
                      <span style={{
                        background: status.bg, color: status.color,
                        fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
                      }}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <svg
                    style={{ width: "18px", height: "18px", color: "#8B94B2", flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded detail panel */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid #F0F4FF", padding: "14px 16px 16px" }}>
                    <div style={{ background: "#F0F4FF", borderRadius: "14px", padding: "14px", marginBottom: "14px" }}>
                      {[
                        { icon: "✉", label: contact.email_address, color: "#2C5FD4" },
                        { icon: "📞", label: contact.phone_number, color: "#1A9E5C" },
                      ].map((row, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: i === 0 ? "10px" : 0 }}>
                          <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: `${row.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: "13px" }}>{row.icon}</span>
                          </div>
                          <span style={{ color: "#0F1B3E", fontSize: "13.5px", fontWeight: 500 }}>{row.label}</span>
                        </div>
                      ))}
                    </div>
                    {contact.status !== "rejected" && (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => { setCurrentContact(contact); setIsEditing(true); }}
                          style={{
                            flex: 1, padding: "10px", borderRadius: "12px",
                            background: "#EEF4FF", color: "#2C5FD4",
                            fontWeight: 700, fontSize: "13.5px",
                            border: "1px solid #DDE3F5", cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { setCurrentContact(contact); setIsDeleting(true); }}
                          style={{
                            flex: 1, padding: "10px", borderRadius: "12px",
                            background: "#FFF0F0", color: "#CC2222",
                            fontWeight: 700, fontSize: "13.5px",
                            border: "1px solid #FFCCCC", cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {contact.status === "rejected" && (
                      <button
                        onClick={() => { setCurrentContact(contact); setIsDeleting(true); }}
                        style={{
                          width: "100%", padding: "10px", borderRadius: "12px",
                          background: "#FFF0F0", color: "#CC2222",
                          fontWeight: 700, fontSize: "13.5px",
                          border: "1px solid #FFCCCC", cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isEditing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <EditContact contact={currentContact} onSave={handleEditSubmit} onCancel={() => setIsEditing(false)} />
        </div>
      )}
      {isDeleting && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <RemoveInfo contact={currentContact} onDelete={handleDeleteConfirm} onCancel={() => setIsDeleting(false)} />
        </div>
      )}
    </div>
  );
}
