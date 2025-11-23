const imageContainer = document.getElementById("resultsContainer");

const dressesData = JSON.parse(localStorage.getItem("dressesData"));

if (!dressesData || dressesData.length === 0) {
    console.log("No data found in localStorage!");
} else {
    const bodyShapeInfo = document.createElement("h2");
    bodyShapeInfo.textContent = `Your body shape is: ${dressesData[0].bodyshape}`;
    document.body.insertBefore(bodyShapeInfo, imageContainer);

    imageContainer.innerHTML = "";

    dressesData.forEach(item => {
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("item-container");

        const imgElement = document.createElement("img");
        let cleanedPath = item.image_path.replace("./", "/");
        imgElement.src = "Dresses/" + cleanedPath;
        imgElement.alt = `${item.bodyshape} ${item.class_name}`;
        imgElement.classList.add("displayed-image");

        const altText = document.createElement("div");
        altText.classList.add("image-tag");
        altText.textContent = imgElement.alt;

        itemContainer.appendChild(imgElement);
        itemContainer.appendChild(altText);
        imageContainer.appendChild(itemContainer);
    });
}
