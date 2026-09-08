import { viewer, nextStory, prevStory, viewerImage, progressContainer } from "./dom.js"
import { stories, loadStories } from "./helper.js";

let timer;
let startTime;
const duration = 3000;
let currentStory = null;


export function getCurrentStory() {
    return currentStory;
}

let remainingTime = duration;

export function closeStory() {
    viewer.classList.add("hidden")
    clearTimeout(timer);
}



// view story
let displayindex = 0;
export function viewstory(index) {
    displayindex = index;
    startTime = Date.now();
    remainingTime = duration;
    viewer.classList.remove("hidden")

    currentStory = stories[index];
    viewerImage.src = stories[index].image;
    currentStory.seen = true;

    localStorage.setItem("stories", JSON.stringify(stories));

    clearTimeout(timer)
    createProgressBars();
    updateProgressBars();
    loadStories();


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
        if (displayindex < stories.length - 1) {
            viewstory(displayindex + 1);
        } else {
            closeStory();
        }
    }, remainingTime);
}

viewer.addEventListener("mousedown", pauseStory);
viewer.addEventListener("mouseup", resumeStory);

function createProgressBars() {
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
let touchstartX = 0;
let touchendX = 0;

function checkDirection() {
    if (touchendX < touchstartX) {
        if (displayindex < stories.length - 1) {
            viewstory(displayindex + 1);
        }
        else {
            closeStory()
        }
    }
    if (touchendX > touchstartX) {
        if (displayindex > 0) {
            viewstory(displayindex - 1);
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

