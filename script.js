const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const canvas = document.getElementById('canvas');
const resizeBtn = document.getElementById('resizeBtn');
const convertBtn = document.getElementById('convertBtn');
const changeBgBtn = document.getElementById('changeBgBtn');
const removeBgBtn = document.getElementById('removeBgBtn');
const downloadBtn = document.getElementById('downloadBtn');
const bgColor = document.getElementById('bgColor');

let img = new Image();
let currentFormat = 'png';

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(file) {
    img.src = URL.createObjectURL(file);
    preview.src = img.src;
  }
});

// Resize
resizeBtn.addEventListener('click', () => {
  const width = parseInt(prompt('Enter new width:', img.width));
  const height = parseInt(prompt('Enter new height:', img.height));
  if(!width || !height) return;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  preview.src = canvas.toDataURL(`image/${currentFormat}`);
});

// Convert format
convertBtn.addEventListener('click', () => {
  const format = prompt('Enter format: png, jpeg, webp', 'png').toLowerCase();
  if(['png','jpeg','jpg','webp'].includes(format)){
    currentFormat = format==='jpg'?'jpeg':format;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    preview.src = canvas.toDataURL(`image/${currentFormat}`);
  } else {
    alert('Invalid format!');
  }
});

// Change background
changeBgBtn.addEventListener('click', () => {
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bgColor.value || '#ffffff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img,0,0);
  preview.src = canvas.toDataURL(`image/${currentFormat}`);
});

// Remove background (simple approximation using transparency)
removeBgBtn.addEventListener('click', () => {
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const data = imageData.data;

  // Simple removal: make white pixels transparent
  for(let i=0;i<data.length;i+=4){
    if(data[i]>200 && data[i+1]>200 && data[i+2]>200){
      data[i+3] = 0;
    }
  }
  ctx.putImageData(imageData,0,0);
  preview.src = canvas.toDataURL('image/png');
  currentFormat = 'png';
});

// Download
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = preview.src;
  link.download = `image.${currentFormat}`;
  link.click();
});
