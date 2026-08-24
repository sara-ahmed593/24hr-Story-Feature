import { addStoryBtn, fileInput, viewer, deleteBtn, closeBtn, createStoryElement } from "./dom.js"
import { closeStory, viewstory, getCurrentStory } from "./viewer.js";
import { loadStories, stories } from "./helper.js";



//add button
addStoryBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileInput.click();
});

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

    createStoryElement(story, () => {
        viewstory(stories.indexOf(story))
    });
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



//close story viewer
closeBtn.addEventListener("click", closeStory)



setInterval(loadStories(view), 60000);


export function view(story) {
    viewstory(stories.indexOf(story));
}

loadStories(view);


