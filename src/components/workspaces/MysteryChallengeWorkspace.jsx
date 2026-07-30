import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { soundFx } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Gamepad2, Play, Square, RotateCcw, Trophy, Award, Clock, Flame, CheckCircle, Sparkles } from 'lucide-react';

export const MysteryChallengeWorkspace = () => {
  const { setDetectedObjects, setProcessingTime, setActiveDetectionSource, addToast } = useApp();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const targetList = ['person', 'cell phone', 'cup', 'bottle', 'laptop', 'chair', 'book'];

  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'won', 'lost'
  const [currentTarget, setCurrentTarget] = useState('person');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [achievements, setAchievements] = useState(['Eagle Eye']);
  const [stream, setStream] = useState(null);

  const animFrameId = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    setActiveDetectionSource('Mystery Challenge');
    return () => {
      stopChallenge();
    };
  }, []);

  const startChallenge = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Pick random target
      const randomTarget = targetList[Math.floor(Math.random() * targetList.length)];
      setCurrentTarget(randomTarget);
      setTimeLeft(20);
      setGameState('playing');
      addToast(`CHALLENGE STARTED: Find a "${randomTarget.toUpperCase()}"!`, 'info');

      // Countdown Timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      runChallengeDetectionLoop(randomTarget);
    } catch (err) {
      addToast('Camera access required for Mystery Challenge', 'warning');
    }
  };

  const handleTimeOut = () => {
    setGameState('lost');
    setStreak(0);
    stopChallengeStream();
    addToast('Time is up! Target not detected in time.', 'warning');
  };

  const handleVictory = () => {
    clearInterval(timerIntervalRef.current);
    soundFx.playSuccessChime();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    const newScore = score + 150 + streak * 50;
    setScore(newScore);
    const newStreak = streak + 1;
    setStreak(newStreak);
    setGameState('won');

    // Unlock achievements
    if (newStreak >= 3 && !achievements.includes('Night Vision')) {
      setAchievements(prev => [...prev, 'Night Vision']);
      addToast('Achievement Unlocked: Night Vision Master!', 'success');
    }
    if (newScore >= 500 && !achievements.includes('Visionary Hunter')) {
      setAchievements(prev => [...prev, 'Visionary Hunter']);
      addToast('Achievement Unlocked: Visionary Hunter!', 'success');
    }

    addToast(`TARGET DETECTED! +150 Points`, 'success');
    stopChallengeStream();
  };

  const stopChallengeStream = () => {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  };

  const stopChallenge = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    stopChallengeStream();
    setGameState('idle');
    addToast('Challenge stopped', 'info');
  };

  const restartChallenge = () => {
    stopChallenge();
    setTimeout(() => {
      startChallenge();
    }, 200);
  };

  const runChallengeDetectionLoop = (targetClass) => {
    const checkFrame = async () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const startTime = performance.now();
        const detections = await apiService.detectObjects(video);
        const processMs = Math.round(performance.now() - startTime);

        setDetectedObjects(detections);
        setProcessingTime(processMs);

        // Check if target is present
        let foundTarget = false;
        detections.forEach((item) => {
          const [x, y, w, h] = item.bbox;
          const isTarget = item.class.toLowerCase() === targetClass.toLowerCase();
          if (isTarget) foundTarget = true;

          ctx.strokeStyle = isTarget ? '#ef4444' : item.color;
          ctx.lineWidth = isTarget ? 5 : 3;
          ctx.strokeRect(x, y, w, h);

          ctx.fillStyle = isTarget ? '#ef4444' : item.color;
          const labelText = isTarget ? `🎯 TARGET: ${item.class.toUpperCase()}` : `${item.class}`;
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.fillRect(x, y - 28 > 0 ? y - 28 : y, ctx.measureText(labelText).width + 14, 24);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(labelText, x + 7, y - 28 > 0 ? y - 10 : y + 17);
        });

        if (foundTarget) {
          handleVictory();
          return;
        }
      }
      animFrameId.current = requestAnimationFrame(checkFrame);
    };

    animFrameId.current = requestAnimationFrame(checkFrame);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-5 shadow-2xl">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Mystery Object Scavenger Hunt</h4>
            <p className="text-xs text-slate-400">Point your camera to detect the mystery target object</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {gameState === 'idle' || gameState === 'won' || gameState === 'lost' ? (
            <button
              onClick={startChallenge}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-purple-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Challenge</span>
            </button>
          ) : (
            <button
              onClick={stopChallenge}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 font-medium text-xs border border-red-800 transition-all"
            >
              <Square className="w-4 h-4 fill-red-400" />
              <span>Stop Challenge</span>
            </button>
          )}

          <button
            onClick={restartChallenge}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Restart Challenge"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gamified HUD Banner */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-purple-300">Target Object</div>
            <div className="text-sm font-bold text-white uppercase font-mono">{currentTarget}</div>
          </div>
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
        </div>

        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-amber-300">Time Left</div>
            <div className="text-sm font-bold text-amber-400 font-mono">{timeLeft}s</div>
          </div>
          <Clock className="w-5 h-5 text-amber-400" />
        </div>

        <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-teal-300">Total Score</div>
            <div className="text-sm font-bold text-teal-400 font-mono">{score}</div>
          </div>
          <Trophy className="w-5 h-5 text-teal-400" />
        </div>

        <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-pink-300">Win Streak</div>
            <div className="text-sm font-bold text-pink-400 font-mono">{streak}🔥</div>
          </div>
          <Flame className="w-5 h-5 text-pink-400" />
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${gameState === 'playing' ? 'block' : 'hidden'}`}
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Victory Screen Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-md z-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-400 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-white">Target Acquired!</h3>
              <p className="text-xs text-teal-300">Successfully detected "{currentTarget}" in front of camera!</p>
            </div>
            <button
              onClick={startChallenge}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/30"
            >
              Next Mystery Target &rarr;
            </button>
          </div>
        )}

        {/* Timeout Loss Screen Overlay */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-md z-20 flex flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-red-400">Time Expired!</h3>
              <p className="text-xs text-slate-400">Could not detect "{currentTarget}" within 20 seconds.</p>
            </div>
            <button
              onClick={startChallenge}
              className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
            >
              Try Again &rarr;
            </button>
          </div>
        )}

        {/* Idle Screen Placeholder */}
        {gameState === 'idle' && (
          <div className="text-center space-y-3 p-8">
            <Gamepad2 className="w-12 h-12 mx-auto text-purple-400 animate-pulse" />
            <h5 className="text-sm font-bold text-slate-300">Ready to Hunt Objects?</h5>
            <p className="text-xs text-slate-500">Click "Start Challenge" to get your random object assignment.</p>
          </div>
        )}
      </div>

      {/* Unlocked Achievements Badges */}
      <div className="pt-2 flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Achievements:</span>
        <div className="flex flex-wrap gap-2">
          {achievements.map((ach) => (
            <div
              key={ach}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-medium"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
