import re

with open(r'd:\tama\best_game\main.js', 'r', encoding='utf-8') as f:
    js = f.read()

def fix_newlines(match):
    text = match.group(1).replace('\n', '\\n')
    return "text: '" + text + "'"

js = re.sub(r"text:\s*'([^']*)'", fix_newlines, js)

def fix_desc(match):
    text = match.group(1).replace('\n', '\\n')
    return "desc = '" + text + "'"

js = re.sub(r"desc\s*=\s*'([^']*)'", fix_desc, js)

with open(r'd:\tama\best_game\main.js', 'w', encoding='utf-8') as f:
    f.write(js)

with open(r'd:\tama\best_game\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# UI/UX Improvements
css += """
/* UI/UX Polish */
#text-box {
    margin-top: 10px;
    padding: 20px;
    background: rgba(20, 20, 30, 0.9);
    border: 2px solid rgba(100, 150, 255, 0.5);
    border-radius: 8px;
    line-height: 1.6;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
}
#text-box:hover {
    border-color: rgba(100, 150, 255, 0.9);
    cursor: pointer;
}
#cursor {
    animation: blink 1s infinite;
}
@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}
.choice-btn {
    padding: 12px 24px;
    margin: 8px;
    background: rgba(40, 40, 60, 0.9);
    color: #fff;
    border: 1px solid rgba(150, 200, 255, 0.4);
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}
.choice-btn:hover {
    background: rgba(60, 80, 120, 0.9);
    transform: translateY(-2px);
    border-color: rgba(200, 230, 255, 0.8);
    box-shadow: 0 6px 12px rgba(100, 150, 255, 0.2);
}
#start-btn {
    padding: 15px 40px;
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    background: linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d);
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
}
#start-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(253, 187, 45, 0.6);
}
"""
with open(r'd:\tama\best_game\style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Syntax fixed and UI polished!")
