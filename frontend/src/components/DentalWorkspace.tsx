import Toolbar from "./Toolbar";
import ToothChart from "./ToothChart";

export default function DentalWorkspace() {
  return (
    <div className="flex items-start gap-6 p-4">
      {/* Toolbar on the left */}
      <div className="sticky top-4">
        <Toolbar />
      </div>

      {/* Tooth chart on the right */}
      <div className="flex-1 overflow-x-auto">
        <ToothChart />
      </div>
    </div>
  );
}
