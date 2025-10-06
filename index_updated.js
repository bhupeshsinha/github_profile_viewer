const userInput = document.getElementById('userID');
const userProfile = document.getElementById('userProfile');
const themeToggle = document.getElementById('themeToggle');

document.getElementById('btn').addEventListener('click', () => {
  const userId = userInput.value.trim();
  if (userId) {
    fetchUser(userId);
  } else {
    displayError("⚠️ Please enter a username.");
  }
});

async function fetchUser(userId) {
  userProfile.classList.remove('hidden');
  userProfile.innerHTML = `
      <div class="flex justify-center py-8">
          <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 border-t-indigo-500"></div>
      </div>
  `;

  try {
    const response = await fetch(`https://api.github.com/users/${userId}`);
    if (!response.ok) throw new Error("User not found");

    const result = await response.json();
    displayUser(result);
  } catch (error) {
    displayError("❌ User not found. Try again!");
  }
}

function displayUser(user) {
  const { avatar_url, name, bio, followers, following, public_repos, html_url, login } = user;

  userProfile.innerHTML = `
    <div class="flex flex-col md:flex-row items-center gap-8">
      <img src="${avatar_url}" alt="${login}" 
           class="w-40 h-40 rounded-full border-4 border-indigo-500 shadow-lg hover:scale-105 transition-transform duration-300">

      <div class="flex flex-col items-center md:items-start text-center md:text-left gap-3">
        <h2 class="text-3xl font-bold tracking-tight">${name || login}</h2>
        <p class="text-gray-700 dark:text-gray-300">${bio || "No bio available 😅"}</p>

        <div class="flex gap-6 mt-4">
          ${statBox("Followers", followers)}
          ${statBox("Following", following)}
          ${statBox("Repos", public_repos)}
        </div>

        <a href="${html_url}" target="_blank"
           class="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-all">
           🔗 Visit GitHub Profile
        </a>
      </div>
    </div>
  `;
}

function statBox(label, value) {
  return `
    <div class="text-center">
      <p class="text-2xl font-bold">${value}</p>
      <p class="text-gray-600 dark:text-gray-400">${label}</p>
    </div>
  `;
}

function displayError(msg) {
  userProfile.innerHTML = `
    <div class="text-center text-red-500 font-semibold py-6">${msg}</div>
  `;
}

// ✅ Theme toggle (now works perfectly)
themeToggle.addEventListener('click', () => {
  const root = document.documentElement;
  root.classList.toggle('dark');

  const isDark = root.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';

  // Optional: Save user preference in localStorage
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ✅ Keep theme saved between refreshes
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    themeToggle.textContent = '☀️ Light Mode';
  }
});

// Loader animation
const style = document.createElement('style');
style.textContent = `
  .loader {
    border-top-color: #6366f1;
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
