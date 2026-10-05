import { describe, it, expect } from "vitest";
import { EMERGENCY_SERVICES, serviceForSituation } from "./emergencyServices";

describe("serviceForSituation", () => {
  const name = (situation) => serviceForSituation(situation).name;

  it("routes each alert card to the right national service", () => {
    expect(name("Robbery")).toBe("Ghana Police Service");
    expect(name("Call")).toBe("Ghana Police Service");
    expect(name("Fire")).toBe("Ghana Fire Service");
    expect(name("Health")).toBe("National Ambulance Service");
    expect(name("Accident")).toBe("National Ambulance Service");
    expect(name("Flood")).toBe("NADMO");
  });

  it("accepts full situation labels in any case", () => {
    expect(name("fire outbreak")).toBe("Ghana Fire Service");
    expect(name("Call Emergency")).toBe("Ghana Police Service");
  });

  it("falls back to the police for anything unknown", () => {
    expect(name("Something else")).toBe("Ghana Police Service");
    expect(name(undefined)).toBe("Ghana Police Service");
  });

  it("only lists dialable numbers (no 0 after +233)", () => {
    for (const service of EMERGENCY_SERVICES) {
      for (const number of service.contacts) {
        expect(number).not.toMatch(/^\+2330/);
      }
    }
  });
});
