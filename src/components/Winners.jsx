import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Medal, Crown, Star, User, Award, Trophy } from "lucide-react";

/* =======================
   MOCK COMPONENTS
======================= */
const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-[#0a0e27]/40 backdrop-blur-xl border-b border-white/5">
    <div className="flex items-center gap-2 text-xl md:text-2xl font-black tracking-tighter">
      <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs">A</span>
      </div>
      <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        AICVS
      </span>
    </div>
    <nav className="hidden md:flex gap-10 text-sm font-semibold text-gray-400">
      {["Home", "Winners", "Events", "Community"].map((item) => (
        <a key={item} href="#" className={`hover:text-white transition-all ${item === 'Winners' ? 'text-purple-400' : ''}`}>
          {item}
        </a>
      ))}
    </nav>
    <button className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-purple-400 hover:text-white transition-all duration-300">
      Join Us
    </button>
  </header>
);

const Footer = () => (
  <footer className="relative z-20 py-16 px-8 border-t border-white/5 bg-[#050816]">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
      <div className="text-gray-500 text-sm font-medium">
        © 2024 AICVS Kaggle Committee. <br /> All rights reserved.
      </div>
      <div className="flex justify-center gap-8">
        <Award className="text-purple-500/40" size={32} />
        <Trophy className="text-purple-500/40" size={32} />
        <Star className="text-purple-500/40" size={32} />
      </div>
      <div className="flex gap-6 text-gray-400 justify-center md:justify-end text-sm">
        {["LinkedIn", "Instagram", "GitHub"].map(social => (
          <span key={social} className="hover:text-purple-400 cursor-pointer transition-colors font-semibold">
            {social}
          </span>
        ))}
      </div>
    </div>
  </footer>
);

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
   CONFETTI COMPONENT
======================= */
const Confetti = ({ activeTab }) => {
  const colors = ["#a855f7", "#22d3ee", "#facc15", "#ffffff", "#ec4899"];
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={`${activeTab}-confetti-${i}`}
          initial={{ 
            x: `${Math.random() * 100}vw`, 
            y: -20, 
            rotate: 0, 
            opacity: 1 
          }}
          animate={{
            y: "110vh",
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            x: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 200}px)`,
          }}
          transition={{ 
            duration: 3 + Math.random() * 4, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 2 
          }}
          style={{
            position: "absolute",
            width: 6 + Math.random() * 8,
            height: 12 + Math.random() * 10,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: "2px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        />
      ))}
    </motion.div>
  );
};

/* =======================
   REUSABLE PODIUM SPOT
======================= */
const PodiumSpot = ({ name, height, color, delay, isCenter = false, icon, medalLabel, className = "" }) => {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div className={`flex flex-col items-center ${isCenter ? 'z-20 scale-105' : 'z-10'} w-full md:w-72 ${className}`}>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
        className="flex flex-col items-center mb-6 relative"
      >
        <div className={`relative mb-4 group`}>
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-2 p-1 ${isCenter ? 'border-yellow-400/50' : 'border-white/20'} bg-white/5 backdrop-blur-md flex items-center justify-center relative overflow-hidden`}
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-lg md:text-2xl ${isCenter ? 'bg-yellow-400/20 text-yellow-200' : 'bg-white/10 text-gray-300'}`}>
              {initials}
            </div>
            
            {isCenter && (
              <div className="absolute inset-0 bg-yellow-400/10 blur-xl animate-pulse" />
            )}
          </motion.div>
          
          
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-2 -right-2 bg-[#0a0e27] p-1.5 rounded-full border border-white/10 shadow-xl"
          >
            {icon}
          </motion.div>
        </div>

        <div className="text-center px-4">
          <h3 className={`font-black tracking-tight leading-none mb-1 ${isCenter ? 'text-2xl md:text-3xl text-yellow-300' : 'text-lg md:text-xl text-white'}`}>
            {name}
          </h3>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
            {isCenter ? "Champion" : "Finalist"}
          </p>
        </div>
      </motion.div>

      
      <div className="relative w-full max-w-[200px] md:max-w-none px-4 md:px-0">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ 
            duration: 1.2, 
            delay, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className={`origin-bottom w-full ${height} rounded-t-3xl bg-gradient-to-b ${color} shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group`}
        >
          <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
             <span className="text-6xl md:text-8xl font-black select-none tracking-tighter opacity-40 text-white leading-none">
               {medalLabel[0]}
             </span>
             <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/60 -mt-2">
               Place
             </span>
          </div>


          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-150%]"
            animate={{ x: ["-150%", "150%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          

          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 blur-[1px]" />
        </motion.div>


        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-6 bg-purple-600/20 blur-2xl rounded-full" />
      </div>
    </div>
  );
};

/* =======================
   MAIN APP
======================= */
const App = () => {
  const [activeTab, setActiveTab] = useState("SY");
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef(null);

  const winners = winnersData[activeTab];


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
        ctx.fill();
      });

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - dist / 150)})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    setShowConfetti(true);
    const hideTimeout = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(hideTimeout);
  }, [activeTab]);

  return (
    <div className="relative bg-[#050816] min-h-screen text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <Header />
      
      <AnimatePresence>
        {showConfetti && <Confetti key={activeTab} activeTab={activeTab} />}
      </AnimatePresence>

      <main className="relative z-10 pt-32 pb-32 px-6 max-w-7xl mx-auto">

        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-black tracking-[0.2em] mb-8"
          >
            <Star size={16} fill="currentColor" />
            <span>KAGGLE COMPETITION 2025</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent mb-12 leading-[0.9] text-center"
          >
            Meet Our Kaggle <br className="hidden md:block" /> Winners
          </motion.h1>

          <div className="flex justify-center gap-3 p-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl w-fit mx-auto shadow-2xl">
            {["FY", "SY", "TY"].map((year) => (
              <button
                key={year}
                onClick={() => setActiveTab(year)}
                className={`px-10 py-3 rounded-2xl text-sm font-black transition-all duration-500 tracking-wider ${
                  activeTab === year
                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </section>

        {/* PODIUM SECTION */}
        <section className="relative mt-24">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-16 md:gap-0 min-h-[600px]">

            <PodiumSpot 
              key={`${activeTab}-silver`}
              name={winners.silver} 
              rank="Silver" 
              height="h-44 md:h-56" 
              color="from-slate-400/80 to-slate-800/90" 
              delay={0.4} 
              icon={<Medal className="text-slate-300" size={24} />}
              medalLabel="2nd"
              className="order-2 md:order-1"
            />


            <PodiumSpot 
              key={`${activeTab}-gold`}
              name={winners.gold} 
              rank="Gold" 
              height="h-56 md:h-80" 
              color="from-yellow-400/90 via-yellow-600/90 to-amber-900/95" 
              delay={0.2} 
              isCenter={true}
              icon={<Crown className="text-yellow-400" size={32} />}
              medalLabel="1st"
              className="order-1 md:order-2"
            />


            <PodiumSpot 
              key={`${activeTab}-bronze`}
              name={winners.bronze} 
              rank="Bronze" 
              height="h-32 md:h-40" 
              color="from-orange-600/80 to-orange-950/95" 
              delay={0.6} 
              icon={<Medal className="text-orange-400" size={24} />}
              medalLabel="3rd"
              className="order-3 md:order-3"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;