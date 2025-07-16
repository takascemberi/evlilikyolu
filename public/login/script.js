document.getElementById("loginTab").addEventListener("click", () => {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");
});

document.getElementById("registerTab").addEventListener("click", () => {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginTab").classList.remove("active");
  document.getElementById("registerTab").classList.add("active");
});
