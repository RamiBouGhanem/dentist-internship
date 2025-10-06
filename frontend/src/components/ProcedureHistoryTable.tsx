import React, { Fragment, useMemo, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Search,
  FileText,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { useToothStore } from "../store/useToothStore";
import { procedureCategories } from "../constants/procedureGroups";

/* ------------------------------- API -------------------------------- */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  withCredentials: true,
});
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* ----------------------------- helpers/ui ---------------------------- */

const ALL_PROCS = (procedureCategories ?? []).flatMap(
  (c) => c.procedures ?? []
);

// FDI numbers only (no letter mapping)
const FDI_ALL = [
  // adults
  "18",
  "17",
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "48",
  "47",
  "46",
  "45",
  "44",
  "43",
  "42",
  "41",
  // primary
  "55",
  "54",
  "53",
  "52",
  "51",
  "61",
  "62",
  "63",
  "64",
  "65",
  "71",
  "72",
  "73",
  "74",
  "75",
  "85",
  "84",
  "83",
  "82",
  "81",
];

const procColor = (type: string) =>
  ALL_PROCS.find((p) => p.type === type)?.color || "#999999";

const within24h = (iso?: string) =>
  !!iso && Date.now() - new Date(iso).getTime() <= 24 * 60 * 60 * 1000;

