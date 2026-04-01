/**
 * 주문 알림용 멜로디 (소켓 수신 시). 브라우저 정책상 사용자 인터랙션 전에는 재생이 막힐 수 있습니다.
 */
export function playNotificationChime(): void {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.32;
    master.connect(ctx.destination);

    const scheduleNote = (frequency: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = frequency;
      const peak = 0.95;
      const attackEnd = start + 0.04;
      const end = start + duration;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(peak, attackEnd);
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(g);
      g.connect(master);
      osc.start(start);
      osc.stop(end + 0.02);
    };

    const t0 = ctx.currentTime;
    // C5 → E5 → G5 (장3화음 상행), 약 0.65초
    scheduleNote(523.25, t0, 0.22);
    scheduleNote(659.25, t0 + 0.16, 0.24);
    scheduleNote(783.99, t0 + 0.34, 0.32);

    window.setTimeout(() => {
      void ctx.close().catch(() => undefined);
    }, 900);
  } catch {
    // ignore
  }
}
