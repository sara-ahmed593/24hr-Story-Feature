import { viewer, nextStory, prevStory, viewerImage, progressContainer, deleteBtn, closeBtn } from "./story-dom.js"

let currentStoriesList = [];

let StoriesChanged;
let timer;
let startTime;
const duration = 3000;
let currentStory = null;
let remainingTime = duration;

let displayindex = 0;
let touchstartX = 0;
let touchendX = 0;

export function setStories(sc) {
    StoriesChanged = sc;
}


export function getCurrentStory() {
    return currentStory;
}


export function closeStory() {
    viewer.classList.add("hidden")
    clearTimeout(timer);
}


// view story

export function viewstory(index, stories) {
    currentStoriesList = stories;
    displayindex = index;
    startTime = Date.now();
    remainingTime = duration;
    viewer.classList.remove("hidden")

    currentStory = stories[index];
    viewerImage.src = stories[index].image;
    currentStory.seen = true;

    localStorage.setItem("stories", JSON.stringify(stories));

    clearTimeout(timer)
    createProgressBars(stories);
    updateProgressBars();
    StoriesChanged();

    timer = setTimeout(() => {
        if (displayindex < stories.length - 1) {
            viewstory(displayindex + 1, stories);

        } else {
            closeStory();
        }
    }, remainingTime);

}


//navigate to next story
nextStory.onclick = (e) => {
    if (displayindex < currentStoriesList.length - 1) {
        viewstory(displayindex + 1, currentStoriesList);
    }
    else {
        closeStory()
    }
};

//navigate to previous story
prevStory.onclick = () => {
    if (displayindex > 0) {
        viewstory(displayindex - 1, currentStoriesList);
    }
    else {
        closeStory()
    }
};


function pauseStory() {
    clearTimeout(timer)
    const elapsedTime = Date.now() - startTime;
    remainingTime -= elapsedTime;

    const activeProgress = getActiveProgressBar();

    if (activeProgress) {
        activeProgress.classList.add("paused");
    }
}

function resumeStory() {
    const activeProgress = getActiveProgressBar();

    if (activeProgress) {
        activeProgress.classList.remove("paused");
    } startTime = Date.now();

    timer = setTimeout(() => {
        if (displayindex < currentStoriesList.length - 1) {
            viewstory(displayindex + 1, currentStoriesList);
        } else {
            closeStory();
        }
    }, remainingTime);
}

viewer.addEventListener("mousedown", pauseStory);
viewer.addEventListener("mouseup", resumeStory);

function createProgressBars(stories) {
    progressContainer.innerHTML = "";

    stories.forEach(() => {
        const progress = document.createElement("div");

        progress.classList.add("story-viewer__progress-bar");

        progressContainer.appendChild(progress);
    });
}


function updateProgressBars() {
    const bars = document.querySelectorAll(".story-viewer__progress-bar");

    bars.forEach((bar, index) => {

        bar.classList.remove("active");

        if (index < displayindex) {
            bar.classList.add("completed");
        }

        else if (index === displayindex) {
            bar.classList.add("active");
        }
    });
}


function getActiveProgressBar() {
    return document.querySelector(".story-viewer__progress-bar.active");
}


function checkDirection() {
    if (touchendX < touchstartX) {
        if (displayindex < currentStoriesList.length - 1) {
            viewstory(displayindex + 1, currentStoriesList);
        }
        else {
            closeStory()
        }
    }
    if (touchendX > touchstartX) {
        if (displayindex > 0) {
            viewstory(displayindex - 1, currentStoriesList);
        }
        else {
            closeStory()
        }
    }
}


viewer.addEventListener("touchstart", (e) => {
    touchstartX = e.changedTouches[0].screenX;
});

viewer.addEventListener("touchend", (e) => {
    touchendX = e.changedTouches[0].screenX;
    checkDirection();
});

// delete story

deleteBtn.addEventListener("click", () => {
    let currentStory = getCurrentStory();
    const index = currentStoriesList.indexOf(currentStory);
    if (index !== -1) {
        currentStoriesList.splice(index, 1);
    }

    localStorage.setItem("stories", JSON.stringify(currentStoriesList));
    closeStory()
    StoriesChanged();
    currentStory = null;


});


//close story viewer
closeBtn.addEventListener("click", closeStory)