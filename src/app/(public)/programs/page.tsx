import { getPrograms } from "@/services/program-actions";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants";
import {
  Home,
  UtensilsCrossed,
  Stethoscope,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const programIcons: Record<string, React.ElementType> = {
  "Housing Assistance Program": Home,
  "Food Security Initiative": UtensilsCrossed,
  "Healthcare Access Fund": Stethoscope,
  "Education Support Grant": GraduationCap,
  "Small Business Relief": Briefcase,
};

export default async function ProgramsPage() {
  const { programs, error } = await getPrograms();

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const activePrograms = programs?.filter((p) => p.status === "ACTIVE") || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Assistance Programs</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse available government assistance programs. Create an account to apply
              for programs that match your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePrograms.map((program) => {
              const Icon = programIcons[program.title] || HeartHandshake;
              const statusColor = STATUS_COLORS[program.status] || "";
              const statusLabel = STATUS_LABELS[program.status] || program.status;

              return (
                <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className={statusColor}>
                        {statusLabel}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{program.title}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Budget</h4>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(Number(program.budget))}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Requirements</h4>
                        <ul className="space-y-1">
                          {program.requirements.split("\n").slice(0, 3).map((req, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-primary mt-1 shrink-0" />
                              {req.replace("- ", "")}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {program._count?.applications || 0} applications submitted
                      </div>
                    </div>
                    <Button className="w-full mt-6" asChild>
                      <Link href="/register">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {activePrograms.length === 0 && (
            <div className="text-center py-16">
              <HeartHandshake className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Active Programs</h2>
              <p className="text-muted-foreground">
                There are currently no active assistance programs. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}