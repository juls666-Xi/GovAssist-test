"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, CheckCircle, X } from "lucide-react";
import { registerUser } from "@/services/auth-actions";

type AuthView = "login" | "register" | "success";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
}

export function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const router = useRouter();
  const [view, setView] = useState<AuthView>(defaultView);
  
  // Login state
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Register state
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid email or password");
        setLoginLoading(false);
        return;
      }

      onClose();
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setLoginError("An unexpected error occurred");
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setRegisterError(result.error);
      setRegisterLoading(false);
      return;
    }

    setView("success");
    setRegisterLoading(false);
  }

  const handleClose = () => {
    onClose();
    // Reset states after animation
    setTimeout(() => {
      setView(defaultView);
      setLoginError("");
      setRegisterError("");
      setLoginLoading(false);
      setRegisterLoading(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary mb-4">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            {view === "login" && "Welcome back"}
            {view === "register" && "Create Account"}
            {view === "success" && "Account Created!"}
          </DialogTitle>
          <DialogDescription>
            {view === "login" && "Sign in to your GovAssist account"}
            {view === "register" && "Register for GovAssist services"}
            {view === "success" && "Your account has been created successfully"}
          </DialogDescription>
        </DialogHeader>

        {view === "login" && (
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    setLoginError("");
                  }}
                  className="text-primary hover:underline font-medium bg-transparent border-none cursor-pointer"
                >
                  Create one
                </button>
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>Admin: admin@govassist.gov / admin123</p>
              <p>Staff: staff@govassist.gov / staff123</p>
              <p>Citizen: jane@example.com / citizen123</p>
            </div>
          </div>
        )}

        {view === "register" && (
          <div className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-3">
              {registerError && (
                <Alert variant="destructive">
                  <AlertDescription>{registerError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="reg-fullName">Full Name</Label>
                <Input
                  id="reg-fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                  id="reg-username"
                  name="username"
                  placeholder="johndoe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    name="password"
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Min 8 chars, uppercase, lowercase, number, special"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    {showRegPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="reg-confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone">Phone (Optional)</Label>
                <Input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-address">Address (Optional)</Label>
                <Input
                  id="reg-address"
                  name="address"
                  placeholder="123 Main Street, City"
                />
              </div>

              <Button type="submit" className="w-full" disabled={registerLoading}>
                {registerLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setRegisterError("");
                  }}
                  className="text-primary hover:underline font-medium bg-transparent border-none cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        )}

        {view === "success" && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-muted-foreground">
              Your account has been created successfully. Please sign in to continue.
            </p>
            <Button
              onClick={() => setView("login")}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}