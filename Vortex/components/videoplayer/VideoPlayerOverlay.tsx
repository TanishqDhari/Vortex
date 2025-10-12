// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";

// interface VideoPlayerOverlayProps {
//   videoId: string;
//   onClose: () => void;
// }

// const VideoPlayerOverlay: React.FC<VideoPlayerOverlayProps> = ({ videoId, onClose }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const controlsContainerRef = useRef<HTMLDivElement>(null);
//   const [isClient, setIsClient] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const playerRef = useRef<any>(null);
//   const [showFallbackSettings, setShowFallbackSettings] = useState(false);
//   const [availableQualities, setAvailableQualities] = useState<any[]>([]);
//   const [selectedQuality, setSelectedQuality] = useState<string>("auto");
//   const [playbackRate, setPlaybackRate] = useState<number>(1);

//   // Ensure client-side rendering
//   useEffect(() => {
//     setIsClient(true);
//     console.log("Shaka VideoPlayerOverlay mounted with videoId:", videoId);
//   }, [videoId]);

//   // Initialize Shaka Player
//   useEffect(() => {
//     if (!isClient) {
//       console.log("Not client-side, skipping Shaka init");
//       return;
//     }

//     // Verify refs
//     if (!videoRef.current || !controlsContainerRef.current) {
//       console.error("Refs not available: videoRef:", videoRef.current, "controlsContainerRef:", controlsContainerRef.current);
//       setError("Player initialization failed: Missing video or controls element.");
//       setIsLoading(false);
//       return;
//     }

//     let mounted = true;
//     const hlsUrl = `http://localhost:5000/api/videos/hls/${videoId}/${videoId}.m3u8`;
//     console.log("Attempting to load Shaka with HLS URL:", hlsUrl);

//     // Dynamic import Shaka Player
//     import("shaka-player/dist/shaka-player.ui")
//       .then((shaka) => {
//         if (!mounted) return;

//         // Install polyfills
//         shaka.polyfill.installAll();

//         // Verify browser support
//         if (!shaka.Player.isBrowserSupported()) {
//           console.error("Shaka Player not supported in this browser");
//           setError("Browser not supported for video playback.");
//           setIsLoading(false);
//           return;
//         }

//         console.log("Initializing Shaka Player");
//         const player = new shaka.Player(videoRef.current!);
//         playerRef.current = player;

//         // Configure for smooth playback and HLS
//         player.configure({
//           streaming: {
//             bufferingGoal: 120, // Large buffer to prevent blackening
//             bufferBehind: 60,
//             rebufferingGoal: 2,
//             retryParameters: { maxAttempts: 5, timeout: 30000 },
//             lowLatencyMode: true, // Optimize for HLS
//             failureCallback: () => console.warn("Streaming failure, attempting recovery"),
//           },
//           abr: { enabled: true, defaultBandwidthEstimate: 1000000 }, // Auto quality
//           manifest: {
//             hls: { useFullSegments: true, ignoreTextStreamFailures: true }, // Ignore subtitle errors
//           },
//           playback: { stallDetectionEnabled: true, stallThreshold: 5 }, // Smooth stall recovery
//         });

//         // Setup Shaka UI with settings menu
//         const ui = new shaka.ui.Overlay(player, controlsContainerRef.current!, videoRef.current!);
//         ui.configure({
//           controlPanelElements: [
//             "play_pause",
//             "time_and_duration",
//             "volume",
//             "mute",
//             "settings", // Quality and playback speed in settings
//             "fullscreen",
//           ],
//           addSeekBar: true,
//           addBigSettingsButton: true, // Prominent settings icon
//           enableKeyboardPlaybackControls: true,
//           seekBarColors: {
//             base: "rgba(255, 255, 255, 0.3)",
//             buffered: "rgba(255, 255, 255, 0.54)",
//             played: "#ffffff",
//           },
//           doubleClickForFullscreen: true,
//           fadeDelay: 0.5, // Smooth fade
//           overflowMenuButtons: [
//             "quality", // Quality toggle
//             "playback_rate", // Playback speed (0.5x, 1x, 1.5x, 2x)
//             "statistics", // Debug stats
//           ],
//         });

