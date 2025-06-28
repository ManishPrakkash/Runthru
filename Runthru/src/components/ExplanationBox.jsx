import React from 'react';

const ExplanationBox = ({ explanation, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Generating explanation...</p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 dark:text-gray-400">
        <p>Your step-by-step explanation will appear here.</p>
      </div>
    );
  }

  // Basic highlighting: Replace [HIGHLIGHT]...[/HIGHLIGHT] with styled spans
  const renderExplanation = () => {
    const parts = explanation.split(/(\[HIGHLIGHT\](.*?)\[\/HIGHLIGHT\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[HIGHLIGHT]') && part.endsWith('[/HIGHLIGHT]')) {
        const highlightedText = part.substring('[HIGHLIGHT]'.length, part.length - '[/HIGHLIGHT]'.length);
        return <span key={index} className="explanation-highlight">{highlightedText}</span>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner overflow-y-auto max-h-96">
      <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
        {renderExplanation()}
      </p>
    </div>
  );
};

export default ExplanationBox;