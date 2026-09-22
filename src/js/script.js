import { addStoryBtn, fileInput, closeBtn, storyEvent } from "./dom.js"
import { closeStory, viewstory } from "./viewer.js";
import { addStory } from "./story.js";
import { loadStories, stories, viewHandler } from "./helper.js";


//add button
addStoryBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileInput.click();
});



// file validation
function validateImage(file) {

    if (!file.type.match("image/*")) {
        alert("Please select an image file (JPEG, PNG, etc).");
        return false;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return false;
    }
    return true;
}

function validateDimensions(width, height) {
    if (width > 1080 || height > 1920) {
        alert("Image dimensions must not exceed 1080 × 1920 pixels.");
        return false;
    }
    return true;
}

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;


    if (!validateImage(file)) {
        return;
    }


    const reader = new FileReader();
    reader.onload = (event) => {
        const imgSrc = event.target.result;

        const img = new Image();

        img.onload = () => {
            if (!validateDimensions(img.width, img.height)) {
                return;

            }

            const time = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });

            const id = Date.now();
            addStory(imgSrc, time, id);
        };

        img.src = imgSrc;
    };

    reader.readAsDataURL(file);

});

//close story viewer
closeBtn.addEventListener("click", closeStory)

setInterval(() => { loadStories(); }, 60000);

export function view(story) {

    viewstory(stories.indexOf(story));
}

storyEvent.addEventListener("storyClicked", () => { view(viewHandler); });

loadStories();
