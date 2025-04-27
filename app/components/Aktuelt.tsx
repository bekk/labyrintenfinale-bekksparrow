import React, { useEffect, useState } from "react";

// Define interfaces for our data structures
interface Topic {
  theme: string;
  question: string;
  description?: string; // Optional since it's added programmatically
}

interface Segment {
  title: string;
  timeStart: string;
  timeEnd: string;
  topics: Topic[];
}

// New interface for time-seek functionality
interface TimeSeekEvent {
  seconds: number;
  segmentTitle: string;
  topicTheme: string;
}

// New interface for profile data
interface Profile {
  name: string;
  timestamp: string;
  seconds: number;
  image?: string;
}

// Import the manus data directly to avoid import issues
//featuered characters:
//Sylvie Listhaug: 2:05
//Erna Solberg: 2:55
//Siv Jensen: 2:55
//Mulla Krekar: 3:55
//Fidel Castro: 7:15
//Knut Hoem: 11:18

const manusData: { segments: Segment[] } = {
  "segments": [
    {
      "title": "Start",
      "timeStart": "0:00",
      "timeEnd": "0:45",
      "topics": [
        {
          "theme": "Intro",
          "question": "Introduksjon til programmet"
        }
      ]
    },
    {
      "title": "News Monologue",
      "timeStart": "0:45",
      "timeEnd": "3:00",
      "topics": [
        {
          "theme": "Antibiotika-resistens",
          "question": "En viktig sak hvor norske kyr har blitt smittet av antibiotikaresistente bakterier. Hva er konsekvensene av dette for landbruket og helsesystemet?"
        },
        {
          "theme": "Julekalender",
          "question": "Erna Solberg åpner første luke. Hvordan fungerer julekalendere i Norge, og hva kan de fortelle oss om kultur og tradisjoner?"
        },
        {
          "theme": "Krisemøte og alkohol",
          "question": "Politiet besøker statsministerens krisemøte og oppdager en overraskende mengde alkohol. Hva er bakgrunnen for slike møter, og hva innebærer det for våre ledere?"
        }
      ]
    },
    {
      "title": "Politics",
      "timeStart": "3:00",
      "timeEnd": "10:00",
      "topics": [
        {
          "theme": "Regjeringsforhandlinger",
          "question": "Venstre og KrF bryter forhandlingene. Erna Solberg omtaler situasjonen som mer en \"samtaleterapi\" enn faktiske forhandlinger. Hva er konsekvensene av dette bruddet for den politiske situasjonen i Norge?"
        },
        {
          "theme": "Politisk miljødebatt",
          "question": "Diskusjon om hvordan det er vanskelig å gjennomføre reell miljøpolitikk med FRP i regjeringen. Hva innebærer dette for fremtidige miljøtiltak og samarbeid?"
        }
      ]
    },
    {
      "title": "Immigrasjon",
      "timeStart": "10:00",
      "timeEnd": "15:00",
      "topics": [
        {
          "theme": "Innvandringspolitikk",
          "question": "Diskusjon om innvandringspolitikk og integreringstiltak"
        },
        {
          "theme": "Grensekontroll",
          "question": "Hvordan håndteres grensekontroll og asylsøkere?"
        }
      ]
    },
    {
      "title": "Kvikkass",
      "timeStart": "15:00",
      "timeEnd": "17:00",
      "topics": [
        {
          "theme": "Kvikkass",
          "question": "Et firma fått mye oppmerksomhet for problemer med distribusjon av lørdagsaviser i distriktene."
        },
        {
          "theme": "Avisdistribusjon",
          "question": "Hvorfor er det utfordrende at lørdagsavisene ikke når frem til abonnentene?"
        }
      ]
    },
    {
      "title": "Skole & språk",
      "timeStart": "17:00",
      "timeEnd": "19:00",
      "topics": [
        {
          "theme": "Norskundervisning",
          "question": "Diskusjonen om hvordan norskundervisningen i skolen oppleves som for teoretisk."
        },
        {
          "theme": "Kritikk av lærebøker",
          "question": "NRKs litteraturjournalist klager over lærebokas kompleksitet."
        }
      ]
    },
    {
      "title": "Museum & helse",
      "timeStart": "19:00",
      "timeEnd": "22:00",
      "topics": [
        {
          "theme": "Destruksjon av utstoppede dyr",
          "question": "Stavanger museum skal destruere gamle utstoppede dyr på grunn av høyt arsenikkinnhold."
        },
        {
          "theme": "Kulturelle referanser",
          "question": "Humoristiske betraktninger om innholdet i julemiddagen i Stavanger."
        }
      ]
    },
    {
      "title": "Internasjonalt",
      "timeStart": "22:00",
      "timeEnd": "25:00",
      "topics": [
        {
          "theme": "Reaksjoner i USA",
          "question": "Det spekuleres i om grunnen til at USA angrer på at de ikke ga Jon Almås flere sjanser."
        },
        {
          "theme": "Moskva og vodka-reklame",
          "question": "Det legges merke til at Almås har hatt noe annet enn vann i glasset under programmene sine."
        }
      ]
    },
    {
      "title": "Ordoppgave",
      "timeStart": "25:00",
      "timeEnd": "27:00",
      "topics": [
        {
          "theme": "Ordoppgave",
          "question": "Deltakerne skal gjette et nytt ord basert på oppgitte ledetråder."
        },
        {
          "theme": "Kreativ språkbruk",
          "question": "Forsøk på å lage nye ord med humoristiske konnotasjoner."
        }
      ]
    },
    {
      "title": "Avslutning",
      "timeStart": "27:00",
      "timeEnd": "60:00",
      "topics": [
        {
          "theme": "Avskjed med programmet",
          "question": "Deltakerne og programlederen forbereder seg på avslutningen av Nytt på Nytt."
        },
        {
          "theme": "Hedersplakett",
          "question": "Guri Skavlan, prosjektleder for programmet, får anerkjennelse for sitt arbeid."
        },
        {
          "theme": "Overgang til ny leder",
          "question": "Introduksjonen av Bård Tufte Johansen som ny programleder."
        }
      ]
    }
  ]
};

