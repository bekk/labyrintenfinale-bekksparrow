import type { Route } from "./+types/home";
import { useRef, useState, useEffect } from "react";
import CharactersRow, { CharacterPopup } from "../components/CharactersRow";
import { characters } from "../data/characters";

import nrk from "app/assets/nrk.mp4"

export function meta({}: Route.MetaArgs) {
  return [{ title: "Video Player" }];
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [isUserScrubbing, setIsUserScrubbing] = useState(false);
  const pauseTimerRef = useRef<number | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<typeof characters[0] | null>(null);
  
  const handlePlay = () => {
    if (pauseTimerRef.current) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    setPaused(false);
    setSelectedCharacter(null);
  };

  const handlePause = () => {
    if (isUserScrubbing) {
      return;
    }
    
    if (pauseTimerRef.current) {
      window.clearTimeout(pauseTimerRef.current);
    }
    
    pauseTimerRef.current = window.setTimeout(() => {
      if (videoRef.current?.paused) {
        setPaused(true);
      }
    }, 150);
  };

  const handleSeeking = () => {
    setIsUserScrubbing(true);
    setPaused(false);
  };

  const handleSeeked = () => {
    setTimeout(() => {
      setIsUserScrubbing(false);
      
      if (videoRef.current?.paused) {
        setPaused(true);
      }
    }, 200);
  };

  const handleCharacterClick = (character: typeof characters[0]) => {
    setSelectedCharacter(prevCharacter => 
      prevCharacter?.name === character.name ? null : character
    );
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const playPromise = videoElement.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing video:', error);
        });
      }
    }

    return () => {
      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && videoRef.current) {
        e.preventDefault();
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="relative w-full h-full">
        <video 
          ref={videoRef} 
          src={nrk} 
          controls 
          className="w-full h-full object-contain"
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
        />

        {paused && (
          <div className="absolute inset-0 pointer-events-auto" onClick={() => videoRef.current?.play()}>
            <div className="absolute inset-0 bg-black opacity-69"></div>
            {/* Characters row - positioned at the bottom */}
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-white text-center mb-2 text-sm">
                Episode Characters
              </div>
              <CharactersRow onCharacterClick={handleCharacterClick} />
            </div>
            {/* Character popup - shows when a character is selected */}
            {selectedCharacter && (
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 max-w-xl max-h-[70vh] overflow-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="relative">
                  <button 
                    onClick={() => setSelectedCharacter(null)}
                    className="absolute top-2 right-2 bg-black bg-opacity-40 rounded-full p-1 text-white hover:bg-opacity-60"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <CharacterPopup character={selectedCharacter} />
                </div>
              </div>
            )}
          </div>
        )}  
      </div>
    </div>
  );
}
