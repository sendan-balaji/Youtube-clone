// Grab elements
const userButton = document.getElementById("user-button");
const popup = document.getElementById("popup");
const optionsBtn = document.getElementById("options");
const defaultTab = document.getElementById("default");
const optionsTab = document.getElementById("optionsTab");
const overlay = document.getElementById("overlay");
const body = document.body;
const dark = document.getElementById("darkTheme");
const light = document.getElementById("lightTheme");
const appearanceButton = document.getElementById("appearanceButton");
const appearancePopupContent = document.getElementById("appearancePopupContent");

const videoCardContainer = document.querySelector('.video-container');
const searchInput = document.querySelector("#searchBar");
const searchBtn = document.querySelector("#search");

const api = "AIzaSyD4Oxe5VLdf6iga_U0rAJkbG7gJM9R9hPA";
const videoAPI = "https://www.googleapis.com/youtube/v3/videos?";
const channelAPI = "https://www.googleapis.com/youtube/v3/channels?";
const searchLink = `https://www.youtube.com/results?search_query=`;

// Fetch popular videos
fetch(videoAPI + new URLSearchParams({
    key: api,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 50,
    regionCode: 'IN'
}))
    .then(res => res.json())
    .then(data => {
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                getChannelIcon(item);
            });
        } else {
            console.warn("No items found in API response.");
        }
    })
    .catch(error => console.error("Fetch error:", error));

// Fetch channel icon
const getChannelIcon = (video_data) => {
    fetch(channelAPI + new URLSearchParams({
        key: api,
        part: "snippet",
        id: video_data.snippet.channelId
    }))
        .then(res => res.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                video_data.channelThumbnail = data.items[0].snippet.thumbnails?.default?.url || "default-icon.png";
                makeVideoCard(video_data);
            }
        })
        .catch(error => console.error(error));
};

// Create video card
const makeVideoCard = (data) => {
    videoCardContainer.innerHTML += `
        <div class="video" onclick="location.href='https://youtube.com/watch?v=${data.id}'">
            <img src="${data.snippet.thumbnails.high.url}" alt="" class="thumbnail">
            <div class="content">
                <img src="${data.channelThumbnail}" alt="" class="channel-icon">
                <div class="info">
                    <h4 class="title">${data.snippet.title}</h4>
                    <p class="channel-name">${data.snippet.channelTitle}</p>
                </div>
            </div>
        </div>`;
};

// Search button functionality
searchBtn.addEventListener('click', () => {
    if (searchInput.value.length) {
        location.href = searchLink + searchInput.value;
    }
});

// Toggle user popup
userButton.addEventListener("click", () => {
    const isVisible = popup.style.display === "block";
    popup.style.display = isVisible ? "none" : "block";
    if (!isVisible) {
        appearancePopupContent.style.display = "none";
    }
});

// Toggle sidebar
optionsBtn.addEventListener("click", () => {
    const isOptionsVisible = optionsTab.style.display === "block";
    defaultTab.style.display = isOptionsVisible ? "block" : "none";
    optionsTab.style.display = isOptionsVisible ? "none" : "block";
    optionsTab.classList.toggle("active");
    overlay.classList.toggle("active");
    closeAllPopups();
});

// Close sidebar on overlay click
overlay.addEventListener("click", () => {
    optionsTab.style.display = "none";
    defaultTab.style.display = "block";
    overlay.classList.remove("active");
    optionsTab.classList.remove("active");
});

// Toggle appearance menu
appearanceButton.addEventListener("click", () => {
    popup.style.display = popup.style.display === "none" ? "block" : popup.style.display;
    appearancePopupContent.style.display =
        appearancePopupContent.style.display === "block" ? "none" : "block";
});

// Dark mode
function Dark() {
    if (body.classList.contains("light-mode")) {
        light.classList.remove("active-1");
        body.classList.remove("light-mode");
    }
    body.classList.add("dark-mode");
    dark.classList.add("active-1");
    localStorage.setItem("theme", "dark");
}

// Light mode
function Light() {
    if (body.classList.contains("dark-mode")) {
        dark.classList.remove("active-1");
        body.classList.remove("dark-mode");
    }
    body.classList.add("light-mode");
    light.classList.add("active-1");
    localStorage.setItem("theme", "light");
}

// Close appearance popup when clicking outside
document.addEventListener("click", (event) => {
    const clickedOutside =
        !popup.contains(event.target) &&
        !userButton.contains(event.target) &&
        appearancePopupContent.style.display === "block";

    const clickedInsidePopupButNotButton =
        popup.contains(event.target) &&
        !appearanceButton.contains(event.target) &&
        appearancePopupContent.style.display === "block" &&
        !appearancePopupContent.contains(event.target);

    if (clickedOutside || clickedInsidePopupButNotButton) {
        appearancePopupContent.style.display = "none";
    }
});

// Utility: close all popups
function closeAllPopups() {
    popup.style.display = "none";
    appearancePopupContent.style.display = "none";
}

// Load theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") Dark();
else if (savedTheme === "light") Light();
