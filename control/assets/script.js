const video = document.getElementById("video");
    const captureBtn = document.getElementById("capture-btn");
    const timerInput = document.getElementById("TIMER(SECONDS)");
    const hueSlider = document.getElementById('hueSlider');
    const photoContainer = document.getElementById("photoContainer");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error(err);
        });

    hueSlider.addEventListener('input', function(event) {
        const hueValue = event.target.value;
        video.style.filter = `hue-rotate(${hueValue}deg)`;
    });

    function capturePhoto() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');

        const photoDiv = document.createElement('div');
        photoDiv.classList.add('photo');
        const img = document.createElement('img');
        img.src = dataUrl;
        photoDiv.appendChild(img);

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'photo.png';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
        photoDiv.appendChild(downloadBtn);
        photoContainer.appendChild(photoDiv);
    }

    captureBtn.addEventListener("click", () => {
        let timer = parseInt(timerInput.value, 10) || 0;
        if (timer > 0) {
            captureBtn.disabled = true;
            captureBtn.textContent = `Capture (${timer})`;
            const countdown = setInterval(() => {
                timer -= 1;
                captureBtn.textContent = `Capture (${timer})`;
                if (timer <= 0) {
                    clearInterval(countdown);
                    captureBtn.textContent = "Capture";
                    captureBtn.disabled = false;
                    capturePhoto();
                }
            }, 1000);
            } else {
                capturePhoto();
            }
        });