const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* 遍历图片并添加至缩略图区 */
for(var i=1; i<=5; i++){
  const newImage = document.createElement('img');
  newImage.setAttribute('src', "images/pic"+i+".jpg");
  thumbBar.appendChild(newImage);
  newImage.onclick = displayImg; // onclick绑定的是一个函数名，若函数带有参数，应将其置于匿名函数中
}

function displayImg(e){
  displayedImage.setAttribute('src', e.target.getAttribute('src'));
}
/* 编写 变亮/变暗 按钮 */
btn.onclick = function(){
  if(btn.getAttribute('class') === 'dark'){
    btn.setAttribute('class', 'light');
    btn.textContent = "变亮";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  }
  else{
    btn.setAttribute('class', 'dark');
    btn.textContent = "变暗";
    overlay.style.backgroundColor = "rgba(0,0,0,0)";
  }
}