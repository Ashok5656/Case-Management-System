import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Smartphone, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import clari5Logo from "figma:asset/6dfdb4c1a68d250267231b32de1f1a07e05b6acf.png";

interface TwoFactorAuthProps {
  username: string;
  onVerify: () => void;
  onBack: () => void;
}

export function TwoFactorAuth({ username, onVerify, onBack }: TwoFactorAuthProps) {
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "email" | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mock user data with masked contact info
  const mockUserData = {
    mobile: "+1 (***) ***-1234",
    email: "su***@clari5.com"
  };

  useEffect(() => {
    if (otpSent && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, countdown]);

  const handleMethodSelect = (method: "sms" | "email") => {
    setSelectedMethod(method);
    setOtpSent(true);
    setCountdown(30);
    setError("");
    // Simulate OTP sending
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join("");
      handleVerify(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      while (newOtp.length < 6) newOtp.push("");
      setOtp(newOtp);
      
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      } else {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  const handleVerify = (otpCode: string) => {
    setIsVerifying(true);
    setError("");

    // Simulate OTP verification (accept any 6-digit code for demo)
    setTimeout(() => {
      if (otpCode.length === 6) {
        onVerify();
      } else {
        setError("Please enter the complete OTP code");
        setIsVerifying(false);
      }
    }, 1000);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    
    setOtpSent(true);
    setCountdown(30);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  const handleManualVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP code");
      return;
    }
    handleVerify(otpCode);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Screen Background Image with Overlay - Same as Login */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY1NzYxOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080')`
          }}
        />
        
        {/* Dark Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A53A0]/95 via-[#1e3d7a]/90 to-gray-900/95" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
        
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff40_1px,transparent_1px),linear-gradient(to_bottom,#ffffff40_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* 2FA Card */}
          <div className="bg-white dark:bg-gray-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </button>

            {/* Logo and Title */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-6"
              >
                <img 
                  src={clari5Logo} 
                  alt="Clari5 Logo" 
                  className="h-12 w-auto object-contain"
                />
              </motion.div>
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                <Shield className="size-8 text-white" />
              </div>

              <h1 className="text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Two-Factor Authentication
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Hi {username}, verify your identity to continue
              </p>
            </div>

            {!selectedMethod ? (
              /* Method Selection */
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                  Choose how you'd like to receive your verification code:
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMethodSelect("sms")}
                  className="w-full p-4 rounded-[8px] border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-gray-900 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[8px] bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Smartphone className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-gray-900 dark:text-white mb-1">SMS Verification</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Send code to {mockUserData.mobile}
                      </div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMethodSelect("email")}
                  className="w-full p-4 rounded-[8px] border-2 border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 bg-white dark:bg-gray-900 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[8px] bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                      <Mail className="size-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-gray-900 dark:text-white mb-1">Email Verification</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Send code to {mockUserData.email}
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            ) : (
              /* OTP Input */
              <div className="space-y-6">
                {/* Success message for OTP sent */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-[8px] p-3 flex items-start gap-3"
                >
                  <CheckCircle2 className="size-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Verification code sent to your {selectedMethod === "sms" ? "mobile" : "email"}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {selectedMethod === "sms" ? mockUserData.mobile : mockUserData.email}
                    </p>
                  </div>
                </motion.div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                    Enter the 6-digit code
                  </p>
                  
                  {/* OTP Input Boxes */}
                  <div className="flex gap-2 justify-center mb-4">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-14 text-center text-xl font-semibold"
                        disabled={isVerifying}
                      />
                    ))}
                  </div>

                  {/* Demo hint */}
                  <div className="text-center mb-4">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Demo: Enter any 6-digit code
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-[8px] p-3"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Verify Button */}
                <Button
                  onClick={handleManualVerify}
                  disabled={isVerifying || otp.join("").length !== 6}
                  className="w-full h-[48px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Didn't receive the code?
                  </p>
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Resend code in {countdown}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                {/* Change Method */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => {
                      setSelectedMethod(null);
                      setOtpSent(false);
                      setOtp(["", "", "", "", "", ""]);
                      setError("");
                    }}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Use different verification method
                  </button>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="size-3" />
                <span>Your account is protected with 2FA security</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2026 Clari5 CustomerXPs. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}