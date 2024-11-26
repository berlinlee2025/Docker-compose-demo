// Button Text Roll effects
const useButtonTextRoll = (tabs) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";

    tabs.forEach(tab => {

        tab.onmouseover = (event) => {
            const target = event.target; // Capture the event target reference
            const finalText = target.dataset.value;

            if (!finalText) {
                console.error("Missing data-value attribute on the element with class: 'nav'");
                return;
            }

            let iterations = 0;
            const interval = setInterval(() => {
                target.style.height = '42px';
                target.style.width = '80px';

                target.innerText = finalText
                    .split("")
                    .map((char, index) => {
                        // Display the final character if iterations exceed index, else show random
                        return index < iterations ? char : letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                iterations++;
                if (iterations > finalText.length) {
                    clearInterval(interval);
                    target.innerText = finalText; // Ensure final text is set after animation
                }
            }, 40); // Finish animation in 0.5 second
        }
    });
}

export default useButtonTextRoll;