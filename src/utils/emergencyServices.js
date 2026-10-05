// Ghana's national emergency services — shown on /emergencylines
// (components/moreAction/settings.jsx) and offered as a direct call when an
// alert can't be sent (components/Cards/AlertFailedModal.jsx). Mirrors
// helpflutter's AppConstants.nationalEmergencies.
export const EMERGENCY_SERVICES = [
  { name: "Ghana Police Service", contacts: ["191", "18555", "+233302773906"] },
  { name: "Ghana Fire Service", contacts: ["192", "+233302772446", "+233299340383"] },
  { name: "National Ambulance Service", contacts: ["193", "+233501614877", "+233505982870"] },
  { name: "NADMO", contacts: ["112", "+233299350030", "+233302964884"] },
  { name: "Electricity Company of Ghana", contacts: ["+233302676727", "+233302611611", "+233302676728"] },
];

// Alert card (its first word, as sent as alertType) -> service to call when
// that alert fails outright.
const SITUATION_SERVICE = {
  robbery: "Ghana Police Service",
  violence: "Ghana Police Service",
  call: "Ghana Police Service",
  fire: "Ghana Fire Service",
  health: "National Ambulance Service",
  accident: "National Ambulance Service",
  flood: "NADMO",
};

export function serviceForSituation(situation) {
  const key = String(situation ?? "").trim().split(/\s+/)[0].toLowerCase();
  const name = SITUATION_SERVICE[key] ?? "Ghana Police Service";
  return EMERGENCY_SERVICES.find((s) => s.name === name);
}
