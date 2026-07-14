
const addStoryBtn = document.getElementById('add-btn');
const fileInput = document.getElementById('file-input');
const storiesCard = document.querySelector(".stories-card");
const nextStory = document.getElementById('next-story');
const prevStory = document.getElementById('prev-story');
const viewer = document.getElementById("story-viewer");
const viewerImage = document.getElementById("viewer-image");
const deleteBtn = document.getElementById("delete-btn");
const progress = document.getElementById('progress-bar');
const closeBtn = document.getElementById("close-viewer");



let currentStory = null;
let timer;


let stories = JSON.parse(localStorage.getItem("stories")) || [];

const duration = 3000;

let startTime;
let remainingTime = duration;


//add button
addStoryBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileInput.click();
});


// create story element
function createStoryElement(story) {
    const storyItem = document.createElement("div");
    storyItem.className = "story-item";

    const storyCircle = document.createElement("div");
    storyCircle.classList.add("story-circle");
    if (story.seen) {
        storyCircle.classList.add("seen");
    }

    const img = document.createElement("img");
    img.src = story.image;
    img.alt = "Story";
    img.classList.add("story-image");

    const label = document.createElement("label");
    label.classList.add("story-label");
    label.textContent = story.time;

    storyCircle.appendChild(img);
    storyItem.appendChild(storyCircle);
    storyItem.appendChild(label);
    storiesCard.appendChild(storyItem);


    storyCircle.addEventListener("click", () => {
        viewstory(stories.indexOf(story));
    });
}

//save story in local storage
function saveStory(story) {
    stories.push(story);
    localStorage.setItem("stories", JSON.stringify(stories));
}

//add story
function addStory(image, time, id) {
    const story = {
        id,
        image,
        time,
        seen: false

    };

    createStoryElement(story);
    saveStory(story);
}

// file validation
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];


    if (!file.type.match("image/*")) {
        alert("Please select an image file (JPEG, PNG, etc).");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const imgSrc = event.target.result;

        const img = new Image();

        img.onload = () => {
            if (img.width > 1080 || img.height > 1920) {
                alert("Image dimensions must not exceed 1080 × 1920 pixels.");
                return;
            }


            const time = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });

            const id = Date.now()

            addStory(imgSrc, time, id);
        }
        img.src = imgSrc;
    }

    reader.readAsDataURL(file);
});


// load stories after refresh
function loadStories() {
    const cardReload = document.querySelectorAll(".story-item:not(:first-child)")

    cardReload.forEach(item => item.remove());

    stories.forEach(story => {
        time24h(story)
        createStoryElement(story);
    });
}

loadStories();





// delete story

deleteBtn.addEventListener("click", () => {
    stories = stories.filter(item => item.id !== currentStory.id);

    localStorage.setItem("stories", JSON.stringify(stories));
    closeStory()
    loadStories()
    currentStory = null;


});
// progress bar
function startProgress() {

    progress.classList.remove("animate");
    progress.offsetWidth;
    progress.classList.add("animate");

}


//close story viewer
closeBtn.addEventListener("click", closeStory)

function closeStory() {
    viewer.classList.add("hidden")
    clearTimeout(timer);
}


// view story
let displayindex = 0;
function viewstory(index) {
    displayindex = index;
    startTime = Date.now();
    remainingTime = duration;
    viewer.classList.remove("hidden")

    currentStory = stories[index];
    viewerImage.src = stories[index].image;
    currentStory.seen = true;

    localStorage.setItem("stories", JSON.stringify(stories));
    loadStories();
    clearTimeout(timer)
    startProgress();

    timer = setTimeout(() => {
        if (displayindex < stories.length - 1) {
            viewstory(displayindex + 1);

        } else {
            closeStory();
        }
    }, remainingTime);

}


//navigate to previous story
prevStory.onclick = () => {
    if (displayindex < stories.length - 1) {
        viewstory(displayindex + 1);
    }
    else {
        closeStory()
    }
};

//navigate to next story
nextStory.onclick = () => {
    if (displayindex > 0) {
        viewstory(displayindex - 1);
    }
    else {
        closeStory()
    }
};

// remove story after 24h
function time24h(story) {
    const time = Date.now();
    let storytime = story.id
    let finish = (time - storytime) / (60 * 1000)
    let end = 24 * 60
    let remainingTime = end - finish

    if (remainingTime <= 0) {
        stories = stories.filter(item => item.id !== story.id);

        localStorage.setItem("stories", JSON.stringify(stories));
    }
}
setInterval(loadStories, 60000);


function pauseStory() {
    clearTimeout(timer)
    const elapsedTime = Date.now() - startTime;
    remainingTime -= elapsedTime;
    progress.style.animationPlayState = "paused";
}

function resumeStory() {
    progress.style.animationPlayState = "running";
    startTime = Date.now();

    timer = setTimeout(() => {
        if (displayindex < stories.length - 1) {
            viewstory(displayindex + 1);
        } else {
            closeStory();
        }
    }, remainingTime);
}

viewer.addEventListener("mousedown", pauseStory);
viewer.addEventListener("mouseup", resumeStory);





















