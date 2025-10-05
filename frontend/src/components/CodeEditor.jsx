import React from 'react';

const CodeEditor = ({ code, setCode, isBlind , onCheatAttempt }) => {
  const editorClasses = isBlind
    ? "bg-black text-black caret-black w-full h-96 p-4 border border-gray-700 rounded-md font-mono text-lg focus:outline-none resize-none blind-editor"
    : "bg-gray-800 text-white w-full h-96 p-4 border border-gray-600 rounded-md font-mono text-lg focus:outline-none resize-none";
  
 const handleCopyPasteCut = (e) => {
    e.preventDefault();
    onCheatAttempt(e.type + '-attempt'); 
    alert("Copying, pasting, and cutting is disabled.");
  };
  
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      onCopy={handleCopyPasteCut}
      onCut={handleCopyPasteCut}
      onPaste={handleCopyPasteCut}
      className={editorClasses}
      spellCheck="false"
      placeholder={isBlind ? '' : 'Write your code here...'}
    />
  );
};

export default CodeEditor;