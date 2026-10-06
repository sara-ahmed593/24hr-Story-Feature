import { createStoryElement, storiesContainer } from "./story-dom.js"
import { viewstory, setStories } from "./story-viewer.js";

export let stories = JSON.parse(localStorage.getItem("stories")) || [];


storiesContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".stories__item");
    if (!card) { return }

    const id = Number(card.dataset.id)
    const index = stories.findIndex(story => story.id === id);
    viewstory(index, stories)

})

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

    createStoryElement(story);
    saveStory(story);
}

// load stories after refresh
export function loadStories() {

    storiesContainer.replaceChildren();

    const newStoriesList = stories.filter(story => {
        return time24h(story)
    });

    if (newStoriesList.length !== stories.length) {
        stories.length = 0;

        newStoriesList.forEach(story => {
            stories.push(story);
        });
        localStorage.setItem("stories", JSON.stringify(stories));
    }


    stories.forEach(story => {
        createStoryElement(story);
    });
}


// remove story after 24h
function time24h(story) {
    const time = Date.now();
    let storytime = story.id
    let finish = (time - storytime) / (60 * 1000)
    let end = 24 * 60
    let remainingTime = end - finish

    if (remainingTime <= 0) {
        return false;
    }
    return true;
}
setStories(loadStories);



