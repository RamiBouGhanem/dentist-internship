import React, { useState } from "react";
import { useToothStore } from "../store/useToothStore";
import { Search } from "lucide-react";

type Proc = { type: string; color: string; details: string };

const Toolbar: React.FC = () => {
  const {
    patients,
    patientId,
    selectedProcedureForAdd,
    selectProcedureForAdd,
    // NOTE: removed isChildMode/toggleChildMode to avoid TS errors if not in store
  } = useToothStore();

  const [procedureSearch, setProcedureSearch] = useState("");
  const currentPatient = patients.find((p) => p._id === patientId);
  const dentitionType = (currentPatient?.dentitionType || "adult") as
    | "adult"
    | "child"
    | "mixed";

  const procedures: Proc[] = [
    { type: "Endo",       color: "#B22222", details: "Canals"  },
    { type: "Extraction", color: "#8B0000", details: ""        },
    { type: "Filling",    color: "#C0C0C0", details: "Surface" },
    { type: "Implant",    color: "#A9A9A9", details: "D"       },
    { type: "Prosthe",    color: "#A0522D", details: "L"       },
    { type: "Zirconia",   color: "#F5F5F5", details: "O"       },
    { type: "Veneer",     color: "#FFE4C4", details: ""        },
    { type: "Bridge",     color: "#A0522D", details: ""        },
  ];

  const filtered = procedures.filter((p) =>
    p.type.toLowerCase().includes(procedureSearch.toLowerCase())
  );

  const handleProcedureClick = (p: Proc) => {
    selectProcedureForAdd({ type: p.type, color: p.color });
  };

  // SVG icon per procedure (unchanged logic)
  const ProcedureIcon = ({ type }: { type: string }) => {
    const iconStyle = { width: "20px", height: "20px" };
    switch (type) {
      case "Endo":
        return (
          <svg style={iconStyle} viewBox="0 0 15 45" fill="currentColor">
            <path d="M10.1321 5.00373L9.18247 4.57635L5.4632 12.6189L8.62854 14.0345L12.2687 6.01391L11.3586 5.58365L10.1321 5.00373Z" fill="#309161"/>
            <path d="M10.3213 3.24976L9.18247 2.95148L9.82129 1.24976L13.8213 2.24976L13.3213 4.24976L11.8213 3.75074M10.3213 3.24976L10.1321 5.00373M10.3213 3.24976L11.8213 3.75074M10.1321 5.00373L9.18247 4.57635L5.4632 12.6189M10.1321 5.00373L11.3586 5.58365M5.4632 12.6189L4.63229 12.2304L4.07836 13.396L5.52085 14.0345M5.4632 12.6189L8.62854 14.0345M8.62854 14.0345L9.45944 14.4061L8.9055 15.5329L7.56023 14.9373M8.62854 14.0345L12.2687 6.01391L11.3586 5.58365M11.3586 5.58365L11.8213 3.75074M7.56023 14.9373L6.68976 16.6596L5.72038 16.2322M7.56023 14.9373L5.52085 14.0345M5.52085 14.0345L4.75099 15.8048L5.72038 16.2322M5.72038 16.2322C1.44209 26.0243 0.690366 32.3639 1.42739 44.7503" stroke="black"/>
          </svg>
        );
      case "Extraction":
        return (
          <svg style={iconStyle} viewBox="0 0 22 22" fill="currentColor">
            <path d="M1.85742 20.0004L20.1426 1.71521" stroke="#990000" strokeWidth="3" />
            <path d="M20.1426 20.0004L1.85742 1.71521" stroke="#990000" strokeWidth="3" />
          </svg>
        );
      case "Filling":
        return (
          <svg style={iconStyle} viewBox="0 0 27 20" fill="currentColor">
            <path d="M13.4183 19.6042C6.7283 20.1242 -0.231695 13.2742 0.208305 5.75424C0.428305 2.03424 2.64831 -0.0957636 6.17831 0.474236C11.1283 1.27424 15.9983 1.31424 20.9483 0.454236C24.4083 -0.145764 26.6183 2.12424 26.7983 5.88424C27.1483 12.9942 20.3683 20.2242 13.4183 19.6042Z" fill="#575856"/>
          </svg>
        );
      case "Implant":
        return (
          <svg style={iconStyle} viewBox="0 0 36 40" fill="currentColor">
            <path d="M1.14502 0.857788H34.145L31.145 5.98026H27.395V10.6759H21.27V12.6179V17.8276L23.5617 17.0619L21.27 17.8322V23.8134V28.8515V35.7036L20.145 38.8578H14.145L12.9367 35.7036V32.5494H10.645L12.9367 31.7518V27.427V24.3899V20.6332L11.1034 21.2494L12.9367 20.6119V15.4917V11.2058V10.6759H7.52002V5.98026H4.14502L1.14502 0.857788Z" fill="#97A1AF"/>
            <path d="M7.52002 5.98026H4.14502L1.14502 0.857788H34.145L31.145 5.98026H27.395M7.52002 5.98026V10.6759H12.9367M7.52002 5.98026H27.395M27.395 5.98026V10.6759H21.27M21.27 10.6759V35.7036L20.145 38.8578H14.145L12.9367 35.7036V32.5494M21.27 10.6759H12.9367M12.9367 10.6759V11.2058V15.4917M23.5617 11.8277L12.9367 15.4917M11.5617 15.4917H12.9367M12.9367 15.4917V20.6119M12.9367 20.6119L23.5617 17.0619L11.1034 21.2494L12.9367 20.6119ZM12.9367 20.6119V24.3899V27.427M11.1034 27.427H12.9367M23.5617 22.8196L12.9367 27.427M12.9367 27.427V32.5494M12.9367 32.5494H10.645L23.5617 28.0539" stroke="black"/>
          </svg>
        );
      case "Prosthe":
        return (
          <svg style={iconStyle} viewBox="0 0 27 18" fill="currentColor">
            <path d="M4.10594 17.6457C0.415941 14.2457 -0.264058 5.70575 2.82594 2.18575C4.92594 -0.204252 7.69594 -0.204253 10.5859 0.215747C13.0902 1.14294 13.5902 2.64294 16.0459 0.465747C23.0859 -0.724253 27.8659 3.90575 26.4659 10.9757C25.9859 13.3957 25.7459 16.1157 22.8559 17.9957C16.0459 17.9957 19.6102 17.9657 13.5902 17.6457C8.90021 17.3957 13.5902 17.1429 4.09595 17.6457H4.10594Z" fill="#171717"/>
          </svg>
        );
      case "Zirconia":
        return (
          <svg style={iconStyle} viewBox="0 0 51 23" fill="currentColor">
            <path d="M4.59502 23C3.24551 20.751 1.2112 18.553 0.707654 16.2273C0.0228317 13.0454 -0.480798 9.60794 0.747854 6.56662C2.92317 1.1229 10.7584 -1.01114 19.3389 0.445627C22.3803 0.956774 25.9453 1.2379 28.9263 0.752315C39.8834 -1.02392 48.5646 2.10686 50.6191 9.17347C51.9484 13.761 49.6322 17.9908 46.2483 21.9777C45.8455 22.4505 46.5686 22.2295 45.0379 22.9068C33.9599 22.455 33.9196 21.8033 20.8677 22.455C9.97092 22.9917 11.8038 22.455 6.18618 22.8722C5.66249 22.9106 5.13886 22.9489 4.61518 22.9872L4.59502 23Z" fill="#369499"/>
          </svg>
        );
      case "Veneer":
        return (
          <svg style={iconStyle} viewBox="0 0 48 26" fill="currentColor">
            <path d="M30.8755 4.78577C30.7141 4.56554 30.5886 4.32528 30.3735 4.11506C29.4591 3.15404 28.5089 2.19302 27.5766 1.232C29.6026 0.8516 31.6106 0.20091 33.6724 0.150857C39.8757 -0.0193234 45.0391 2.41326 46.7782 6.40749C49.4675 12.6041 47.4057 18.6004 43.6227 24.4667C42.0809 26.8692 38.2979 25.738 35.5011 25.708C34.7301 25.708 33.7979 24.1363 33.3317 23.2253C32.9373 22.4445 33.2421 21.5636 33.009 20.7527C32.3994 18.5704 30.4273 17.4993 26.0885 17.4492C15.0983 17.3391 14.7756 17.4392 14.166 23.4456C14.0943 24.1363 12.7496 25.3776 12.0145 25.3676C9.30732 25.3376 5.57821 26.3186 4.21563 24.1163C1.18569 19.2211 -0.91197 14.2258 0.396821 8.98022C0.629893 8.07927 0.683666 7.14828 1.16774 6.28737C2.65582 3.61453 4.44866 0.961718 10.0603 0.260975C16.5864 -0.559896 22.0546 0.571302 26.3933 3.43434C27.4511 4.12507 28.7958 4.68567 30.0149 5.29631C30.2838 5.12613 30.5707 4.95596 30.8396 4.78577H30.8755Z" fill="#F37C73"/>
          </svg>
        );
      case "Bridge":
        return (
          <svg style={iconStyle} viewBox="0 0 15 33" fill="currentColor">
            <path d="M5.18844 0.487037C7.35545 0.943615 9.37047 2.09209 10.6823 3.78795C14.1009 8.21142 14.3175 14.5935 14.4641 19.693C14.549 22.8831 13.5992 28.8158 13.9233 32.1245C12.4166 31.48 10.0653 30.4741 10.0653 30.4741C10.0653 30.4741 6.97792 29.6598 5.04968 30.0615C4.11434 30.2563 3.68772 30.8867 2.7348 30.8867C1.78188 30.8867 0.419922 30.0615 0.419922 30.0615C0.419922 30.0615 4.91835 15.7913 4.55566 12.7317C4.22383 9.9685 3.6452 6.54247 3.50635 3.65417C3.26713 2.77067 3.50643 0.765874 3.6452 0.219482L5.18844 0.487037Z" fill="#005412"/>
          </svg>
        );
      default:
        return (
          <svg style={iconStyle} viewBox="0 0 18 61" fill="currentColor">
            <path d="M9.53106 0.503906C17.5214 0.503906 17.7018 0.503905 17.3952 6.53899C17.2328 9.79333 16.3039 13.0274 15.7718 16.275C15.5734 17.4793 15.4742 18.6971 15.3931 19.915C14.5995 30.9567 13.923 42.0053 12.949 53.0403C12.7506 55.2662 11.5963 57.4718 10.6223 59.6234C10.3698 60.1714 9.04405 60.8683 8.3857 60.7803C7.68226 60.6856 7.02392 59.7993 6.63613 59.1565C6.32048 58.6288 6.35655 57.959 6.34753 57.3568C6.04992 42.763 4.21015 28.2639 1.54068 13.819C1.10779 11.478 0.593735 9.14382 0.368273 6.79609C-0.118725 1.8097 1.51363 0.517439 7.99791 0.510673C8.51197 0.510673 9.01701 0.510673 9.53106 0.510673V0.503906Z" fill="black"/>
            <path d="M4.88654 21.2681C6.10403 34.4952 7.24939 46.924 8.40376 59.3527L9.49498 59.373C13.9682 47.0728 13.4541 34.4411 13.4361 21.4778C10.6854 24.306 7.97086 24.0624 4.88654 21.2681Z" fill="#FFE0A6"/>
            <path d="M15.7358 9.90835C14.9692 0.355061 17.2599 1.81647 7.52895 1.64733C3.80432 1.58643 2.83933 2.29684 2.77621 5.13847C2.72209 7.56739 2.62289 10.0301 3.04676 12.432C3.48867 14.9624 3.90352 17.6687 5.42764 19.8676C7.61011 23.0069 11.0642 22.8175 12.6063 19.5022C14.3199 15.8149 15.1135 11.8907 15.7358 9.90835Z" fill="white"/>
          </svg>
        );
    }
  };

  return (
    <div className="w-64 bg-white border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Current Treatment</h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={procedureSearch}
            onChange={(e) => setProcedureSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Dentition label (readonly display to avoid store typing issues) */}
        <div className="text-xs inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded">
          Dentition: <span className="font-medium capitalize">{dentitionType}</span>
        </div>
      </div>

      {/* Procedures list */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {filtered.map((p) => (
            <div
              key={p.type}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all border-l-4 mx-2 rounded-r ${
                selectedProcedureForAdd?.type === p.type
                  ? "bg-blue-50 border-blue-500"
                  : "border-transparent hover:bg-gray-50"
              }`}
              onClick={() => handleProcedureClick(p)}
              style={{
                borderLeftColor:
                  selectedProcedureForAdd?.type === p.type ? p.color : "transparent",
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0 text-gray-600">
                  <ProcedureIcon type={p.type} />
                </div>
                <span className="text-sm font-medium text-gray-800">{p.type}</span>
              </div>

              <div className="flex items-center gap-2">
                {p.details && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {p.details}
                  </span>
                )}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 border border-gray-300"
                  style={{ backgroundColor: p.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
