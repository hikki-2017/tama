import re

# Update main.js
with open(r'd:\tama\best_game\main.js', 'r', encoding='utf-8') as f:
    js = f.read()

bg_logic = """
const bgImages = {
    start: new Image(),
    school: new Image(),
    night: new Image(),
    battle: new Image(),
    peaceful: new Image()
};
bgImages.start.src = 'bg_start.png';
bgImages.school.src = 'bg_school.png';
bgImages.night.src = 'bg_night.png';
bgImages.battle.src = 'bg_night.png'; // Reuse night
bgImages.peaceful.src = 'bg_peaceful.png';

(function drawBg() {
    let img = bgImages[bgTheme];
    if (bgTheme === 'default') img = bgImages.start;
    
    if (img && img.complete && img.naturalHeight !== 0) {
        // Draw image covering the whole canvas
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }
        bgCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } else {
        bgCtx.fillStyle = '#050505';
        bgCtx.fillRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(drawBg);
})();
"""

js = re.sub(r'const themes = \{.*?\};\n\n\(function drawBg\(\) \{.*?\n\}\)\(\);', bg_logic, js, flags=re.DOTALL)

with open(r'd:\tama\best_game\main.js', 'w', encoding='utf-8') as f:
    f.write(js)

# Update style.css
with open(r'd:\tama\best_game\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

css += """
/* === CINEMATIC OVERHAUL === */
.char-portrait { display: none !important; }

#start-screen {
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10%;
    background: transparent;
}
.game-title {
    font-size: 3.5rem;
    text-align: left;
    margin: 0;
    text-shadow: 2px 2px 10px rgba(0,0,0,0.9);
    font-family: 'Georgia', serif;
}
.start-sub {
    text-align: left;
    font-size: 1.3rem;
    margin-top: 10px;
    margin-bottom: 50px;
    text-shadow: 1px 1px 5px rgba(0,0,0,0.8);
}
#start-btn {
    align-self: flex-start;
    margin-top: 20px;
    padding: 15px 60px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 0;
    font-weight: normal;
    letter-spacing: 5px;
    box-shadow: none;
    text-shadow: 1px 1px 5px rgba(0,0,0,0.8);
}
#start-btn:hover {
    background: rgba(255,255,255,0.1);
    transform: none;
    box-shadow: 0 0 15px rgba(255,255,255,0.2);
}
.title-chars, .start-chars-label { display: none !important; }

#ui-layer {
    justify-content: flex-end;
    padding: 0;
}
#message-area {
    width: 100%;
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    background: linear-gradient(to bottom, rgba(15,20,30,0.7) 0%, rgba(5,10,20,0.95) 100%);
    border: none;
    border-top: 1px solid rgba(200, 220, 255, 0.3);
    padding: 30px 50px 40px 50px;
    position: relative;
    box-shadow: none;
}
#speaker-name {
    position: absolute;
    top: -38px;
    left: 40px;
    background: rgba(20, 40, 80, 0.95);
    border: 1px solid rgba(100, 150, 255, 0.4);
    border-bottom: none;
    padding: 8px 25px;
    font-size: 1.2rem;
    border-radius: 2px 2px 0 0;
    box-shadow: inset 0 2px 5px rgba(255,255,255,0.05);
    letter-spacing: 2px;
}
#text-box {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
    font-size: 1.3rem;
    line-height: 1.8;
}
#text-box:hover {
    border-color: transparent;
    cursor: pointer;
}

#choices-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: 15px;
    width: 70%;
    max-width: 650px;
}
.choice-btn {
    width: 100%;
    background: linear-gradient(90deg, rgba(10,20,40,0) 0%, rgba(20,40,80,0.8) 50%, rgba(10,20,40,0) 100%);
    border: none;
    border-top: 1px solid rgba(100,150,255,0.3);
    border-bottom: 1px solid rgba(100,150,255,0.3);
    border-radius: 0;
    padding: 15px;
    font-size: 1.2rem;
    letter-spacing: 2px;
}
.choice-btn:hover {
    background: linear-gradient(90deg, rgba(20,50,100,0) 0%, rgba(40,80,180,0.9) 50%, rgba(20,50,100,0) 100%);
    border-color: rgba(150,200,255,0.8);
    transform: none;
    box-shadow: 0 0 20px rgba(100,150,255,0.2);
}
"""

with open(r'd:\tama\best_game\style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("UI Overview applied!")