//         // Error handling
//         player.addEventListener("error", (event: any) => {
//           const error = event.detail;
//           console.error("Shaka error:", error);
//           if (error.severity === shaka.util.Error.Severity.RECOVERABLE) {
//             console.warn("Non-fatal error, continuing playback:", error.code, error.message);
//             return;
//           }
//           console.error("Fatal error:", error);
//           setError("Playback error. Check console for details.");
//           setIsLoading(false);
//         });

//         // Handle fullscreen rendering issues
//         const handleFullscreenChange = () => {
//           if (videoRef.current && document.fullscreenElement) {
//             console.log("Entered fullscreen, forcing video repaint");
//             videoRef.current.play().catch(() => console.warn("Repaint play failed"));
//             // Force repaint
//             videoRef.current.style.display = "none";
//             setTimeout(() => {
//               if (videoRef.current) videoRef.current.style.display = "block";
//             }, 0);
//           }
//         };
//         document.addEventListener("fullscreenchange", handleFullscreenChange);

//         // Load HLS manifest
//         player
//           .load(hlsUrl)
//           .then(() => {
//             console.log("HLS manifest loaded successfully");
//             // Log available quality tracks
//             const tracks = player.getVariantTracks();
//             console.log("Available quality tracks:", tracks.map((t: any) => ({
//               id: t.id,
//               height: t.height,
//               bandwidth: t.bandwidth,
//               active: t.active,
//             })));
//             setAvailableQualities(tracks);
//             if (tracks.length <= 1) {
//               console.warn("Only one quality track available, enabling fallback settings");
//               setShowFallbackSettings(true);
//             }
//             setIsLoading(false);
//             // Enter fullscreen
//             videoRef.current?.requestFullscreen().catch((err) => {
//               console.error("Fullscreen error:", err);
//             });
//             // Persist quality selection
//             player.addEventListener("variantchanged", () => {
//               const track = player.getVariantTracks().find((t: any) => t.active);
//               if (track) {
//                 console.log("Quality changed to:", track.height, "p");
//                 setSelectedQuality(track.id.toString());
//                 localStorage.setItem("videoQuality", track.id.toString());
//               }
//             });
//             // Apply saved quality
//             const savedQuality = localStorage.getItem("videoQuality");
//             if (savedQuality) {
//               const tracks = player.getVariantTracks();
//               const track = tracks.find((t: any) => t.id.toString() === savedQuality);
//               if (track) {
//                 console.log("Applying saved quality:", track.height, "p");
//                 player.selectVariantTrack(track, true);
//                 setSelectedQuality(track.id.toString());
//               }
//             }
//           })
//           .catch((err: any) => {
//             console.error("Failed to load HLS manifest:", err);
//             setError("Failed to load video. Check network or stream.");
//             setIsLoading(false);
//           });

//         // Cleanup
//         return () => {
//           console.log("Cleaning up Shaka Player");
//           player.destroy().catch(() => console.warn("Player cleanup failed"));
//           document.removeEventListener("fullscreenchange", handleFullscreenChange);
//         };
//       })
//       .catch((err) => {
//         console.error("Failed to import Shaka Player:", err);
//         setError("Failed to load player. Check console.");
//         setIsLoading(false);
//       });

//     return () => {
//       mounted = false;
//       if (playerRef.current) {
//         playerRef.current.destroy().catch(() => console.warn("Player cleanup failed"));
//       }
//     };
//   }, [videoId, isClient]);

