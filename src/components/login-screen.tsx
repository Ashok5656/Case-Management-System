import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, User, Eye, EyeOff, Shield, ShieldCheck, Zap, Brain, ArrowRight, TrendingUp, Activity, AlertTriangle, Fingerprint, Award, CheckCircle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import clari5Logo from "figma:asset/6dfdb4c1a68d250267231b32de1f1a07e05b6acf.png";

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setError("");
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Screen Background - Matches 2FA Page */}
      <div className="absolute inset-0 z-0">
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

      {/* Animated Grid Pattern - Softer */}
      <div className="absolute inset-0 opacity-[0.02] z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Floating Particles - Slower and more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full blur-[1px]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content - Full Width */}
      <div className="relative z-10 min-h-screen grid lg:grid-cols-[55%_45%] xl:grid-cols-[60%_40%]">
        
        {/* Left Side - Brand & Information - Full Height */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center p-8 lg:p-16 xl:p-24 relative"
        >
          <div className="max-w-2xl space-y-10 relative z-10">
            {/* Logo & Title */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)] group hover:bg-white/10 transition-all duration-300">
                  <Shield className="size-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="h-8 w-px bg-white/20" />
                <img 
                  src={clari5Logo} 
                  alt="Clari5 Logo" 
                  className="h-8 w-auto object-contain brightness-0 invert drop-shadow-lg opacity-90"
                />
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] text-white tracking-tight drop-shadow-2xl">
                Advanced Fraud
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                  Detection Platform
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-blue-100/70 mb-10 leading-relaxed font-light max-w-lg">
                Next-generation enterprise security with AI-powered compliance monitoring and real-time threat intelligence.
              </p>
            </div>

            {/* Real-time Stats Cards - HUD Style */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { 
                  icon: TrendingUp, 
                  value: "99.8%", 
                  label: "Accuracy", 
                  delay: 0.4,
                  // Explicit classes for Tailwind to detect
                  bgClass: "bg-emerald-500/10",
                  borderClass: "border-emerald-500/20", 
                  textClass: "text-emerald-400",
                  glowClass: "from-emerald-500/50"
                },
                { 
                  icon: Shield, 
                  value: "2.4M+", 
                  label: "Blocked", 
                  delay: 0.5,
                  bgClass: "bg-blue-500/10",
                  borderClass: "border-blue-500/20", 
                  textClass: "text-blue-400",
                  glowClass: "from-blue-500/50"
                },
                { 
                  icon: Zap, 
                  value: "<2ms", 
                  label: "Response", 
                  delay: 0.6,
                  bgClass: "bg-amber-500/10",
                  borderClass: "border-amber-500/20", 
                  textClass: "text-amber-400",
                  glowClass: "from-amber-500/50"
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ delay: stat.delay, duration: 0.5 }}
                  className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group cursor-default relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${stat.glowClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border ${stat.bgClass} ${stat.borderClass}`}>
                    <stat.icon className={`size-5 ${stat.textClass}`} />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1 text-white tracking-tight">{stat.value}</div>
                  <div className="text-[10px] font-medium text-blue-200/50 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Key Features List - Minimalist */}
            <div className="space-y-4 pt-4">
              {[
                { 
                  icon: Brain, 
                  title: "AI-Powered Detection", 
                  desc: "Machine learning algorithms detect anomalies instantly", 
                  bgClass: "bg-cyan-500/10",
                  borderClass: "border-cyan-500/20",
                  textClass: "text-cyan-300",
                  hoverTextClass: "group-hover:text-cyan-300",
                  hoverBorderClass: "group-hover:border-cyan-400/40"
                },
                { 
                  icon: ShieldCheck, 
                  title: "Complete Compliance", 
                  desc: "Full AML, KYC, and regulatory compliance monitoring", 
                  bgClass: "bg-purple-500/10",
                  borderClass: "border-purple-500/20",
                  textClass: "text-purple-300",
                  hoverTextClass: "group-hover:text-purple-300",
                  hoverBorderClass: "group-hover:border-purple-400/40"
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors ${feature.bgClass} ${feature.borderClass} ${feature.hoverBorderClass}`}>
                    <feature.icon className={`size-5 ${feature.textClass}`} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold text-white mb-0.5 transition-colors ${feature.hoverTextClass}`}>{feature.title}</h3>
                    <p className="text-xs text-blue-200/50">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Certifications - Subtle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 pt-6 border-t border-white/5 max-w-md"
            >
               <span className="text-[10px] text-white/30 uppercase tracking-widest">Certified Security</span>
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                     <Award className="size-3 text-yellow-400" />
                     <span className="text-xs text-gray-300">ISO 27001</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                     <ShieldCheck className="size-3 text-green-400" />
                     <span className="text-xs text-gray-300">SOC 2</span>
                  </div>
               </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Right Side - Login Card - Full Height */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center p-6 lg:p-12 xl:p-20 relative"
        >
          <div className="w-full max-w-md relative z-10">
            {/* White Card Container - No Glass Effect */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 p-8 lg:p-10 relative overflow-hidden">
              
              {/* Decorative background blobs inside card - kept subtle */}
              <div className="absolute -top-[100px] -right-[100px] w-[200px] h-[200px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[60px]" />
              <div className="absolute -bottom-[100px] -left-[100px] w-[200px] h-[200px] bg-purple-50/50 dark:bg-purple-900/10 rounded-full blur-[60px]" />

              <div className="relative z-10">
                {/* Logo Area */}
                <div className="flex justify-center mb-8">
                   <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100">
                      <img 
                        src={clari5Logo} 
                        alt="Clari5 Logo" 
                        className="h-6 w-auto object-contain"
                      />
                   </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[260px] mx-auto">
                    Sign in to access your secure dashboard
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username */}
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                      Username
                    </Label>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                        focusedField === 'username' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                      }`}>
                        <User className="size-5" />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        className={`pl-12 pr-4 h-[46px] text-sm rounded-[8px] bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                          focusedField === 'username' 
                            ? 'border-blue-500/50 ring-4 ring-blue-500/10 bg-white dark:bg-gray-800' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300'
                        }`}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                        focusedField === 'password' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                      }`}>
                        <Lock className="size-5" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className={`pl-12 pr-12 h-[46px] text-sm rounded-[8px] bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                          focusedField === 'password' 
                            ? 'border-blue-500/50 ring-4 ring-blue-500/10 bg-white dark:bg-gray-800' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300'
                        }`}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 text-red-600 dark:text-red-400 text-xs font-medium">
                          <AlertTriangle className="size-4 flex-shrink-0" />
                          <p>{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!username || !password}
                    className={`w-full h-[48px] text-base font-semibold rounded-[8px] shadow-lg transition-all duration-300 group overflow-hidden relative
                      ${(!username || !password) 
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none' 
                        : 'bg-[#2A53A0] hover:bg-[#1e3d7a] text-white shadow-blue-900/20 hover:shadow-blue-900/30 hover:-translate-y-0.5'
                      }`}
                  >
                    {(!username || !password) ? null : (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    )}
                    <span className="mr-2">Secure Sign In</span>
                    <ArrowRight className={`size-5 transition-transform ${(!username || !password) ? '' : 'group-hover:translate-x-1'}`} />
                  </Button>
                </form>

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center justify-center gap-4 opacity-70">
                     <div className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all duration-300 cursor-help" title="Encrypted Connection">
                        <ShieldCheck className="size-3.5 text-emerald-500" />
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">256-bit SSL</span>
                     </div>
                  </div>
                  
                  {/* Copyright */}
                  <div className="mt-6 text-center">
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                      © 2026 Clari5 CustomerXPs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}