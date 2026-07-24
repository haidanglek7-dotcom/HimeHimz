import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Layers, Zap } from 'lucide-react';
import '../../styles/IntroScreen.css';

const TypeWriter = ({ text, start }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!start) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text, start]);

  return (
    <span className="intro-typewriter">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="intro-cursor"
      >
        |
      </motion.span>
    </span>
  );
};

const IntroScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter'); // enter → reveal → typing → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 800);
    const t2 = setTimeout(() => setPhase('typing'), 2800);
    const t3 = setTimeout(() => setPhase('exit'), 4200);
    const t4 = setTimeout(() => onComplete(), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const words = [
    { text: "WELCOME", highlight: false },    { text: "WELCOME", highlight: false },
    { text: "TO", highlight: false },
    { text: "HIME", highlight: false },
    { text: "PORTFOLIO", highlight: true },
    { text: "WEBSITE", highlight: true }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="intro-screen"
          initial={{ opacity: 1, scale: 1 }}
          animate={phase === 'exit' ? { opacity: 0, scale: 1.05, filter: 'blur(20px)' } : { opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => { if (phase === 'exit') setPhase('done'); }}
        >
          {/* Background visuals */}
          <div className="intro-bg-layer">
            <div className="intro-orb orb-1" />
            <div className="intro-orb orb-2" />
            <div className="grid-bg opacity-30" />
          </div>

          <div className="intro-content-wrapper">
            {/* Animated Icons */}
            <div className="intro-icon-list">
              {[Code2, Layers, Zap].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="intro-icon-item"
                >
                  <Icon size={24} className="intro-icon" />
                </motion.div>
              ))}
            </div>

            {/* Main Text Reveal */}
            <div className="intro-text-center">
              <motion.h1
                className="intro-heading"
                variants={containerVariants}
                initial="hidden"
                animate={phase !== 'enter' ? "visible" : "hidden"}
              >
                <div className="intro-heading-row">
                  {words.slice(0, 3).map((w, i) => (
                    <motion.span key={i} variants={wordVariants} className="intro-word">
                      {w.text}
                    </motion.span>
                  ))}
                </div>
                <div className="intro-heading-row highlight-row">
                  {words.slice(3).map((w, i) => (
                    <motion.span 
                      key={i} 
                      variants={wordVariants} 
                      className={`intro-word ${w.highlight ? 'glow-text-primary highlighted' : ''}`}
                    >
                      {w.text}
                    </motion.span>
                  ))}
                </div>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={phase === 'typing' || phase === 'exit' ? { opacity: 1 } : {}}
                className="intro-subtext-container"
              >
                <div className="intro-subtext-inner">
                  <span className="intro-subtext-prefix">⊕</span>
                  <TypeWriter text="himehimz.com" start={phase === 'typing'} />
                </div>
              </motion.div>
            </div>

            {/* Premium Loader */}
            <div className="intro-loader-container">
              <motion.div
                className="intro-loader-track"
                initial={{ opacity: 0, width: 0 }}
                animate={phase !== 'enter' ? { opacity: 1, width: '240px' } : {}}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="intro-loader-bar"
                  initial={{ width: '0%' }}
                  animate={{
                    width: (phase === 'exit' || phase === 'typing') ? '100%' : '30%'
                  }}
                  transition={{ 
                    width: { duration: phase === 'typing' ? 1.5 : 2.5, ease: [0.65, 0, 0.35, 1] }
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;