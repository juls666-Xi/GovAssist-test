"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Shield,
  FileText,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Building2,
  HeartHandshake,
  GraduationCap,
  Stethoscope,
  Home,
  UtensilsCrossed,
  Briefcase,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Easy Applications",
    description: "Submit applications online with guided forms and document uploads.",
  },
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Track your application status in real-time from submission to approval.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security and encryption.",
  },
  {
    icon: Users,
    title: "Multi-role Access",
    description: "Citizens, staff, and administrators each have tailored dashboards.",
  },
];

const programs = [
  { icon: Home, title: "Housing Assistance", description: "Financial aid for safe and affordable housing." },
  { icon: UtensilsCrossed, title: "Food Security", description: "Monthly food vouchers for families in need." },
  { icon: Stethoscope, title: "Healthcare Access", description: "Medical expense coverage for uninsured residents." },
  { icon: GraduationCap, title: "Education Support", description: "Scholarships and educational materials for students." },
  { icon: Briefcase, title: "Small Business Relief", description: "Grants and loans for local businesses." },
  { icon: HeartHandshake, title: "Community Support", description: "Various community welfare programs." },
];

const stats = [
  { value: "10,000+", label: "Applications Processed" },
  { value: "5,000+", label: "Citizens Assisted" },
  { value: "15+", label: "Active Programs" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function HomePage() {
  const { openAuth } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium mb-8">
              <Shield className="h-4 w-4 text-primary" />
              Government Digital Services
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Access Government Assistance{" "}
              <span className="text-primary">Seamlessly</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              GovAssist connects citizens with vital government programs. Apply for assistance,
              track your applications, and manage documents all in one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => openAuth("register")}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/programs">View Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose GovAssist?</h2>
            <p className="text-muted-foreground">
              Our platform is designed to make government assistance accessible, transparent, and efficient.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Assistance Programs</h2>
            <p className="text-muted-foreground">
              Browse our comprehensive range of government assistance programs designed to support our community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.title} className="rounded-lg border bg-background p-6 hover:shadow-lg transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <program.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{program.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                <Link
                  href="/programs"
                  className="text-sm text-primary font-medium hover:underline inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Getting assistance is simple with our streamlined four-step process.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Register", description: "Create your account with basic information" },
              { step: "02", title: "Apply", description: "Select a program and submit your application" },
              { step: "03", title: "Upload", description: "Upload required documents securely" },
              { step: "04", title: "Track", description: "Monitor your application status in real-time" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of citizens who have successfully accessed government assistance through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => openAuth("register")}>
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-black hover:bg-primary-foreground/10" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold">GovAssist</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Government Assistance and Document Management System
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li><Link href="/programs" className="hover:text-primary">Programs</Link></li>
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Government Building, Main St
                </li>
                <li>support@govassist.gov</li>
                <li>+1 (555) 000-0000</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} GovAssist. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}