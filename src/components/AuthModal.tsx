import { useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
  accountType?: "customer" | "business";
}

const AuthModal = ({ open, onClose, redirectTo, accountType = "customer" }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const defaultRedirect = accountType === "business" ? "/business-dashboard" : "/community";
  const finalRedirect = redirectTo || defaultRedirect;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signup") {
      try {
        await signUp({ name, email, password });
        setSuccess("Account created successfully.");
        onClose();
        navigate(finalRedirect);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to create account.");
      }
    } else {
      try {
        await signIn({ email, password });
        onClose();
        navigate(finalRedirect);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to sign in.");
      }
    }
    setLoading(false);
  };

  const titles = {
    customer: {
      login: "Welcome back",
      signup: "Join the Community",
      loginDesc: "Sign in to connect with your Alief neighbors.",
      signupDesc: "Create an account to join discussions, leave reviews, and more.",
    },
    business: {
      login: "Business Login",
      signup: "Register Your Business",
      loginDesc: "Sign in to manage your business profile, post jobs, and connect with customers.",
      signupDesc: "Create a business account to get listed, post jobs, and grow your business.",
    },
  };

  const t = titles[accountType];

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-card border rounded-2xl shadow-elevated w-full max-w-md mx-4 p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
            {mode === "login" ? t.login : t.signup}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" ? t.loginDesc : t.signupDesc}
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder={accountType === "business" ? "Business name" : "Full name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-primary">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              className="text-primary font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
