import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Home, RefreshCw, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast, Toaster } from "../components/ui/toaster";

const Auth = () => {
  const [step, setStep] = useState("options"); // options, login, signup
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { login, register, loading } = useAuth();

  

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });

  // Function to validate password
  const validatePassword = (pwd) => {
    setPasswordValidation({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  // Generate strong password
  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()";
    
    let generatedPassword = "";
    
    // Ensure at least one of each type
    generatedPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    generatedPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
    generatedPassword += specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Fill remaining characters (total 12 characters)
    const allChars = uppercase + lowercase + numbers + specialChars;
    for (let i = generatedPassword.length; i < 12; i++) {
      generatedPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(generatedPassword);
    validatePassword(generatedPassword);
    toast.success("Strong password generated!");
  };

  const handleGoogleAuth = () => {
    console.log("Continue with Google");
  };

  const handleContinueWithEmail = () => {
    setStep("login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      if (user.role === "guest") {
        navigate("/guest/dashboard");
        toast.success("Logged in successfully");
      } else if (user.role === "staff") {
        navigate("/staff/dashboard");
        toast.success("Logged in successfully");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Check all password validations
    const isPasswordValid = Object.values(passwordValidation).every(v => v === true);
    
    if (!isPasswordValid) {
      toast.error("Please meet all password requirements");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      const user = await register({ name, email, password });
      if (user.role === "guest") {
        navigate("/guest/browse");
        toast.success("Account created successfully");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBackToOptions = () => {
    setStep("options");
    setEmail("");
    setPassword("");
  };

  const handleBackToLogin = () => {
    setStep("login");
  };

  // Password Validation Component
  const PasswordStrengthIndicator = () => {
    const validCount = Object.values(passwordValidation).filter(v => v === true).length;
    const strength = (validCount / 5) * 100;
    
    let strengthColor = "bg-red-500";
    let strengthText = "Weak";
    
    if (validCount >= 4) {
      strengthColor = "bg-green-500";
      strengthText = "Strong";
    } else if (validCount >= 3) {
      strengthColor = "bg-yellow-500";
      strengthText = "Medium";
    }
    
    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Password strength:</span>
          <span className={`text-xs font-medium ${
            validCount >= 4 ? 'text-green-600' : validCount >= 3 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {strengthText}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`${strengthColor} h-1.5 rounded-full transition-all duration-300`} 
            style={{ width: `${strength}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Password Requirements List Component
  const PasswordRequirement = ({ met, text }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <X className="w-3 h-3 text-red-500" />
      )}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );

  // Options Screen (First screen)
  if (step === "options") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-6xl">
          {/* Home Button - Left side */}
          <div className="absolute top-8 left-8">
            <p
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-md text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <Home className="w-10 h-10" />
              Back to Home
            </p>
          </div>

          {/* Auth Card - Centered */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Logo/Brand */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                  Serene Hotel
                </h1>
              </div>

              {/* Auth Card */}
              <div className="bg-card rounded-lg border border-border-light p-6 sm:p-8">
                {/* Title */}
                <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                  Log in or create an account to collaborate
                </h2>

                {/* Google Button */}
                <button
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-border rounded-lg hover:bg-secondary transition-colors mb-4"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-foreground">
                    Continue with Google
                  </span>
                </button>

                {/* OR Divider */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                {/* Email Button */}
                <button
                  onClick={handleContinueWithEmail}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-border rounded-lg hover:bg-secondary transition-colors mb-6"
                >
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Continue with email
                  </span>
                </button>

                {/* Footer */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    <a href="#" className="hover:underline">
                      Do not sell or share my personal info
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Screen (Second screen - Email & Password)
  if (step === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-6xl">
          {/* Home Button - Left side */}
          <div className="absolute top-8 left-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </a>
          </div>

          {/* Auth Card - Centered */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Logo/Brand */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                  Serene Hotel
                </h1>
              </div>

              {/* Auth Card */}
              <div className="bg-card rounded-lg border border-border-light p-6 sm:p-8">
                {/* Back Button */}
                <button
                  onClick={handleBackToOptions}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Log in to your account
                </h2>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      EMAIL
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right mb-6">
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2.5"
                  >
                    {loading ? "Logging in..." : "Log in"}
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No account?{" "}
                    <button
                      onClick={() => setStep("signup")}
                      className="text-primary hover:underline font-medium"
                    >
                      Create one
                    </button>
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                  <p className="text-xs text-muted-foreground">
                    <a href="#" className="hover:underline">
                      Do not sell or share my personal info
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sign Up Screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Home Button - Left side */}
        <div className="absolute top-8 left-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </a>
        </div>

        {/* Auth Card - Centered */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">
                Serene Hotel
              </h1>
            </div>

            {/* Auth Card */}
            <div className="bg-card rounded-lg border border-border-light p-6 sm:p-8">
              {/* Back Button */}
              <button
                onClick={handleBackToLogin}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              {/* Title */}
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Create an account
              </h2>

              {/* Sign Up Form */}
              <form onSubmit={handleSignup}>
                {/* Name Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field with Generator */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Generate strong password
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full pl-9 pr-10 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && <PasswordStrengthIndicator />}
                  
                  {/* Password Requirements */}
                  {password && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Password must contain:</p>
                      <PasswordRequirement met={passwordValidation.length} text="At least 8 characters" />
                      <PasswordRequirement met={passwordValidation.uppercase} text="At least one uppercase letter" />
                      <PasswordRequirement met={passwordValidation.lowercase} text="At least one lowercase letter" />
                      <PasswordRequirement met={passwordValidation.number} text="At least one number" />
                      <PasswordRequirement met={passwordValidation.specialChar} text="At least one special character (!@#$%^&*)" />
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2.5"
                  disabled={loading || Object.values(passwordValidation).some(v => !v) || password !== confirmPassword}
                >
                  {loading ? "Signing up..." : "Sign up"}
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">
                  <a href="#" className="hover:underline">
                    Do not sell or share my personal info
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;