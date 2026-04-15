/**
 * 주문 알림용 "딩-동" 사운드 (소켓 수신 시).
 * 브라우저 정책상 사용자 인터랙션 전에는 재생이 막힐 수 있습니다.
 */
export function playNotificationChime(): void {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);

    const playTone = (frequency: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      const end = start + duration;
      const fadeIn = 0.05;
      const fadeOut = 0.05;
      const peak = 0.5;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(peak, start + fadeIn);
      g.gain.linearRampToValueAtTime(0, end - fadeOut);
      osc.connect(g);
      g.connect(master);
      osc.start(start);
      osc.stop(end);
    };

    const t0 = ctx.currentTime;
    // "띵-동": 예시처럼 높은음(1000Hz) -> 낮은음(800Hz)
    playTone(1000, t0, 0.4);
    playTone(800, t0 + 0.2, 0.5);

    window.setTimeout(() => {
      void ctx.close().catch(() => undefined);
    }, 1000);
  } catch {
    // ignore
  }
}