//   // Native HLS fallback
//   useEffect(() => {
//     if (error && videoRef.current && !playerRef.current) {
//       console.log("Falling back to native HLS");
//       const hlsUrl = `http://localhost:5000/api/videos/hls/${videoId}/${videoId}.m3u8`;
//       if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
//         videoRef.current.src = hlsUrl;
//         videoRef.current
//           .play()
//           .then(() => {
//             console.log("Native HLS playback started");
//             setError(null);
//             setIsLoading(false);
//             videoRef.current?.requestFullscreen().catch((err) => console.error("Fullscreen error:", err));
//           })
//           .catch((err) => {
//             console.error("Native HLS playback error:", err);
//             setError("Failed to play video.");
//             setIsLoading(false);
//           });
//       } else {
//         console.error("Native HLS not supported");
//         setError("HLS not supported in this browser.");
//         setIsLoading(false);
//       }
//     }
//   }, [error, videoId]);

//   // Fallback settings UI
//   const handleQualityChange = (trackId: string) => {
//     if (playerRef.current) {
//       const track = availableQualities.find((t: any) => t.id.toString() === trackId);
//       if (track) {
//         playerRef.current.selectVariantTrack(track, true);
//         setSelectedQuality(trackId);
//         localStorage.setItem("videoQuality", trackId);
//       }
//     }
//   };

//   const handlePlaybackRateChange = (rate: number) => {
//     if (videoRef.current) {
//       videoRef.current.playbackRate = rate;
//       setPlaybackRate(rate);
//     }
//   };

//   if (!isClient) {
//     console.log("Not client-side, skipping render");
//     return null;
//   }

//   console.log("Rendering VideoPlayerOverlay");
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
//       <div className="relative w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden">
//         <Button
//           variant="ghost"
//           className="absolute top-4 right-4 z-50 text-white hover:bg-gray-700"
//           onClick={onClose}
//         >
//           <X className="h-6 w-6" />
//         </Button>
//         <div className="relative w-full aspect-video min-h-[50vh]">
//           <div className="relative w-full h-full" style={{ minHeight: "50vh", maxHeight: "80vh" }}>
//             <video
//               ref={videoRef}
//               className="w-full h-full bg-black object-contain"
//               style={{ minHeight: "50vh", maxHeight: "80vh" }}
//               autoPlay
//               playsInline
//             />
//             <div
//               ref={controlsContainerRef}
//               className="shaka-controls-container absolute inset-0"
//               style={{ minHeight: "50vh", maxHeight: "80vh" }}
//             />
//             {showFallbackSettings && (
//               <div className="absolute bottom-16 right-4 z-50 bg-black/80 text-white p-2 rounded-lg">
//                 <div className="mb-2">
//                   <label className="block text-sm">Quality</label>
//                   <select
//                     value={selectedQuality}
//                     onChange={(e) => handleQualityChange(e.target.value)}
//                     className="bg-gray-800 text-white rounded p-1"
//                   >
//                     <option value="auto">Auto</option>
//                     {availableQualities.map((track: any) => (
//                       <option key={track.id} value={track.id}>
//                         {track.height}p
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm">Playback Speed</label>
//                   <select
//                     value={playbackRate}
//                     onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
//                     className="bg-gray-800 text-white rounded p-1"
//                   >
//                     {[0.5, 1, 1.5, 2].map((rate) => (
//                       <option key={rate} value={rate}>
//                         {rate}x
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}
//             {isLoading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
//                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
//                 <p className="text-white text-lg font-semibold ml-2">Loading video...</p>
//               </div>
//             )}
//             {error && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
//                 <p className="text-red-500 text-lg font-semibold">{error}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { VideoPlayerOverlay };


"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2, Settings } from "lucide-react";

interface VideoPlayerOverlayProps {
  videoId: string;
  onClose: () => void;
}

