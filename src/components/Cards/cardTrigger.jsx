"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trigger } from "@/redux/userSlice";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import {
  faUserSlash,
  faUsersSlash,
  faTriangleExclamation,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

export default function TriggerCard({
  cardName,
  cardName2,
  cardLogo,
  logoAlt,
  accentColor = "#CC2222",
  onClose,
}) {
  const [showModal, setShowModal] = useState(true);
  const [isPulsing, setIsPulsing] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const contact = useSelector((state) => state.contact.contacts);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(onClose, 300);
  };

  const getGeolocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser");
      } else {
        navigator.geolocation.getCurrentPosition(
          () => {
            const watchId = navigator.geolocation.watchPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                });
                navigator.geolocation.clearWatch(watchId);
              },
              (error) => handleGeolocationError(error, reject),
              { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 }
            );
          },
          (error) => handleGeolocationError(error, reject),
          { enableHighAccuracy: true, timeout: 60000 }
        );
      }
    });

  const handleGeolocationError = (error, reject) => {
    const messages = {
      [error.PERMISSION_DENIED]: "Please allow location access to send alerts.",
      [error.POSITION_UNAVAILABLE]: "Location unavailable. Check device settings.",
      [error.TIMEOUT]: "Location request timed out. Please try again.",
    };
    toast.error(messages[error.code] || "An unknown error occurred.", { duration: 5000 });
    reject(error);
  };

  const handleTriggerAlert = async () => {
    setIsPulsing(false);
    try {
      const geolocation = await getGeolocation();
      if (!geolocation.latitude || !geolocation.longitude) {
        toast.error("Geolocation data unavailable.", { duration: 5000 });
        return;
      }
      const response = await dispatch(
        Trigger({ alertType: `${cardName}`, location: geolocation })
      );
      if (response.meta.requestStatus === "fulfilled") {
        setShowModal(false);
        setTimeout(onClose, 300);
      }
      toast.success(
        response.payload?.message || "Alert triggered successfully.",
        { duration: 5000, icon: <FontAwesomeIcon icon={faMapLocationDot} /> }
      );
    } catch {
      setShowModal(false);
      setTimeout(onClose, 300);
    } finally {
      setShowModal(false);
      setTimeout(onClose, 300);
    }
  };

  const renderContent = () => {
    // ── Not authenticated ─────────────────────────────────
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center text-center px-2 pb-2">
          <div
            style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "16px",
              boxShadow: "0 8px 24px rgba(44,95,212,0.35)",
            }}
          >
            <svg style={{ width: "32px", height: "32px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p style={{ color: "#0F1B3E", fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>
            Authentication Required
          </p>
          <p style={{ color: "#8B94B2", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
            This service is only available to authenticated users. Please register or log in.
          </p>
          <div className="flex gap-3 w-full">
            <Link href="/auth/register" className="flex-1">
              <button
                style={{
                  width: "100%", padding: "11px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                  color: "#fff", fontWeight: 700, fontSize: "14px",
                  boxShadow: "0 6px 18px rgba(91,63,232,0.35)",
                }}
              >
                Register
              </button>
            </Link>
            <Link href="/auth/login" className="flex-1">
              <button
                style={{
                  width: "100%", padding: "11px", borderRadius: "14px",
                  background: "#F0F4FF", color: "#2C5FD4",
                  fontWeight: 700, fontSize: "14px",
                  border: "1px solid #DDE3F5",
                }}
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      );
    }

    // ── No contacts ───────────────────────────────────────
    if (contact.length < 1) {
      return (
        <div className="flex flex-col items-center text-center px-2 pb-2">
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(204,34,34,0.1)", border: "2px solid rgba(204,34,34,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "16px",
          }}>
            <FontAwesomeIcon icon={faUserSlash} size="xl" style={{ color: "#CC2222" }} />
          </div>
          <p style={{ color: "#CC2222", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", marginBottom: "6px" }}>
            NO CONTACTS
          </p>
          <p style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800, marginBottom: "8px" }}>
            No Emergency Contacts
          </p>
          <p style={{ color: "#8B94B2", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "20px" }}>
            You need at least one approved contact in your emergency list to send alerts.
          </p>
          <div className="flex gap-3 w-full">
            <Link href="/contact" className="flex-1">
              <button style={{
                width: "100%", padding: "11px", borderRadius: "14px",
                background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                color: "#fff", fontWeight: 700, fontSize: "14px",
                boxShadow: "0 6px 18px rgba(91,63,232,0.35)",
              }}>
                Add Contacts
              </button>
            </Link>
            <button
              onClick={handleClose}
              style={{
                flex: 1, padding: "11px", borderRadius: "14px",
                background: "#F0F4FF", color: "#8B94B2",
                fontWeight: 600, fontSize: "14px",
                border: "1px solid #DDE3F5",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // ── No approved contacts ───────────────────────────────
    const approvedContacts = contact.filter((c) => c.status === "approved");
    if (approvedContacts.length < 1) {
      return (
        <div className="flex flex-col items-center text-center px-2 pb-2">
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(224,122,26,0.1)", border: "2px solid rgba(224,122,26,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "16px",
          }}>
            <FontAwesomeIcon icon={faUsersSlash} size="xl" style={{ color: "#E07A1A" }} />
          </div>
          <p style={{ color: "#E07A1A", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", marginBottom: "6px" }}>
            PENDING APPROVAL
          </p>
          <p style={{ color: "#0F1B3E", fontSize: "17px", fontWeight: 800, marginBottom: "8px" }}>
            No Approved Contacts
          </p>
          <p style={{ color: "#8B94B2", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "12px" }}>
            None of your contacts have approved your request yet. You can:
          </p>
          <div
            style={{
              background: "#F0F4FF", borderRadius: "14px",
              padding: "14px 16px", width: "100%",
              border: "1px solid #DDE3F5", marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <p style={{ color: "#0F1B3E", fontSize: "13px", marginBottom: "6px" }}>
              <span style={{ color: "#2C5FD4", fontWeight: 700 }}>1.</span>&nbsp;
              Alert them to approve your request.
            </p>
            <p style={{ color: "#0F1B3E", fontSize: "13px" }}>
              <span style={{ color: "#2C5FD4", fontWeight: 700 }}>2.</span>&nbsp;
              Register a new contact relation.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Link href="/contact" className="flex-1">
              <button style={{
                width: "100%", padding: "11px", borderRadius: "14px",
                background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                color: "#fff", fontWeight: 700, fontSize: "14px",
                boxShadow: "0 6px 18px rgba(91,63,232,0.35)",
              }}>
                Manage Contacts
              </button>
            </Link>
            <button
              onClick={handleClose}
              style={{
                flex: 1, padding: "11px", borderRadius: "14px",
                background: "#F0F4FF", color: "#8B94B2",
                fontWeight: 600, fontSize: "14px",
                border: "1px solid #DDE3F5",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // ── Ready to trigger ──────────────────────────────────
    return (
      <div className="flex flex-col items-center text-center pb-2">
        {/* Pulsing icon */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          {isPulsing && (
            <div style={{
              position: "absolute", inset: "-12px",
              borderRadius: "50%",
              background: `${accentColor}22`,
              animation: "ringPulse 1.2s ease-in-out infinite",
            }} />
          )}
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: `${accentColor}22`,
            border: `2px solid ${accentColor}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              background: `${accentColor}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Image src={cardLogo} alt={logoAlt} width={32} height={32} />
            </div>
          </div>
        </div>

        <p style={{ color: "#8B94B2", fontSize: "11px", fontWeight: 700, letterSpacing: "1.4px", marginBottom: "6px" }}>
          EMERGENCY ALERT
        </p>
        <p style={{ color: "#0F1B3E", fontSize: "20px", fontWeight: 800, marginBottom: "6px", letterSpacing: "-0.02em" }}>
          {cardName} {cardName2}
        </p>
        <p style={{ color: "#8B94B2", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "16px" }}>
          All approved contacts on your emergency list will be immediately notified.
        </p>

        {/* Location info pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#F0F4FF", borderRadius: "20px",
          padding: "8px 16px", marginBottom: "22px",
          border: "1px solid #DDE3F5",
        }}>
          <svg style={{ width: "14px", height: "14px", color: accentColor, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p style={{ color: "#8B94B2", fontSize: "12.5px" }}>Your live location will be shared</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleTriggerAlert}
            style={{
              flex: 2, padding: "14px", borderRadius: "16px",
              background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor})`,
              color: "#fff", fontWeight: 700, fontSize: "15px",
              boxShadow: `0 8px 24px ${accentColor}55`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Alert Now
          </button>
          <button
            onClick={handleClose}
            style={{
              flex: 1, padding: "14px", borderRadius: "16px",
              background: "#F0F4FF", color: "#8B94B2",
              fontWeight: 600, fontSize: "14px",
              border: "1px solid #DDE3F5",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        @keyframes ringPulse {
          0%   { transform: scale(1); opacity: 0.7; }
          50%  { transform: scale(1.3); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.7; }
        }
      `}</style>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: "#fff",
                borderRadius: "28px",
                width: "100%",
                maxWidth: "400px",
                overflow: "hidden",
                boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
              }}
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Gradient top header */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor})`,
                  padding: "20px 20px 20px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.2)",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: "#fff" }} />
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 800, fontSize: "16px", letterSpacing: "-0.01em" }}>
                      Confirm Alert
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>
                      This action will notify contacts
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg style={{ width: "16px", height: "16px", color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "24px 20px 20px" }}>
                {renderContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
