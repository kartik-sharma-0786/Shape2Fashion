const imgElement = document.getElementById("imgsrc");
const fileElement = document.getElementById("fileInput") ;
const analyseBtn = document.getElementById("analyse");
var bdindex = 0;
var array;

fileElement.addEventListener("change" , (e)=>{
	imgElement.src = URL.createObjectURL(e.target.files[0]);
});



analyseBtn.addEventListener('click' , function(event){	
	event.preventDefault();
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
		})
	.catch(error => {
			console.log('Error:', error);
		});
}


