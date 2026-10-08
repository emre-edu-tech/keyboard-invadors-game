// Delta time (dt): the number of seconds since the previous frame. All motion
// is written as `position += speed * dt`, so a 30 fps laptop and a 144 Hz
// monitor move objects at the same real-world speed.

// Upper clamp for dt in seconds. A frame that takes longer than this (a slow
// drag, a background tab that only wakes up now) would teleport objects, so we
// pretend the frame was 50 ms long instead.
const MAX_DT = 0.05;

// Length of the window used to average FPS, in milliseconds.
const FPS_WINDOW_MS = 500;

/**
 * Fixed-timestep-free game loop built on requestAnimationFrame.
 *
 * Each frame: compute dt, then update(dt), then render(). render() gets no
 * arguments on purpose - it should only read current state, never move it.
 */
export function createLoop({ update, render }) {
  let rafId = 0;
  let running = false;
  let lastTime = 0; // timestamp of the previous frame, 0 = "no frame yet"
  let fpsFrames = 0;
  let fpsWindowStart = 0;

  const loop = {
    fps: 0, // frames per second, averaged over ~0.5 s
    dt: 0, // dt of the most recent frame, in seconds
    start,
    stop,
    resetClock,
  };

  function frame(now) {
    if (!running) return;
    rafId = window.requestAnimationFrame(frame);

    // First frame after a start has no previous timestamp: dt = 0.
    let dt = 0;
    if (lastTime !== 0) {
      dt = Math.min(MAX_DT, Math.max(0, (now - lastTime) / 1000));
    }
    lastTime = now;
    loop.dt = dt;

    if (fpsWindowStart === 0) fpsWindowStart = now;
    fpsFrames++;
    const elapsed = now - fpsWindowStart;
    if (elapsed >= FPS_WINDOW_MS) {
      loop.fps = (fpsFrames * 1000) / elapsed;
      fpsFrames = 0;
      fpsWindowStart = now;
    }

    update(dt);
    render();
  }

  function start() {
    if (running) return;
    running = true;
    resetClock();
    rafId = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    window.cancelAnimationFrame(rafId);
  }

  // Called on start and after a pause, so the next frame starts from a clean
  // clock instead of counting the paused time as one huge dt.
  function resetClock() {
    lastTime = 0;
  }

  return loop;
}