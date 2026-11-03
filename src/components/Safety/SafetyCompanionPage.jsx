"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiService from "@/utils/axios";

// Web counterpart of helpflutter's SafetyCompanionScreen. The server owns
// every deadline (EmergencySystem/account/safety.py): if the user doesn't
// confirm arrival, their Safety Companion contacts are alerted whether or
// not this tab is still open. What the web can't do — keep sharing
// location with the tab closed, record evidence after the duress PIN, the
// panic button — lives in the mobile app.

const ACCENT = "#7B22CE";
const card = {
  background: "var(--hoh-bg-ffffff)", borderRadius: "20px", padding: "20px",
  border: "1px solid var(--hoh-line-eee3f7)", boxShadow: "0 8px 30px rgba(0,0,0,0.05)", marginBottom: "16px",
};
const input = {
  width: "100%", padding: "12px 14px", borderRadius: "12px",
  border: "1px solid var(--hoh-line-dddddd)", fontSize: "15px", background: "var(--hoh-bg-fafafa)",
};
const label = { display: "block", fontWeight: 700, fontSize: "14px", margin: "14px 0 6px", color: "var(--hoh-text-0f1b3e)" };
const hint = { color: "var(--hoh-text-6b7280)", fontSize: "13px", lineHeight: 1.5 };
const primary = (color = ACCENT) => ({
  width: "100%", padding: "14px", borderRadius: "14px", border: "none", cursor: "pointer",
  background: color, color: "#fff", fontWeight: 700, fontSize: "15px",
});
const secondary = {
  padding: "12px", borderRadius: "14px", border: `1px solid ${ACCENT}`, cursor: "pointer",
  background: "var(--hoh-bg-ffffff)", color: ACCENT, fontWeight: 700, fontSize: "14px", flex: 1,
};

const errorOf = (err, fallback = "Something went wrong. Try again.") =>
  err?.response?.data?.error || fallback;

const DURATIONS = [15, 30, 45, 60, 90, 120];

// Three wrong PINs lock PIN entry for an hour (safety.verify_pin).
const MAX_PIN_TRIES = 3;
const pinStatusOf = (data) =>
  data && "pin_attempts_left" in data
    ? { attemptsLeft: data.pin_attempts_left, lockedUntil: data.pin_locked_until }
    : null;
const clockOf = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function DurationChips({ minutes, onPick }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {DURATIONS.map((m) => (
        <button key={m} type="button" onClick={() => onPick(m)} style={{
          padding: "8px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "14px",
          border: `1px solid ${minutes === m ? ACCENT : "var(--hoh-line-dddddd)"}`,
          background: minutes === m ? ACCENT : "var(--hoh-bg-ffffff)",
          color: minutes === m ? "#fff" : "var(--hoh-text-333333)",
        }}>
          {minutesLabel(m)}
        </button>
      ))}
    </div>
  );
}

