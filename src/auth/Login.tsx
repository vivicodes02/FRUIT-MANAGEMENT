import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple Admin Login (Hardcoded for demo)
    if (email === "admin@fruit.com" && password === "admin123") {
      // Simulate API delay
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true"); // Simple auth flag
        navigate("/dashboard");
      }, 800);
    } else {
      setError("Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="background.jpeg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-orange-500/40" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-4xl mx-3 sm:mx-6 flex rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl min-h-[500px] sm:min-h-[560px]">

        {/* Left Panel - Illustration */}
        <aside className="hidden md:block w-5/12 relative overflow-hidden">
          <img
            src="sidepic.jpeg"
            alt="Fruits illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-white font-extrabold text-2xl lg:text-3xl leading-tight drop-shadow">
              Fresh start<br />every day
            </h2>
            <p className="text-orange-100 text-xs lg:text-sm mt-2 leading-relaxed drop-shadow">
              Manage your inventory, track freshness,<br />
              and grow your fruit business.
            </p>
          </div>
        </aside>

        {/* Right Panel - Login Form */}
        <main className="flex-1 relative flex items-center justify-center px-6 sm:px-10 lg:px-14 py-10 sm:py-12">
          <div className="absolute inset-0 backdrop-blur-xl bg-white/75" />

          <div className="relative z-10 w-full max-w-sm">
            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent leading-tight">
                FRUITS AND VEGETABLES <br /> MANAGEMENT SYSTEM
              </h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-colors ${email ? "text-orange-500" : "text-gray-400"}`}>
                    <MdEmail />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 bg-white/80 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-colors ${password ? "text-orange-500" : "text-gray-400"}`}>
                    <RiLockPasswordFill />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-orange-200 bg-white/80 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm tracking-wide hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all shadow-md hover:shadow-orange-300 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}