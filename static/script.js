let flippedCards = [];
let lockBoard = false;
let timeLeft = 60;
let timerInterval = setInterval(updateTimer, 1000);
let gameFinished = false;

function updateTimer() {
    document.getElementById("timer").textContent = timeLeft;
    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(timerInterval);
        endGame(false);
    }
}

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        if (lockBoard || card.classList.contains("matched")) return;

        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    });
});

function checkMatch() {
    lockBoard = true;
    let [c1, c2] = flippedCards;

    if (c1.dataset.value === c2.dataset.value) {
        c1.classList.add("matched");
        c2.classList.add("matched");

        if (document.querySelectorAll(".matched").length ===
            document.querySelectorAll(".card").length) {
            clearInterval(timerInterval);
            endGame(true);
        }
        resetBoard();
    } else {
        setTimeout(() => {
            c1.classList.remove("flipped");
            c2.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    flippedCards = [];
    lockBoard = false;
}

function endGame(victory) {
    if (gameFinished) return;
    gameFinished = true;

    const resultDiv = document.getElementById("result");

    if (victory) {
        resultDiv.innerHTML = `<h2>🎉 Bravo ! Paires trouvées !</h2>`;
        saveScore();
        document.getElementById("share").style.display = "inline-block";
    } else {
        resultDiv.innerHTML = `<h2>⏳ Temps écoulé !</h2>`;
    }
}

function saveScore() {
    const name = prompt("Entrez votre nom pour le classement :");

    fetch("/save_score", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: name, time: 60 - timeLeft})
    });
}

document.getElementById("share").onclick = function () {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
        `🎉 J'ai terminé le Memory Game en ${60 - timeLeft} secondes !`
    );

    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`);
};
