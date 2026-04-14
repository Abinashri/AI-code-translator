async function convertCode() {
    let code = document.getElementById("inputCode").value;
    let from = document.getElementById("fromLang").value;
    let to = document.getElementById("toLang").value;

    let chatBox = document.getElementById("chatBox");

    let userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.innerText = code;
    chatBox.appendChild(userMsg);

    let botMsg = document.createElement("div");
    botMsg.className = "message bot";

    let codeBlock = document.createElement("pre");
    let codeElement = document.createElement("code");

    codeElement.className = "language-" + to;

    codeBlock.appendChild(codeElement);
    botMsg.appendChild(codeBlock);

    chatBox.appendChild(botMsg);

    chatBox.scrollTop = chatBox.scrollHeight;

    let res = await fetch("/convert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            code,
            fromLang: from,
            toLang: to
        })
    });

    let data = await res.json();

    let text = data.result;
    let i = 0;

    function typeEffect() {
        if (i < text.length) {
            codeElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeEffect, 5);
        } else {
            hljs.highlightElement(codeElement);
        }
    }

    typeEffect();

    document.getElementById("inputCode").value = "";
}
