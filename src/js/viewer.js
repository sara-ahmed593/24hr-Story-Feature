import { progress, viewer, nextStory, prevStory, viewerImage } from "./dom.js"
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

// progress bar
export function startProgress() {

    progress.classList.remove("animate");
    progress.offsetWidth;
    progress.classList.add("animate");

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

