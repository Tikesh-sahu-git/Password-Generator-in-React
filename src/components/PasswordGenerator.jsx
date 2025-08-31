import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// React Icons
import { FaCopy, FaKey, FaLightbulb, FaCheck } from "react-icons/fa";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState("");
  const [copied, setCopied] = useState(false);

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const generatePassword = () => {
    let charSet = "";
    if (includeLowercase) charSet += lowercaseChars;
    if (includeUppercase) charSet += uppercaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;

    if (!charSet) {
      setPassword("Please select at least one option");
      setStrength("");
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
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto border border-gray-200"
    >
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
        Password Generator
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Create strong and secure passwords
      </p>

      {/* Password Display */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 pr-12 border border-gray-300 shadow-sm">
          <span className="font-mono text-lg truncate">{password}</span>

          <button
            onClick={copyToClipboard}
            className="absolute right-2 text-indigo-600 hover:text-indigo-800 transition-transform transform hover:scale-110 cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? (
              <FaCheck className="text-green-600 text-xl" />
            ) : (
              <FaCopy className="text-xl" />
            )}
          </button>
        </div>

        {/* Strength Indicator Bar */}
        {strength && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Strength</span>
              <span
                className={`font-semibold ${
                  strength === "Weak"
                    ? "text-red-600"
                    : strength === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {strength}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  strength === "Weak"
                    ? "w-1/3 bg-red-500"
                    : strength === "Medium"
                    ? "w-2/3 bg-yellow-500"
                    : "w-full bg-green-500"
                }`}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-gray-700 font-medium">
            Password Length: {length}
          </label>
          <input
            type="range"
            min="4"
            max="24"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <label
              key={id}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-gray-700">{label}</span>
              <input
                type="checkbox"
                checked={state}
                onChange={() => set(!state)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-indigo-600 relative transition">
                <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 peer-checked:translate-x-5 transition"></div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={generatePassword}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center"
      >
        <FaKey className="mr-2" /> Generate Password
      </motion.button>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <FaLightbulb className="mr-2" /> Password Tips
        </h3>
        <ul className="text-sm text-blue-600 list-disc pl-5 space-y-1">
          <li>Use at least 12 characters</li>
          <li>Include numbers, symbols, and both cases</li>
          <li>Avoid common words or patterns</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default PasswordGenerator;
