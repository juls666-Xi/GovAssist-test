import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You do not have permission to access this page. Please contact an administrator
          if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}