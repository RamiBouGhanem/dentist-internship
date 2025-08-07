export interface CategorizedProcedure {
  type: string;
  color: string;
}

export interface ProcedureCategory {
  title: string;
  procedures: CategorizedProcedure[];
}

export const procedureCategories: ProcedureCategory[] = [
  {
    title: "Endodontic (Root Canal Treatments)",
    procedures: [
      { type: "Endo", color: "#B22222" },
      { type: "Pulpotomy", color: "#FF8C00" },
      { type: "Palpectomy", color: "#CD5C5C" },
      { type: "Apexification", color: "#A0522D" },
      { type: "Fiber Post", color: "#8B0000" }
    ]
  },
  {
    title: "Surgical Procedures",
    procedures: [
      { type: "Simple Extraction", color: "#8B0000" },
      { type: "Surgical Extraction", color: "#A52A2A" },
      { type: "Crown Lengthening", color: "#6B8E23" },
      { type: "Gingivectomy", color: "#228B22" },
      { type: "Frenectomy", color: "#556B2F" },
      { type: "Apicoectomy", color: "#2E8B57" },
      { type: "Implant", color: "#A9A9A9" },
      { type: "GBR", color: "#5F9EA0" }
    ]
  },
  {
    title: "Restorative & Prosthodontics",
    procedures: [
      { type: "Filling", color: "#C0C0C0" },
      { type: "Temporary", color: "#DCDCDC" },
      { type: "Crown (Zirconia)", color: "#F5F5F5" },
      { type: "CCM", color: "#90EE90" },
      { type: "Bridge", color: "#A0522D" },
      { type: "Veneer", color: "#FFE4C4" },
      { type: "Inlay", color: "#B8860B" },
      { type: "Onlay", color: "#DAA520" },
      { type: "Post & Core", color: "#778899" }
    ]
  },
  {
    title: "Cosmetic & Whitening",
    procedures: [
      { type: "Laser Whitening", color: "#E0FFFF" },
      { type: "Home Whitening", color: "#87CEFA" },
      { type: "Whitening Paste", color: "#ADD8E6" },
      { type: "Enamel Microabrasion", color: "#B0E0E6" }
    ]
  },
  {
    title: "Periodontal Treatments",
    procedures: [
      { type: "Scaling and Root Planing", color: "#20B2AA" },
      { type: "Polishing", color: "#B0C4DE" },
      { type: "Fluoride Application", color: "#48D1CC" },
      { type: "Gingival Curettage", color: "#008080" }
    ]
  },
  {
  title: "Pediatric (Pedo)",
  procedures: [
    { type: "Sealant", color: "#E0FFFF" },                 
    { type: "Stainless Steel Crown", color: "#708090" },   
    { type: "Pulpotomy", color: "#FFA500" },               
    { type: "Pulpectomy", color: "#CD5C5C" },              
    { type: "Space Maintainer", color: "#00CED1" },        
    { type: "Fluoride Varnish", color: "#40E0D0" },        
    { type: "Tooth Eruption Check", color: "#F0E68C" },    
    { type: "Oral Hygiene Instruction", color: "#98FB98" },
    { type: "Early Caries Detection", color: "#FFD700" },  
    { type: "Topical Anesthesia", color: "#AFEEEE" },      
    { type: "Rubber Dam Placement", color: "#B0E0E6" },    
  ]
},
  {
    title: "Orthodontics",
    procedures: [
      { type: "Ortho Band", color: "#4682B4" }
    ]
  },
  {
    title: "Miscellaneous",
    procedures: [
      { type: "Missing", color: "#000000" }
    ]
  }
];
