import type React from "react";

import { useState } from "react";

function toGitHubBranchName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .slice(0, 255); // Limit to GitHub's max branch length
}

export default function InputEchoPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    const converted = toGitHubBranchName(e.target.value);

    setOutputText(converted);
    // Reset copied state when input changes
    if (copied) setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!inputText) return;

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Github Branch Converter
        </h1>

        <div className="mb-6">
          <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-2">
            Branch Name
          </label>
          <input
            id="textInput"
            type="text"
            value={inputText}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Input branch name .."
          />
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-gray-700">Output:</h2>
            <button
              onClick={copyToClipboard}
              disabled={!outputText}
              className={`p-2 rounded-md transition-colors ${
                !outputText
                  ? "text-gray-400 cursor-not-allowed"
                  : copied
                  ? "bg-green-100 text-green-600"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>
          <div className="min-h-[50px] p-2 bg-white border border-gray-200 rounded relative group">
            {outputText ? (
              <div className="break-words">{outputText}</div>
            ) : (
              <span className="text-gray-400 italic">...</span>
            )}
          </div>
          {copied && <p className="text-green-600 text-xs mt-1 text-right">Copied to clipboard!</p>}
        </div>
      </div>
    </div>
  );
}
