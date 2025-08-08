// export interface Procedure {
//   type: string;
//   color?: string;
//   createdAt?: string;
//   notes?: string;
// }

// export interface ValidationResult {
//   allowed: boolean;
//   reason?: string;
// }

// const SINGLE_INSTANCE = [
//   "Endo",
//   "Pulpotomy",
//   "Sealant",
//   "Ortho Band",
//   "Bridge",
//   "Veneer",
//   "Crown (Zirconia)",
//   "CCM",
//   "Temporary",
//   "Inlay",
//   "Onlay",
// ];

// const MAJOR_RESTORATIONS = [
//   "Crown (Zirconia)",
//   "Bridge",
//   "Veneer",
//   "Inlay",
//   "Onlay",
//   "CCM",
//   "Temporary",
// ];

// const RESTORATIONS = ["Filling", ...MAJOR_RESTORATIONS];

// const ALLOWED_AFTER_IMPLANT = [
//   "Crown (Zirconia)",
//   "CCM",
//   "Temporary",
//   "Bridge",
//   "Missing", // if implant fails
// ];

// // ❌ Procedures not allowed on milk teeth
// const NOT_ALLOWED_ON_CHILD = [
//   "Implant",
//   "Bridge",
//   "Crown (Zirconia)",
//   "CCM",
//   "Temporary",
//   "Inlay",
//   "Onlay",
// ];

// export const validateProcedure = (
//   existing: Procedure[],
//   incoming: Procedure,
//   dentitionType?: "child" | "mixed" | "adult",
//   toothNumber?: number
// ): ValidationResult => {
//   const existingTypes = existing.map((p) => p.type);
//   const isMilkTooth = toothNumber && toothNumber >= 51 && toothNumber <= 85;

//   /**
//    * RULE: Milk teeth restrictions (for child & mixed)
//    */
//   if ((dentitionType === "child" || dentitionType === "mixed") && isMilkTooth) {
//     if (NOT_ALLOWED_ON_CHILD.includes(incoming.type)) {
//       return {
//         allowed: false,
//         reason: `"${incoming.type}" cannot be done on primary (milk) teeth.`,
//       };
//     }
//   }

//   if (existing.length === 0) return { allowed: true };

//   /**
//    * RULE: After Missing
//    */
//   if (existingTypes.includes("Missing") && !existingTypes.includes("Implant")) {
//     if (incoming.type === "Implant") {
//       return { allowed: true };
//     }
//     return {
//       allowed: false,
//       reason: "This tooth is missing. You can only place an implant to replace it.",
//     };
//   }

//   /**
//    * RULE: Implant
//    */
//   if (incoming.type === "Implant") {
//     if (existingTypes.includes("Missing") || existingTypes.includes("Extraction")) {
//       return { allowed: true };
//     }
//     return {
//       allowed: false,
//       reason:
//         "You can only place an implant after the tooth is marked as Missing or Extracted.",
//     };
//   }

//   /**
//    * RULE: After Implant
//    */
//   if (existingTypes.includes("Implant")) {
//     if (ALLOWED_AFTER_IMPLANT.includes(incoming.type)) {
//       return { allowed: true };
//     }
//     if (incoming.type === "Extraction") {
//       return {
//         allowed: false,
//         reason: "You cannot extract an implant. If it fails, mark it as Missing.",
//       };
//     }
//     return {
//       allowed: false,
//       reason: `After an implant, you can only add: ${ALLOWED_AFTER_IMPLANT.join(", ")}.`,
//     };
//   }

//   /**
//    * RULE: Extraction
//    */
//   if (incoming.type === "Extraction") {
//     return { allowed: true };
//   }

//   /**
//    * RULE: After Extraction
//    */
//   if (existingTypes.includes("Extraction")) {
//     return {
//       allowed: false,
//       reason:
//         "This tooth has been extracted. You cannot perform procedures on it (except Implant).",
//     };
//   }

//   /**
//    * Single-instance procedures cannot be repeated
//    */
//   if (SINGLE_INSTANCE.includes(incoming.type) && existingTypes.includes(incoming.type)) {
//     return {
//       allowed: false,
//       reason: `${incoming.type} can only be performed once on a tooth.`,
//     };
//   }

//   /**
//    * Major restorations cannot overlap (except Temporary → Final)
//    */
//   if (MAJOR_RESTORATIONS.includes(incoming.type)) {
//     const existingMajor = existing.find((p) => MAJOR_RESTORATIONS.includes(p.type));
//     if (existingMajor) {
//       if (existingMajor.type === "Temporary" && incoming.type !== "Temporary") {
//         return { allowed: true };
//       }
//       return {
//         allowed: false,
//         reason: `A major restoration (${existingMajor.type}) already exists. Remove it before adding ${incoming.type}.`,
//       };
//     }
//   }

//   /**
//    * Invalid combinations
//    */
//   for (const proc of existing) {
//     if (
//       (proc.type === "Endo" && incoming.type === "Pulpotomy") ||
//       (proc.type === "Pulpotomy" && incoming.type === "Endo")
//     ) {
//       return {
//         allowed: false,
//         reason: `You cannot perform ${incoming.type} because ${proc.type} has already been done.`,
//       };
//     }

//     if (
//       (proc.type === "Sealant" && RESTORATIONS.includes(incoming.type)) ||
//       (incoming.type === "Sealant" && RESTORATIONS.includes(proc.type))
//     ) {
//       return {
//         allowed: false,
//         reason: `Sealants cannot be combined with restorations like ${proc.type}.`,
//       };
//     }

//     if (
//       (proc.type === "Filling" &&
//         ["Inlay", "Onlay", "Crown (Zirconia)", "Veneer"].includes(incoming.type)) ||
//       (incoming.type === "Filling" &&
//         ["Inlay", "Onlay", "Crown (Zirconia)", "Veneer"].includes(proc.type))
//     ) {
//       return {
//         allowed: false,
//         reason: `You cannot combine ${incoming.type} with ${proc.type}. Choose one treatment.`,
//       };
//     }

//     if (
//       (proc.type === "Ortho Band" && MAJOR_RESTORATIONS.includes(incoming.type)) ||
//       (incoming.type === "Ortho Band" && MAJOR_RESTORATIONS.includes(proc.type))
//     ) {
//       return {
//         allowed: false,
//         reason: `Ortho bands cannot be placed with major restorations like ${proc.type}.`,
//       };
//     }
//   }

//   return { allowed: true };
// };

// no restrictions so there's no need for rules !!!
