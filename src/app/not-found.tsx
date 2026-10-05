import { MascotState } from "@/components/MascotState";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <MascotState 
        type="error"
        title="404 - Page Not Found"
        description="The page you are looking for doesn't exist or has been moved."
      />
      <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-4")}>
        Return Home
      </Link>
    </div>
  );
}
