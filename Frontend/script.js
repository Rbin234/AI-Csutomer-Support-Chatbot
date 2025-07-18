const chatsContainer = document.querySelector(".chats-container");
const promptFrom = document.querySelector(".prompt-form");
const promptInput = promptFrom.querySelector(".prompt-input");

let userMessage= "";

//Fuction to create message elements
const createMsgElement=(content,...classes)=>{
    const div=document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML=content;
    return div;
}
//handling the form selection
const handleFormSubmit = (e) =>{
    e.preventDefault();
    userMessage=promptInput.value.trim();
    if(!userMessage) return;

promptInput.value="";

//Generate user message then add in the chat 
    const userMsgHTML='<p class="message-text"></p>';
    const userMsgDiv=createMsgElement(userMsgHTML,"user-message");

    userMsgDiv.querySelector(".message-text").textContent=userMessage;
    chatsContainer.appendChild(userMsgDiv);
    
//generate bot message then add in the chat after 600ms
    setTimeout(() =>{
    const botMsgHTML='<img src="chatbot.png" class="avatar"><p class="message-text">Just a sec...</p>';
    const botMsgDiv=createMsgElement(botMsgHTML,"bot-message","loading");
   
    chatsContainer.appendChild(botMsgDiv);

    },600);
}


promptFrom.addEventListener("submit",handleFormSubmit);