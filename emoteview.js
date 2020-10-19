/*

RegExps (all are in lowercase):
looooololollllooool: /^l[ol]+$/
lul/lulw: /^lulw?$/
hahahahaaahhhaaahhahahah: /^h[ah]+$/
monkaw: /^monkaw$/

add ?????????????

*/


//TODO: Figure out how to filter out "F", "lol", etc...
//TODO: Add rollover on emotes that tells you which one it is
//TODO: Add support for BetterTTV emotes

document.querySelectorAll(".chat-room__content > .tw-z-default")[0].innerHTML += `<div id="emotes-list"><div id="emotes-list-content"></div></div>`;

var node = document.createElement("style");

var regExps = [
    /^l[ol]+$/, //looolloollolololllool
    /^lulw?$/, //lul/lulw
    /^h[ah]+$/, //haahahahahahhhahahahahahah
    /^monkaw$/ //monkaw
];

node.innerHTML += `
@keyframes zoom-in {
    0% {
        /*transform: scale(0);*/
        margin-top: 10px;
        width: 1px;
    }
    100% {
        /*transform: scale(1);*/
        margin-top: 0px;
        width: 28px;
    }
}

@keyframes shoop-in {
    0% {
        transform: scaleY(0.9);
    }
    100% {
        transform: scaleY(1);
    }
}

#emotes-list {
    height: 50px;
    background-color: #18181b;
    display: flex;
    /* border: 1px dashed red; */
    align-items: center;
    justify-content: flex-end;
    padding: 0px 10px;
    border-bottom: 1px solid #303032;
    overflow: hidden;
    /* border-top: 1px solid #303032; */
    width: 100%;
}

#emotes-list-content {
    position: absolute;
    overflow: hidden;
    height: 28px;
}

#emotes-list .chat-image-wrapper {
    float:right;
    position: relative;
    top: 0;
    margin: 0;
    display: flex-inline;
    align-items: center;
    justify-content: center;
    animation: zoom-in 0.3s ease;
    margin-left: 5px;
    height: 28px;
}
.chat-image-wrapper .chat-image {
    margin: 0;
    max-height: 100%;
    position: static;
    top: 0;
}
#emotes-list .chat-image-wrapper:after {
    content: attr(data-content);
    color: white;
    background-color: rgba(145, 70, 255, 0.7);
    font-size: 0.6em;
    padding: 1px 3.5px;
    border-radius: 9999px;
    position: absolute;
    right: 0;
    bottom: 0;
}
.chat-image-wrapper.hiddenQuantityCounter:after {
    display: none;
}
`;

document.body.appendChild(node);

function runRegex(regex, text) {
    if (regex.test(text)) {

        let finalElement = document.createElement("div");
        finalElement.className = "chat-image-wrapper hiddenQuantityCounter";
        finalElement.innerHTML = `<img alt="LUL" class="chat-image chat-line__message--emote" src="https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0 1x,https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/2.0 2x,https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/3.0 4x">`;

        document.getElementById("emotes-list-content").prepend(finalElement);
    }
}

document.getElementsByClassName("chat-scrollable-area__message-container")[0].addEventListener("DOMNodeInserted", (e) => {
    if (e.target.classList.contains("chat-line__message")) {
        let target = e.target;
        let clone = target.cloneNode(true);

        clone.querySelector(".chat-line__username-container.tw-inline-block").remove();
        clone.querySelector("[data-test-selector='chat-message-separator']").remove();

        if (clone.innerText.trim() == "") { //Only emotes
            let emotes = target.querySelectorAll(".chat-image");
            //let emotes = target.querySelectorAll(".chat-line__message--emote")
            var lastUniqueEmote = emotes[0];
            var lastUniqueEmoteCount = 1;


            /*

            <div class="bttv-emote-tooltip-wrapper bttv-emote bttv-channel bttv-channel-emo-57719a9a6bdecd592c3ad59b">
                            <img src="https://cdn.betterttv.net/emote/57719a9a6bdecd592c3ad59b/1x" srcset="https://cdn.betterttv.net/emote/57719a9a6bdecd592c3ad59b/2x 2x, https://cdn.betterttv.net/emote/57719a9a6bdecd592c3ad59b/3x 4x" alt="gachiBASS" class="chat-line__message--emote">
                            <div class="bttv-emote-tooltip bttv-emote-tooltip--up bttv-emote-tooltip--align-center">
                        gachiBASS<br>
                        Channel: Rooph1e<br>
                        BetterTTV Channel Emotes
                    </div>
                        </div>

            */


            for (var i = 0; i < emotes.length; i+= 1) {
                let node = emotes[i].cloneNode();
                let finalElement = document.createElement("div");
                finalElement.className = "chat-image-wrapper";
                finalElement.appendChild(node);

                let quantity = 1;

                for (var j = i; j < emotes.length; j++) {
                    if (j == emotes.length - 1) {
                        i = j;
                        break;
                    }

                    if (emotes[j].alt == node.alt) {
                        quantity++;
                    } else {
                        i = j;
                        break;
                    }
                }

                if (quantity < 2) {
                    finalElement.className += " hiddenQuantityCounter";
                }

                finalElement.dataset.content = quantity;


                document.getElementById("emotes-list-content").prepend(finalElement);
            }
            target.style.display = "none";
        } else { //Try to match each with the regex
            let text = clone.innerText.trim().toLowerCase();
            for (var i = 0; i < regExps.length; i++) {
                if (regExps[i].test(text)) {
                    runRegex(regExps[i], text);
                    target.style.display = "none";
                }
            }
        }
    }
});
