"use client";
import { MascotState } from "@/components/MascotState";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <MascotState 
        type="error"
        title="Something went wrong!"
        description="We've encountered an unexpected error. Please try again."
      />
      <Button onClick={() => reset()} className="mt-4">
        Try Again
      </Button>
    </div>
  );
}
