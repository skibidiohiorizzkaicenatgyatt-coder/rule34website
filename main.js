const maximumStreaks = document.querySelectorAll(".maximum-streak");
let canClick = true;

async function fetchRule34Characters(n = 2) {
    const response = await fetch("https://thronesapi.com/api/v2/Characters");
    const characters = await response.json();
    const selectedCharacters = [...characters].sort(() => 0.5 - Math.random()).slice(0, n);

    let randomNumbers;
    do {
    randomNumbers = [
        Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
        Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000
    ];
    } while (randomNumbers[0] === randomNumbers[1]);

    for (let i = 0; i <= n - 1; i++) {
        selectedCharacters[i].count = randomNumbers[i];
    }

    console.log(selectedCharacters)
    /*const proxyUrl = "https://api.allorigins.win/get?url=";
    selectedCharacters.forEach(async (selecChar) => {
        const targetUrl = `https://r34-json.herokuapp.com/posts?tags=${encodeURIComponent(selecChar.fullName)}&limit=1`;
        const response34 = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        const data = await response34.json()
        console.log(data)
        selecChar.count = data.count;
    });*/ //quando achar uma api que de certo substituir o codigo atual

    return selectedCharacters
}

function rule34Generator(character1, character2) {
    const template = document.querySelector("template").innerHTML;
    const image1 = document.querySelector(".image-1");
    const image2 = document.querySelector(".image-2");
    
    character1.class = "img-1";
    character2.class = "img-2";

    const rendered1 = Mustache.render(template, character1);
    const rendered2 = Mustache.render(template, character2);

    image1.innerHTML = rendered1;
    image2.innerHTML = rendered2;
}

function popUp() {
    return new Promise((resolve) => {
        const popUp = document.querySelector(".pop-up");
        const button = popUp.querySelector("button");

        function closePopUp() {
            popUp.classList.add("none");
            button.removeEventListener("click", closePopUp);
            document.querySelector(".pop-up-streak").innerText = 0;
            resolve();
        }

        popUp.classList.remove("none");
        button.addEventListener("click", closePopUp);
    });
}

function maxStreak(streak) {
    if (Number(document.querySelector(".maximum-streak").innerText) < Number(streak.innerText)) {
        maximumStreaks.forEach((maxStreak) => {
            console.log("foi aq")
            maxStreak.innerText = streak.innerText
        })
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function animateCount(element, target, duration = 1000) {
    const start = Number(element.dataset.count);
    const diff = target - start;
    const steps = Math.ceil(duration / 30);
    const increment = diff / steps;
    let current = start;
    let stepCount = 0;

    const interval = setInterval(() => {
        stepCount++;
        current += increment;
        element.innerText = Math.floor(current);

        if (stepCount >= steps) {
            element.innerText = target;
            clearInterval(interval);
        }
    }, 30);
}

document.addEventListener("DOMContentLoaded", async (event) => {
    const selectedCharacters = await fetchRule34Characters();
    rule34Generator(selectedCharacters[0], selectedCharacters[1]);
})

document.addEventListener("click", async (event) => {
    if (!event.target.closest(".image-1") && !event.target.closest(".image-2")) return
    if (!canClick) return
    console.log("hiii")
    canClick = false;

    const streak = document.querySelector(".streak");

    let image = null;
    let opositeImage = null;
    if (event.target.closest(".image-1")) {
        image = event.target.closest(".image-1").querySelector("img");
        opositeImage = event.target.closest(".images").querySelector(".image-2 img");
    } else {
        image = event.target.closest(".image-2").querySelector("img");
        opositeImage = event.target.closest(".images").querySelector(".image-1 img");
    }

    document.querySelectorAll(".posts").forEach((post) => {
        animateCount(post, Number(post.closest("div").querySelector("div").dataset.count), 1500)
    });
    
    await sleep(3000)

    if (Number(image.closest("div").dataset.count) > Number(opositeImage.closest("div").dataset.count)) {
        document.querySelectorAll(".streak").forEach((streakEach) => {
            streakEach.innerText = Number(streakEach.innerText) + 1;
        });
        maxStreak(streak);
    } else {
        streak.innerText = 0;
        maxStreak(streak);
        await popUp();
    }
    
    const selectedCharacters = await fetchRule34Characters();
    rule34Generator(selectedCharacters[0], selectedCharacters[1]);
    document.querySelectorAll(".posts").forEach((post) => {
        post.innerText = "?"
    })
    canClick = true;
});

/*
-- adicionar pop up de derrota
-- adicionar funcionalidade responsiva para o tamnho das imagens
-- colocar count q sobe aos poucos
-- colocar intervalo de tempo quando o usuario clica num card pra aparecer o próximo
-- ajustar a streak e a maximum streak
-- ajustar pra q o pop up fique centralizado na tela quando é mobile mesmo q scrole
-- ajustar canClick pra q só volte a ficar true depois q o pop up foi tirado da tela
*/