// Import the placeholder descriptions
const loremDescriptions = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lacinia malesuada urna, et mollis ipsum dictum et. Fusce eu lorem vel nisi finibus tempor.",
  "Phasellus consequat arcu at justo pellentesque, ac commodo justo lobortis. Vestibulum vel odio eu magna feugiat consectetur. Cras ornare tempus quam.",
  "Maecenas vitae erat in lorem ultricies porttitor. Donec tempor libero nec diam venenatis, vel lacinia massa vulputate. Proin egestas magna non dolor.",
  "Etiam feugiat nibh in dui molestie, vel fermentum nunc venenatis. Nulla facilisi. Cras venenatis justo vel orci cursus, non sagittis metus tincidunt.",
  "Suspendisse potenti. Ut efficitur arcu eget nisi dictum, ac faucibus justo tincidunt. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
  "Curabitur eleifend, odio nec feugiat commodo, ipsum neque lacinia orci. Praesent euismod, justo vel vehicula hendrerit, nisi libero efficitur nibh.",
  "Fusce fermentum purus a elit finibus, in dictum nulla tempus. Nullam fermentum lacus vitae luctus ultricies. Donec luctus nibh nec enim lacinia.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  "Vivamus in risus sed nisi facilisis tempor vel vel nunc. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.",
  "Integer tincidunt felis eget magna condimentum, nec vehicula nisl tempus. Sed ut perspiciatis unde omnis iste natus. Nemo enim ipsam voluptatem."
];

// Add a description to each topic in the data
manusData.segments.forEach(segment => {
  segment.topics.forEach((topic, index) => {
    const descIndex = (index + segment.title.length) % loremDescriptions.length;
    topic.description = loremDescriptions[descIndex];
  });
});

