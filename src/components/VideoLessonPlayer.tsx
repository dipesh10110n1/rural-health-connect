import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize,
  CheckCircle,
  Download,
  Wifi,
  WifiOff,
  Clock,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  completed: boolean;
  progress: number;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface VideoLessonPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onLessonComplete: (lessonId: string) => void;
  onProgressUpdate: (lessonId: string, progress: number) => void;
}

// Sample video URLs (using free sample videos)
const sampleVideos = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];

export const VideoLessonPlayer = ({
  isOpen,
  onClose,
  module,
  onLessonComplete,
  onProgressUpdate
}: VideoLessonPlayerProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadedLessons, setDownloadedLessons] = useState<string[]>([]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "You're connected to the internet",
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Using downloaded content",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Load saved progress and downloaded lessons
  useEffect(() => {
    const savedDownloads = localStorage.getItem('downloadedLessons');
    if (savedDownloads) {
      setDownloadedLessons(JSON.parse(savedDownloads));
    }
  }, []);

  // Save video progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && module?.lessons[currentLessonIndex]) {
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        if (!isNaN(progress)) {
          const lessonId = module.lessons[currentLessonIndex].id;
          localStorage.setItem(`lesson_progress_${lessonId}`, progress.toString());
          localStorage.setItem(`lesson_time_${lessonId}`, videoRef.current.currentTime.toString());
          onProgressUpdate(lessonId, progress);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentLessonIndex, module, onProgressUpdate]);

  // Load saved progress when lesson changes
  useEffect(() => {
    if (module?.lessons[currentLessonIndex] && videoRef.current) {
      const lessonId = module.lessons[currentLessonIndex].id;
      const savedTime = localStorage.getItem(`lesson_time_${lessonId}`);
      if (savedTime && videoRef.current) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
    }
  }, [currentLessonIndex, module]);

  const currentLesson = module?.lessons[currentLessonIndex];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    if (currentLesson) {
      onLessonComplete(currentLesson.id);
      localStorage.setItem(`lesson_progress_${currentLesson.id}`, "100");
      toast({
        title: "Lesson Completed!",
        description: `You've completed "${currentLesson.title}"`,
      });
      
      // Auto-advance to next lesson
      if (module && currentLessonIndex < module.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  const handleDownloadLesson = async (lessonId: string) => {
    // Simulate download for offline viewing
    toast({
      title: "Downloading...",
      description: "Saving lesson for offline viewing",
    });

    // In a real app, this would use Service Worker and Cache API
    setTimeout(() => {
      const updated = [...downloadedLessons, lessonId];
      setDownloadedLessons(updated);
      localStorage.setItem('downloadedLessons', JSON.stringify(updated));
      toast({
        title: "Download Complete",
        description: "Lesson available offline",
      });
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (!module) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {module.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="outline" className="text-success border-success">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                src={sampleVideos[currentLessonIndex % sampleVideos.length]}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={skipBackward} className="text-white hover:bg-white/20">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={skipForward} className="text-white hover:bg-white/20">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Lesson Info */}
            {currentLesson && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{currentLesson.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{currentLesson.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{currentLesson.duration}</span>
                      </div>
                    </div>
                    {!downloadedLessons.includes(currentLesson.id) && isOnline && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadLesson(currentLesson.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Save Offline
                      </Button>
                    )}
                    {downloadedLessons.includes(currentLesson.id) && (
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available Offline
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Lesson List */}
          <div className="space-y-2">
            <h4 className="font-semibold mb-3">Lessons ({module.lessons.length})</h4>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {module.lessons.map((lesson, index) => {
                const savedProgress = localStorage.getItem(`lesson_progress_${lesson.id}`);
                const progress = savedProgress ? parseFloat(savedProgress) : 0;
                const isDownloaded = downloadedLessons.includes(lesson.id);
                
                return (
                  <Card
                    key={lesson.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      currentLessonIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentLessonIndex(index)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          progress >= 100 ? 'bg-success text-success-foreground' :
                          currentLessonIndex === index ? 'bg-primary text-primary-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {progress >= 100 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            {isDownloaded && (
                              <Download className="h-3 w-3 text-success" />
                            )}
                          </div>
                          {progress > 0 && progress < 100 && (
                            <Progress value={progress} className="h-1 mt-2" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoLessonPlayer;