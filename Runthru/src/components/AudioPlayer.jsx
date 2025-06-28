

const AudioPlayer = ({ audioUrl }) => {
  if (!audioUrl) {
    return null; // Don't render if no audio URL is provided
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Listen to Explanation:</h3>
      <audio controls src={audioUrl} className="w-full">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
