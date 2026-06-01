import { Navbar } from "@/components/layout/navbar";
import { Shield, Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We uphold the highest standards of honesty and transparency in all our operations.",
  },
  {
    icon: Target,
    title: "Efficiency",
    description: "Streamlined processes ensure timely delivery of assistance to those who need it most.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Open and accountable governance with clear visibility into program operations.",
  },
  {
    icon: Heart,
    title: "Compassion",
    description: "Every citizen is treated with dignity and respect throughout their journey.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About GovAssist</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              GovAssist is the official Government Assistance and Document Management System,
              designed to bridge the gap between citizens and vital government support programs.
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              Our mission is to ensure that every eligible citizen can easily access government
              assistance programs. We believe that bureaucratic barriers should never stand between
              people and the support they need. Through digital innovation, we are transforming how
              government services are delivered.
            </p>

            <h2 className="text-2xl font-bold mb-4">What We Do</h2>
            <p className="text-muted-foreground mb-6">
              GovAssist serves as a centralized platform where citizens can discover, apply for, and
              track their applications for various government assistance programs. From housing support
              to healthcare access, education grants to food security initiatives, our platform covers
              a comprehensive range of programs designed to support our community.
            </p>

            <h2 className="text-2xl font-bold mb-4">How We Help</h2>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Digital application submission with guided forms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Secure document upload and verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Real-time application status tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Automated notifications and updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Streamlined claim scheduling and document downloads</span>
              </li>
            </ul>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="rounded-lg border bg-card p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions about GovAssist or need assistance with the platform?
              Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}