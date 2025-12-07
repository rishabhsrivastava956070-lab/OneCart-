import React, { useContext, useState } from 'react'
import ai from "../assets/ai.png"
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import open from "../assets/open.mp3"

// Initialize audio outside the component so it's created only once.
const openingSound = new Audio(open);

function Ai() {
  // Destructure context and hooks
  let { showSearch, setShowSearch } = useContext(shopDataContext)
  let navigate = useNavigate()
  let [activeAi, setActiveAi] = useState(false)

  // Function to handle text-to-speech
  function speak(message) {
    // Cancel any previous speech for smooth interaction
    window.speechSynthesis.cancel();
    let utterence = new SpeechSynthesisUtterance(message)
    window.speechSynthesis.speak(utterence)
  }

  // Primary function to start and handle the voice recognition
  const handleVoiceCommand = () => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Voice features not supported in this browser.");
      speak("Voice commands are not supported in your browser.")
      return;
    }

    // Create a new recognition instance every time the user clicks
    const recognition = new SpeechRecognition();
    
    // Optional settings
    recognition.lang = 'en-US'; 
    recognition.interimResults = false; // Only returns final results

    // Event fired when listening starts
    recognition.onstart = () => {
       openingSound.play();
       setActiveAi(true);
       console.log("AI Listening..."); 
    }

    // Event fired when results are returned
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      console.log("User Said:", transcript); 

      // --- VOICE COMMAND LOGIC ---

      // 1. Search Open
      if (transcript.includes("search") && transcript.includes("open") && !showSearch) {
        speak("opening search")
        setShowSearch(true)
        navigate("/collection")
      }
      // 2. Search Close
      else if (transcript.includes("search") && transcript.includes("close") && showSearch) {
        speak("closing search")
        setShowSearch(false)
      }
      // 3. Collection/Products/Shop (Robust Match)
      else if (
        transcript.includes("collection") || 
        transcript.includes("products") || 
        transcript.includes("selection") || // Handles mishearings
        transcript.includes("shop") || 
        transcript.includes("store")
      ) {
        speak("opening collection page")
        navigate("/collection")
      }
      // 4. About
      else if (transcript.includes("about")) {
        speak("opening about page")
        navigate("/about")
        setShowSearch(false)
      }
      // 5. Home
      else if (transcript.includes("home")) {
        speak("opening home page")
        navigate("/")
        setShowSearch(false)
      }
      // 6. Cart
      else if (transcript.includes("cart") || transcript.includes("kaat")) { // Added "kaat" for common mishear
        speak("opening your cart")
        navigate("/cart")
        setShowSearch(false)
      }
      // 7. Contact
      else if (transcript.includes("contact")) {
        speak("opening contact page")
        navigate("/contact")
        setShowSearch(false)
      }
      // 8. Orders
      else if (transcript.includes("order")) {
        speak("opening your orders page")
        navigate("/order")
        setShowSearch(false)
      }
      // Default Fallback
      else {
        speak("I didn't catch that. Please try again.")
        toast.error(`Try Again. Heard: "${transcript}"`)
      }
    }

    // Event fired if listening stops or there's an error
    recognition.onend = () => {
      console.log("AI Stopped listening.");
      setActiveAi(false);
    }
    
    // Optional: Add error logging
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setActiveAi(false);
      if (event.error === 'not-allowed') {
         toast.error("Microphone permission denied. Please enable it in browser settings.");
      }
    }

    // Start the recognition engine
    recognition.start();
  }

  // --- JSX RENDER ---
  return (
    <div 
      className='fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%] z-50' 
      onClick={handleVoiceCommand} // Trigger the function on click
    >
      <img 
        src={ai} 
        alt="AI Assistant" 
        className={`w-[100px] cursor-pointer ${activeAi ? 'translate-x-[10%] translate-y-[-10%] scale-125 ' : 'translate-x-[0] translate-y-[0] scale-100'} transition-transform`} 
        style={{
          filter: ` ${activeAi ? "drop-shadow(0px 0px 30px #00d2fc)" : "drop-shadow(0px 0px 20px black)"}`
        }} 
      />
    </div>
  )
}

export default Ai