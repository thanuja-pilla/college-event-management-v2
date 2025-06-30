document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const password = document.getElementById("admin-password").value;

    // Encoded "admin123"
    const ADMIN_PASSWORD = atob("YWRtaW4xMjM=");

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      alert("✅ Logged in as Admin!");
      window.location.href = "addevent.html";
    } else {
      alert("❌ Incorrect Password. Please try again.");
    }
  });
});
