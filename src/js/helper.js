


// file validation
export function validateImage(file, width, height) {

    if (!file.type.match("image/*")) {
        alert("Please select an image file (JPEG, PNG, etc).");
        return false;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return false;
    }
    if (width > 1080 || height > 1920) {
        alert("Image dimensions must not exceed 1080 × 1920 pixels.");
        return false;
    }
    return true;
}