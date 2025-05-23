const dogePointer = document.getElementById("doge-pointer");

document.addEventListener("mousemove", function (e) {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelector(".gameplay-bg").style.transform = `translate(${-x}px, ${-y}px)`;

  dogePointer.style.top = `${e.clientY - dogePointer.clientHeight + 30}px`;
  dogePointer.style.left = `${e.clientX - dogePointer.clientWidth - 200}px`;
});

let bonkResetTimeout;
let bonkRestartTimeout;

document.addEventListener("click", () => {
  clearTimeout(bonkResetTimeout);
  clearTimeout(bonkRestartTimeout);

  dogePointer.classList.remove("bonked");

  bonkRestartTimeout = setTimeout(() => {
    dogePointer.classList.add("bonked");

    bonkResetTimeout = setTimeout(() => {
      dogePointer.classList.remove("bonked");
    }, 150);
  }, 50);
});
