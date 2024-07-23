import React, { useState, useEffect, useCallback } from 'react';
import { FiCopy, FiRefreshCcw } from 'react-icons/fi';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const generatePassword = useCallback(() => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?/';

    let charset = lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    const charsetLength = charset.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsetLength);
      result += charset[randomIndex];
    }
    setPassword(result);
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  const getPasswordStrength = (password) => {
    const lengthCriteria = password.length > 12;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const symbolCriteria = /[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password);

    if (lengthCriteria && uppercaseCriteria && numberCriteria && symbolCriteria) {
      return 'Very Strong';
    } else if (lengthCriteria && (uppercaseCriteria || numberCriteria || symbolCriteria)) {
      return 'Strong';
    } else if (lengthCriteria || (uppercaseCriteria || numberCriteria || symbolCriteria)) {
      return 'Medium';
    } else {
      return 'Weak';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const strengthClass = (strength) => {
    switch (strength) {
      case 'Very Strong':
        return 'text-green-600';
      case 'Strong':
        return 'text-yellow-600';
      case 'Medium':
        return 'text-orange-600';
      case 'Weak':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-2xl border border-gray-300">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">Password Generator</h1>

        <div className="mb-8">
          <label className="block text-gray-700 text-lg font-medium mb-2">Password Length ({length})</label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4caf50 ${((length - 8) / 24) * 100}%, #d3d3d3 ${((length - 8) / 24) * 100}%)`
            }}
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 text-lg font-medium mb-2">Options</label>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={() => setIncludeUppercase(prev => !prev)}
                className="form-checkbox h-5 w-5 text-blue-600 accent-blue-600"
              />
              <span className="text-gray-800 text-lg">Uppercase Letters (ABC)</span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(prev => !prev)}
                className="form-checkbox h-5 w-5 text-blue-600 accent-blue-600"
              />
              <span className="text-gray-800 text-lg">Numbers (123)</span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(prev => !prev)}
                className="form-checkbox h-5 w-5 text-blue-600 accent-blue-600"
              />
              <span className="text-gray-800 text-lg">Symbols (@$!)</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-lg font-semibold text-gray-700">Password Strength: <span className={`font-bold ${strengthClass(getPasswordStrength(password))}`}>{getPasswordStrength(password)}</span></p>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 relative">
          {password && (
            <>
              <p className="text-lg font-semibold text-gray-700">Generated Password:</p>
              <p className="text-xl font-mono mt-2 text-gray-800 break-all">{password}</p>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-16 py-2 px-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition"
              >
                <FiCopy size={20} />
              </button>
              <button
                onClick={generatePassword}
                className="absolute top-2 right-2 py-2 px-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
              >
                <FiRefreshCcw size={20} />
              </button>
              {showToast && (
                <div className="absolute top-14 right-2 p-1 bg-green-600 text-white text-sm rounded-lg shadow-lg">
                  <p>Copied!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
