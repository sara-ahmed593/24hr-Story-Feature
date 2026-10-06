import { addStoryBtn, fileInput } from "./story-dom.js"
import { addStory, loadStories } from "./story-manager.js";
import { validateImage } from "./helper.js";


//add button
addStoryBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileInput.click();
});



fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;




    const reader = new FileReader();
    reader.onload = (event) => {
        const imgSrc = event.target.result;

        const img = new Image();

        img.onload = () => {
            if (!validateImage(file, img.width, img.height)) {
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



setInterval(() => { loadStories(); }, 60000);


loadStories();
