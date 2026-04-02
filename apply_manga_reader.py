import re

with open(r'd:\tama\best_game\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<button id="restart-btn"', '<button id="read-manga-btn">完成した漫画を読む</button>\n            <button id="restart-btn"')

manga_viewer = """        <!-- Manga Reader -->
        <div id="manga-viewer" class="hidden" style="display:none;">
            <div id="manga-container">
                <img src="manga_panel_1.webp" class="manga-panel">
                <img src="manga_panel_2.webp" class="manga-panel">
                <img src="manga_panel_3.webp" class="manga-panel">
                <img src="manga_panel_4.webp" class="manga-panel">
            </div>
            <button id="close-manga-btn">閉じる</button>
        </div>"""

html = html.replace('</div>\n    <script src="main.js"></script>', f'{manga_viewer}\n    </div>\n    <script src="main.js"></script>')

with open(r'd:\tama\best_game\index.html', 'w', encoding='utf-8') as f:
    f.write(html)


with open(r'd:\tama\best_game\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

css += """
/* Manga Viewer */
#manga-viewer {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.95); display: flex; flex-direction: column; align-items: center;
    z-index: 1000; overflow-y: auto; padding: 40px 0;
}
#manga-container {
    display: flex; flex-direction: column; gap: 20px; max-width: 600px; width: 90%;
}
.manga-panel {
    width: 100%; border: 3px solid #fff; border-radius: 4px; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}
#close-manga-btn {
    margin-top: 20px; margin-bottom: 40px; padding: 10px 30px; font-size: 1.2rem;
    background: #444; color: #fff; border: 2px solid #888;
    cursor: pointer; border-radius: 5px;
}
#read-manga-btn {
    margin-top: 15px; padding: 10px 25px; font-size: 1.2rem;
    background: #252535; color: #fff; border: 2px solid #ff44aa;
    cursor: pointer; border-radius: 5px; box-shadow: 0 0 10px rgba(255,68,170,0.4);
}

/* Speed Effect (Shake) */
@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}
.shake-anim { animation: shake 0.1s infinite; }
"""
with open(r'd:\tama\best_game\style.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open(r'd:\tama\best_game\main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add speed and action lines to ch3 crunch nodes
js = js.replace("{ id: 'ch3_m', text: 'それぞれが役割を見出し、最後の修羅場に突入した。', bg: 'school', bgm: 'audio/morning.mp3', next: 'ch3_d1' }", 
                "{ id: 'ch3_m', text: 'それぞれが役割を見出し、最後の修羅場に突入した。', bg: 'school', bgm: 'audio/morning.mp3', next: 'ch3_d1', speed: true }")

# In showNode
js = re.sub(r'    let ci = 0;\n    if \(typeTimer\) clearInterval\(typeTimer\);\n    typeTimer = setInterval\(\(\) => {',
r'''    let typeSpeed = 35;
    if (node.speed) {
        typeSpeed = 10;
        document.body.classList.add('shake-anim');
    } else {
        document.body.classList.remove('shake-anim');
    }

    let ci = 0;
    if (typeTimer) clearInterval(typeTimer);
    typeTimer = setInterval(() => {''', js)
js = js.replace('}, 35);', '}, typeSpeed);')

# Add ending UI button display toggle just in case
js = js.replace("clearChars();", "clearChars();\n    document.body.classList.remove('shake-anim');")

# Add button listeners
js += """
setTimeout(() => {
    document.getElementById('read-manga-btn').addEventListener('click', () => {
        document.getElementById('manga-viewer').classList.remove('hidden');
        document.getElementById('manga-viewer').style.display = 'flex';
    });
    document.getElementById('close-manga-btn').addEventListener('click', () => {
        document.getElementById('manga-viewer').classList.add('hidden');
        document.getElementById('manga-viewer').style.display = 'none';
    });
}, 100);
"""

with open(r'd:\tama\best_game\main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Applied UI and speed improvements!")
