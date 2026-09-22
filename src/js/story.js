import { createStoryElement, deleteBtn } from "./dom.js"
import { stories, loadStories } from "./helper.js";
import { closeStory, viewstory, getCurrentStory } from "./viewer.js";


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


// delete story

deleteBtn.addEventListener("click", () => {
    let currentStory = getCurrentStory();
    const index = stories.indexOf(currentStory);
    if (index !== -1) {
        stories.splice(index, 1);
    }

    localStorage.setItem("stories", JSON.stringify(stories));
    closeStory()
    loadStories()
    currentStory = null;


});



