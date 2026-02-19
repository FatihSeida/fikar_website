import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 shadow-xl border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground font-serif">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground font-sans">
            The page you are looking for does not exist. It might have been moved or deleted.
          </p>

          <div className="mt-6">
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors w-full font-mono">
              Return to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
