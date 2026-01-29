const multiplier = 0.06;
let targetXPercent = 50 * multiplier;
let targetYPercent = 50* multiplier;
let currentXPercent = targetXPercent + 50;
let currentYPercent = targetYPercent + 50;
let menuXPercent = targetXPercent * 7;
let menuYPercent = targetYPercent * 2;
let rightX = targetXPercent / 5;

const menu = document.getElementsByClassName("buttons")[0];

document.addEventListener('mousemove', (event) => {
  const { innerWidth, innerHeight } = window;
  const x = event.clientX;
  const y = event.clientY;

  const offsetX = (x / innerWidth - 0.5) * 2;
  const offsetY = (y / innerHeight - 0.5) * 2;

  targetXPercent = offsetX * 50 * multiplier; // например, +/- 50% от центра
  targetYPercent = offsetY * 50 * multiplier;
  return true;
});

function animate() {
  currentXPercent += (targetXPercent + 50 - currentXPercent) * 0.2;
  currentYPercent += (targetYPercent + 50 - currentYPercent) * 0.2;

  document.body.style.backgroundPosition = `${currentXPercent}% ${currentYPercent}%`;

  menuXPercent += (targetXPercent * 7 - menuXPercent) * 0.3;
  menuYPercent += (targetYPercent * 2 - menuYPercent) * 0.3;

  menu.style.marginTop = `${150 + menuYPercent}px`
  menu.style.marginLeft = `${40 + menuXPercent}px`

  requestAnimationFrame(animate);
}

animate();