const themeSelect = document.getElementById('theme');
const body = document.body;
const userInput = document.getElementById('userID');
const profileDiv = document.getElementById('userProfile');
const searchBtn = document.getElementById('btn');

// Apply selected theme
themeSelect.addEventListener('change', () => {
  const selectedTheme = themeSelect.value;
  body.className = '';
  body.classList.add(`${selectedTheme}-theme`);
  localStorage.setItem('theme', selectedTheme);
});

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.add(`${savedTheme}-theme`);
themeSelect.value = savedTheme;

// Fetch GitHub user
searchBtn.addEventListener('click', () => {
  const userId = userInput.value.trim();
  if (userId) fetchUser(userId);
});

async function fetchUser(userId) {
  profileDiv.innerHTML = `<div class="loading">Fetching user data...</div>`;
  try {
    const response = await fetch(`https://api.github.com/users/${userId}`);
    const data = await response.json();

    if (data.message === 'Not Found') {
      profileDiv.innerHTML = `<h2 class="not-found">❌ User Not Found</h2>`;
      return;
    }

    displayUser(data);
  } catch (error) {
    profileDiv.innerHTML = `<h2 class="not-found">⚠️ Error fetching data</h2>`;
  }
}

function displayUser({ avatar_url, name, bio, followers, following, public_repos, html_url }) {
  profileDiv.innerHTML = `
    <div class="card">
      <div class="profile-image">
        <img src="${avatar_url}" alt="${name}">
      </div>
      <h2>${name || 'No Name Available'}</h2>
      <p class="bio">${bio || 'No bio provided.'}</p>
      <div class="stats">
        <div><strong>${followers}</strong><span>Followers</span></div>
        <div><strong>${following}</strong><span>Following</span></div>
        <div><strong>${public_repos}</strong><span>Repos</span></div>
      </div>
      <a href="${html_url}" target="_blank" class="visit-btn">Visit Profile</a>
    </div>
  `;
}
