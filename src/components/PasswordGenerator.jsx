import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

// React Icons
import { FaCopy, FaKey, FaLightbulb, FaCheck, FaShieldAlt, FaRedo } from "react-icons/fa";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Refs for GSAP animations
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const strengthBarRef = useRef(null);
  const tipsRef = useRef(null);

  const generatePassword = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let charSet = "";
      if (includeLowercase) charSet += lowercaseChars;
      if (includeUppercase) charSet += uppercaseChars;
      if (includeNumbers) charSet += numberChars;
      if (includeSymbols) charSet += symbolChars;

      if (!charSet) {
        setPassword("Please select at least one option");
        setStrength("");
        setIsGenerating(false);
        return;
      }

      let generatedPassword = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        generatedPassword += charSet[randomIndex];
      }

      setPassword(generatedPassword);
      evaluateStrength(generatedPassword);
      setCopied(false);
      setIsGenerating(false);
    }, 300);
  };

  const evaluateStrength = (pass) => {
    let strengthValue = 0;
    if (pass.length >= 8) strengthValue++;
    if (pass.length >= 12) strengthValue++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strengthValue++;
    if (/[0-9]/.test(pass)) strengthValue++;
    if (/[^A-Za-z0-9]/.test(pass)) strengthValue++;

    if (strengthValue <= 2) setStrength("Weak");
    else if (strengthValue <= 4) setStrength("Medium");
    else setStrength("Strong");
  };

  const copyToClipboard = () => {
    if (!password) return;

    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopied(true);
        
        // Animate the copy button
        gsap.to(".copy-btn", {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  // Initialize animations
  useEffect(() => {
    generatePassword();
    
    // Animate container entrance
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    
    // Animate icon
    gsap.fromTo(iconRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)", delay: 0.2 }
    );
    
    // Animate title
    gsap.fromTo(titleRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.4 }
    );
    
    // Animate subtitle
    gsap.fromTo(subtitleRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.5 }
    );
    
    // Animate tips section
    gsap.fromTo(tipsRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 1 }
    );
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate strength bar when strength changes
  useEffect(() => {
    if (strengthBarRef.current && strength) {
      const width = strength === "Weak" ? "33%" : strength === "Medium" ? "66%" : "100%";
      
      gsap.to(strengthBarRef.current, {
        width,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        overwrite: true
      });
      
      // Pulse animation for the bar
      gsap.to(strengthBarRef.current, {
        scaleX: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      });
    }
  }, [strength]);

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto border border-purple-500/30"
    >
      {/* Header with Icon */}
      <div className="text-center mb-6">
        <div
          ref={iconRef}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg"
        >
          <FaShieldAlt className="text-2xl text-white" />
        </div>
        <h1 ref={titleRef} className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Password Generator
        </h1>
        <p ref={subtitleRef} className="text-gray-400">
          Create strong and secure passwords instantly
        </p>
      </div>

      {/* Password Display */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between bg-gray-800/80 rounded-xl p-4 pr-14 border border-purple-500/20 shadow-inner">
          <span className="font-mono text-lg text-white truncate tracking-wider">
            {password}
          </span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyToClipboard}
            className="copy-btn absolute right-2 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer p-2"
            title="Copy to clipboard"
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-400 bg-green-900/30 p-1 rounded-full"
              >
                <FaCheck className="text-xl" />
              </motion.div>
            ) : (
              <div className="bg-purple-900/30 p-1 rounded-full">
                <FaCopy className="text-xl" />
              </div>
            )}
          </motion.button>
        </div>

        {/* Strength Indicator */}
        {strength && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Password Strength</span>
              <span
                className={`font-semibold ${
                  strength === "Weak"
                    ? "text-red-400"
                    : strength === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {strength}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800">
              <div
                ref={strengthBarRef}
                className={`h-2 rounded-full ${
                  strength === "Weak"
                    ? "bg-red-500 shadow-sm shadow-red-500/50"
                    : strength === "Medium"
                    ? "bg-yellow-500 shadow-sm shadow-yellow-500/50"
                    : "bg-green-500 shadow-sm shadow-green-500/50"
                }`}
                style={{ width: '0%' }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-5 mb-6">
        <div>
          <div className="flex justify-between text-gray-300 mb-2">
            <label className="font-medium">Password Length</label>
            <span className="font-mono bg-purple-900/40 px-2 py-1 rounded text-purple-300">
              {length}
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="24"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>24</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: "uppercase",
              label: "Uppercase",
              state: includeUppercase,
              set: setIncludeUppercase,
            },
            {
              id: "lowercase",
              label: "Lowercase",
              state: includeLowercase,
              set: setIncludeLowercase,
            },
            {
              id: "numbers",
              label: "Numbers",
              state: includeNumbers,
              set: setIncludeNumbers,
            },
            {
              id: "symbols",
              label: "Symbols",
              state: includeSymbols,
              set: setIncludeSymbols,
            },
          ].map(({ id, label, state, set }) => (
            <motion.label
              key={id}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center justify-between cursor-pointer p-3 rounded-lg border ${
                state
                  ? "bg-purple-900/30 border-purple-500/50"
                  : "bg-gray-800/50 border-gray-700"
              } transition-colors`}
            >
              <span className="text-gray-300">{label}</span>
              <input
                type="checkbox"
                checked={state}
                onChange={() => set(!state)}
                className="sr-only peer"
              />
              <div
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  state ? "bg-purple-600" : "bg-gray-700"
                }`}
              >
                <motion.div
                  className={`w-3 h-3 rounded-full absolute top-1 left-1 ${
                    state ? "bg-white" : "bg-gray-400"
                  }`}
                  animate={{ x: state ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                ></motion.div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generatePassword}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center relative overflow-hidden"
      >
        {isGenerating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: "linear",
            }}
          />
        )}
        <span className="relative z-10 flex items-center">
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <FaRedo className="mr-2" />
              </motion.div>
              Generating...
            </>
          ) : (
            <>
              <FaKey className="mr-2" /> Generate Password
            </>
          )}
        </span>
      </motion.button>

      {/* Security Tips */}
      <div 
        ref={tipsRef}
        className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-purple-500/20"
      >
        <h3 className="font-medium text-purple-400 mb-2 flex items-center">
          <FaLightbulb className="mr-2 text-yellow-400" /> Security Tips
        </h3>
        <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
          <li>Use at least 12 characters for better security</li>
          <li>Include numbers, symbols, and both uppercase & lowercase letters</li>
          <li>Avoid common words or predictable patterns</li>
          <li>Use unique passwords for different accounts</li>
        </ul>
      </div>

      <style jsx>{`
        input[type="range"].slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(192, 132, 252, 0.8);
        }
        
        input[type="range"].slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(192, 132, 252, 0.8);
          border: none;
        }
      `}</style>
    </motion.div>
  );
};

export default PasswordGenerator;