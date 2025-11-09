import React from 'react';

const ExplanationBox = ({ explanation, loading, type = 'explanation' }) => {
  const getTitle = () => {
    switch (type) {
      case 'debug':
        return 'Debugging Analysis';
      case 'refactor':
        return 'Refactoring Suggestions';
      case 'dryrun':
        return 'Dry Run Analysis';
      default:
        return 'Explanation';
    }
  };

  const getLoadingMessage = () => {
    switch (type) {
      case 'debug':
        return 'Analyzing code for issues...';
      case 'refactor':
        return 'Analyzing code structure...';
      case 'dryrun':
        return 'Analyzing execution flow...';
      default:
        return 'Analyzing your code...';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'debug':
        return 'Debugging analysis will appear here.';
      case 'refactor':
        return 'Refactoring suggestions will appear here.';
      case 'dryrun':
        return 'Step-by-step dry run analysis will appear here.';
      default:
        return 'Your step-by-step explanation will appear here.';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-48">
        <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">{getTitle()}</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">{getLoadingMessage()}</p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="flex flex-col justify-center items-center h-48 text-gray-500 dark:text-gray-400">
        <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">{getTitle()}</h2>
        <p>{getPlaceholder()}</p>
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
      <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">{getTitle()}</h2>
      <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
        {renderExplanation()}
      </p>
    </div>
  );
};

export default ExplanationBox;