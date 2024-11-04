// this file deals with taking still photos with getUserMedia()
// Reference taken from https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos

(() => {

	const width = 320;
	let height = 0;

	const streaming = false;

	let video = null;
	let canvas = null;
	let photo = null;
	let startbutton = null;

	function startup()
	{
			video = document.getElementById('video');
			canvas = document.getElementById('canvas');
			photo = document.getElementById('photo');
			startbutton = document.getElementById('startbutton');

			navigator.mediaDevices
			.getUserMedia({ video: true , audio: false })
			.then((stream) => {
					video.srcObject = stream;
					video.play();
			 })
			.catch((err) => {
				console.error(`An error occured: ${err}`);
			});

	video.addEventListener("canplay" , 
		(ev)=> {
			if(!streaming)
			{
				height = (video.videoHeight / video.videoWidth) * width;

				video.setAttribute("width" , width);
				video.setAttribute("height" , height);
				canvas.setAttribute("width" , width);
				canvas.setAttribute("height" , height);

				streaming = true;
			}
		},
			false,
		);

		startbutton.addEventListener("click" , 
		 (ev) => {
			takepicture();
			ev.preventDefault();
		 },
				false,
		);

		clearphoto();

	}

	

	function clearphoto()
	{
		const context = canvas.getContext("2d");
		context.fillStyle = "#AAA";
		context.fillRect(0,0, canvas.width , canvas.width);

		const data = canvas.toDataURL("image/png");
		photo.setAttribute("src" , data);
	}

	
	function 	takepicture()
	{
		const context = canvas.getContext("2d");
		if (width && height)
		{
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video , 0,0, width , height);

			const data = canvas.toDataURL("image/png");
			photo.setAttribute("src" , data);			
			const imgblob = base64ToBlob(data);
			const imgFile = new File([imgblob] , "photo.png" , {type: "image/png"});

			uploadFile(imgFile);

		}

		else{
			clearphoto();
		}
	}
//The image taken is stored as a base64 encoded type which needs to be converted to a blob 
	function base64ToBlob(base64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64.split(',')[1]);
     const byteArrays = [];
	
     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         const slice = byteCharacters.slice(offset, offset + sliceSize);
	
         const byteNumbers = new Array(slice.length);
         for (let i = 0; i < slice.length; i++) {
             byteNumbers[i] = slice.charCodeAt(i);
         }
	
         const byteArray = new Uint8Array(byteNumbers);
         byteArrays.push(byteArray);
     }
	
     const blob = new Blob(byteArrays, { type: contentType });
     return blob;
}

	window.addEventListener("load" , startup , false);
	})();