// Profile data for people shown in video clips
const profileData: Profile[] = [
  {
    name: "Sylvi Listhaug",
    timestamp: "2:05",
    seconds: timeToSeconds("2:05"),
    image: "/Sylvie.png"
  },
  {
    name: "Erna Solberg",
    timestamp: "2:55",
    seconds: timeToSeconds("2:55"),
    image: "/Erna.png"
  },
  {
    name: "Siv Jensen",
    timestamp: "2:55",
    seconds: timeToSeconds("2:55"),
    image: "/Siv.png"
  },
  {
    name: "Mulla Krekar",
    timestamp: "3:55",
    seconds: timeToSeconds("3:55"),
    image: "/Mulla.png"
  },
  {
    name: "Fidel Castro",
    timestamp: "7:15",
    seconds: timeToSeconds("7:15")
  },
  {
    name: "Knut Hoem",
    timestamp: "11:18",
    seconds: timeToSeconds("11:18")
  }
];

// Improved utility function to convert MM:SS or MM:SS:FF format to seconds
function timeToSeconds(timeStr: string): number {
  try {
    // Handle potential HH:MM:SS format
    if (timeStr.includes(":")) {
      const parts = timeStr.split(":");
      
      if (parts.length === 2) {
        const [minutes, seconds] = parts.map(Number);
        if (isNaN(minutes) || isNaN(seconds)) {
          console.error(`Invalid time format: ${timeStr}`);
          return 0;
        }
        return minutes * 60 + seconds;
      } else if (parts.length === 3) {
        // HH:MM:SS format
        const [hours, minutes, seconds] = parts.map(Number);
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
          console.error(`Invalid time format: ${timeStr}`);
          return 0;
        }
        return hours * 3600 + minutes * 60 + seconds;
      }
    }
    
    // If we get here, format wasn't recognized
    console.error(`Unrecognized time format: ${timeStr}`);
    return 0;
  } catch (error) {
    console.error(`Error converting time: ${timeStr}`, error);
    return 0;
  }
}

// New interface for chat messages
interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Function to create a unique key for each theme's chat messages
function createThemeKey(theme: string): string {
  return `chat_${theme.toLowerCase().replace(/\s+/g, '_')}`;
}

interface AktueltProps {
  currentTime: number; // Current video time in seconds
  onThemeClick?: (theme: string, question: string) => void;
  onTimeSeek?: (event: TimeSeekEvent) => void; // New prop for seeking to a specific time
}

