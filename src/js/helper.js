import { createStoryElement } from "./dom.js";
import { view } from "./script.js";

export let stories = JSON.parse(localStorage.getItem("stories")) || [];

// load stories after refresh
export function loadStories() {
    const cardReload = document.querySelectorAll(".stories__item:not(:first-child)")

    cardReload.forEach(item => item.remove());

    stories.forEach(story => {
        time24h(story)
        createStoryElement(story, () => {
            view(story)
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