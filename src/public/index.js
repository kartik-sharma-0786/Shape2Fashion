const imgElement = document.getElementById("imgsrc");
const fileElement = document.getElementById("fileInput") ;
const analyseBtn = document.getElementById("analyse");

fileElement.addEventListener("change" , (e)=>{
	imgElement.src = URL.createObjectURL(e.target.files[0]);
});


analyseBtn.addEventListener('click' , function(event){	
	event.preventDefault();
	const checkboxes = document.querySelectorAll('input[name="wearType"]:checked');
	// Create an array of the values of the checked checkboxes
	 selectedItems = Array.from(checkboxes).map(checkbox => checkbox.value);
	
	// Output the selected items
	console.log(selectedItems); 
	const file = fileElement?.files[0];
	uploadFile(file);

	

});


function uploadFile(file)
{
	console.log("Entered upload function");
	if(!file){
		alert("Please upload a file before continuing");
		return;
	}
	// to transfer files over the server it must be transfered as formdata
	const formData = new FormData();
	formData.append('file' , file);
	axios.post('/upload' , formData , {
		headers:{
			'Content-Type': 'multipart/form-data'
		}
	})
	.then(response => {
			console.log("file upload successfull" , response.data);

			const predictionArray = response.data.predicted_class; 
			const highestValue = predictionArray
			console.log("Highest value:", highestValue);
			const bodyShapeMap = [
				"rectangle",       // 0
				"apple",           // 1
				"InvertedTriangle", // 2
				"hourglass",       // 3
				"pear"             // 4
			];

			const bodyShape = bodyShapeMap[highestValue];
			//res.json({ bodyShape, predictionData: response.data });


			console.log("Body shape:", bodyShape);

       
		
		
		const payload = {
			body_shape: bodyShape,
			items: selectedItems
		};
		
		axios.post('/dresses', payload, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
	// 	.then(response => {
	// 		console.log("Payload successfully sent");
	// 	})
	// 	.catch(error => {
	// 		console.log('Error:', error);
	// 	})
	// })
	.then((response) => {
		console.log("Response from /dresses:", response.data);
		
		// Store the data in localStorage
		localStorage.setItem("dressesData", JSON.stringify(response.data));
		console.log("Data saved to localStorage:", localStorage.getItem("dressesData"));

		// Redirect to results.html
		
	
		window.location.href = "results.html";
	})
	.catch((error) => {
		console.log("Error:", error);
	});
})
		
	.catch(error => {
			console.log('Error:', error);
		});
}