// Separate component to display profiles in a sidebar menu
export function ProfileMenu({ currentTime, onTimeSeek }: { currentTime: number, onTimeSeek?: (event: TimeSeekEvent) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Filter profiles to only show those that appeared within 2 minutes (120 seconds) of current time
  const nearbyProfiles = profileData.filter(profile => {
    const timeDifference = Math.abs(profile.seconds - currentTime);
    return timeDifference <= 120; // 2 minutes in seconds
  });
  
  // Sort profiles by closeness to current time
  const sortedProfiles = [...nearbyProfiles].sort((a, b) => {
    const diffA = Math.abs(a.seconds - currentTime);
    const diffB = Math.abs(b.seconds - currentTime);
    return diffA - diffB;
  });
  
  // Handle clicking on a profile to seek to that time
  const handleProfileClick = (profile: Profile) => {
    if (onTimeSeek) {
      onTimeSeek({
        seconds: profile.seconds,
        segmentTitle: "Profile",
        topicTheme: profile.name
      });
    }
  };
  
  // If there are no nearby profiles, don't show the menu button
  if (sortedProfiles.length === 0) {
    return null;
  }
  
  return (
    <div className="relative m-4">
      {/* Button to toggle menu */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="py-2 px-6 bg-gray-900 text-white font-medium rounded-xl shadow-lg hover:bg-gray-800 transition-all"
      >
        Viste Profiler {isMenuOpen ? '×' : `(${sortedProfiles.length})`}
      </button>
      
      {/* Horizontal expanding menu from right to left */}
      <div 
        className={`absolute bottom-16 right-0 transform transition-all duration-300 origin-right ${
          isMenuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
        }`}
        style={{ width: "calc(50vw - 4rem)", minWidth: "300px" }}
      >
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg w-full">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold">Viste profiler</h3>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {sortedProfiles.map((profile, index) => (
              <div
                key={index}
                onClick={() => handleProfileClick(profile)}
                className="flex-shrink-0 w-32 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors overflow-hidden flex flex-col"
              >
                <div className="w-full h-32 bg-gray-600 flex-shrink-0 overflow-hidden">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-white font-medium text-sm truncate">{profile.name}</p>
                  <p className="text-gray-400 text-xs">Vist ved {profile.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThemePopup({ theme, question }: { theme: string; question: string }) {
  // Get a random description for this theme
  const descIndex = Math.abs(theme.length) % loremDescriptions.length;
  const description = loremDescriptions[descIndex];
  
  // Create a theme-specific key for this chat
  const themeKey = createThemeKey(theme);
  
  // State for chatbot functionality - use theme in state key to separate chats
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Debug input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Input changed to:", value);
    setInputValue(value);
  };
  
  // Handle key events to prevent video from playing/pausing when typing space
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop spacebar from triggering video play/pause
    if (e.key === " " || e.code === "Space") {
      e.stopPropagation();
    }
  };
  
  // Reset chat when expanding the chat panel
  useEffect(() => {
    if (isExpanded) {
      // Don't reset immediately when opening to prevent flicker
    } else {
      // Reset chat when closing
      setChatMessages([]);
    }
  }, [isExpanded]);
  
  // Debug to show current input value
  useEffect(() => {
    console.log("Current input value:", inputValue);
  }, [inputValue]);
  
  // Function to handle user sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    // Add to chat messages
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    
    console.log(`Chat messages for ${themeKey} after user input:`, newMessages);
    
    // Clear input field
    const userInput = inputValue;
    setInputValue("");
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      // Generate a contextual response based on the theme
      let responseText = "";
      
      if (userInput.toLowerCase().includes("mer") || 
          userInput.toLowerCase().includes("informasjon") ||
          userInput.toLowerCase().includes("fortell")) {
        responseText = `${theme} er et viktig tema i programmet. Det er verdt å merke seg at ${question.substring(0, 40)}...`;
      } else if (userInput.toLowerCase().includes("hvor") || 
                userInput.toLowerCase().includes("når") ||
                userInput.toLowerCase().includes("hvordan")) {
        responseText = `For mer detaljert informasjon om ${theme}, anbefaler jeg å sjekke NRKs nettsider eller Wikipedia.`;
      } else {
        responseText = `Interessant spørsmål om ${theme}! Dette er noe programlederne diskuterte i detalj. Jeg anbefaler å se hele segmentet for å få full forståelse.`;
      }
      
      const botMessage: ChatMessage = {
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatMessages(prevMessages => {
        const updatedMessages = [...prevMessages, botMessage];
        console.log(`Chat messages for ${themeKey} after bot response:`, updatedMessages);
        return updatedMessages;
      });
    }, 1000);
  };
  
  // For debugging
  useEffect(() => {
    console.log("Current chat messages:", chatMessages);
  }, [chatMessages]);
  
  return (
    <div className="w-full h-full max-w-full max-h-full bg-white rounded-lg p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{theme}</h2>
      <p className="text-gray-700 whitespace-pre-line mb-4">{question}</p>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex-1 overflow-hidden flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Beskrivelse:</h3>
        <p className="text-gray-600 whitespace-pre-line">{description}</p>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Fakta:</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
            <li>Sed do eiusmod tempor incididunt ut labore et dolore</li>
            <li>Ut enim ad minim veniam, quis nostrud exercitation</li>
          </ul>
        </div>
        
        {/* Chatbot section - collapsed by default */}
        <div className="mt-6">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            {isExpanded ? "Skjul spørreassistent" : "Spør om dette temaet"}
          </button>
          
          {isExpanded && (
            <div className="mt-3 border border-blue-100 rounded-lg overflow-hidden flex flex-col bg-white" style={{ maxHeight: "300px" }}>
              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-white" style={{ minHeight: "150px" }}>
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 my-8">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <p className="text-gray-800">Spør om noe relatert til «{theme}»</p>
                    <p className="text-xs mt-1 text-gray-600">For eksempel: "Fortell meg mer om dette temaet"</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Reset button when messages exist */}
                    <div className="flex justify-end mb-2">
                      <button 
                        onClick={() => setChatMessages([])} 
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Nullstill samtale
                      </button>
                    </div>
                    
                    {chatMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] px-4 py-2 rounded-lg shadow ${
                            msg.isUser 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-gray-200 text-gray-800 rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words font-medium">{msg.text}</div>
                          <div className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Input area */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-2 bg-white flex z-10">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Skriv et spørsmål om dette temaet..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  style={{ zIndex: 20 }}
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-right">
          <span className="text-xs text-gray-400">Kilde: Nytt på Nytt, {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}

// Get a color for each theme based on the segment title
function getThemeColor(segmentTitle: string): string {
  const colors: Record<string, string> = {
    "Start": "bg-emerald-500",
    "News Monologue": "bg-blue-500",
    "Politics": "bg-red-500",
    "Immigrasjon": "bg-amber-500",
    "Kvikkass": "bg-purple-500",
    "Skole & språk": "bg-cyan-500",
    "Museum & helse": "bg-green-500",
    "Internasjonalt": "bg-orange-500",
    "Ordoppgave": "bg-pink-500",
    "Avslutning": "bg-indigo-500"
  };
  
  return colors[segmentTitle] || "bg-gray-500";
}

// Icon for each theme category
function getSegmentIcon(segmentTitle: string): React.ReactNode {
  switch(segmentTitle) {
    case "Start":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>;
    case "News Monologue":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>;
    case "Politics":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>;
    case "Immigrasjon":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
    case "Kvikkass":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
    case "Skole & språk":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>;
    case "Museum & helse":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>;
    case "Internasjonalt":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    case "Ordoppgave":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>;
    case "Avslutning":
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>;
    default:
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>;
  }
}

export default function Aktuelt({ currentTime, onThemeClick, onTimeSeek }: AktueltProps) {
  // Debug logging for time detection
  useEffect(() => {
    if (currentTime > 900) { // Only log for times > 15 minutes
      console.log(`Checking segments for time: ${currentTime} seconds (${Math.floor(currentTime/60)}:${Math.floor(currentTime%60).toString().padStart(2, '0')})`);
    }
  }, [currentTime]);

  // State for theme finder modal
  const [themeFinderOpen, setThemeFinderOpen] = useState(false);

  // Function to handle time seeking
  const handleTimeSeek = (timeStr: string, segmentTitle: string, topicTheme: string) => {
    if (onTimeSeek) {
      const seconds = timeToSeconds(timeStr);
      onTimeSeek({
        seconds,
        segmentTitle,
        topicTheme
      });
      setThemeFinderOpen(false); // Close modal after selection
    }
  };

  // Find the current segment based on currentTime
  const currentSegment = manusData.segments.find(segment => {
    const startTime = timeToSeconds(segment.timeStart);
    const endTime = timeToSeconds(segment.timeEnd);
    const isInSegment = currentTime >= startTime && currentTime <= endTime;
    
    // Extra debug logging for times > 15 minutes
    if (currentTime > 900) {
      console.log(`Segment "${segment.title}": ${startTime}s-${endTime}s, current: ${currentTime}s, match: ${isInSegment}`);
    }
    
    return isInSegment;
  });

  // Always render a placeholder even if no segment is found, for debugging
  if (!currentSegment) {
    return (
      <div className="flex flex-col p-4 rounded-xl shadow-lg mx-auto max-w-xs backdrop-blur-md bg-black/40 border border-white/10">
        <div className="flex items-center mb-3">
          <div className="bg-red-500 p-2 rounded-lg mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Ingen aktive temaer</h3>
        </div>
        <p className="text-white/70 text-sm mb-3">Nåværende tid: {Math.floor(currentTime/60)}:{Math.floor(currentTime%60).toString().padStart(2, '0')}</p>
        
        <div className="text-xs text-white/50 mt-1 border-t border-white/10 pt-3">
          <p className="font-medium mb-1">Tilgjengelige segmenter:</p>
          <div className="max-h-32 overflow-y-auto">
            {manusData.segments.map((seg, idx) => (
              <div key={idx} className="flex items-center mb-1 opacity-70 hover:opacity-100">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getThemeColor(seg.title).replace('bg-', '') }}></span>
                <span>{seg.title} ({seg.timeStart} - {seg.timeEnd})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get the background color class for the current segment
  const segmentColorClass = getThemeColor(currentSegment.title);
  const segmentIcon = getSegmentIcon(currentSegment.title);

  return (
    <div className="flex flex-col p-4 rounded-xl shadow-lg mx-auto max-w-xs backdrop-blur-md bg-black/40 border border-white/10">
      <div className="flex items-center mb-4">
        <div className={`${segmentColorClass} p-2 rounded-lg mr-3`}>
          {segmentIcon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{currentSegment.title}</h3>
          <p className="text-white/70 text-xs">
            {currentSegment.timeStart} - {currentSegment.timeEnd}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mt-1">
        {currentSegment.topics.map((topic: Topic, index) => (
          <button
            key={index}
            onClick={() => onThemeClick && onThemeClick(topic.theme, topic.question)}
            className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center p-3 backdrop-blur-sm bg-white/10 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
              <div className="mr-3 flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                {index + 1}
              </div>
              <div className="text-left">
                <h4 className="font-medium text-white">{topic.theme}</h4>
                <p className="text-xs text-white/70 line-clamp-1 group-hover:line-clamp-none transition-all">
                  {topic.question.length > 60 ? `${topic.question.substring(0, 60)}...` : topic.question}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Find Theme Button */}
      <button 
        onClick={() => setThemeFinderOpen(true)}
        className="mt-3 py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded flex items-center justify-center border border-white/10 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        Finn tema
      </button>
      
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="text-xs text-white/70">
          Nåværende tid: {Math.floor(currentTime/60)}:{Math.floor(currentTime%60).toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-white/50 px-2 py-1 rounded-full bg-white/5">
          {currentSegment.topics.length} emner
        </div>
      </div>
      
      {/* Theme Finder Modal */}
      {themeFinderOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24" onClick={() => setThemeFinderOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setThemeFinderOpen(false)}></div>
          <div 
            className="relative bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden max-w-md w-full max-h-[70vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Alle temaer</h2>
              <button 
                onClick={() => setThemeFinderOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {manusData.segments.map((segment, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className={`${getThemeColor(segment.title)} w-4 h-4 rounded-full mr-2`}></div>
                    <h3 className="text-white font-medium text-sm">
                      {segment.title} <span className="text-gray-400 text-xs">({segment.timeStart} - {segment.timeEnd})</span>
                    </h3>
                  </div>
                  
                  <div className="pl-6 space-y-2">
                    {segment.topics.map((topic, topicIdx) => (
                      <button 
                        key={topicIdx}
                        onClick={() => handleTimeSeek(segment.timeStart, segment.title, topic.theme)}
                        className="block w-full text-left p-2 rounded hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white mr-2">
                            {topicIdx + 1}
                          </span>
                          <div>
                            <p className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors">{topic.theme}</p>
                            <p className="text-gray-400 text-xs line-clamp-1">
                              {topic.question.length > 50 ? `${topic.question.substring(0, 50)}...` : topic.question}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-700 bg-gray-800 text-center">
              <p className="text-xs text-gray-400">Klikk på et tema for å hoppe til det aktuelle tidspunktet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 