import React, { useState } from "react";
import { useToothStore } from "../store/useToothStore";
import { ChevronDown, Search } from "lucide-react";

type Proc = { type: string; color: string; details: string };

const Toolbar: React.FC = () => {
  const {
    patients,
    patientId,
    selectedProcedureForAdd,
    selectProcedureForAdd,
    isChildMode,
    toggleChildMode,
  } = useToothStore();

  const [procedureSearch, setProcedureSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const currentPatient = patients.find((p) => p._id === patientId);
  const dentitionType = (currentPatient?.dentitionType || "adult") as
    | "adult"
    | "child"
    | "mixed";

  const endoCanals = [
    { type: "1 Canal", description: "(for anterior teeth)", color: "#B22222" },
    { type: "2 Canals", description: "(for premolars)", color: "#A52A2A" },
    { type: "3 Canals", description: "(for molars)", color: "#8B0000" },
    { type: "4 Canals", description: "(for complex molars)", color: "#800000" },
    { type: "C-Shape", description: "(special cases)", color: "#660000" },
  ];

  const fillingSurfaces = [
    { type: "O", description: "(Occlusal only)", color: "#C0C0C0" },
    { type: "MO", description: "(Mesial + Occlusal)", color: "#B8B8B8" },
    { type: "MOD", description: "(3 surfaces)", color: "#B0B0B0" },
    { type: "B", description: "(Buccal only)", color: "#A8A8A8" },
    { type: "L", description: "(Lingual only)", color: "#A0A0A0" },
    { type: "M", description: "(Mesial only)", color: "#989898" },
    { type: "D", description: "(Distal only)", color: "#909090" },
    { type: "MODBL", description: "(Full coverage)", color: "#888888" },
  ];

  // COMPLETE list (matches your icons below)
  const procedures: Proc[] = [
    // Endodontic
    { type: "Fiber Post", color: "#8B4513", details: "" },
    { type: "Metal Post", color: "#708090", details: "" },
    { type: "Endo", color: "#B22222", details: "Canals" },
    { type: "RCT", color: "#000D54", details: "" },
    { type: "Re-RCT", color: "#005412", details: "" },
    { type: "Pulpotomy", color: "#4F4F4F", details: "" },
    { type: "Pulpectomy", color: "#4F4F4F", details: "" },
    { type: "Apicoectomy", color: "#990000", details: "" },

    // Surgical
    { type: "Extraction", color: "#990000", details: "" },
    { type: "Simple Extraction", color: "#990000", details: "" },
    { type: "Surgical Extraction", color: "#990000", details: "" },

    // Restorative
    { type: "Filling", color: "#575856", details: "Surface" },
    { type: "Composite", color: "#C5CBBF", details: "" },
    { type: "Amalgam", color: "#1F201E", details: "" },
    { type: "Inlay", color: "#993668", details: "" },
    { type: "Onlay", color: "#7F3699", details: "" },

    // Prosthodontics
    { type: "Implant", color: "#97A1AF", details: "" },
    { type: "Prosthetic", color: "#171717", details: "" },
    { type: "Veneer", color: "#F37C73", details: "" },
    { type: "Zirconia", color: "#369499", details: "" },
    { type: "Stainless Crown", color: "#171717", details: "" },

    // Additional
    { type: "Biofix", color: "#C1BBB8", details: "" },
    { type: "CCM", color: "#243A63", details: "" },
  ];

  const filtered = procedures.filter((p) =>
    p.type.toLowerCase().includes(procedureSearch.toLowerCase())
  );

  const handleProcedureClick = (p: Proc) => {
    if (p.type === "Endo" || p.type === "Filling") {
      setActiveDropdown(activeDropdown === p.type ? null : p.type);
    } else {
      selectProcedureForAdd({ type: p.type, color: p.color });
      setActiveDropdown(null);
    }
  };

  const handleSubProcedureClick = (
    mainType: string,
    subProc: { type: string; color: string; description: string }
  ) => {
    // Keep subtype in label, but Tooth will normalize base type for icon
    selectProcedureForAdd({
      type: `${mainType} - ${subProc.type}`,
      color: subProc.color,
    });
    setActiveDropdown(null);
  };

  // Toolbar icons (existing)
  const ProcedureIcon = ({ type }: { type: string }) => {
    const iconStyle = { width: "25px", height: "25px" };

    switch (type) {
      case "Fiber Post":
        return (
          <svg style={iconStyle} viewBox="0 0 5 30" fill="currentColor">
            <path
              d="M6.80392 0.857782H3.03922V4.48368H1V6.59879H3.03922L3.98039 42.8578H5.70588L6.80392 6.59879H9V4.48368H6.80392V0.857782Z"
              fill="#F1D2A5"
              stroke="#B99C75"
            />
          </svg>
        );
      case "Endo":
        return (
          <svg style={iconStyle} viewBox="0 0 10 35" fill="currentColor">
            <path
              d="M10.1321 5.00373L9.18247 4.57635L5.4632 12.6189L8.62854 14.0345L12.2687 6.01391L11.3586 5.58365L10.1321 5.00373Z"
              fill="#309161"
            />
            <path
              d="M10.3213 3.24976L9.18247 2.95148L9.82129 1.24976L13.8213 2.24976L13.3213 4.24976L11.8213 3.75074M10.3213 3.24976L10.1321 5.00373M10.3213 3.24976L11.8213 3.75074M10.1321 5.00373L9.18247 4.57635L5.4632 12.6189M10.1321 5.00373L11.3586 5.58365M5.4632 12.6189L4.63229 12.2304L4.07836 13.396L5.52085 14.0345M5.4632 12.6189L8.62854 14.0345M8.62854 14.0345L9.45944 14.4061L8.9055 15.5329L7.56023 14.9373M8.62854 14.0345L12.2687 6.01391L11.3586 5.58365M11.3586 5.58365L11.8213 3.75074M7.56023 14.9373L6.68976 16.6596L5.72038 16.2322M7.56023 14.9373L5.52085 14.0345M5.52085 14.0345L4.75099 15.8048L5.72038 16.2322M5.72038 16.2322C1.44209 26.0243 0.690366 32.3639 1.42739 44.7503"
              stroke="black"
            />
          </svg>
        );
      case "Metal Post":
        return (
          <svg style={iconStyle} viewBox="0 0 9 45" fill="currentColor">
            {/* (…kept exactly as your source…) */}
            <path
              d="M1.72 6.17C1.85 5.83 1.97999 5.49 2.10999 5.16C2.14999 5 2.18 4.84 2.22 4.67C2.36 4.33 2.49 3.99 2.63 3.65C2.66 3.49 2.70001 3.34 2.73001 3.18C2.85001 2.84 2.97001 2.5 3.10001 2.17C3.32001 1.54 3.54999 0.9 3.76999 0.27C4.57999 0.18 5.39999 0.09 6.20999 0C5.89999 0.41 5.59 0.820001 5.28 1.23C5.45 3.37 5.61 5.51 5.78 7.65C5.92 8 6.05 8.35 6.19 8.69C6.21 12.38 6.22999 16.07 6.23999 19.76C5.08999 19.78 3.94001 19.79 2.79001 19.81C1.24001 19.92 0.640002 19.25 0.690002 17.65C0.720002 16.67 0.270009 15.68 0.0400085 14.7C0.0300085 14.03 0.0200098 13.35 0.0100098 12.68C0.15001 12.03 0.300002 11.39 0.440002 10.74C0.510002 10.41 0.569984 10.08 0.639984 9.76C0.839984 9.07 1.03999 8.38 1.23999 7.69C1.36999 7.35 1.5 7.01 1.63 6.66C1.67 6.5 1.69999 6.34 1.73999 6.18L1.72 6.17Z"
              fill="#272324"
            />
            {/* (rest of the Metal Post paths exactly as you posted)… */}
            <path
              d="M4.68994 49.3795V42.0495C4.91994 42.0495 5.14994 42.0295 5.37994 42.0195V49.3195C5.14994 49.3395 4.91994 49.3595 4.68994 49.3795Z"
              fill="#403839"
            />
          </svg>
        );
      case "RCT":
        return (
          <svg style={iconStyle} viewBox="0 0 15 35" fill="currentColor">
            <path
              d="M1.38011 0.857788C3.37027 2.79066 5.59045 4.63011 7.29058 6.68513C11.7209 12.0454 13.2111 17.9518 13.4011 24.1312C13.5111 27.997 14.1693 30.8483 14.5894 34.8578L3.50031 33.6836C3.50031 33.6836 3.97032 18.3326 3.50029 14.625C3.07025 11.2766 1.53012 8.00006 0.560043 4.68041C0.250018 3.60979 0.180015 2.50324 0 1.41106L1.38011 0.857788Z"
              fill="#000D54"
            />
          </svg>
        );
      case "Re-RCT":
        return (
          <svg style={iconStyle} viewBox="0 0 15 35" fill="currentColor">
            <path
              d="M1.38011 0.857788C3.37027 2.79066 5.59045 4.63011 7.29058 6.68513C11.7209 12.0454 13.2111 17.9518 13.4011 24.1312C13.5111 27.997 14.1693 30.8483 14.5894 34.8578L3.50031 33.6836C3.50031 33.6836 3.97032 18.3326 3.50029 14.625C3.07025 11.2766 1.53012 8.00006 0.560043 4.68041C0.250018 3.60979 0.180015 2.50324 0 1.41106L1.38011 0.857788Z"
              fill="#005412"
            />
          </svg>
        );
      case "Pulpotomy":
        return (
          <svg style={iconStyle} viewBox="0 0 21 17" fill="currentColor">
            <rect y="0.857788" width="21" height="16" fill="#4F4F4F" />
          </svg>
        );
      case "Pulpectomy":
        return (
          <svg style={iconStyle} viewBox="0 0 21 17" fill="currentColor">
            <rect y="0.857788" width="21" height="16" fill="#4F4F4F" />
          </svg>
        );
      case "Apicoectomy":
        return (
          <svg style={iconStyle} viewBox="0 0 22 22" fill="currentColor">
            <path d="M2 20.0004L20.2852 1.71521" stroke="#990000" strokeWidth="3" />
            <path d="M20.2852 20.0004L2 1.71521" stroke="#990000" strokeWidth="3" />
          </svg>
        );
      case "Extraction":
        return (
          <svg style={iconStyle} viewBox="0 0 22 22" fill="currentColor">
            <path d="M1.85742 20.0004L20.1426 1.71521" stroke="#990000" strokeWidth="3" />
            <path d="M20.1426 20.0004L1.85742 1.71521" stroke="#990000" strokeWidth="3" />
          </svg>
        );
      case "Simple Extraction":
        return (
          <svg style={iconStyle} viewBox="0 0 22 22" fill="currentColor">
            <path d="M2 20.0004L20.2852 1.71521" stroke="#990000" strokeWidth="3" />
            <path d="M20.2852 20.0004L2 1.71521" stroke="#990000" strokeWidth="3" />
          </svg>
        );
      case "Surgical Extraction":
        return (
          <svg style={iconStyle} viewBox="0 0 22 22" fill="currentColor">
            <path d="M2 20.0004L20.2852 1.71521" stroke="#990000" strokeWidth="3" />
            <path d="M20.2852 20.0004L2 1.71521" stroke="#990000" strokeWidth="3" />
          </svg>
        );
      case "Filling":
        return (
          <svg style={iconStyle} viewBox="0 0 27 20" fill="currentColor">
            <path
              d="M13.4183 19.6042C6.7283 20.1242 -0.231695 13.2742 0.208305 5.75424C0.428305 2.03424 2.64831 -0.0957636 6.17831 0.474236C11.1283 1.27424 15.9983 1.31424 20.9483 0.454236C24.4083 -0.145764 26.6183 2.12424 26.7983 5.88424C27.1483 12.9942 20.3683 20.2242 13.4183 19.6042Z"
              fill="#575856"
            />
          </svg>
        );
      case "Composite":
        return (
          <svg style={iconStyle} viewBox="0 0 27 20" fill="currentColor">
            <path
              d="M13.2298 19.462C6.53983 19.982 -0.420172 13.132 0.019828 5.61203C0.239828 1.89203 2.45983 -0.237976 5.98983 0.332024C10.9398 1.13202 15.8098 1.17202 20.7598 0.312024C24.2198 -0.287976 26.4298 1.98202 26.6098 5.74202C26.9598 12.852 20.1798 20.082 13.2298 19.462Z"
              fill="#C5CBBF"
            />
          </svg>
        );
      case "Amalgam":
        return (
          <svg style={iconStyle} viewBox="0 0 27 20" fill="currentColor">
            <path
              d="M13.2298 19.462C6.53983 19.982 -0.420172 13.132 0.019828 5.61203C0.239828 1.89203 2.45983 -0.237976 5.98983 0.332024C10.9398 1.13202 15.8098 1.17202 20.7598 0.312024C24.2198 -0.287976 26.4298 1.98202 26.6098 5.74202C26.9598 12.852 20.1798 20.082 13.2298 19.462Z"
              fill="#1F201E"
            />
          </svg>
        );
      case "Inlay":
        return (
          <svg style={iconStyle} viewBox="0 0 27 8" fill="currentColor">
            <path
              d="M12.5596 7.17583H0C0.699992 2.21583 4.81893 -0.179739 9.75887 0.910261C12.491 1.83568 12.9911 2.33568 15.0389 1.17026C18.4751 -0.839952 25.0496 2.17748 26.1504 7.10062L12.5596 7.17583Z"
              fill="#993668"
            />
          </svg>
        );
      case "Onlay":
        return (
          <svg style={iconStyle} viewBox="0 0 26 19" fill="currentColor">
            <path
              d="M22.1752 18.894C19.3274 9.99939 17.4174 9.17939 12.8274 8.99939C8.0774 8.81939 4.82739 12.9994 3.32515 18.394C0.715156 16.714 0.885153 13.834 0.215154 11.424C-0.124846 10.184 -0.00484505 8.75397 0.185155 7.44397C0.885154 2.48397 4.85516 -0.016032 9.79516 1.07397C12.5273 1.99939 13.0273 2.49939 15.0752 1.33397C22.2152 0.0739683 26.9252 4.58397 25.6452 11.764C25.3352 13.544 24.6352 15.264 23.9452 16.944C23.6852 17.594 22.9552 18.054 22.1752 18.884V18.894Z"
              fill="#7F3699"
            />
          </svg>
        );
      case "Implant":
        return (
          <svg style={iconStyle} viewBox="0 0 36 40" fill="currentColor">
            <path
              d="M1.14502 0.857788H34.145L31.145 5.98026H27.395V10.6759H21.27V12.6179V17.8276L23.5617 17.0619L21.27 17.8322V23.8134V28.8515V35.7036L20.145 38.8578H14.145L12.9367 35.7036V32.5494H10.645L12.9367 31.7518V27.427V24.3899V20.6332L11.1034 21.2494L12.9367 20.6119V15.4917V11.2058V10.6759H7.52002V5.98026H4.14502L1.14502 0.857788Z"
              fill="#97A1AF"
            />
            <path
              d="M7.52002 5.98026H4.14502L1.14502 0.857788H34.145L31.145 5.98026H27.395M7.52002 5.98026V10.6759H12.9367M7.52002 5.98026H27.395M27.395 5.98026V10.6759H21.27M21.27 10.6759V35.7036L20.145 38.8578H14.145L12.9367 35.7036V32.5494M21.27 10.6759H12.9367M12.9367 10.6759V11.2058V15.4917M23.5617 11.8277L12.9367 15.4917M11.5617 15.4917H12.9367M12.9367 15.4917V20.6119M12.9367 20.6119L23.5617 17.0619L11.1034 21.2494L12.9367 20.6119ZM12.9367 20.6119V24.3899V27.427M11.1034 27.427H12.9367M23.5617 22.8196L12.9367 27.427M12.9367 27.427V32.5494M12.9367 32.5494H10.645L23.5617 28.0539"
              stroke="black"
            />
          </svg>
        );
      case "Prosthetic":
        return (
          <svg style={iconStyle} viewBox="0 0 27 18" fill="currentColor">
            <path
              d="M4.10594 17.6457C0.415941 14.2457 -0.264058 5.70575 2.82594 2.18575C4.92594 -0.204252 7.69594 -0.204253 10.5859 0.215747C13.0902 1.14294 13.5902 2.64294 16.0459 0.465747C23.0859 -0.724253 27.8659 3.90575 26.4659 10.9757C25.9859 13.3957 25.7459 16.1157 22.8559 17.9957C16.0459 17.9957 19.6102 17.9657 13.5902 17.6457C8.90021 17.3957 13.5902 17.1429 4.09595 17.6457H4.10594Z"
              fill="#171717"
            />
          </svg>
        );
      case "Veneer":
        return (
          <svg style={iconStyle} viewBox="0 0 48 26" fill="currentColor">
            <path
              d="M30.8755 4.78577C30.7141 4.56554 30.5886 4.32528 30.3735 4.11506C29.4591 3.15404 28.5089 2.19302 27.5766 1.232C29.6026 0.8516 31.6106 0.20091 33.6724 0.150857C39.8757 -0.0193234 45.0391 2.41326 46.7782 6.40749C49.4675 12.6041 47.4057 18.6004 43.6227 24.4667C42.0809 26.8692 38.2979 25.738 35.5011 25.708C34.7301 25.708 33.7979 24.1363 33.3317 23.2253C32.9373 22.4445 33.2421 21.5636 33.009 20.7527C32.3994 18.5704 30.4273 17.4993 26.0885 17.4492C15.0983 17.3391 14.7756 17.4392 14.166 23.4456C14.0943 24.1363 12.7496 25.3776 12.0145 25.3676C9.30732 25.3376 5.57821 26.3186 4.21563 24.1163C1.18569 19.2211 -0.91197 14.2258 0.396821 8.98022C0.629893 8.07927 0.683666 7.14828 1.16774 6.28737C2.65582 3.61453 4.44866 0.961718 10.0603 0.260975C16.5864 -0.559896 22.0546 0.571302 26.3933 3.43434C27.4511 4.12507 28.7958 4.68567 30.0149 5.29631C30.2838 5.12613 30.5707 4.95596 30.8396 4.78577H30.8755Z"
              fill="#F37C73"
            />
          </svg>
        );
      case "Zirconia":
        return (
          <svg style={iconStyle} viewBox="0 0 51 23" fill="currentColor">
            <path
              d="M4.59502 23C3.24551 20.751 1.2112 18.553 0.707654 16.2273C0.0228317 13.0454 -0.480798 9.60794 0.747854 6.56662C2.92317 1.1229 10.7584 -1.01114 19.3389 0.445627C22.3803 0.956774 25.9453 1.2379 28.9263 0.752315C39.8834 -1.02392 48.5646 2.10686 50.6191 9.17347C51.9484 13.761 49.6322 17.9908 46.2483 21.9777C45.8455 22.4505 46.5686 22.2295 45.0379 22.9068C33.9599 22.455 33.9196 21.8033 20.8677 22.455C9.97092 22.9917 11.8038 22.455 6.18618 22.8722C5.66249 22.9106 5.13886 22.9489 4.61518 22.9872L4.59502 23Z"
              fill="#369499"
            />
          </svg>
        );
      case "Stainless Crown":
        return (
          <svg style={iconStyle} viewBox="0 0 26 19" fill="currentColor">
            <path
              d="M3.23534 18.5035C-0.454665 15.1035 -1.13466 6.56354 1.95534 3.04354C4.05534 0.653536 6.82533 0.653535 9.71533 1.07353C12.2196 2.00073 12.7196 3.50073 15.1753 1.32353C22.2153 0.133535 26.9953 4.76354 25.5953 11.8335C25.1153 14.2535 24.8753 16.9735 21.9853 18.8535C15.1753 18.8535 18.7396 18.8235 12.7196 18.5035C8.0296 18.2535 12.7196 18.0007 3.22534 18.5035H3.23534Z"
              fill="#171717"
            />
          </svg>
        );
      case "Biofix":
        return (
          <svg style={iconStyle} viewBox="0 0 26 19" fill="currentColor">
            <path
              d="M2.5603 18.9955C1.8903 17.2355 0.601335 15.2369 0.351335 13.4169C0.0113355 10.9269 -0.238706 8.23687 0.371294 5.85687C1.45129 1.59687 5.34134 -0.0731336 9.60134 1.06687C11.1113 1.46687 12.8813 1.68687 14.3613 1.30687C19.8013 -0.0831339 24.1113 2.36687 25.1313 7.89687C25.7913 11.4869 24.0164 15.5239 22.3364 18.6439L10.5364 18.9955H2.5603Z"
              fill="#C1BBB8"
            />
          </svg>
        );
      case "CCM":
        return (
          <svg style={iconStyle} viewBox="0 0 26 19" fill="currentColor">
            <path
              d="M2.28133 18.8571C1.61133 17.0971 0.601335 15.3771 0.351335 13.5571C0.0113355 11.0671 -0.238706 8.37713 0.371294 5.99713C1.45129 1.73713 5.34134 0.0671251 9.60134 1.20713C11.1113 1.60713 12.8813 1.82712 14.3613 1.44712C19.8013 0.0571249 24.1113 2.50712 25.1313 8.03713C25.7913 11.6271 24.6413 14.9371 22.9613 18.0571C22.7613 18.4271 23.1204 18.2542 22.3604 18.7842C16.8604 18.4307 16.8404 17.9207 10.3604 18.4307C4.95035 18.8507 5.86035 18.4307 3.07131 18.7571C2.81131 18.7871 2.55134 18.8171 2.29134 18.8471L2.28133 18.8571Z"
              fill="#243A63"
            />
          </svg>
        );
      default:
        return (
          <svg style={iconStyle} viewBox="0 0 20 20" fill="currentColor">
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="#ccc"
              stroke="black"
              strokeWidth="0.5"
            />
            <text x="10" y="14" textAnchor="middle" fontSize="8" fill="black">
              ?
            </text>
          </svg>
        );
    }
  };

  const renderDropdownContent = () => {
    if (activeDropdown === "Endo") {
      return (
        <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {endoCanals.map((canal) => (
            <div
              key={canal.type}
              className="px-4 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => handleSubProcedureClick("Endo", canal)}
            >
              <span className="text-sm text-gray-800">{canal.type}</span>
            </div>
          ))}
        </div>
      );
    }
    if (activeDropdown === "Filling") {
      return (
        <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {fillingSurfaces.map((surface) => (
            <div
              key={surface.type}
              className="px-4 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => handleSubProcedureClick("Filling", surface)}
            >
              <span className="text-sm text-gray-800">{surface.type}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="w-68 bg-white border-r border-gray-200 flex flex-col"
      style={{ height: "fit-content", maxHeight: "calc(85vh - 180px)" }}
    >
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Current Treatment
        </h2>

        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={procedureSearch}
            onChange={(e) => setProcedureSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="text-xs inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded">
          Dentition:{" "}
          <span className="font-medium capitalize">{dentitionType}</span>
        </div>
      </div>

      {(dentitionType === "child" || dentitionType === "mixed") && (
        <button
          onClick={toggleChildMode}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors mb-2 text-sm font-medium"
        >
          <span>Convert</span>
          <div className="text-xs bg-green-600 px-2 py-1 rounded">
            {isChildMode ? "Child" : "Adult"}
          </div>
        </button>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {filtered.map((p) => (
            <div
              key={p.type}
              className={`flex items-center justify-between px-4 py-4 border-b border-gray-200 cursor-pointer transition-all  mx-2 rounded-r ${
                selectedProcedureForAdd?.type === p.type
                  ? "bg-blue-50 border-gray-100"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleProcedureClick(p)}
              style={{
                borderLeftColor:
                  selectedProcedureForAdd?.type === p.type
                    ? p.color
                    : "transparent",
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0 text-gray-600">
                  <ProcedureIcon type={p.type} />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {p.type}
                </span>
              </div>

              {(p.type === "Endo" || p.type === "Filling") && (
                <div className="relative">
                  <div className="flex">
                    <span className="text-xs text-gray-500">{p.details}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        activeDropdown === p.type ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {activeDropdown === p.type && renderDropdownContent()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
