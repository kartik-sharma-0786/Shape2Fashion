// Get the container element where images will be displayed
const imageContainer = document.getElementById("resultsContainer");

// // Function to remove `./` from image paths in the data
// function cleanImagePaths(data) {
//     return data.map(category => 
//         category.map(item => {
//             if (item.image_path.startsWith("./")) {
//                 item.image_path = item.image_path.replace("./", ""); // Remove `./` from path
//             }
//             return item;
//         })
//     );
// }

// Retrieve and parse the data from localStorage
const dressesData = JSON.parse(localStorage.getItem("dressesData"));

// Check if data exists in localStorage
if (!dressesData || !dressesData.data) {
    console.log("No data found in localStorage!");
} 
//     function cleanImagePaths(data) {
//         return data.map(category => 
//         category.map(item => {
//             if (item.image_path.startsWith("./")) {
//                 item.image_path = item.image_path.replace("./", "/"); // Remove `./` from path
//             }
//             return item;
//         })
//     );
// }

    // Clean up image paths in the data
    // const cleanedData = cleanImagePaths(dressesData.data);
    const bodyShapeInfo = document.createElement("h2");
    bodyShapeInfo.textContent = `Your body shape is: ${dressesData[0][0].body_shape}`; // Assuming each category has a body shape
    document.body.insertBefore(bodyShapeInfo, imageContainer);

    // Clear previous images if any
    imageContainer.innerHTML = "";

    // Loop through the cleaned data and display images
    dressesData.forEach(category => {
        const divElement = document.createElement("div");
        divElement.innerText = category[0].class_name;
        imageContainer.appendChild(divElement);
            

        // console.log(category);
        // console.log(category[0].class_name);
        category.forEach(item => {

            const itemContainer = document.createElement("div");
            itemContainer.classList.add("item-container"); // Optional styling class

            // Create an image element for each item
            const imgElement = document.createElement("img");
            let cleanedPath = item.image_path.replace("./", "/");
            console.log(cleanedPath);
            imgElement.src = "Dresses/" + cleanedPath; // Set the cleaned image path
            // imgElement.alt = `${item.body_shape} ${item.class_name}`; // Set alt text
            imgElement.classList.add("displayed-image"); // Optionally add a class for styling
            imageContainer.appendChild(imgElement); // Append to the container


                        // Create a text element to display alt text
             const altText = document.createElement("div");
             altText.classList.add("image-tag"); // Optional styling class
             altText.textContent = imgElement.alt; // Set the text content
            
                        // Append the image and text to the container
             itemContainer.appendChild(imgElement);
             itemContainer.appendChild(altText);
            
                        // Append the container to the main image container
             imageContainer.appendChild(itemContainer);
            
        });
    });

