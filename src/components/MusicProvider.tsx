"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface MusicContextValue {
  playing: boolean;
  ready: boolean;
  toggle: () => void;

  energy: number;

  bars: number[];
}

const BAR_COUNT = 4;
const defaultBars = Array(BAR_COUNT).fill(0.2);

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({
  src,
  autoPlay = false,
  children,
}: {
  src?: string;
  autoPlay?: boolean;
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [bars, setBars] = useState(defaultBars);

  const stopAnalyser = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setEnergy(0);
    setBars(defaultBars);
  }, []);

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (!analyser || !data) return;

    analyser.getByteFrequencyData(data);

    let bassSum = 0;
    const bassEnd = Math.floor(data.length * 0.15);
    for (let i = 0; i < bassEnd; i++) bassSum += data[i];
    const bass = bassSum / bassEnd / 255;

    let midSum = 0;
    const midStart = bassEnd;
    const midEnd = Math.floor(data.length * 0.5);
    for (let i = midStart; i < midEnd; i++) midSum += data[i];
    const mid = midSum / (midEnd - midStart) / 255;

    const nextEnergy = Math.min(1, bass * 0.65 + mid * 0.35);
    setEnergy((prev) => prev * 0.55 + nextEnergy * 0.45);

    const slice = Math.floor(data.length / BAR_COUNT);
    const nextBars = Array.from({ length: BAR_COUNT }, (_, i) => {
      let sum = 0;
      const start = i * slice;
      for (let j = start; j < start + slice; j++) sum += data[j];
      const avg = sum / slice / 255;
      return Math.max(0.18, Math.min(1, avg * 1.4));
    });
    setBars(nextBars);

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startAnalyser = useCallback(() => {
    stopAnalyser();
    rafRef.current = requestAnimationFrame(tick);
  }, [stopAnalyser, tick]);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.loop = true;
    audioRef.current = audio;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.78;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    ctxRef.current = ctx;
    analyserRef.current = analyser;
    dataRef.current = new Uint8Array(analyser.frequencyBinCount);
    setReady(true);

    return () => {
      stopAnalyser();
      audio.pause();
      void ctx.close();
      audioRef.current = null;
      ctxRef.current = null;
      analyserRef.current = null;
      dataRef.current = null;
      setReady(false);
      setPlaying(false);
    };
  }, [src, stopAnalyser]);

  useEffect(() => {
    if (!autoPlay || !ready || !audioRef.current) return;
    const audio = audioRef.current;
    const ctx = ctxRef.current;
    void ctx?.resume().then(() =>
      audio.play().then(() => {
        setPlaying(true);
        startAnalyser();
      }).catch(() => {}),
    );
  }, [autoPlay, ready, startAnalyser]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    const ctx = ctxRef.current;
    if (!audio || !ctx) return;

    void ctx.resume().then(() => {
      if (playing) {
        audio.pause();
        setPlaying(false);
        stopAnalyser();
      } else {
        void audio.play().then(() => {
          setPlaying(true);
          startAnalyser();
        });
      }
    });
  }, [playing, startAnalyser, stopAnalyser]);

  const value = useMemo(
    () => ({ playing, ready, toggle, energy, bars }),
    [playing, ready, toggle, energy, bars],
  );

  if (!src) return <>{children}</>;

  return (
    <MusicContext.Provider value={value}>
      {children}
      <style
        dangerouslySetInnerHTML={{
          __html: `:root { --music-energy: ${energy.toFixed(3)}; }`,
        }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return ctx;
}

export function useMusicOptional() {
  return useContext(MusicContext);
}
