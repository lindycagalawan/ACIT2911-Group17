// I've been here function

const increaseBtn = document.getElementById("increaseBtn");
const countLabel = document.getElementById("countLabel");

let count = 0;

increaseBtn.onclick = function() {
    count++;
    countLabel.textContent = count;
}
