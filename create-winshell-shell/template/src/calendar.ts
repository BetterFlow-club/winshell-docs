import { shell } from "@winshell/sdk";

const label = document.getElementById("label")!;
const days = document.getElementById("days")!;
let shown = new Date();

function render() {
  const year = shown.getFullYear();
  const month = shown.getMonth();
  label.textContent = shown.toLocaleDateString([], { month: "long", year: "numeric" });
  const first = (new Date(year, month, 1).getDay() + 6) % 7; // Monday first
  const count = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells: HTMLElement[] = [];
  for (let i = 0; i < first; i++) cells.push(document.createElement("span"));
  for (let d = 1; d <= count; d++) {
    const cell = document.createElement("span");
    cell.textContent = String(d);
    if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) cell.className = "today";
    cells.push(cell);
  }
  days.replaceChildren(...cells);
}

document.getElementById("prev")!.onclick = () => (shown = new Date(shown.getFullYear(), shown.getMonth() - 1, 1), render());
document.getElementById("next")!.onclick = () => (shown = new Date(shown.getFullYear(), shown.getMonth() + 1, 1), render());

// A popup page stays loaded between openings: reset it each time it opens.
shell.surface.onOpen(() => {
  shown = new Date();
  render();
});
render();
