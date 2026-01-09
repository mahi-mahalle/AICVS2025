import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

/* =======================
   WINNERS DATA
======================= */
const winnersData = {
  FY: {
    gold: "Aarav Sharma",
    silver: "Neha Kulkarni",
    bronze: "Rohan Patil",
  },
  SY: {
    gold: "Ananya Deshpande",
    silver: "Siddharth Joshi",
    bronze: "Pooja Kulkarni",
  },
  TY: {
    gold: "Aditya Mahajan",
    silver: "Isha Mehta",
    bronze: "Kunal Shah",
  },
};

/* =======================
   REALISTIC PARTY POPPER CONFETTI + AFTERGLOW
======================= */
const Confetti = ({ trigger }) => {
  const mainPieceCount = 160;
  const afterglowCount = 18;
  const colors = ["#a855f7", "#c084fc", "#22d3ee", "#67e8f9", "#facc15", "#fde047", "#ffffff", "#ff7eb3", "#ec4899"];

  return (
    <>
      <AnimatePresence>
        {trigger && (
          <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
            {/* Main burst - only when trigger is true */}
            {Array.from({ length: mainPieceCount }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const velocity = 500 + Math.random() * 800;
              const driftX = (Math.random() - 0.5) * 600;
              const driftY = (Math.random() - 0.5) * 200;
              const spinDirection = Math.random() > 0.5 ? 1 : -1;
              const spinAmount = 3 + Math.random() * 8;
              const delay = Math.random() * 0.6;

              return (
                <motion.div
                  key={`burst-${i}-${Date.now()}`} // Ensure unique keys per burst
                  initial={{ x: "50vw", y: "10vh", rotate: Math.random() * 360, opacity: 0 }}
                  animate={{
                    x: `calc(50vw + ${Math.cos(angle) * velocity + driftX}px)`,
                    y: `calc(10vh + ${Math.sin(angle) * velocity + driftY + 1000}px)`,
                    rotate: 360 * spinDirection * spinAmount,
                    opacity: [0, 1, 1, 0.8, 0.4, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ delay, duration: 8 + Math.random() * 5, ease: [0.1, 0.3, 0.4, 1] }}
                  style={{
                    position: "absolute",
                    width: 5 + Math.random() * 10,
                    height: 18 + Math.random() * 25,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    borderRadius: "4px",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Persistent afterglow - always visible */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        {Array.from({ length: afterglowCount }).map((_, i) => {
          const startX = Math.random() * window.innerWidth;
          const startY = window.innerHeight + 100;

          return (
            <motion.div
              key={`persistent-glow-${i}`}
              initial={{ x: startX, y: startY, opacity: 0 }}
              animate={{
                y: -200,
                x: startX + (Math.random() - 0.5) * 300,
                opacity: [0, 0.08, 0.08, 0.05],
              }}
              transition={{
                duration: 30 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10,
              }}
              style={{
                position: "absolute",
                width: 6 + Math.random() * 6,
                height: 20 + Math.random() * 15,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: "4px",
              }}
            />
          );
        })}
      </div>
    </>
  );
};

const Winners = () => {
  const [activeTab, setActiveTab] = useState("SY");
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef(null);

  const winners = winnersData[activeTab];

  // Neural network background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;
    const connectionDistance = 150;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(147, 51, 234, 0.6)";
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Trigger confetti burst exactly 1 second after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 15000);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (year) => {
    if (year === activeTab) return;
    setActiveTab(year);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 15000);
  };

  return (
    <div className="relative bg-[#0a0e27] min-h-screen text-white overflow-hidden">
      {/* Neural canvas background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Pulsing glow blobs + ambient stage lighting */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-50">
        <motion.div
          className="absolute left-[-20%] top-1/3 h-[800px] w-[800px] rounded-full bg-purple-600/20 blur-3xl"
          animate={{ x: [0, 100, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-[-20%] bottom-1/3 h-[800px] w-[800px] rounded-full bg-cyan-500/20 blur-3xl"
          animate={{ x: [0, -100, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      <Header />

      <Confetti trigger={showConfetti} />

      <div className="relative z-20 flex flex-col items-center px-6 pt-32 pb-44">
        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-6xl md:text-8xl font-black mb-32 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
          style={{ textShadow: "0 0 40px rgba(168,85,247,0.6)" }}
        >
          Kaggle Winners 🏆
        </motion.h1>

        {/* TABS */}
        <div className="flex gap-12 mb-40">
          {["FY", "SY", "TY"].map((year) => (
            <motion.button
              key={year}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange(year)}
              className={`relative px-12 py-4 rounded-2xl font-bold text-xl tracking-wide overflow-hidden
                ${activeTab === year
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 shadow-2xl shadow-purple-600/60"
                  : "border border-purple-400/40 text-purple-200 hover:border-purple-400/70"
                }`}
            >
              {activeTab === year && (
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-2xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              )}
              {year}
            </motion.button>
          ))}
        </div>

        {/* PODIUM SECTION - Mobile responsive */}
        <div className="w-full max-w-6xl">
          <div className="flex flex-col items-center md:flex-row md:items-end justify-center gap-8 md:gap-32">
            {/* SILVER */}
            <div className="flex flex-col items-center">
              <motion.div
                key={`silver-name-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6 }}
                className="mb-12 text-2xl md:text-3xl font-medium text-gray-300 text-center"
                style={{ textShadow: "0 0 20px rgba(255,255,255,0.4)" }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  🥈 {winners.silver}
                </motion.div>
              </motion.div>

              <div className="relative">
                <motion.div
                  key={`silver-podium-${activeTab}`}
                  initial={{ y: 300 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="w-32 h-40 rounded-t-2xl bg-gradient-to-b from-gray-400 to-gray-600 shadow-2xl"
                />
                {/* Reflection */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent blur-xl opacity-30 scale-y-[-0.4] translate-y-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 2 }}
                />
              </div>
            </div>

            {/* GOLD - Center */}
            <div className="flex flex-col items-center order-first md:order-none">
              <motion.div
                key={`gold-name-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="mb-16 text-3xl md:text-4xl font-black text-yellow-300 text-center"
                style={{ textShadow: "0 0 30px rgba(255,220,0,0.8)" }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  👑 {winners.gold}
                </motion.div>
              </motion.div>

              <div className="relative">
                <motion.div
                  key={`gold-podium-${activeTab}`}
                  initial={{ y: 300 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="w-40 h-56 rounded-t-2xl bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 shadow-2xl relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                {/* Gold glow pulse */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-yellow-300/50 to-yellow-600/20 blur-2xl rounded-t-2xl -z-10"
                  animate={{
                    boxShadow: [
                      "0 0 60px rgba(255,215,0,0.7)",
                      "0 0 90px rgba(255,215,0,1)",
                      "0 0 60px rgba(255,215,0,0.7)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Reflection */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent blur-2xl opacity-40 scale-y-[-0.4] translate-y-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 2.2 }}
                />
              </div>
            </div>

            {/* BRONZE */}
            <div className="flex flex-col items-center">
              <motion.div
                key={`bronze-name-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7 }}
                className="mb-8 text-2xl md:text-3xl font-medium text-orange-400 text-center"
                style={{ textShadow: "0 0 20px rgba(205,127,50,0.6)" }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  🥉 {winners.bronze}
                </motion.div>
              </motion.div>

              <div className="relative">
                <motion.div
                  key={`bronze-podium-${activeTab}`}
                  initial={{ y: 300 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="w-32 h-32 rounded-t-2xl bg-gradient-to-b from-orange-400 to-orange-700 shadow-2xl"
                />
                {/* Reflection */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent blur-xl opacity-30 scale-y-[-0.4] translate-y-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 2 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Winners;