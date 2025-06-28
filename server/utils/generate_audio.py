# server/utils/generate_audio.py
import pyttsx3
import sys
import os

def generate_audio(text, output_file_path):
    try:
        engine = pyttsx3.init()

        # Optional: Configure voice properties (rate, volume, voice ID)
        # voices = engine.getProperty('voices')
        # engine.setProperty('voice', voices[0].id) # Change index for different voices
        # engine.setProperty('rate', 150) # Speed of speech

        engine.save_to_file(text, output_file_path)
        engine.runAndWait()
        print(f"Audio successfully saved to {output_file_path}")
        sys.exit(0) # Indicate success
    except Exception as e:
        print(f"Error generating audio: {e}", file=sys.stderr)
        sys.exit(1) # Indicate failure

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_audio.py <text_to_synthesize> <output_file_path>", file=sys.stderr)
        sys.exit(1)

    text_to_synthesize = sys.argv[1]
    output_file_path = sys.argv[2]

    # Ensure the output directory exists
    output_dir = os.path.dirname(output_file_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    generate_audio(text_to_synthesize, output_file_path)