// normalize e.g., “Crown (Zirconia)” -> “crown”
const normType = (s?: string) =>
  (s || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/* ------------------------------- types ------------------------------- */

type Row = {
  id: string;
  tooth: string;
  idx: number;
  proc: {
    type: string;
    color: string;
    status?: "planned" | "completed";
    plannedAt?: string;
    createdAt?: string;
    notes?: string;
    dentistName?: string;
  };
};

/* ---------------------------- component ------------------------------ */

export default function ProcedureHistoryTable() {
  const {
    teethData,
    patients,
    patientId,
    removeProcedureFromTooth,
    updateProcedureNote,
  } = useToothStore();

  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  // Add modal state
  const [isAddOpen, setAddOpen] = useState(false);
  const [busyAdd, setBusyAdd] = useState(false);

  // Modal form fields
  const [formTooth, setFormTooth] = useState<string>(FDI_ALL[0]);
  const [formType, setFormType] = useState<string>(
    ALL_PROCS[0]?.type ?? "Endo"
  );
  const [formDate, setFormDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [formNote, setFormNote] = useState<string>("");

  if (!patientId) return null;
  const patient = patients.find((p) => p._id === patientId);

  /* --------------------- Build + reconcile rows ---------------------- */
  const rows: Row[] = useMemo(() => {
    const list: Row[] = [];
    for (const tooth in teethData) {
      (teethData[tooth] ?? []).forEach((proc: any, idx: number) => {
        list.push({ id: `${tooth}-${idx}`, tooth, idx, proc });
      });
    }

    // hide planned if a completed of same (tooth,type) exists
    const seenCompleted = new Set<string>();
    list.forEach(({ tooth, proc }) => {
      const key = `${tooth}|${normType(proc.type)}`;
      const isCompleted =
        (proc.status ?? "completed") === "completed" || !!proc.createdAt;
      if (isCompleted) seenCompleted.add(key);
    });

    const filtered = list.filter(({ tooth, proc }) => {
      const key = `${tooth}|${normType(proc.type)}`;
      const isPlanned =
        (proc.status ?? "completed") === "planned" ||
        (!!proc.plannedAt && !proc.createdAt);
      if (isPlanned && seenCompleted.has(key)) return false;
      return true;
    });

    filtered.sort((a, b) => {
      const at =
        a.proc.status === "planned"
          ? new Date(a.proc.plannedAt ?? 0).getTime()
          : new Date(a.proc.createdAt ?? 0).getTime();
      const bt =
        b.proc.status === "planned"
          ? new Date(b.proc.plannedAt ?? 0).getTime()
          : new Date(b.proc.createdAt ?? 0).getTime();
      return bt - at;
    });

    return filtered;
  }, [teethData]);

  const filteredRows = rows.filter(({ tooth, proc }) => {
    const q = filter.toLowerCase();
    return (
      tooth.toLowerCase().includes(q) ||
      (proc.type ?? "").toLowerCase().includes(q) ||
      (proc.notes ?? "").toLowerCase().includes(q) ||
      (proc.status ?? (proc.createdAt ? "completed" : "planned")).includes(q)
    );
  });

  /* --------------------------- actions -------------------------------- */

  function openAdd() {
    // reset to sensible defaults each time
    setFormTooth(FDI_ALL[0]);
    setFormType(ALL_PROCS[0]?.type ?? "Endo");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormNote("");
    setAddOpen(true);
  }

  async function submitAdd(e?: React.FormEvent) {
    e?.preventDefault();
    if (!patientId) return;
    setBusyAdd(true);

    const plannedProc = {
      type: formType,
      color: procColor(formType),
      status: "planned" as const,
      plannedAt: new Date(formDate || new Date()).toISOString(),
      notes: formNote || "",
    };

    let rollback: null | (() => void) = null;

    // optimistic UI
    useToothStore.setState((s: any) => {
      const current = s.teethData?.[formTooth] ?? [];
      const next = { ...s.teethData, [formTooth]: [...current, plannedProc] };
      rollback = () =>
        useToothStore.setState((s2: any) => {
          const arr = (s2.teethData?.[formTooth] ?? []).slice(0, -1);
          return { ...s2, teethData: { ...s2.teethData, [formTooth]: arr } };
        });
      return { ...s, teethData: next };
    });

    try {
      await api.patch(
        `/patients/${patientId}/teeth/${formTooth}/add-procedure`,
        plannedProc
      );
      window.dispatchEvent(new Event("patient:refresh"));
      setAddOpen(false);
    } catch (err) {
      if (rollback) rollback();
      console.error("Failed to add planned procedure:", err);
      alert("Could not add the planned procedure. Please try again.");
    } finally {
      setBusyAdd(false);
    }
  }

  async function onCommentEnter(
    e: React.KeyboardEvent<HTMLInputElement>,
    tooth: string,
    idx: number
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      await updateProcedureNote(tooth, idx, comment);
      setEditingId(null);
    }
  }

  /* -------------------------------- UI -------------------------------- */

  return (
    <section className="mt-16 mb-4 px-3 sm:px-4">
      {/* Small section title + search */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[22px] font-semibold text-gray-700">Treatment</h3>

        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md border border-gray-300">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-xs w-44 focus:outline-none"
          />
        </div>
      </div>

      {/* Card-like table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md ring-1 ring-gray-200 overflow-hidden ">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-[11px] tracking-wider">
            <tr className="[&>th]:px-4 [&>th]:py-2 border-b border-gray-200">
              <th className="text-left font-bold">Procedure</th>
              <th className="text-left font-bold">Tooth</th>
              <th className="text-left font-bold">Date</th>
              <th className="text-left font-bold">Comment</th>
              <th className="text-left font-bold">Status</th>
              <th className="w-10 text-right">
                <button
                  onClick={openAdd}
                  className="h-6 w-6 inline-flex items-center justify-center text-gray-600 hover:text-gray-900"
                  title="Add planned"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No treatments yet.
                </td>
              </tr>
            ) : (
              filteredRows.map(({ id, tooth, proc, idx }) => {
                const isCompleted =
                  (proc.status ??
                    (proc.createdAt ? "completed" : "planned")) === "completed";
                const editable = !isCompleted && within24h(proc.plannedAt);

                return (
                  <tr key={id} className="bg-white">
                    <td className="px-4 py-2 align-middle">
                      <span
                        className="px-2 py-1 rounded text-white text-xs font-semibold"
                        style={{
                          backgroundColor: proc.color || procColor(proc.type),
                        }}
                      >
                        {proc.type}
                      </span>
                    </td>

                    <td className="px-4 py-2 align-middle font-semibold">
                      {tooth}
                    </td>

                    <td className="px-4 py-2 align-middle">
                      <div className="relative inline-block">
                        <input
                          type="text"
                          className={`border rounded px-2 pr-6 py-1 text-sm w-28 text-gray-700 ${
                            isCompleted ? "bg-gray-50" : ""
                          }`}
                          value={
                            (isCompleted ? proc.createdAt : proc.plannedAt)
                              ? new Date(
                                  (isCompleted
                                    ? proc.createdAt
                                    : proc.plannedAt) as string
                                ).toLocaleDateString()
                              : ""
                          }
                          readOnly
                        />
                        <CalendarIcon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </td>

                    <td className="px-4 py-2 align-middle">
                      {editingId === id ? (
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          onKeyDown={(e) => onCommentEnter(e, tooth, idx)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full max-w-[320px] focus:ring-1 focus:ring-blue-400"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm">
                            {proc.notes || (
                              <span className="text-gray-400 italic">
                                Lorum ipsum
                              </span>
                            )}
                          </span>
                          <button
                            onClick={() => {
                              if (editable) {
                                setEditingId(id);
                                setComment(proc.notes || "");
                              }
                            }}
                            disabled={!editable}
                            className={`${
                              editable
                                ? "text-blue-500 hover:text-blue-700"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title={
                              editable
                                ? "Edit comment"
                                : "Completed or older than 24h"
                            }
                          >
                            <FileText size={16} />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-2 align-middle">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          Planned
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 align-middle text-right">
                      <button
                        onClick={() =>
                          editable ? removeProcedureFromTooth(tooth, idx) : null
                        }
                        className={`${
                          editable
                            ? "text-gray-500 hover:text-red-600"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        title={
                          editable
                            ? "Delete planned"
                            : "Completed or older than 24h"
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
{/* 
      <p className="text-xs text-gray-500 mt-3">
        • Adding here creates a <b>Planned</b> row. When you add the same
        procedure on the chart, a <b>Completed</b> one will appear and the
        planned row will be hidden.
      </p> */}

      {/* ----------------------------- Add Modal ----------------------------- */}
      <Transition show={isAddOpen} as={Fragment}>
        <Dialog
          onClose={() => setAddOpen(false)}
          className="fixed inset-0 z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-black/40" />
          </Transition.Child>

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="transition-transform duration-200"
              enterFrom="opacity-0 -translate-y-2 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="transition-transform duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 -translate-y-2 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 p-5">
                <Dialog.Title className="text-base font-semibold text-gray-800">
                  Add Planned Procedure
                </Dialog.Title>

                <form onSubmit={submitAdd} className="mt-4 space-y-3">
                  {/* Tooth */}
                  <div className="grid grid-cols-3 items-center gap-3">
                    <label className="text-sm text-gray-600">Tooth</label>
                    <div className="col-span-2">
                      <select
                        className="w-full border rounded-md px-2 py-1.5 text-sm"
                        value={formTooth}
                        onChange={(e) => setFormTooth(e.target.value)}
                      >
                        {FDI_ALL.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Procedure */}
                  <div className="grid grid-cols-3 items-center gap-3">
                    <label className="text-sm text-gray-600">Procedure</label>
                    <div className="col-span-2">
                      <select
                        className="w-full border rounded-md px-2 py-1.5 text-sm"
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                      >
                        {(procedureCategories ?? []).map((cat) => (
                          <optgroup key={cat.title} label={cat.title}>
                            {(cat.procedures ?? []).map((p) => (
                              <option
                                key={`${cat.title}-${p.type}`}
                                value={p.type}
                              >
                                {p.type}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="grid grid-cols-3 items-center gap-3">
                    <label className="text-sm text-gray-600">Date</label>
                    <div className="col-span-2 relative">
                      <input
                        type="date"
                        className="w-full border rounded-md px-2 py-1.5 text-sm "
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                      />
                      {/* <CalendarIcon className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" /> */}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="grid grid-cols-3 items-center gap-3">
                    <label className="text-sm text-gray-600">Comment</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Optional note"
                        className="w-full border rounded-md px-2 py-1.5 text-sm"
                        value={formNote}
                        onChange={(e) => setFormNote(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddOpen(false)}
                      className="px-4 py-1.5 rounded-md border text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={busyAdd}
                      className="px-4 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {busyAdd ? "Adding…" : "Add Planned"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
