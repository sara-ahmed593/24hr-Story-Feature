export const addStoryBtn = document.getElementById('add-btn');
export const fileInput = document.getElementById('file-input');
export const nextStory = document.getElementById('next-story');
export const prevStory = document.getElementById('prev-story');
export const viewer = document.getElementById("story-viewer");
export const viewerImage = document.getElementById("viewer-image");
export const deleteBtn = document.getElementById("delete-btn");
export const progress = document.getElementById('progress-bar');
export const closeBtn = document.getElementById("close-viewer");
const storiesCard = document.querySelector(".stories__card");



// create story element
export function createStoryElement(story, storyClick) {
    const storyItem = document.createElement("div");
    storyItem.className = "stories__item";

    const storyCircle = document.createElement("div");
    storyCircle.classList.add("stories__add-btn");
    if (story.seen) {
        storyCircle.classList.add("seen");
    }

    const img = document.createElement("img");
    img.src = story.image;
    img.alt = "Story";
    img.classList.add("stories__image");

    const label = document.createElement("label");
    label.classList.add("stories__label");
    label.textContent = story.time;

    storyCircle.appendChild(img);
    storyItem.appendChild(storyCircle);
    storyItem.appendChild(label);
    storiesCard.appendChild(storyItem);

    storyCircle.addEventListener("click", storyClick);

}
