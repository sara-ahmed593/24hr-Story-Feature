import { createStoryElement } from "./story-dom.js"
import { stories } from "./helper.js";
import { viewstory, setStories } from "./story-viewer.js";


//save story in local storage
function saveStory(story) {
    stories.push(story);
    localStorage.setItem("stories", JSON.stringify(stories));
}

//add story
export function addStory(image, time, id) {
    const story = {
        id,
        image,
        time,
        seen: false

    };

    createStoryElement(story, () => {
        viewstory(stories.indexOf(story))
    });
    saveStory(story);
}

// load stories after refresh
export function loadStories() {
    const cardReload = document.querySelectorAll(".stories__item:not(:first-child)")

    cardReload.forEach(item => item.remove());

    stories.forEach(story => {
        time24h(story)
        createStoryElement(story, () => {
            viewstory(stories.indexOf(story))
        });
    }
    )
}


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
setStories(loadStories);



