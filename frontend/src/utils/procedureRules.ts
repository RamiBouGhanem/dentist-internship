export interface Procedure {
  type: string;
  color?: string;
  createdAt?: string;           // present when COMPLETED (added on chart)
  notes?: string;

  // The following fields may exist on your objects even if not typed elsewhere:
  status?: "planned" | "completed"; // planned when added from table
  plannedAt?: string;               // present when PLANNED (from table)
}

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

/** Treat both extraction labels uniformly in the rules */
const EXTRACTION_SET = new Set(["Extraction", "Simple Extraction", "Surgical Extraction"]);

const SINGLE_INSTANCE = [
  "Endo",
  "Pulpotomy",
  "Sealant",
  "Ortho Band",
  "Bridge",
  "Veneer",
  "Crown (Zirconia)",
  "CCM",
  "Temporary",
  "Inlay",
  "Onlay",
];

const MAJOR_RESTORATIONS = [
  "Crown (Zirconia)",
  "Bridge",
  "Veneer",
  "Inlay",
  "Onlay",
  "CCM",
  "Temporary",
];

const RESTORATIONS = ["Filling", ...MAJOR_RESTORATIONS];

const ALLOWED_AFTER_IMPLANT = [
  "Crown (Zirconia)",
  "CCM",
  "Temporary",
  "Bridge",
  "Missing", // if implant fails
];

// ❌ Procedures not allowed on milk teeth
const NOT_ALLOWED_ON_CHILD = [
  "Implant",
  "Bridge",
  "Crown (Zirconia)",
  "CCM",
  "Temporary",
  "Inlay",
  "Onlay",
];

/* --------------------------- helpers -------------------------------- */

/** Only treat items with createdAt or explicit completed status as completed. */
function isCompleted(p: Procedure): boolean {
  return !!p.createdAt || p.status === "completed";
}

/** Ignore planned procedures entirely in rule checks. */
function completedOnly(existing: Procedure[]): Procedure[] {
  return existing.filter(isCompleted);
}

/** True if any extraction variant exists in completed set */
function hasExtraction(existingCompleted: Procedure[]): boolean {
  return existingCompleted.some((p) => EXTRACTION_SET.has(p.type));
}

/** Normalize type for set lookups where needed */
function includesType(arr: Procedure[], type: string): boolean {
  if (EXTRACTION_SET.has(type)) {
    return arr.some((p) => EXTRACTION_SET.has(p.type));
  }
  return arr.some((p) => p.type === type);
}

/* ----------------------------- validator ----------------------------- */

export const validateProcedure = (
  existing: Procedure[],
  incoming: Procedure,
  dentitionType?: "child" | "mixed" | "adult",
  toothNumber?: number
): ValidationResult => {
  // ✅ Only consider COMPLETED procedures for rule logic.
  const existingCompleted = completedOnly(existing);
  const existingTypes = existingCompleted.map((p) => p.type);

  const isMilkTooth = typeof toothNumber === "number" && toothNumber >= 51 && toothNumber <= 85;

  /**
   * RULE: Milk teeth restrictions (for child & mixed) — still applies regardless of planned/completed.
   */
  if ((dentitionType === "child" || dentitionType === "mixed") && isMilkTooth) {
    if (NOT_ALLOWED_ON_CHILD.includes(incoming.type)) {
      return {
        allowed: false,
        reason: `"${incoming.type}" cannot be done on primary (milk) teeth.`,
      };
    }
  }

  if (existingCompleted.length === 0) return { allowed: true };

  /**
   * RULE: After Missing
   */
  if (includesType(existingCompleted, "Missing") && !includesType(existingCompleted, "Implant")) {
    if (incoming.type === "Implant") {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: "This tooth is missing. You can only place an implant to replace it.",
    };
  }

  /**
   * RULE: Implant
   */
  if (incoming.type === "Implant") {
    if (includesType(existingCompleted, "Missing") || hasExtraction(existingCompleted)) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason:
        "You can only place an implant after the tooth is marked as Missing or Extracted.",
    };
  }

  /**
   * RULE: After Implant
   */
  if (includesType(existingCompleted, "Implant")) {
    if (ALLOWED_AFTER_IMPLANT.includes(incoming.type)) {
      return { allowed: true };
    }
    if (EXTRACTION_SET.has(incoming.type)) {
      return {
        allowed: false,
        reason: "You cannot extract an implant. If it fails, mark it as Missing.",
      };
    }
    return {
      allowed: false,
      reason: `After an implant, you can only add: ${ALLOWED_AFTER_IMPLANT.join(", ")}.`,
    };
  }

  /**
   * RULE: Extraction (both simple/surgical)
   */
  if (EXTRACTION_SET.has(incoming.type)) {
    return { allowed: true };
  }

  /**
   * RULE: After Extraction
   */
  if (hasExtraction(existingCompleted)) {
    return {
      allowed: false,
      reason:
        "This tooth has been extracted. You cannot perform procedures on it (except Implant).",
    };
  }

  /**
   * Single-instance procedures cannot be repeated (only counts completed ones)
   */
  if (SINGLE_INSTANCE.includes(incoming.type) && includesType(existingCompleted, incoming.type)) {
    return {
      allowed: false,
      reason: `${incoming.type} can only be performed once on a tooth.`,
    };
  }

  /**
   * Major restorations cannot overlap (except Temporary → Final), only among completed ones
   */
  if (MAJOR_RESTORATIONS.includes(incoming.type)) {
    const existingMajor = existingCompleted.find((p) => MAJOR_RESTORATIONS.includes(p.type));
    if (existingMajor) {
      if (existingMajor.type === "Temporary" && incoming.type !== "Temporary") {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: `A major restoration (${existingMajor.type}) already exists. Remove it before adding ${incoming.type}.`,
      };
    }
  }

  /**
   * Invalid combinations — evaluate against completed items only
   */
  for (const proc of existingCompleted) {
    if (
      (proc.type === "Endo" && incoming.type === "Pulpotomy") ||
      (proc.type === "Pulpotomy" && incoming.type === "Endo")
    ) {
      return {
        allowed: false,
        reason: `You cannot perform ${incoming.type} because ${proc.type} has already been done.`,
      };
    }

    if (
      (proc.type === "Sealant" && RESTORATIONS.includes(incoming.type)) ||
      (incoming.type === "Sealant" && RESTORATIONS.includes(proc.type))
    ) {
      return {
        allowed: false,
        reason: `Sealants cannot be combined with restorations like ${proc.type}.`,
      };
    }

    if (
      (proc.type === "Filling" &&
        ["Inlay", "Onlay", "Crown (Zirconia)", "Veneer"].includes(incoming.type)) ||
      (incoming.type === "Filling" &&
        ["Inlay", "Onlay", "Crown (Zirconia)", "Veneer"].includes(proc.type))
    ) {
      return {
        allowed: false,
        reason: `You cannot combine ${incoming.type} with ${proc.type}. Choose one treatment.`,
      };
    }

    if (
      (proc.type === "Ortho Band" && MAJOR_RESTORATIONS.includes(incoming.type)) ||
      (incoming.type === "Ortho Band" && MAJOR_RESTORATIONS.includes(proc.type))
    ) {
      return {
        allowed: false,
        reason: `Ortho bands cannot be placed with major restorations like ${proc.type}.`,
      };
    }
  }

  return { allowed: true };
};