function minutesLabel(m) {
  if (m < 60) return `${m} min`;
  return m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`;
}

// Best effort: the start point helps contacts, but a journey never waits on it.
function currentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  });
}

export default function SafetyCompanionPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [hasPin, setHasPin] = useState(false);
  const [hasContacts, setHasContacts] = useState(true);
  const [pinPrompt, setPinPrompt] = useState(null); // { title, onPin }
  const [pinStatus, setPinStatus] = useState({ attemptsLeft: MAX_PIN_TRIES, lockedUntil: null });
  const notePinStatus = (data) => {
    const next = pinStatusOf(data);
    if (next) setPinStatus(next);
  };

  const load = useCallback(async () => {
    try {
      const res = await apiService.getSafetySession();
      setSession(res.data.session);
      setHasPin(res.data.has_pin);
      setHasContacts(res.data.has_contacts);
      const status = pinStatusOf(res.data);
      if (status) setPinStatus(status);
    } catch (err) {
      toast.error(errorOf(err, "Could not load Safety Companion."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const askPin = (title) =>
    new Promise((resolve) => setPinPrompt({ title, onPin: resolve }));

  if (loading) {
    return <p style={{ padding: "120px 20px", textAlign: "center", color: "var(--hoh-text-6b7280)" }}>Loading…</p>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--hoh-bg-fcf0f0)" }} className="pt-24 pb-16">
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 16px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--hoh-text-0f1b3e)", marginBottom: "6px" }}>
          Safety Companion
        </h1>
        <p style={{ ...hint, fontSize: "14.5px", marginBottom: "18px" }}>
          Let your people know if you don&apos;t get where you&apos;re going. Nobody is told
          anything unless you don&apos;t check in.
        </p>

        {!hasContacts && (
          <div style={{ ...card, background: "var(--hoh-bg-fff3e0)", border: "1px solid var(--hoh-line-ffd8a8)" }}>
            None of your contacts receive Safety Companion alerts yet. Edit a contact and tick
            <strong> Safety Companion</strong> first.
          </div>
        )}

        {!hasPin ? (
          <PinSetup onDone={() => setHasPin(true)} />
        ) : session ? (
          <ActiveJourney session={session} askPin={askPin} onChange={load} onPinStatus={notePinStatus} />
        ) : (
          <StartJourney onStarted={setSession} />
        )}

        <DailyCheckIn />

        <div style={card}>
          <p style={{ fontWeight: 800, fontSize: "16px", marginBottom: "6px" }}>Panic button</p>
          <p style={hint}>
            In the Help OO Help mobile app you can raise a panic alert without opening it: hold
            Volume Down for 5 seconds (Android), or press and hold the app icon and tap
            &ldquo;Panic alert&rdquo;. It also records evidence if you use your duress PIN.
          </p>
        </div>

        {hasPin && !session && (
          <PinSetup compact onPinStatus={notePinStatus}
            onDone={() => toast.success("PINs updated. We've sent a text to your phone number to confirm.")} />
        )}
      </div>

      {pinPrompt && (
        <PinPrompt
          title={pinPrompt.title}
          status={pinStatus}
          onClose={(pin) => {
            pinPrompt.onPin(pin);
            setPinPrompt(null);
          }}
        />
      )}
    </div>
  );
}

// First time (not compact): both PINs. Compact is "change": the current
// Safety PIN, then a new Safety PIN, a new duress PIN, or both (blank keeps
// it). "Forgot PIN" needs the fingerprint, so it's only in the mobile app.
function PinSetup({ onDone, onPinStatus, compact = false }) {
  const [open, setOpen] = useState(!compact);
  const [current, setCurrent] = useState("");
  const [pin, setPin] = useState("");
  const [pinAgain, setPinAgain] = useState("");
  const [duress, setDuress] = useState("");
  const [duressAgain, setDuressAgain] = useState("");
  const [saving, setSaving] = useState(false);
  const [forgot, setForgot] = useState(false);

  const valid = (v) => /^\d{4,6}$/.test(v);
  const okOrBlank = (v) => (compact && v === "") || valid(v);
  const problem =
    compact && !valid(current) ? "Enter your current Safety PIN."
      : compact && !pin && !duress ? "Enter a new Safety PIN, a new duress PIN, or both."
        : !okOrBlank(pin) || !okOrBlank(duress) ? "PINs must be 4 to 6 digits."
          : pin !== pinAgain || duress !== duressAgain ? "The PINs you typed twice don't match."
            : pin && pin === duress ? "Your Safety PIN and duress PIN must be different."
              : null;

  const reset = () => {
    [setCurrent, setPin, setPinAgain, setDuress, setDuressAgain].forEach((set) => set(""));
    setForgot(false);
  };

  const save = async (e) => {
    e.preventDefault();
    if (problem) return toast.error(problem);
    setSaving(true);
    try {
      await apiService.setSafetyPins(compact
        ? { currentPin: current, pin: pin || undefined, duressPin: duress || undefined }
        : { pin, duressPin: duress });
      onPinStatus?.({ pin_attempts_left: MAX_PIN_TRIES, pin_locked_until: null });
      onDone();
      if (compact) {
        reset();
        setOpen(false);
      }
    } catch (err) {
      onPinStatus?.(err?.response?.data);
      toast.error(errorOf(err));
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={{ ...secondary, width: "100%", background: "transparent" }}>
        Change my Safety PIN or duress PIN
      </button>
    );
  }

  const pinField = (value, set, placeholder) => (
    <input type="password" inputMode="numeric" maxLength={6} value={value}
      onChange={(e) => set(e.target.value.replace(/\D/g, ""))} placeholder={placeholder}
      style={{ ...input, marginBottom: "8px" }} />
  );
  const fresh = compact ? "New " : "";

  return (
    <form onSubmit={save} style={card}>
      <p style={{ fontWeight: 800, fontSize: "16px", marginBottom: "6px" }}>
        {compact ? "Change your PINs" : "Set your Safety PINs"}
      </p>
      {compact ? (
        <>
          <p style={hint}>
            Change just one PIN or both. Leave a PIN blank to keep it. We&apos;ll send a text to
            your phone number to let you know.
          </p>
          <label style={label}>Current Safety PIN</label>
          {pinField(current, setCurrent, "4–6 digits")}
          <button type="button" onClick={() => setForgot(!forgot)}
            style={{ background: "none", border: "none", color: ACCENT, cursor: "pointer", padding: 0, fontSize: "13px", fontWeight: 600 }}>
            Forgot PIN?
          </button>
          {forgot && (
            <p style={{ ...hint, marginTop: "6px" }}>
              Open the Help OO Help mobile app and go to Safety Companion › Change my Safety PIN
              or duress PIN › Forgot PIN?. You&apos;ll confirm it&apos;s you with your fingerprint.
            </p>
          )}
        </>
      ) : (
        <>
          <p style={hint}>
            Your <strong>Safety PIN</strong> confirms you&apos;ve arrived or adds more time.
          </p>
          <p style={{ ...hint, marginTop: "6px" }}>
            Your <strong>duress PIN</strong> is for when someone forces you to say you&apos;ve
            arrived. It looks exactly like a normal check-in on screen, but silently alerts your
            contacts with your location.
          </p>
        </>
      )}
      <label style={label}>{fresh}Safety PIN</label>
      {pinField(pin, setPin, compact ? "Leave blank to keep" : "4–6 digits")}
      {pinField(pinAgain, setPinAgain, "Again")}
      <label style={label}>{fresh}Duress PIN</label>
      {pinField(duress, setDuress, compact ? "Leave blank to keep" : "4–6 digits, different")}
      {pinField(duressAgain, setDuressAgain, "Again")}
      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        {compact && (
          <button type="button" style={secondary} onClick={() => { reset(); setOpen(false); }}>Back</button>
        )}
        <button type="submit" disabled={saving} style={{ ...primary(), flex: 1, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Save PINs"}
        </button>
      </div>
    </form>
  );
}

function StartJourney({ onStarted }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [visitingName, setVisitingName] = useState("");
  const [visitingPhone, setVisitingPhone] = useState("");
  const [note, setNote] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [walking, setWalking] = useState(false);
  const [starting, setStarting] = useState(false);

  const start = async (e) => {
    e.preventDefault();
    if (!to.trim()) return toast.error("Where are you going?");
    setStarting(true);
    try {
      const position = await currentPosition();
      const res = await apiService.startSafetySession({
        minutes,
        start_location: position,
        start_label: from.trim(),
        destination: to.trim(),
        note: note.trim(),
        visiting_name: visitingName.trim(),
        visiting_phone: visitingPhone.trim(),
        vehicle_details: walking ? "" : vehicle.trim(),
        live_sharing: false,
      });
      onStarted(res.data.session);
      toast.success("Journey started. Safe travels.");
    } catch (err) {
      toast.error(errorOf(err));
    } finally {
      setStarting(false);
    }
  };

  return (
    <form onSubmit={start} style={card}>
      <p style={{ fontWeight: 800, fontSize: "16px" }}>Start a journey</p>
      <p style={hint}>A trotro, taxi or ride, a visit, or walking home.</p>

      <label style={label}>How are you travelling?</label>
      <div style={{ display: "flex", gap: "8px" }}>
        {[[false, "Vehicle"], [true, "Walking"]].map(([value, text]) => (
          <button key={text} type="button" onClick={() => setWalking(value)} style={{
            ...secondary,
            background: walking === value ? ACCENT : "var(--hoh-bg-ffffff)",
            color: walking === value ? "#fff" : ACCENT,
          }}>
            {text}
          </button>
        ))}
      </div>

      <label style={label}>From</label>
      <input style={input} value={from} onChange={(e) => setFrom(e.target.value)}
        placeholder="e.g. Kaneshie Market (optional)" />
      <label style={label}>Going to</label>
      <input style={input} value={to} onChange={(e) => setTo(e.target.value)}
        placeholder="e.g. Ama's house, Madina Zongo Junction" />

      <label style={label}>How long will it take?</label>
      <p style={{ ...hint, marginBottom: "8px" }}>
        If you haven&apos;t confirmed you&apos;ve arrived by then, your Safety Companion
        contacts are alerted 90 seconds later.
      </p>
      <DurationChips minutes={minutes} onPick={setMinutes} />

      <label style={label}>Who are you visiting? <span style={hint}>(optional)</span></label>
      <input style={{ ...input, marginBottom: "8px" }} value={visitingName}
        onChange={(e) => setVisitingName(e.target.value)} placeholder="Name" />
      <input style={input} type="tel" value={visitingPhone}
        onChange={(e) => setVisitingPhone(e.target.value)} placeholder="Their phone number" />

      <label style={label}>Message for your contacts <span style={hint}>(optional)</span></label>
      <textarea style={{ ...input, minHeight: "80px" }} maxLength={500} value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. I am visiting Kojo at his house near the Madina market." />

      {!walking && (
        <>
          <label style={label}>Vehicle details <span style={hint}>(optional)</span></label>
          <input style={input} value={vehicle} onChange={(e) => setVehicle(e.target.value)}
            placeholder="e.g. Trotro GR 1234-22, white Sprinter" />
        </>
      )}

      <p style={{ ...hint, marginTop: "12px" }}>
        Only shared with your contacts if you don&apos;t arrive. To share your location the
        whole way, start the journey in the mobile app.
      </p>
      <button type="submit" disabled={starting} style={{ ...primary(), marginTop: "14px", opacity: starting ? 0.6 : 1 }}>
        {starting ? "Starting…" : "Start journey"}
      </button>
    </form>
  );
}

function ActiveJourney({ session, askPin, onChange, onPinStatus }) {
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [shownDeadline, setShownDeadline] = useState(session.deadline);
  // After a change of plans — including the made-up one shown after the
  // duress PIN, which the server never really applied.
  const [shownDestination, setShownDestination] = useState(session.destination);
  const [changing, setChanging] = useState(false);
  const [newTo, setNewTo] = useState("");
  const [newMinutes, setNewMinutes] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => setShownDeadline(session.deadline), [session.deadline]);
  useEffect(() => setShownDestination(session.destination), [session.destination]);

  const alerted = session.status === "alerted";
  const left = new Date(shownDeadline).getTime() - now;
  const overdue = left < 0;
  const color = alerted || overdue ? "#B71C1C" : "#1A9E5C";
  const abs = Math.abs(left);
  const h = Math.floor(abs / 3600000), m = Math.floor(abs / 60000) % 60, s = Math.floor(abs / 1000) % 60;
  const countdown = h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m ${String(s).padStart(2, "0")}s`;

  const run = async (action, title, data = {}) => {
    const pin = await askPin(title);
    if (!pin) return;
    setBusy(true);
    try {
      const res = await apiService.safetySessionAction(session.id, action, { pin, ...data });
      // Accepted (the duress PIN too): the count of wrong tries starts again.
      onPinStatus({ pin_attempts_left: MAX_PIN_TRIES, pin_locked_until: null });
      if (action === "extend") {
        setShownDeadline(res.data.deadline);
        toast.success(`Added ${data.minutes} minutes.`);
        if (!res.data.capture) onChange();
      } else if (action === "change") {
        setShownDeadline(res.data.deadline);
        setShownDestination(data.destination);
        setChanging(false);
        setNewTo("");
        toast.success("Plans updated.");
        if (!res.data.capture) onChange();
      } else {
        toast.success(action === "cancel" ? "Journey cancelled." : "Glad you made it.");
        onChange();
      }
    } catch (err) {
      onPinStatus(err?.response?.data);
      toast.error(errorOf(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ ...card, border: `2px solid ${color}` }}>
      <p style={{ color, fontWeight: 800, fontSize: "16px", marginBottom: "10px" }}>
        {alerted ? "Your contacts have been alerted" : overdue ? "Have you arrived?" : "Journey in progress"}
      </p>
      {shownDestination && <p style={{ fontSize: "18px", fontWeight: 700 }}>To {shownDestination}</p>}
      {session.visiting_name && <p style={hint}>Visiting {session.visiting_name}</p>}
      {session.plan_changed_at && (
        <p style={hint}>
          Plans changed{session.original_destination ? ` (first going to ${session.original_destination})` : ""}
        </p>
      )}
      {alerted ? (
        <p style={{ margin: "12px 0" }}>
          They&apos;ve been told you haven&apos;t arrived. If you&apos;re safe, let them know now.
        </p>
      ) : (
        <p style={{ fontSize: "30px", fontWeight: 800, color, margin: "12px 0" }}>
          {overdue ? `Overdue by ${countdown}` : `${countdown} left`}
        </p>
      )}
      <button type="button" disabled={busy} onClick={() => run("arrive", "I've arrived safely")}
        style={{ ...primary("#1A9E5C"), opacity: busy ? 0.6 : 1 }}>
        I&apos;ve arrived
      </button>
      {!alerted && (
        <>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            {[15, 30].map((mins) => (
              <button key={mins} type="button" disabled={busy} style={secondary}
                onClick={() => run("extend", `Add ${mins} minutes`, { minutes: mins })}>
                +{mins} min
              </button>
            ))}
          </div>
          {changing ? (
            <div style={{ marginTop: "14px" }}>
              <p style={hint}>
                If you don&apos;t arrive, your contacts will see both your first plan and this one.
              </p>
              <label style={label}>Where are you going now?</label>
              <input style={input} value={newTo} onChange={(e) => setNewTo(e.target.value)}
                placeholder="e.g. Back home, Adenta" />
              <label style={label}>How long will it take from here?</label>
              <DurationChips minutes={newMinutes} onPick={setNewMinutes} />
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button type="button" style={secondary} onClick={() => setChanging(false)}>Back</button>
                <button type="button" disabled={busy || !newTo.trim()}
                  style={{ ...primary(), flex: 1, opacity: busy || !newTo.trim() ? 0.6 : 1 }}
                  onClick={() => run("change", "Change plans", { destination: newTo.trim(), minutes: newMinutes })}>
                  Update journey
                </button>
              </div>
            </div>
          ) : (
            <button type="button" disabled={busy} style={{ ...secondary, width: "100%", marginTop: "8px" }}
              onClick={() => setChanging(true)}>
              Change plans
            </button>
          )}
          <button type="button" disabled={busy} onClick={() => run("cancel", "Cancel this journey")}
            style={{ marginTop: "10px", width: "100%", background: "none", border: "none", color: "var(--hoh-text-6b7280)", cursor: "pointer" }}>
            Cancel journey
          </button>
        </>
      )}
    </div>
  );
}

// Looks the same whichever PIN is typed — the server tells them apart. It
// only shows the server's count of wrong tries, so the last one is warned.
function PinPrompt({ title, status, onClose }) {
  const [pin, setPin] = useState("");
  const locked = status?.lockedUntil && new Date(status.lockedUntil) > new Date();
  const left = status?.attemptsLeft ?? MAX_PIN_TRIES;
  const warning = locked
    ? `Too many wrong PINs. PIN entry is locked until ${clockOf(status.lockedUntil)}.`
    : left === 1 ? "Last try. A wrong PIN now locks PIN entry for an hour."
      : left < MAX_PIN_TRIES ? `${left} tries left. After 3 wrong PINs, PIN entry is locked for an hour.`
        : null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
    }}>
      <form onSubmit={(e) => { e.preventDefault(); if (pin.length >= 4) onClose(pin); }}
        style={{ ...card, width: "100%", maxWidth: "360px", marginBottom: 0 }}>
        <p style={{ fontWeight: 800, fontSize: "17px", textAlign: "center" }}>{title}</p>
        <p style={{ ...hint, textAlign: "center", marginBottom: "14px" }}>Enter your Safety PIN</p>
        {warning && (
          <p role="alert" style={{
            background: "var(--hoh-bg-fff3e0)", border: "1px solid var(--hoh-line-ffd8a8)",
            color: "var(--hoh-text-b45309)", borderRadius: "10px", padding: "10px", fontSize: "13px",
            marginBottom: "12px",
          }}>
            {warning}
          </p>
        )}
        <input autoFocus type="password" inputMode="numeric" maxLength={6} value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          style={{ ...input, textAlign: "center", fontSize: "26px", letterSpacing: "10px" }} />
        <button type="submit" disabled={pin.length < 4} style={{ ...primary(), marginTop: "14px", opacity: pin.length < 4 ? 0.5 : 1 }}>
          Confirm
        </button>
        <button type="button" onClick={() => onClose(null)}
          style={{ marginTop: "8px", width: "100%", background: "none", border: "none", color: "var(--hoh-text-6b7280)", cursor: "pointer" }}>
          Back
        </button>
      </form>
    </div>
  );
}

