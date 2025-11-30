import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { OtpInput } from "@/components/OtpInput";
import { MobileLayout } from "@/components/MobileLayout";
import { Mail, Phone, ArrowLeft, Eye, EyeOff, MapPin, Shield } from "lucide-react";
import { toast } from "sonner";

type AuthStep = "method" | "email-login" | "phone-login" | "otp" | "signup";

export default function Auth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>("method");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleBack = () => {
    if (step === "otp") {
      setStep(authMethod === "email" ? "email-login" : "phone-login");
    } else if (step === "email-login" || "phone-login" || "signup") {
      setStep("method");
    }
  };

  const handleSendOtp = () => {
    if (authMethod === "email" && !email) {
      toast.error("Please enter your email");
      return;
    }
    if (authMethod === "phone" && !phone) {
      toast.error("Please enter your phone number");
      return;
    }
    setStep("otp");
    toast.success("Verification code sent!");
  };

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Welcome back!");
    navigate("/permissions");
  };

  const handleOtpComplete = (otp: string) => {
    console.log("OTP:", otp);
    toast.success("Verified successfully!");
    navigate("/permissions");
  };

  const handleSignup = () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Account created!");
    navigate("/permissions");
  };

  return (
    <MobileLayout className="gradient-hero">
      <div className="flex-1 flex flex-col p-6 safe-top safe-bottom">
        {step !== "method" && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="self-start p-2 -ml-2 rounded-full hover:bg-muted transition-colors touch-target"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </motion.button>
        )}

        <div className="flex-1 flex flex-col justify-center">
          {step === "method" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-soft mb-4">
                  <div className="relative">
                    <MapPin className="w-8 h-8 text-primary-foreground" />
                    <Shield className="w-4 h-4 text-primary-foreground absolute -bottom-0.5 -right-0.5" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Welcome to Attendify</h1>
                <p className="text-muted-foreground">Secure attendance tracking</p>
              </div>

              <div className="space-y-3">
                <Card
                  variant="interactive"
                  className="p-4"
                  onClick={() => {
                    setAuthMethod("email");
                    setStep("email-login");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Continue with Email</p>
                      <p className="text-sm text-muted-foreground">Sign in with your email</p>
                    </div>
                  </div>
                </Card>

                <Card
                  variant="interactive"
                  className="p-4"
                  onClick={() => {
                    setAuthMethod("phone");
                    setStep("phone-login");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-info" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Continue with Phone</p>
                      <p className="text-sm text-muted-foreground">We'll send you a code</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setStep("signup")}
                  className="text-primary font-semibold touch-target"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </motion.div>
          )}

          {step === "email-login" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Sign in with Email</h1>
                <p className="text-muted-foreground">Enter your credentials to continue</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground touch-target"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button className="text-sm text-primary font-medium touch-target">
                  Forgot password?
                </button>
              </div>

              <div className="space-y-3 pt-4">
                <Button className="w-full" size="lg" onClick={handleLogin}>
                  Sign In
                </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={handleSendOtp}>
                  Sign in with OTP
                </Button>
              </div>
            </motion.div>
          )}

          {step === "phone-login" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Sign in with Phone</h1>
                <p className="text-muted-foreground">We'll send you a verification code</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleSendOtp}>
                Send Code
              </Button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-foreground">Verify Your {authMethod === "email" ? "Email" : "Phone"}</h1>
                <p className="text-muted-foreground">
                  Enter the 6-digit code sent to<br />
                  <span className="font-medium text-foreground">
                    {authMethod === "email" ? email : phone}
                  </span>
                </p>
              </div>

              <OtpInput onComplete={handleOtpComplete} />

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
                <button className="text-primary font-semibold touch-target">
                  Resend Code
                </button>
              </div>
            </motion.div>
          )}

          {step === "signup" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                <p className="text-muted-foreground">Join your team on Attendify</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground touch-target"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{" "}
                <button className="text-primary font-medium">Terms of Service</button>{" "}
                and{" "}
                <button className="text-primary font-medium">Privacy Policy</button>
              </p>

              <Button className="w-full" size="lg" onClick={handleSignup}>
                Create Account
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
