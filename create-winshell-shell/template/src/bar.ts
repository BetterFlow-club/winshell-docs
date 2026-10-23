import { shell } from "@winshell/sdk";

const title = document.getElementById("title")!;
const clock = document.getElementById("clock")!;
const volume = document.getElementById("volume")!;

// The focused window's title. subscribe() calls back right away with the
// current state, then on every change.
shell.subscribe("windows", ({ windows, focused }) => {
  title.textContent = windows.find((w) => w.hwnd === focused)?.title ?? "";
});

// Volume: click mutes, the wheel changes it.
shell.subscribe("audio", ({ output }) => {
  volume.textContent = !output ? "–" : output.muted ? "muted" : `${Math.round(output.volume * 100)}%`;
});
volume.onclick = () => shell.invoke("audio.toggleMute");
volume.addEventListener("wheel", (e) => {
  e.preventDefault();
  shell.invoke("audio.adjustVolume", { delta: e.deltaY < 0 ? 0.05 : -0.05 });
}, { passive: false });

// The clock opens the calendar popup (declared in surfaces.json) below itself.
function tick() {
  clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  setTimeout(tick, 60_000 - (Date.now() % 60_000)); // wake once a minute
}
tick();
clock.onclick = () => shell.surface.toggle("__NAME__-calendar", { anchor: clock });