function DailyCheckIn() {
  const [checkIn, setCheckIn] = useState(null);
  const [time, setTime] = useState("10:00");
  const [busy, setBusy] = useState(false);
  // Opt-in: turning it on first shows what it does.
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    apiService.getDailyCheckIn()
      .then((res) => {
        setCheckIn(res.data.check_in);
        if (res.data.check_in) setTime(res.data.check_in.check_by);
      })
      .catch(() => {});
  }, []);

  const save = async (enabled, checkBy = time) => {
    setBusy(true);
    try {
      const res = await apiService.saveDailyCheckIn({ enabled, check_by: checkBy, timezone: "Africa/Accra" });
      setCheckIn(res.data.check_in);
      setTime(checkBy);
    } catch (err) {
      toast.error(errorOf(err));
    } finally {
      setBusy(false);
    }
  };

  const imFine = async () => {
    setBusy(true);
    try {
      const res = await apiService.confirmDailyCheckIn({ location: await currentPosition() });
      setCheckIn(res.data.check_in);
      toast.success("Checked in. Have a good day.");
    } catch (err) {
      toast.error(errorOf(err));
    } finally {
      setBusy(false);
    }
  };

  const skip = async (undo = false) => {
    if (!undo && !window.confirm(
      "Skip today? You won't get a reminder today, and your contacts won't be told if you " +
      "don't check in. Your daily check-in starts again tomorrow.")) return;
    setBusy(true);
    try {
      const res = await apiService.skipDailyCheckIn(undo);
      setCheckIn(res.data.check_in);
    } catch (err) {
      toast.error(errorOf(err));
    } finally {
      setBusy(false);
    }
  };

  const enabled = checkIn?.enabled;
  const done = checkIn?.checked_in_today;
  const skipped = checkIn?.skipped_today;
  const link = { background: "none", border: "none", color: ACCENT, cursor: "pointer", fontWeight: 600, fontSize: "14px" };

  return (
    <div style={card}>
      <p style={{ fontWeight: 800, fontSize: "16px" }}>Daily check-in</p>
      <p style={hint}>
        Tap &ldquo;I&apos;m fine&rdquo; once a day before your chosen time. Miss it, and your
        Safety Companion contacts are asked to call or visit you. Ideal for parents living alone.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "14px", flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
          <input type="checkbox" checked={Boolean(enabled)} disabled={busy}
            onChange={(e) => (e.target.checked ? setExplaining(true) : save(false))} />
          On
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          Check in by
          {/* Saved only once it's on; before that it's kept for turning on. */}
          <input type="time" value={time} disabled={busy}
            onChange={(e) => e.target.value && (enabled ? save(true, e.target.value) : setTime(e.target.value))}
            style={{ ...input, width: "auto", padding: "8px 10px" }} />
        </label>
      </div>
      {explaining && !enabled && (
        <div style={{ marginTop: "14px", padding: "14px", borderRadius: "14px", background: "var(--hoh-bg-fafafa)", border: "1px solid var(--hoh-line-dddddd)" }}>
          <p style={{ fontWeight: 700, marginBottom: "6px" }}>Turn on daily check-in?</p>
          <p style={hint}>
            Once a day, before {time}, you tap &ldquo;I&apos;m fine&rdquo;. You&apos;ll get a
            reminder 30 minutes before. If you don&apos;t tap it in time, your Safety Companion
            contacts get a message asking them to call or visit you.
          </p>
          <p style={{ ...hint, marginTop: "6px" }}>
            Turning it on counts as today&apos;s check-in, so it starts from tomorrow. You can skip
            a day, change the time, or turn it off whenever you like.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button type="button" style={secondary} onClick={() => setExplaining(false)}>Not now</button>
            <button type="button" disabled={busy} style={{ ...primary("#1A9E5C"), flex: 1 }}
              onClick={async () => { await save(true); setExplaining(false); }}>
              Turn on
            </button>
          </div>
        </div>
      )}
      {enabled && (
        <>
          <button type="button" disabled={busy || done} onClick={imFine}
            style={{ ...primary(done ? "#9CA3AF" : "#1A9E5C"), marginTop: "16px", padding: "20px", fontSize: "20px" }}>
            {done ? "Checked in today" : "I'm fine"}
          </button>
          {skipped ? (
            <p style={{ ...hint, textAlign: "center", marginTop: "10px" }}>
              Skipped today. It starts again tomorrow.{" "}
              <button type="button" disabled={busy} style={link} onClick={() => skip(true)}>Undo</button>
            </p>
          ) : !done && (
            <p style={{ textAlign: "center", marginTop: "8px" }}>
              <button type="button" disabled={busy} style={link} onClick={() => skip()}>Skip today</button>
            </p>
          )}
        </>
      )}
    </div>
  );
}
