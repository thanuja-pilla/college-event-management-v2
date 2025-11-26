document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("eventsContainer");
  if (!container) return;

  container.innerHTML = `<p class="text-center text-gray-400">⏳ Loading events...</p>`;

  const baseUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://college-event-management-v2.onrender.com";

  const params = new URLSearchParams(window.location.search);
  const filterType = params.get("type");

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  try {
    const res = await fetch(`${baseUrl}/api/events`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const events = await res.json();

    const filteredEvents = filterType
      ? events.filter(
          (event) => event.type?.toLowerCase() === filterType.toLowerCase()
        )
      : events;

    if (!filteredEvents.length) {
      container.innerHTML = `<p class="text-center text-gray-600">No events found${
        filterType ? ` for '${filterType}'` : ""
      }.</p>`;
      return;
    }

    container.innerHTML = filteredEvents
      .map(
        (event) => `
      <div class="bg-white p-6 rounded-xl shadow-md space-y-2 mb-4">
        <h3 class="text-xl font-bold text-blue-700">${event.name}</h3>
        <p class="text-sm text-gray-600">📅 ${formatDate(
          event.startDate
        )} → ${formatDate(event.endDate)}</p>
        <p class="text-gray-800">${event.description}</p>
        <span class="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          ${event.type}
        </span>
        ${
          event.eligibility
            ? `<p class="text-sm text-gray-600"><strong>Eligibility:</strong> ${event.eligibility}</p>`
            : ""
        }
        ${
          event.url
            ? `<div><a href="${event.url}" target="_blank" class="text-blue-500 hover:underline">🔗 Visit Event</a></div>`
            : ""
        }
        ${
          isAdmin
            ? `<button class="deleteBtn text-red-500 text-xs mt-2 px-2 py-1 border border-red-500 rounded" data-id="${event._id}">Delete</button>`
            : ""
        }
      </div>
    `
      )
      .join("");

    // Delete button functionality
    if (isAdmin) {
      document.querySelectorAll(".deleteBtn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          if (!confirm("Are you sure you want to delete this event?")) return;

          try {
            const res = await fetch(`${baseUrl}/api/events/${id}`, {
              method: "DELETE",
              headers: { "x-admin": "true" }, // ✅ pass admin info
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");

            alert(data.message);
            btn.closest("div").remove();
          } catch (err) {
            alert(err.message);
          }
        });
      });
    }
  } catch (err) {
    console.error("Error fetching events:", err);
    container.innerHTML = `
      <p class="text-center text-red-600">❌ Failed to load events. Please try again later.</p>
      <p class="text-center text-gray-500 text-xs">${err.message}</p>`;
  }
});
