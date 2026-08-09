import allCountries from "@/app/countries.json";

export const countryOptions = allCountries.map((c) => {
  const isoCode = (c.iso2 || c.code || "").toLowerCase().replace(/[^a-z]/g, "");
  return {
    name: c.name,
    code: c.dial_code,
    flag: isoCode ? `https://flagcdn.com/w20/${isoCode}.png` : "",
    iso: isoCode,
  };
});

export const DEFAULT_COUNTRY =
  countryOptions.find((c) => c.iso === "gh") || countryOptions[0];

export function findCountryByDialCode(dialCode) {
  const digits = String(dialCode || "").replace(/\D/g, "");
  if (!digits) return null;
  return countryOptions.find((c) => c.code === `+${digits}`) || null;
}

/**
 * Turns any raw entry into an E.164-ready national number.
 *   "0244123456"    -> "244123456"
 *   "024 412 3456"  -> "244123456"
 *   "+233244123456" -> "244123456"   (when dialCode is "+233")
 */
export function sanitizePhoneInput(input = "", dialCode = "") {
  const trimmed = String(input).trim();

  // Only treat as international when explicitly marked — a local Ghanaian
  // number may legitimately start with 233.
  const isInternational = trimmed.startsWith("+") || trimmed.startsWith("00");

  let digits = trimmed.replace(/\D/g, "");

  if (isInternational) {
    digits = digits.replace(/^00/, "");
    const cc = String(dialCode).replace(/\D/g, "");
    if (cc && digits.length > cc.length && digits.startsWith(cc)) {
      digits = digits.slice(cc.length);
    }
  }

  // Trunk prefix — never part of an E.164 national significant number.
  return digits.replace(/^0+/, "").slice(0, 15);
}

/** Splits a stored number back into { country, dialCode, national } for editing/display. */
export function splitPhone(raw = "", countryCode = "") {
  let value = String(raw).trim();
  if (value.startsWith("00")) value = `+${value.slice(2)}`;
  const isInternational = value.startsWith("+");

  let digits = value.replace(/\D/g, "");
  let country = findCountryByDialCode(countryCode);
  let dial = country?.code || "";

  if (isInternational) {
    const cc = dial.replace(/\D/g, "");
    if (cc && digits.startsWith(cc)) {
      digits = digits.slice(cc.length);
    } else {
      const sorted = [...countryOptions].sort((a, b) => b.code.length - a.code.length);
      const match = sorted.find((c) => {
        const d = c.code.replace(/\D/g, "");
        return d && digits.length > d.length && digits.startsWith(d);
      });
      if (match) {
        country = match;
        dial = match.code;
        digits = digits.slice(match.code.replace(/\D/g, "").length);
      }
    }
  }

  return {
    country,
    dialCode: dial,
    national: digits.replace(/^0+/, ""),
  };
}