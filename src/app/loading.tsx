import { MascotState } from "@/components/MascotState";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <MascotState 
        type="loading"
        title="Loading..."
        description="Gathering the best local pros for you..."
      />
    </div>
  );
}