const VideoPlayerOverlay: React.FC<VideoPlayerOverlayProps> = ({ videoId, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [quality, setQuality] = useState(-1); // -1 for auto
  const [availableQualities, setAvailableQualities] = useState<{ height: number; index: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
    console.log("VideoPlayerOverlay mounted with videoId:", videoId);
  }, [videoId]);

  // Handle fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Load HLS stream
  useEffect(() => {
    if (!isClient || !videoRef.current) {
      console.error("Video ref is not set or not client-side");
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    const hlsUrl = `http://localhost:5000/api/videos/hls/${videoId}/${videoId}.m3u8`;
    console.log("Attempting to load HLS URL:", hlsUrl);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed, qualities:", hls.levels);
        setAvailableQualities(hls.levels.map((level, index) => ({ height: level.height, index })));
        setIsLoading(false);
        // Restore saved quality
        const savedQuality = localStorage.getItem("videoQuality");
        if (savedQuality && hls.levels[parseInt(savedQuality)]) {
          hls.currentLevel = parseInt(savedQuality);
          setQuality(parseInt(savedQuality));
        }
        video.play().then(() => {
          video.requestFullscreen().catch((err) => {
            console.error("Fullscreen error:", err);
          });
        }).catch((err) => {
          console.error("Auto-play error:", err);
          // Rely on native controls for retry
        });
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        if (!data.fatal) {
          console.warn("Non-fatal HLS error, continuing playback:", data.details);
          return; // Ignore non-fatal errors like bufferSeekOverHole
        }
        setIsLoading(false);
        console.error("Fatal HLS error:", data.details);
      });
      return () => {
        console.log("Cleaning up HLS");
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("Using native HLS support");
      video.src = hlsUrl;
      video.play().then(() => {
        video.requestFullscreen().catch((err) => {
          console.error("Fullscreen error:", err);
        });
      }).catch((err) => {
        console.error("Auto-play error:", err);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      console.error("HLS not supported in this browser.");
    }
  }, [videoId, isClient]);

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (isFullscreen) {
      document.exitFullscreen().catch((err) => console.error("Exit fullscreen error:", err));
    } else {
      videoRef.current.requestFullscreen().catch((err) => console.error("Fullscreen error:", err));
    }
  };

  // Show/hide controls on mouse move or touch
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      videoContainer.addEventListener("mousemove", handleMouseMove);
      videoContainer.addEventListener("touchstart", handleMouseMove);
    }
    return () => {
      if (videoContainer) {
        videoContainer.removeEventListener("mousemove", handleMouseMove);
        videoContainer.removeEventListener("touchstart", handleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, []);

  if (!isClient) {
    console.log("Not client-side, skipping render");
    return null;
  }

  console.log("Rendering VideoPlayerOverlay");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden">
        <Button
          variant="ghost"
          className="absolute top-4 right-4 z-20 text-white hover:bg-gray-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="relative w-full aspect-video min-h-[50vh]">
          <video
            ref={videoRef}
            controls={false} // Disable native controls
            autoPlay
            className="w-full h-full bg-black object-contain"
            style={{ minHeight: "50vh", maxHeight: "80vh" }}
            onPlay={() => {
              console.log("Video started playing");
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error("Video element error:", e);
              setIsLoading(false);
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
              <p className="text-white text-lg font-semibold ml-2">Loading video...</p>
            </div>
          )}
          {/* Custom Controls */}
          {showControls && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-10 transition-opacity duration-300"
              style={{ opacity: showControls ? 1 : 0 }}
            >
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-700"
                  onClick={() => videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause()}
                >
                  {videoRef.current?.paused ? (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-gray-700"
                    onClick={() => document.querySelector("#quality-menu")?.classList.toggle("hidden")}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <select
                    id="quality-menu"
                    value={quality}
                    onChange={(e) => {
                      const level = parseInt(e.target.value);
                      if (hlsRef.current) {
                        hlsRef.current.currentLevel = level;
                        setQuality(level);
                        localStorage.setItem("videoQuality", level.toString());
                      }
                    }}
                    className="p-2 bg-gray-800 text-white rounded text-sm"
                  >
                    <option value={-1}>Auto</option>
                    {availableQualities.map((q) => (
                      <option key={q.index} value={q.index}>
                        {q.height}p
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-700"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { VideoPlayerOverlay };