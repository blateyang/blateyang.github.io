let myIm = document.querySelector("img"); 

myIm.onclick = function (){
    let myImSrc = myIm.getAttribute("src");
    if(myImSrc === "images/sunflower.jpg"){
        myIm.setAttribute("src", "images/mozilla.jpg");
    }
    else{
        myIm.setAttribute("src", "images/sunflower.jpg");
    }
}

let myButton = document.querySelector("button");
let myHeading = document.querySelector("h1");

function setUserName(){
    let myName = prompt('请输入你的名字。');
    if(!myName || myName === null)
        setUserName();
    localStorage.setItem('name', myName);
    myHeading.innerHTML = '这是' + myName + '的第一个网站'; // textContent貌似不支持中文
}

if(!localStorage.getItem("name")){
    setUserName();
}
else{
    let storedName = localStorage.getItem("name");
    myHeading.textContent = '这是' + storedName + '的第一个网站';    
}

myButton.onclick = function (){
    setUserName();
}