// ============================================
// 最高の漫画への道 - Visual Novel (Complete Edition v2)
// 6 Characters | 4 Manga Routes | Date System
// ============================================

// --- Audio System --- //
const AudioSys = {
    ctx: null, ready: false, bgm: null, bgmGain: null, currentBGM: '', cache: {},
    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = 0.3;
        this.bgmGain.connect(this.ctx.destination);
        this.ready = true;
    },
    async load(url) {
        if (this.cache[url]) return this.cache[url];
        try { const r = await fetch(url); const b = await r.arrayBuffer(); const d = await this.ctx.decodeAudioData(b); this.cache[url] = d; return d; } catch(e) { return null; }
    },
    async playBGM(url, vol = 0.25) {
        if (!this.ready || this.currentBGM === url) return;
        this.stopBGM(); this.currentBGM = url;
        const buf = await this.load(url); if (!buf) return;
        this.bgm = this.ctx.createBufferSource(); this.bgm.buffer = buf; this.bgm.loop = true;
        this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.bgmGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 1.2);
        this.bgm.connect(this.bgmGain); this.bgm.start();
    },
    stopBGM() {
        if (this.bgm) { try { this.bgmGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4); const o = this.bgm; setTimeout(() => { try { o.stop(); } catch(e){} }, 500); } catch(e){} this.bgm = null; this.currentBGM = ''; }
    },
    async playSE(url, vol = 0.4) {
        if (!this.ready) return; const buf = await this.load(url); if (!buf) return;
        const s = this.ctx.createBufferSource(); s.buffer = buf; const g = this.ctx.createGain(); g.gain.value = vol; s.connect(g); g.connect(this.ctx.destination); s.start();
    },
    typeBeep() {
        if (!this.ready) return; const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(700 + Math.random()*300, this.ctx.currentTime);
        g.gain.setValueAtTime(0.015, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime+0.025);
        o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+0.025);
    },
    glitchSFX() {
        if (!this.ready) return; const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(180, this.ctx.currentTime);
        g.gain.setValueAtTime(0.15, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime+0.35);
        o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+0.35);
    }
};

// --- Canvas BG --- //
const canvas = document.getElementById('bg-canvas');
const bgCtx = canvas.getContext('2d');
let bgTheme = 'default';
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

const bgImages = { start: new Image(), school: new Image(), night: new Image(), battle: new Image(), peaceful: new Image() };
bgImages.start.src = 'bg_start.png'; bgImages.school.src = 'bg_school.png'; bgImages.night.src = 'bg_night.png'; bgImages.battle.src = 'bg_night.png'; bgImages.peaceful.src = 'bg_peaceful.png';

(function drawBg() {
    let img = bgImages[bgTheme]; if (bgTheme === 'default') img = bgImages.start;
    if (img && img.complete && img.naturalHeight !== 0) {
        const cr = canvas.width/canvas.height, ir = img.width/img.height;
        let dw, dh, ox, oy;
        if (cr > ir) { dw = canvas.width; dh = dw/ir; ox = 0; oy = (canvas.height-dh)/2; }
        else { dh = canvas.height; dw = dh*ir; ox = (canvas.width-dw)/2; oy = 0; }
        bgCtx.drawImage(img, ox, oy, dw, dh);
    } else { bgCtx.fillStyle = '#050505'; bgCtx.fillRect(0,0,canvas.width,canvas.height); }
    requestAnimationFrame(drawBg);
})();

// --- Character System (6 Characters with Fallback) --- //
const slots = { left: document.getElementById('char-left'), center: document.getElementById('char-center'), right: document.getElementById('char-right') };

// Build character HTML with fallback silhouette
function makeCharHTML(id, name, cls) {
    return `<div class="char-portrait ${cls}"><img class="char-img" src="char_${id}.png" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><div class="char-img-fallback" style="display:none;"></div><div class="char-nametag">${name}</div></div>`;
}

const charHTML = {
    aoi:     makeCharHTML('aoi', '蒼', 'char-aoi'),
    homura:  makeCharHTML('homura', '焔', 'char-homura'),
    shizuki: makeCharHTML('shizuki', '紫月', 'char-shizuki'),
    sui:     makeCharHTML('sui', '翠', 'char-sui'),
    akari:   makeCharHTML('akari', '灯', 'char-akari'),
    youta:   makeCharHTML('youta', '陽太', 'char-youta')
};

let curChars = {};
function updateChars(newChars, speakingId) {
    if (!newChars) return;
    ['left','center','right'].forEach(pos => {
        const id = newChars[pos]; const el = slots[pos];
        if (id) {
            if (curChars[pos] !== id) { el.innerHTML = charHTML[id] || ''; el.classList.add('visible'); }
            el.classList.toggle('speaking', id === speakingId);
        } else { el.classList.remove('visible','speaking'); setTimeout(() => { if (!el.classList.contains('visible')) el.innerHTML = ''; }, 500); }
    });
    curChars = { ...newChars };
}
function clearChars() { updateChars({ left:null, center:null, right:null }, null); curChars = {}; }

// --- Effects --- //
const glitchOverlay = document.getElementById('glitch-overlay');
const transOverlay = document.getElementById('transition-overlay');
function triggerGlitch(ms=500) { glitchOverlay.classList.add('active'); AudioSys.glitchSFX(); setTimeout(() => glitchOverlay.classList.remove('active'), ms); }
function fadeTransition() { transOverlay.classList.add('fade-in'); setTimeout(() => transOverlay.classList.remove('fade-in'), 700); }

// --- Chapter Title --- //
function showChapter(label, title) {
    return new Promise(resolve => {
        const sc = document.getElementById('chapter-screen');
        document.getElementById('chapter-label').textContent = label;
        document.getElementById('chapter-title').textContent = title;
        sc.classList.remove('hidden'); sc.style.display = 'flex'; sc.style.opacity = '0';
        requestAnimationFrame(() => { sc.style.opacity = '1'; });
        setTimeout(() => { sc.style.opacity = '0'; setTimeout(() => { sc.style.display = 'none'; sc.classList.add('hidden'); resolve(); }, 900); }, 2200);
    });
}

// ==============================
// STORY SCRIPT (6 Characters)
// ==============================
const script = [
    // ── PROLOGUE ──
    { id: 'pro_0', chapter: ['PROLOGUE', '出会い'], next: 'pro_1' },
    { id: 'pro_1', text: '四月──。\n桜の花びらが風に舞う、穏やかな朝だった。', bg: 'school', bgm: 'audio/morning.mp3', next: 'pro_2' },
    { id: 'pro_2', text: '私立・星嶺学園。\n僕は昔から漫画を読むのが好きで、いつか自分でも描いてみたいと思っていた。', next: 'pro_3' },
    { id: 'pro_3', text: 'でも、一人で作品を完成させる勇気も、画力も足りない。\nノートの隅に落書きをするだけの日々。', se: 'audio/wind.mp3', next: 'pro_4' },
    { id: 'pro_4', text: 'そんな時、ふと目にしたのは──\n一枚の手書きポスター。「漫画研究会、部員募集中。本気でプロを目指す者求む」。', next: 'pro_5' },

    { id: 'pro_5', text: '── 1年B組・教室 ──', bg: 'school', bgm: 'audio/classroom.mp3', chars: {}, se: 'audio/chime.mp3', next: 'pro_6' },
    { id: 'pro_6', text: '放課後のチャイムが鳴り響く。\nノートの端の落書きを見つめていると、不意に声がした。', chars: { center: 'aoi' }, next: 'pro_7' },
    { id: 'pro_7', speaker: '蒼', sc: 'aoi', text: '（……今日も描けなかったな）', next: 'pro_8' },

    // NEW: 陽太の登場
    { id: 'pro_8', speaker: '陽太', sc: 'youta', text: 'よっ、蒼。また落書きしてんの？\nお前の絵、俺は好きだけどなー。', chars: { left: 'aoi', right: 'youta' }, next: 'pro_9' },
    { id: 'pro_9', speaker: '蒼', sc: 'aoi', text: '陽太……。別に、ただの暇つぶしだよ。', next: 'pro_9b' },
    { id: 'pro_9b', speaker: '陽太', sc: 'youta', text: '暇つぶしにしちゃ上手すぎだろ。\nあ、そういえば漫研のポスター見た？ お前、入ればいいのに。', next: 'pro_9c' },
    { id: 'pro_9c', speaker: '蒼', sc: 'aoi', text: '漫研……？ いや、僕なんか──', next: 'pro_10' },

    { id: 'pro_10', text: '突然、背後からノートを覗き込まれた。', se: 'audio/taiko.mp3', next: 'pro_11' },
    { id: 'pro_11', speaker: '焔', sc: 'homura', text: 'よう！ お前、すっげえ絵描くじゃん！', chars: { left: 'aoi', right: 'homura' }, next: 'pro_12' },
    { id: 'pro_12', speaker: '蒼', sc: 'aoi', text: '……えっ！？\nいや、これはただの落書きで──', next: 'pro_13' },
    { id: 'pro_13', speaker: '焔', sc: 'homura', text: '俺は焔！ 最高の原作ストーリーを思いついたんだけど、作画がいなくてさ！\n漫研に見学行くから、お前も来いよ！', next: 'pro_14' },
    { id: 'pro_14', speaker: '蒼', sc: 'aoi', text: 'ええっ……！？', next: 'pro_15' },
    { id: 'pro_15', speaker: '陽太', sc: 'youta', text: 'おお、面白そうじゃん！\n蒼、行ってきなよ。俺も応援してるぜ！', chars: { left: 'aoi', center: 'youta', right: 'homura' }, next: 'pro_16' },
    { id: 'pro_16', text: '腕を引かれるまま、蒼は教室を後にした。\n陽太が手を振って見送るのが見えた。', next: 'ch1_0' },

    // ── CHAPTER 1 ──
    { id: 'ch1_0', chapter: ['CHAPTER 1', '漫画研究会'], next: 'ch1_1' },
    { id: 'ch1_1', text: '── 旧校舎・漫画研究会 部室 ──', bg: 'peaceful', bgm: 'audio/underground.mp3', chars: {}, next: 'ch1_2' },
    { id: 'ch1_2', text: '旧校舎にある部室。\nインクの匂いと、山積みの漫画雑誌や画材が広がっている。', next: 'ch1_3' },
    { id: 'ch1_3', speaker: '紫月', sc: 'shizuki', text: 'いらっしゃい。見学者かしら？', chars: { center: 'shizuki' }, next: 'ch1_4' },
    { id: 'ch1_4', text: '長い紫の髪をした上級生が、Gペンを置いて優雅に微笑んだ。\nその落ち着いた雰囲気に、空気が変わる。', next: 'ch1_5' },
    { id: 'ch1_5', speaker: '紫月', sc: 'shizuki', text: '私は紫月。3年生で、この漫研の部長よ。\nよく来てくれたわね。', next: 'ch1_6' },
    { id: 'ch1_6', speaker: '焔', sc: 'homura', text: 'おお、部長！ 俺、焔っす！\nジャンプで一番取るために来ました！', chars: { left: 'homura', right: 'shizuki' }, next: 'ch1_7' },
    { id: 'ch1_7', speaker: '紫月', sc: 'shizuki', text: '……元気ね。嫌いじゃないわ。', next: 'ch1_8' },
    { id: 'ch1_8', speaker: '蒼', sc: 'aoi', text: 'あの……僕は蒼です。\nその、無理やり連れてこられただけで、漫画作るとかは……', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch1_9' },
    { id: 'ch1_9', speaker: '紫月', sc: 'shizuki', text: '絵を描くのが好きなら大歓迎よ。\n漫画は一人で描かなくても、分担して作れるから。', next: 'ch1_10' },
    { id: 'ch1_10', text: 'その時、部室のドアがゆっくりと開いた。', se: 'audio/switch.mp3', next: 'ch1_11' },
    { id: 'ch1_11', speaker: '翠', sc: 'sui', text: '……遅れました。1年C組の、翠です。', chars: { left: 'aoi', center: 'sui', right: 'shizuki' }, next: 'ch1_12' },
    { id: 'ch1_12', text: '緑がかった髪の静かな少女。\n手には分厚いマーケティング資料を持っている。', next: 'ch1_13' },
    { id: 'ch1_13', speaker: '翠', sc: 'sui', text: '編集・データ分析志望です。\n読者アンケートの傾向データ、持ってきました。', next: 'ch1_14' },
    { id: 'ch1_14', speaker: '焔', sc: 'homura', text: '……変わったやつだな。', chars: { left: 'homura', center: 'sui', right: 'shizuki' }, next: 'ch1_15' },
    { id: 'ch1_15', speaker: '翠', sc: 'sui', text: '変わってるのはお互い様。\n情熱だけでは連載は勝ち取れません。', next: 'ch1_16' },

    // NEW: 灯の登場
    { id: 'ch1_16', text: 'さらにドアが開く。今度はリボンをつけた少女が現れた。', se: 'audio/switch.mp3', next: 'ch1_16b' },
    { id: 'ch1_16b', speaker: '灯', sc: 'akari', text: 'あっ、ここが漫研！？ 見つけた！\n1年A組の灯です！ カラーイラストが得意です！', chars: { left: 'akari', center: 'sui', right: 'shizuki' }, next: 'ch1_16c' },
    { id: 'ch1_16c', speaker: '紫月', sc: 'shizuki', text: 'あら、大盛況ね。カラー担当は貴重よ。歓迎するわ。', next: 'ch1_16d' },
    { id: 'ch1_16d', speaker: '灯', sc: 'akari', text: 'やったー！ あ、そこの男子、絵描くの？\nなんか……いいオーラ出てるね！', chars: { left: 'akari', center: 'aoi', right: 'shizuki' }, next: 'ch1_16e' },
    { id: 'ch1_16e', speaker: '蒼', sc: 'aoi', text: '（元気な子だな……）\nえっと……よろしく。', next: 'ch1_17' },

    { id: 'ch1_17', speaker: '紫月', sc: 'shizuki', text: 'ふふ、頼もしい一年生たちね。\nでは──まずは自己紹介から始めましょうか。', next: 'ch1_18' },
    { id: 'ch1_18', speaker: '紫月', sc: 'shizuki', text: '私たちの目標は、夏の同人誌即売会でオリジナル漫画を完成させ、\nそして新人賞へ応募することよ。', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch1_c' },

    { id: 'ch1_c', speaker: '紫月', sc: 'shizuki', text: '蒼、あなたはどう漫画に関わってみたい？', chars: { left: 'aoi', right: 'shizuki' }, choices: [
        { label: '真剣に取り組む──「作画をがっつりやってみたい」', next: 'ch1_ca', flag: 'serious' },
        { label: '不安を伝える──「アシスタントくらいなら…」', next: 'ch1_cb', flag: 'afraid' },
        { label: '好奇心で挑む──「ネームも作画もやってみたい」', next: 'ch1_cc', flag: 'curious' }
    ]},
    { id: 'ch1_ca', speaker: '蒼', sc: 'aoi', text: '……作画に挑戦してみたいです。\n自分の描いた絵で、キャラクターを動かしてみたい。', next: 'ch1_ca2' },
    { id: 'ch1_ca2', speaker: '紫月', sc: 'shizuki', text: '……良い目ね。期待しているわ。', next: 'ch1_ca3' },
    { id: 'ch1_ca3', speaker: '灯', sc: 'akari', text: 'じゃあ私はカラー表紙担当だね！\n蒼くんの線画に色を塗るの、楽しみ！', chars: { left: 'aoi', center: 'akari', right: 'shizuki' }, next: 'ch1_end' },
    { id: 'ch1_cb', speaker: '蒼', sc: 'aoi', text: '正直……自分の絵に自信がない。\nだから、背景やトーン貼りのアシスタントなら……。', next: 'ch1_cb2' },
    { id: 'ch1_cb2', speaker: '焔', sc: 'homura', text: '大丈夫だ！ 俺が死ぬほど面白い原作書くから！\n二人で一緒に最高の漫画描こうぜ！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch1_cb3' },
    { id: 'ch1_cb3', speaker: '灯', sc: 'akari', text: '私も手伝うよ！\n一人で抱え込まなくていいからね！', chars: { left: 'akari', center: 'homura', right: 'aoi' }, next: 'ch1_end' },
    { id: 'ch1_cc', speaker: '蒼', sc: 'aoi', text: '少し……面白そうだ。\nせっかくだから、原作も作画も全部学んでみたいです。', next: 'ch1_cc2' },
    { id: 'ch1_cc2', speaker: '翠', sc: 'sui', text: '同感。全体工程を知るのは良いこと。\n一緒にスケジュール管理しましょう。', chars: { left: 'aoi', center: 'sui', right: 'shizuki' }, next: 'ch1_end' },

    { id: 'ch1_end', text: 'こうして、漫画研究会での日々が始まった。\nまだ誰も知らない──最高の漫画を作るための道のりが、どれほど険しいかを。', next: 'ch2_0' },

    // ── CHAPTER 2 ──
    { id: 'ch2_0', chapter: ['CHAPTER 2', '初めてのネーム'], next: 'ch2_1' },
    { id: 'ch2_1', text: '── 数日後・放課後 ──', bg: 'school', bgm: 'audio/classroom.mp3', chars: {}, next: 'ch2_2' },
    { id: 'ch2_2', speaker: '紫月', sc: 'shizuki', text: 'じゃあ、今日は焔くんが持ち込んだ原作プロットをもとに、\n蒼くんにネームを切ってもらうわ。', chars: { center: 'shizuki' }, next: 'ch2_3' },
    { id: 'ch2_3', speaker: '焔', sc: 'homura', text: 'よっしゃ、初原稿だ！ 頼むぜ蒼！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch2_4' },
    { id: 'ch2_4', speaker: '翠', sc: 'sui', text: '読者の視線誘導、読了までのテンポを計測します。', next: 'ch2_4b' },
    { id: 'ch2_4b', speaker: '灯', sc: 'akari', text: 'あ、カラーラフも一緒に考えとくね！\n表紙のイメージ、もう浮かんでるの！', chars: { left: 'akari', center: 'homura', right: 'aoi' }, next: 'ch2_5' },
    { id: 'ch2_5', speaker: '蒼', sc: 'aoi', text: '……わかった。やってみる。', next: 'ch2_b' },

    { id: 'ch2_b', text: '── 蒼の机の上 ──', bg: 'school', bgm: 'audio/morning.mp3', chars: {}, next: 'ch2_b1' },
    { id: 'ch2_b1', text: 'まっさらな紙。コマ割りの枠線だけが引いてある。\nここにキャラクターのドラマを描き込んでいく。', next: 'ch2_b3' },
    { id: 'ch2_b3', speaker: '焔', sc: 'homura', text: '「ここでさ、主人公がデカい声で叫ぶんだよ！ 俺は負けねえ！って！」', chars: { center: 'homura' }, se: 'audio/taiko.mp3', next: 'ch2_b4' },
    { id: 'ch2_b4', text: '焔のアイデアは熱いが、そのまま描くと少し大げさに感じる。', next: 'ch2_b6' },
    { id: 'ch2_b6', speaker: '翠', sc: 'sui', text: 'コマのサイズが全体の40%を占めています。\n大ゴマの連続は読者の緊張感を削ぐ危険があります。', chars: { left: 'homura', center: 'sui' }, next: 'ch2_b7' },
    { id: 'ch2_b7', speaker: '蒼', sc: 'aoi', text: '……修正してみよう。どんな構図にする？', chars: { left: 'homura', center: 'aoi', right: 'sui' }, next: 'ch2_bc' },

    { id: 'ch2_bc', text: 'どんなふうにネームを描く？', choices: [
        { label: '焔の熱意をそのまま見開きの大ゴマで！', next: 'ch2_x1', flag: 'front' },
        { label: '翠の指摘をふまえ、コマを細かく割る', next: 'ch2_x2', flag: 'analyze' },
        { label: '主人公の表情のアップだけで魅せる', next: 'ch2_x3', flag: 'solo' }
    ]},
    { id: 'ch2_x1', speaker: '蒼', sc: 'aoi', text: 'ここは見開きで一気に読ませる！', next: 'ch2_x1b' },
    { id: 'ch2_x1b', speaker: '焔', sc: 'homura', text: 'おう！ 超迫力あるじゃんか！！', chars: { left: 'aoi', right: 'homura' }, next: 'ch2_r' },
    { id: 'ch2_x2', speaker: '蒼', sc: 'aoi', text: '……コマを割って、少しずつ感情を高めていこう。', next: 'ch2_x2b' },
    { id: 'ch2_x2b', speaker: '翠', sc: 'sui', text: 'テンポは完璧。読者の没入感が高まります。', chars: { left: 'aoi', right: 'sui' }, next: 'ch2_r' },
    { id: 'ch2_x3', speaker: '蒼', sc: 'aoi', text: '（セリフより、表情で語れるはずだ）', chars: { center: 'aoi' }, next: 'ch2_x3b' },
    { id: 'ch2_x3b', text: '無言のアップ。瞳に強い決意だけを描き込んだ。\n読者に想像させる演出が、静かな余韻を残す。', next: 'ch2_x3c' },
    { id: 'ch2_x3c', speaker: '紫月', sc: 'shizuki', text: '（凄い……あの子、絵で物語を語る才能があるわね……）', next: 'ch2_r' },

    { id: 'ch2_r', text: '初めてのネーム作業は無事に終わった。', bg: 'school', bgm: 'audio/classroom.mp3', next: 'ch2_r1' },
    { id: 'ch2_r1', speaker: '焔', sc: 'homura', text: 'やった……案外いけるじゃん！', chars: { left: 'aoi', right: 'homura' }, next: 'ch2_r1b' },
    // NEW: 灯のリアクション
    { id: 'ch2_r1b', speaker: '灯', sc: 'akari', text: 'ねえねえ、このシーン見て！ すっごいカッコいい！\n蒼くんの線画、私が塗ったら絶対映えるよ！', chars: { left: 'aoi', center: 'akari', right: 'homura' }, next: 'ch2_r2' },
    { id: 'ch2_r2', speaker: '蒼', sc: 'aoi', text: '……うん。なんだか、楽しい。\n初めて、自分の頭の中が形になった気がする。', next: 'ch2_r3' },
    { id: 'ch2_r3', speaker: '紫月', sc: 'shizuki', text: 'お疲れ様。いいネームね。\nでも──', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch2_r4' },
    { id: 'ch2_r4', speaker: '紫月', sc: 'shizuki', text: '新人賞の締め切りまであと1ヶ月。\nここからのペン入れと仕上げが地獄よ。', next: 'ch2_r5' },
    { id: 'ch2_r5', speaker: '紫月', sc: 'shizuki', text: '……でも、その前に。\n今日くらいは息抜きしなさい。根を詰めすぎると潰れるわよ。', next: 'date_0' },

    // ── DATE CHAPTER ──
    { id: 'date_0', chapter: ['CHAPTER 2.5', '放課後の横顔'], next: 'date_1' },
    { id: 'date_1', text: '── 放課後 ──\n\n紫月先輩の言葉に甘えて、今日は早めに部室を出ることにした。', bg: 'school', bgm: 'audio/classroom.mp3', chars: {}, next: 'date_2' },
    { id: 'date_2', text: '校舎を出ようとした時、廊下でみんなとすれ違った。\n誰と一緒に帰ろうか。', next: 'date_c' },

    { id: 'date_c', text: '誰と過ごす？', choices: [
        { label: '焔と──「おい蒼、ラーメン食いに行こうぜ！」', next: 'date_h1', flag: 'date_homura' },
        { label: '紫月先輩と──「蒼くん、少し付き合ってくれる？」', next: 'date_s1', flag: 'date_shizuki' },
        { label: '翠と──「……蒼さん、本屋に寄りませんか」', next: 'date_t1', flag: 'date_sui' },
        { label: '灯と──「蒼くん！ クレープ食べに行こうよ！」', next: 'date_a1', flag: 'date_akari' }
    ]},

    // --- 焔ルート ---
    { id: 'date_h1', text: '── 駅前・ラーメン屋「炎龍」 ──', bg: 'peaceful', bgm: 'audio/morning.mp3', chars: { left: 'aoi', right: 'homura' }, next: 'date_h2' },
    { id: 'date_h2', speaker: '焔', sc: 'homura', text: 'ここの味噌ラーメン、マジで最強なんだ！\n漫画描いた後はカロリー補給だろ！', next: 'date_h3' },
    { id: 'date_h3', speaker: '蒼', sc: 'aoi', text: '……焔って、いつもそのテンションだよな。', next: 'date_h4' },
    { id: 'date_h4', speaker: '焔', sc: 'homura', text: 'ん？ 当たり前だろ。\n熱くなきゃ、面白いもん作れないぜ。', next: 'date_h5' },
    { id: 'date_h5', text: 'ラーメンをすすりながら、焔は真剣な顔になった。', next: 'date_h6' },
    { id: 'date_h6', speaker: '焔', sc: 'homura', text: '……なあ蒼。お前はさ、なんで漫画描こうと思ったんだ？', next: 'date_h7' },
    { id: 'date_h7', speaker: '蒼', sc: 'aoi', text: '……小さい頃、入院してた時に読んだ漫画があって。\nそれに救われたんだ。だから……いつか自分も。', next: 'date_h8' },
    { id: 'date_h8', speaker: '焔', sc: 'homura', text: '──いい話じゃねえか。\n俺がお前の原作を書く。お前が描く。\n最高のコンビだろ、俺たち。', next: 'date_h10' },
    { id: 'date_h10', text: '夕陽がラーメン屋の窓から差し込んでいた。\n焔の横顔が、いつもより少し大人びて見えた。', bg: 'peaceful', se: 'audio/wind.mp3', next: 'date_h11' },
    { id: 'date_h11', speaker: '蒼', sc: 'aoi', text: '（……不思議だな。こいつといると、描ける気がする）', next: 'date_h12' },
    { id: 'date_h12', speaker: '焔', sc: 'homura', text: 'よっし！ 替え玉追加！\nお前もいけよ、蒼！', next: 'date_h13' },
    { id: 'date_h13', speaker: '蒼', sc: 'aoi', text: 'はは……じゃあ、もう一杯だけ。', next: 'date_end' },

    // --- 紫月ルート ---
    { id: 'date_s1', text: '── 旧校舎・屋上への階段 ──', bg: 'night', bgm: 'audio/night_city.mp3', chars: { left: 'aoi', right: 'shizuki' }, next: 'date_s2' },
    { id: 'date_s2', speaker: '紫月', sc: 'shizuki', text: '……ここ、普段は鍵がかかってるんだけどね。\n部長特権、というやつよ。', next: 'date_s3' },
    { id: 'date_s3', text: '屋上に出ると、星空が広がっていた。\n街の灯りが遠くに瞬いている。', se: 'audio/wind.mp3', next: 'date_s4' },
    { id: 'date_s4', speaker: '蒼', sc: 'aoi', text: 'すごい……こんな場所があったんですね。', next: 'date_s5' },
    { id: 'date_s5', speaker: '紫月', sc: 'shizuki', text: '私ね、卒業したらプロの漫画家になるの。\nもう出版社にも持ち込みしてるわ。', next: 'date_s6' },
    { id: 'date_s6', speaker: '蒼', sc: 'aoi', text: '……え、先輩、もうそこまで……？', next: 'date_s7' },
    { id: 'date_s7', speaker: '紫月', sc: 'shizuki', text: 'でもね。3回連続で落とされたの。\n「画力はあるが、キャラクターに熱がない」って。', next: 'date_s8' },
    { id: 'date_s8', text: '紫月先輩の表情が、月明かりの中で少し揺れた。', next: 'date_s9' },
    { id: 'date_s9', speaker: '紫月', sc: 'shizuki', text: '……だから、あなたたちが入ってくれて嬉しかったの。\n一人じゃ見えなかったものが、見えるようになった。', next: 'date_s10' },
    { id: 'date_s10', speaker: '紫月', sc: 'shizuki', text: '特に蒼くん、あなたの絵には──\n言葉にできない「何か」があるのよ。', next: 'date_s11' },
    { id: 'date_s11', speaker: '蒼', sc: 'aoi', text: '（胸が、熱くなる。\nこの人のために──もっといい絵を描きたい）', next: 'date_s12' },
    { id: 'date_s12', speaker: '紫月', sc: 'shizuki', text: '……ふふ、顔が赤いわよ。\nさ、そろそろ戻りましょう。', next: 'date_s13' },
    { id: 'date_s13', text: '階段を降りる時、紫月先輩の指先がそっと蒼の手に触れた。\nどちらも、何も言わなかった。', se: 'audio/shiver.mp3', next: 'date_end' },

    // --- 翠ルート ---
    { id: 'date_t1', text: '── 駅前・大型書店 ──', bg: 'peaceful', bgm: 'audio/rain.mp3', chars: { left: 'aoi', right: 'sui' }, next: 'date_t2' },
    { id: 'date_t2', speaker: '翠', sc: 'sui', text: '……雨、降ってきましたね。\nちょうどいい。ゆっくり本が選べます。', next: 'date_t3' },
    { id: 'date_t3', text: '翠は漫画の技法書コーナーへまっすぐ向かった。\nその横顔は、データ分析中と同じ真剣さだった。', next: 'date_t4' },
    { id: 'date_t4', speaker: '翠', sc: 'sui', text: 'この本、コマ割りの黄金比について書いてあります。\n蒼さんの画風に合うと思って。', next: 'date_t5' },
    { id: 'date_t5', speaker: '蒼', sc: 'aoi', text: '……翠って、いつも僕のこと分析してるよな。', next: 'date_t6' },
    { id: 'date_t6', speaker: '翠', sc: 'sui', text: '……分析じゃ、ありません。\nただ……見てるだけです。蒼さんが描く時の顔が、好きなので。', next: 'date_t8' },
    { id: 'date_t8', text: '翠の頬が、わずかに赤くなった。\n普段クールな彼女の、初めて見る表情だった。', se: 'audio/shiver.mp3', next: 'date_t9' },
    { id: 'date_t9', speaker: '蒼', sc: 'aoi', text: '（……え？ 今、「好き」って……）', next: 'date_t10' },
    { id: 'date_t10', speaker: '翠', sc: 'sui', text: '……忘れてください。\nただの観測データです。', next: 'date_t11' },
    { id: 'date_t11', text: '帰り道、2人は一つの傘を共有した。\n翠の肩が、わずかに蒼に触れていた。', next: 'date_end' },

    // --- 灯ルート (NEW) ---
    { id: 'date_a1', text: '── 駅前・クレープ屋 ──', bg: 'peaceful', bgm: 'audio/morning.mp3', chars: { left: 'aoi', right: 'akari' }, next: 'date_a2' },
    { id: 'date_a2', speaker: '灯', sc: 'akari', text: 'いちごチョコバナナ、ダブルで！\n蒼くんは何にする？', next: 'date_a3' },
    { id: 'date_a3', speaker: '蒼', sc: 'aoi', text: '……普通のチョコバナナで。\n灯は本当に元気だな。', next: 'date_a4' },
    { id: 'date_a4', speaker: '灯', sc: 'akari', text: 'だって、漫画って楽しくないと意味ないじゃん！\n苦しいだけの創作なんて嫌だもん。', next: 'date_a5' },
    { id: 'date_a5', text: 'クレープを食べながら、公園のベンチに座った。\n灯はスマホでSNSを見せてくれた。', next: 'date_a6' },
    { id: 'date_a6', speaker: '灯', sc: 'akari', text: '見てこれ！ 私が描いたファンアート、500いいね超えたの！\n……でもね、オリジナルは全然伸びないんだ。', next: 'date_a7' },
    { id: 'date_a7', speaker: '蒼', sc: 'aoi', text: '……灯のカラー、すごく綺麗だよ。\nオリジナルだって、きっと届く。', next: 'date_a8' },
    { id: 'date_a8', speaker: '灯', sc: 'akari', text: '……ッ！\nそ、そう？ えへへ、蒼くんに言われると嬉しいな。', next: 'date_a9' },
    { id: 'date_a9', text: '夕焼けの中、灯の笑顔がいつもより眩しかった。\nリボンが風に揺れている。', se: 'audio/wind.mp3', next: 'date_a10' },
    { id: 'date_a10', speaker: '灯', sc: 'akari', text: '……ねえ蒼くん。私たちの漫画、絶対最高のにしようね。\n約束！', next: 'date_a11' },
    { id: 'date_a11', speaker: '蒼', sc: 'aoi', text: '……うん。約束だ。', next: 'date_a12' },
    { id: 'date_a12', text: '灯は小指を差し出した。\n蒼は少し照れながら、小指を絡めた。', se: 'audio/shiver.mp3', next: 'date_end' },

    // --- デート後 ---
    { id: 'date_end', text: '── 翌日・部室 ──', bg: 'school', bgm: 'audio/classroom.mp3', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'date_end2' },
    { id: 'date_end2', speaker: '蒼', sc: 'aoi', text: '（……昨日のことが、まだ頭から離れない）', next: 'date_end3' },
    { id: 'date_end3', text: 'でも、原稿は待ってくれない。\n蒼はペンを握り直した。昨日見た景色が、線に力を与えてくれる気がした。', next: 'ch3_0' },

    // ── CHAPTER 3 ──
    { id: 'ch3_0', chapter: ['CHAPTER 3', '立ちはだかる壁'], next: 'ch3_1' },
    { id: 'ch3_1', text: '── 2週間後・部室 ──', bg: 'peaceful', bgm: 'audio/underground.mp3', chars: {}, next: 'ch3_2' },
    { id: 'ch3_2', speaker: '翠', sc: 'sui', text: '報告。作画の進捗が思わしくありません。\nこのままだと、締め切りに間に合わない確率が70%です。', chars: { center: 'sui' }, next: 'ch3_4' },
    { id: 'ch3_4', speaker: '焔', sc: 'homura', text: 'マジかよ……人が足りねえのか？', chars: { left: 'homura', center: 'sui', right: 'shizuki' }, next: 'ch3_5' },
    // NEW: 灯の焦り
    { id: 'ch3_5', speaker: '灯', sc: 'akari', text: 'カラー表紙はもうすぐ完成だけど……\n本文ページがまだ半分以上残ってるよね？', chars: { left: 'akari', center: 'sui', right: 'shizuki' }, next: 'ch3_6' },
    { id: 'ch3_6', speaker: '蒼', sc: 'aoi', text: '紫月先輩……どうしましょう？\n背景の描き込みが全く追いついていなくて……', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch3_7' },
    { id: 'ch3_7', speaker: '紫月', sc: 'shizuki', text: '……無理は禁物よ。でも、妥協もしたくないわね。\nページ数を減らすか、背景を簡略化するか。', next: 'ch3_10' },
    { id: 'ch3_10', speaker: '焔', sc: 'homura', text: 'そんなの嫌だ！ 最高の漫画にしたいんだ！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch3_11' },

    // NEW: 陽太が助っ人に
    { id: 'ch3_11', text: 'その時、部室のドアが開いた。', se: 'audio/switch.mp3', next: 'ch3_11b' },
    { id: 'ch3_11b', speaker: '陽太', sc: 'youta', text: 'よう！ 困ってるって聞いたぜ。\n俺、背景なら手伝えるぞ。元美術部だからな。', chars: { left: 'aoi', center: 'youta', right: 'homura' }, next: 'ch3_11c' },
    { id: 'ch3_11c', speaker: '蒼', sc: 'aoi', text: '陽太！？ わざわざ来てくれたのか！？', next: 'ch3_11d' },
    { id: 'ch3_11d', speaker: '陽太', sc: 'youta', text: '当たり前だろ、友達じゃん。\nそれに、お前らの漫画、俺も読みたいんだよ。', next: 'ch3_12' },
    { id: 'ch3_12', text: '陽太の言葉に、部室の空気が少し軽くなった。\nでも、まだ問題は残っている。', next: 'ch3_c' },

    { id: 'ch3_c', text: '……どうする？', choices: [
        { label: '「みんなで徹夜してでも仕上げよう」', next: 'ch3_c1', flag: 'seal' },
        { label: '「背景を省略し、キャラの感情で見せよう」', next: 'ch3_c2', flag: 'preempt' },
        { label: '「トーン処理やツヤベタを効率化しよう」', next: 'ch3_c3', flag: 'intel' }
    ]},
    { id: 'ch3_c1', speaker: '蒼', sc: 'aoi', text: 'みんなで気合いで仕上げよう。\n陽太も来てくれた。僕たちなら、間に合う。', next: 'ch3_c1b' },
    { id: 'ch3_c1b', speaker: '陽太', sc: 'youta', text: 'おっしゃ！ 任せとけ！\n夜食は俺が買い出し行くぜ！', next: 'ch3_m' },
    { id: 'ch3_c2', speaker: '蒼', sc: 'aoi', text: '背景を省略して、キャラの感情で見せよう。\n余白が逆に演出になるはず。', next: 'ch3_c2b' },
    { id: 'ch3_c2b', speaker: '灯', sc: 'akari', text: 'その分、カラーページを増やせない？\n色で世界観を伝えるの、得意だよ！', next: 'ch3_m' },
    { id: 'ch3_c3', speaker: '蒼', sc: 'aoi', text: '仕上げ工程を見直そう。\n時間がかかる処理は避けて、メリハリで魅せよう。', next: 'ch3_c3b' },
    { id: 'ch3_c3b', speaker: '翠', sc: 'sui', text: '同意。陽太さんの背景と灯さんのカラーを\n効率的に組み合わせるプランを提案します。', next: 'ch3_m' },

    { id: 'ch3_m', text: 'それぞれが役割を見出し、最後の修羅場に突入した。', bg: 'school', bgm: 'audio/morning.mp3', next: 'ch3_d1', speed: true },
    { id: 'ch3_d1', text: '── 締め切り前日・徹夜明けの部室 ──', chars: {}, next: 'ch3_d2' },
    { id: 'ch3_d2', speaker: '焔', sc: 'homura', text: 'なあ蒼、漫画描いてみてどうだ？', chars: { left: 'aoi', right: 'homura' }, next: 'ch3_d3' },
    { id: 'ch3_d3', speaker: '蒼', sc: 'aoi', text: '……本当に大変だけどね。\nでも、一人で妄想してた時よりずっといい。', next: 'ch3_d4' },
    { id: 'ch3_d4', speaker: '焔', sc: 'homura', text: 'だろ！ 一緒にひとつのモン作るのは最高だよな！', next: 'ch3_d5' },
    { id: 'ch3_d5', speaker: '翠', sc: 'sui', text: '最終確認完了。皆さんの協力のおかげで、全ページ完成です。', chars: { left: 'aoi', center: 'sui', right: 'homura' }, next: 'ch3_d6' },
    { id: 'ch3_d6', speaker: '灯', sc: 'akari', text: 'カラー表紙も入稿完了！\n……めちゃくちゃ綺麗に仕上がったよ！', chars: { left: 'akari', center: 'sui', right: 'aoi' }, next: 'ch3_d7' },
    { id: 'ch3_d7', speaker: '陽太', sc: 'youta', text: '背景、なんとか全部描き上げたぜ……\n腕がもう棒だ……ハハ。', chars: { left: 'akari', center: 'youta', right: 'aoi' }, next: 'ch3_d8' },
    { id: 'ch3_d8', text: '誰もがインクまみれの手で、笑い合った。\nいよいよ、僕たちの作品が世界に出る。', next: 'ch4_0' },

    // ── FINAL CHAPTER ──
    { id: 'ch4_0', chapter: ['FINAL CHAPTER', '結果発表'], next: 'ch4_1' },
    { id: 'ch4_1', text: '── 数ヵ月後・放課後 ──', bg: 'peaceful', bgm: 'audio/morning.mp3', chars: {}, next: 'ch4_2' },
    { id: 'ch4_2', text: 'ついに、新人賞の結果が掲載された雑誌の発売日。\n部室は異様な緊張感に包まれていた。', next: 'ch4_3' },
    { id: 'ch4_3', speaker: '紫月', sc: 'shizuki', text: '雑誌、買ってきたわよ。\n……見る準備はいい？', chars: { center: 'shizuki' }, next: 'ch4_4' },
    { id: 'ch4_4', speaker: '灯', sc: 'akari', text: 'ドキドキする……！\n表紙のカラー、ちゃんと印刷されてるかな……', chars: { left: 'akari', center: 'shizuki', right: 'aoi' }, next: 'ch4_5' },
    { id: 'ch4_5', text: '紫月先輩が机の上に雑誌を置く。\nページをめくる音が、やけに大きく響いた。', next: 'ch4_6' },
    { id: 'ch4_6', speaker: '焔', sc: 'homura', text: '（心臓飛び出そう……頼む、載っててくれ！）', chars: { left: 'homura', right: 'aoi' }, next: 'ch4_7' },
    { id: 'ch4_7', speaker: '翠', sc: 'sui', text: '（受賞確率は過去のデータから推定して……）', chars: { left: 'homura', center: 'sui', right: 'aoi' }, next: 'ch4_8' },
    { id: 'ch4_8', speaker: '蒼', sc: 'aoi', text: '（……大丈夫。やり切ったんだから）', next: 'ch4_b1' },

    { id: 'ch4_b1', text: 'ページをめくっていくと、結果発表のページが現れた。\nしかし、一番大きな「大賞」には別の作品の名前がある。', next: 'ch4_b2' },
    { id: 'ch4_b2', speaker: '焔', sc: 'homura', text: '……大賞じゃない。', chars: { center: 'homura' }, next: 'ch4_b3' },
    { id: 'ch4_b3', text: '落選か、それとも──。', next: 'ch4_fc' },

    { id: 'ch4_fc', text: 'どうする？', choices: [
        { label: '最後まで自分の目で確かめる', next: 'ch4_f1', flag: 'all_attack' },
        { label: '焔にページをめくらせる', next: 'ch4_f2', flag: 'trust_homura' },
        { label: 'ページを一気に飛ばして下へ！', next: 'ch4_f3', flag: 'sacrifice' }
    ]},
    { id: 'ch4_f1', speaker: '蒼', sc: 'aoi', text: '（最後まで見届けよう！）\n「下の方、入賞の欄を見てみて！」', next: 'ch4_f1b' },
    { id: 'ch4_f1b', speaker: '灯', sc: 'akari', text: 'あった！！ 佳作だ！！\n私たちの漫画が載ってる！！', chars: { left: 'akari', right: 'aoi' }, next: 'ch4_climax' },
    { id: 'ch4_f2', speaker: '蒼', sc: 'aoi', text: '「焔……お前が見つけてくれ」', next: 'ch4_f2b' },
    { id: 'ch4_f2b', speaker: '焔', sc: 'homura', text: '「……うおおおおッ！！ あった！！ 佳作だ！！」', next: 'ch4_climax' },
    { id: 'ch4_f3', speaker: '蒼', sc: 'aoi', text: '「ええい！！」\n蒼は雑誌を引ったくり、一覧を見た。', next: 'ch4_f3b' },
    { id: 'ch4_f3b', text: '「……佳作。入賞してる！」', next: 'ch4_climax' },

    { id: 'ch4_climax', text: '『佳作：星嶺漫研──圧倒的な情熱と将来性を感じる意欲作』。', next: 'ch4_cx1' },
    { id: 'ch4_cx1', text: '編集部からの熱い講評に、部室は歓喜に包まれた！！', next: 'ch4_cx2' },
    // NEW: 全員のリアクション
    { id: 'ch4_cx2', speaker: '灯', sc: 'akari', text: 'やったあああ！！\nカラー表紙、褒められてる！ 嬉しい！！', chars: { left: 'akari', center: 'homura', right: 'aoi' }, next: 'ch4_cx3' },
    { id: 'ch4_cx3', speaker: '陽太', sc: 'youta', text: 'すげえな、お前ら……！\n背景描いた甲斐があったよ！', chars: { left: 'youta', center: 'akari', right: 'aoi' }, next: 'ch4_cx4' },
    { id: 'ch4_cx4', text: '大賞には届かなかった。でも、第一歩を踏み出した。\nやり切った達成感と笑顔が、そこにはあった。', next: 'ch4_e1' },
    { id: 'ch4_e1', speaker: '焔', sc: 'homura', text: '……最高だな……！ まじで載りやがった！', chars: { left: 'homura', right: 'aoi' }, next: 'ch4_e2' },
    { id: 'ch4_e2', speaker: '翠', sc: 'sui', text: '初投稿での入賞確率はわずか数％。\n見事な結果です。', chars: { left: 'homura', center: 'sui', right: 'aoi' }, next: 'ch4_e3' },
    { id: 'ch4_e3', speaker: '紫月', sc: 'shizuki', text: 'お疲れ様。みんな、最高の原稿だったわ。', chars: { left: 'aoi', center: 'shizuki', right: 'homura' }, next: 'ch4_e4' },
    { id: 'ch4_e4', speaker: '蒼', sc: 'aoi', text: '……漫研に入って、本当によかった。\nみんながいたから、ここまで来れた。', next: 'ch4_e5' },
    { id: 'ch4_e5', speaker: '焔', sc: 'homura', text: 'これからもよろしくな！\n俺たちの連載は、まだまだこれからだ！', next: 'ch4_epi' },
    { id: 'ch4_epi', text: '一本の漫画が完成しても、僕らの夢は終わらない。\n\n入賞を果たした仲間たちは、\n次の原稿用紙に向かって、またペンをとるのだった。', next: '__END__' }
];

// --- Script Index --- //
const idx = {};
script.forEach(n => { idx[n.id] = n; });

// --- State --- //
let currentId = null, typeTimer = null, isTyping = false, currentText = '', flags = [], mangaViewerOpen = false;
const uiLayer = document.getElementById('ui-layer');
const messageArea = document.getElementById('message-area');
const speakerName = document.getElementById('speaker-name');
const textContent = document.getElementById('text-content');
const cursor = document.getElementById('cursor');
const choicesContainer = document.getElementById('choices-container');

// --- Show Node --- //
async function showNode(id) {
    if (id === '__END__') { showEnding(); return; }
    const node = idx[id]; if (!node) return; currentId = id;
    if (node.chapter) { await showChapter(node.chapter[0], node.chapter[1]); if (node.next) showNode(node.next); return; }
    if (node.bg) bgTheme = node.bg;
    if (node.bgm) AudioSys.playBGM(node.bgm);
    if (node.se) AudioSys.playSE(node.se);
    if (node.effect === 'glitch') triggerGlitch();
    if (node.effect === 'transition') fadeTransition();
    if (node.chars !== undefined) { updateChars(node.chars, node.sc || null); }
    else if (node.sc) { ['left','center','right'].forEach(p => { slots[p].classList.toggle('speaking', curChars[p] === node.sc); }); }
    speakerName.textContent = node.speaker || '';
    speakerName.className = node.sc ? 'speaker-' + node.sc : '';
    speakerName.style.display = node.speaker ? 'inline-block' : 'none';
    choicesContainer.innerHTML = '';
    messageArea.classList.remove('hidden'); messageArea.style.display = 'block';
    currentText = node.text || ''; textContent.textContent = '';
    cursor.style.display = 'inline'; isTyping = true;
    let typeSpeed = 35;
    if (node.speed) { typeSpeed = 10; document.body.classList.add('shake-anim'); } else { document.body.classList.remove('shake-anim'); }
    let ci = 0; if (typeTimer) clearInterval(typeTimer);
    typeTimer = setInterval(() => {
        if (ci < currentText.length) { textContent.textContent += currentText[ci]; if (currentText[ci]!=='\n'&&currentText[ci]!==' ') AudioSys.typeBeep(); ci++; }
        else { clearInterval(typeTimer); isTyping = false; if (node.choices) showChoices(node.choices); }
    }, typeSpeed);
}

function showChoices(choices) {
    cursor.style.display = 'none';
    choices.forEach(c => {
        const btn = document.createElement('button'); btn.className = 'choice-btn'; btn.textContent = c.label;
        btn.onclick = (e) => { e.stopPropagation(); AudioSys.playSE('audio/switch.mp3',0.3); if(c.flag) flags.push(c.flag); choicesContainer.innerHTML=''; showNode(c.next); };
        choicesContainer.appendChild(btn);
    });
}

// --- Text advance --- //
document.getElementById('text-box').onclick = () => {
    if (mangaViewerOpen) return;
    if (isTyping) { clearInterval(typeTimer); textContent.textContent = currentText; isTyping = false; const node = idx[currentId]; if (node && node.choices) showChoices(node.choices); }
    else { const node = idx[currentId]; if (node && !node.choices && node.next) showNode(node.next); }
};
document.addEventListener('keydown', (e) => {
    if (mangaViewerOpen) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('text-box').click(); }
});

// ==============================
// MANGA DETERMINATION SYSTEM
// ==============================
const mangaTypes = {
    blaze: {
        title: '炎獄の剣士 -BLAZE SWORD-', genre: '熱血バトルファンタジー', color: '#f64',
        endTitle: 'ENDING：灼熱の筆',
        endDesc: '蒼と焔の情熱がぶつかり合い、圧倒的な熱量の作品が生まれた。\n灯の鮮烈なカラー表紙が読者の目を惹きつけた。\n\n審査員コメント：「荒削りだが、ページをめくる手が止まらない。\nこの熱さは本物だ」\n\n──最高の漫画は、最高の情熱から生まれる。',
        panels: [
            { type:'cover', title:'炎獄の剣士', subtitle:'BLAZE SWORD', author:'原作：焔 / 作画：蒼 / カラー：灯', color:'#f64', desc:'── 第1話「覚醒」──' },
            { type:'scene', layout:'action', lines: [
                { pos:'narration', text:'── 炎の王国・アグニス。千年に一度、魔王が復活する。' },
                { pos:'dramatic', text:'ドオオオオッ！！' },
                { pos:'dialogue', speaker:'???', text:'逃げろ！ 村が……村が燃えている！' },
                { pos:'narration', text:'少年レイは、燃え盛る故郷を前に立ち尽くしていた。' }
            ]},
            { type:'scene', layout:'intense', lines: [
                { pos:'dialogue', speaker:'レイ', text:'……俺は逃げない。' },
                { pos:'dramatic', text:'ゴオオオオッ！！' },
                { pos:'narration', text:'右手から炎が噴き出す。継承された炎の血脈──\n「灼剣」の力が目覚めた瞬間だった。' },
                { pos:'dialogue', speaker:'レイ', text:'うおおおおおッ！！\n俺がこの剣で──全部守る！！' }
            ]},
            { type:'scene', layout:'climax', lines: [
                { pos:'narration', text:'── レイは剣を構え、魔王の軍勢に斬りかかった。' },
                { pos:'dramatic', text:'ズバアアアッ！！' },
                { pos:'narration', text:'一閃。炎を纏った剣が闇を切り裂く。\n伝説は、ここから始まる。' },
                { pos:'dialogue', speaker:'レイ', text:'──燃え尽きるまで、戦い続ける。\nそれが俺の……「炎獄の剣士」だ。' }
            ]},
            { type:'endcard', text:'第1話「覚醒」── 完\n\n「炎獄の剣士」は次号も掲載！ お楽しみに！', color:'#f64' }
        ]
    },
    silence: {
        title: '沈黙の瞳 -SILENT EYES-', genre: '心理サスペンスドラマ', color: '#c6f',
        endTitle: 'ENDING：静寂の画力',
        endDesc: '蒼の「絵で語る」才能が開花した作品。\nセリフを極限まで削ぎ落とした、表情だけで読ませる異色作。\n\n審査員コメント：「新人とは思えない画面構成力。\n沈黙が雄弁に語る、稀有な才能」\n\n──最高の漫画は、言葉の外にある。',
        panels: [
            { type:'cover', title:'沈黙の瞳', subtitle:'SILENT EYES', author:'原作・作画：蒼 / 監修：紫月', color:'#c6f', desc:'── 第1話「まばたき」──' },
            { type:'scene', layout:'quiet', lines: [
                { pos:'narration', text:'── 閉鎖された学園。生徒は7人だけ。' },
                { pos:'narration', text:'毎朝、一人ずつ消えていく。\n誰も、その理由を知らない。' },
                { pos:'dialogue', speaker:'少女', text:'……………。' },
                { pos:'narration', text:'少女──ミオは、他人の嘘が「見える」。\n瞳に映る色が、真実と虚偽を分ける。' }
            ]},
            { type:'scene', layout:'tension', lines: [
                { pos:'dialogue', speaker:'少年A', text:'昨夜は部屋にいたよ。何も見ていない。' },
                { pos:'narration', text:'ミオの瞳に映る色──赤。\n彼は嘘をついている。' },
                { pos:'silence', text:'・・・・・・' },
                { pos:'narration', text:'だが、ミオは何も言わない。\n言葉にした瞬間、真実は凶器になるから。' }
            ]},
            { type:'scene', layout:'revelation', lines: [
                { pos:'narration', text:'── 最後の夜。残ったのは、ミオと一人の少年だけ。' },
                { pos:'dialogue', speaker:'少年', text:'……お前には、全部見えてたんだろ。' },
                { pos:'narration', text:'ミオは初めて口を開いた。' },
                { pos:'dialogue', speaker:'ミオ', text:'──見えていたのは、あなたの孤独だけ。' }
            ]},
            { type:'endcard', text:'第1話「まばたき」── 完\n\n「沈黙の瞳」── 衝撃の第2話は次号。', color:'#c6f' }
        ]
    },
    data: {
        title: 'ANALYZE -分析者の戦場-', genre: '頭脳戦・SF', color: '#4fa',
        endTitle: 'ENDING：最適解の芸術',
        endDesc: '翠のデータ分析と蒼の画力が融合した、\n論理的でありながら美しい作品。\n\n審査員コメント：「読者の視線誘導が完璧。\n計算し尽くされたコマ割りに脱帽」\n\n──最高の漫画は、科学と芸術の交差点にある。',
        panels: [
            { type:'cover', title:'ANALYZE', subtitle:'分析者の戦場', author:'原作：焔＆翠 / 作画：蒼', color:'#4fa', desc:'── 第1話「初手」──' },
            { type:'scene', layout:'tech', lines: [
                { pos:'narration', text:'── 西暦2147年。全ての紛争は「情報戦」で決着する時代。' },
                { pos:'narration', text:'「アナライザー」と呼ばれる分析官が、データで戦う。' },
                { pos:'dialogue', speaker:'ユキ', text:'対象の行動パターン、取得完了。\n勝率……87.3%。' },
                { pos:'narration', text:'天才分析官ユキ。感情を排した完璧な戦術──\nだが、それが彼女の弱点でもあった。' }
            ]},
            { type:'scene', layout:'strategy', lines: [
                { pos:'dialogue', speaker:'敵分析官', text:'お前のデータは完璧だ。だが──\n人間は「計算外」を起こす生き物だぞ？' },
                { pos:'dramatic', text:'ERROR: 予測値逸脱──' },
                { pos:'narration', text:'初めての敗北。ユキの計算を超えた「人間の意志」。' },
                { pos:'dialogue', speaker:'ユキ', text:'……感情を、変数に組み込む……？' }
            ]},
            { type:'scene', layout:'breakthrough', lines: [
                { pos:'narration', text:'── ユキは全てを再計算した。今度は「心」を含めて。' },
                { pos:'dialogue', speaker:'ユキ', text:'新しい方程式。変数名──「信頼」。' },
                { pos:'narration', text:'仲間を信じる。それが最適解だった。' },
                { pos:'dialogue', speaker:'ユキ', text:'……勝率100%。いえ──\n「勝率」という概念を超えた。' }
            ]},
            { type:'endcard', text:'第1話「初手」── 完\n\n「ANALYZE」── 頭脳戦は加速する。次号続報！', color:'#4fa' }
        ]
    },
    azure: {
        title: '群青ラプソディ', genre: '青春群像劇', color: '#4af',
        endTitle: 'ENDING：漫画家への第一歩',
        endDesc: '6人の個性がバランスよく混ざり合った、\n笑いあり涙ありの青春ストーリー。\n\n審査員コメント：「キャラクターが生きている。\n読者に寄り添う温かさがある」\n\n──最高の漫画は、仲間と一緒に描くものだ。',
        panels: [
            { type:'cover', title:'群青ラプソディ', subtitle:'AZURE RHAPSODY', author:'漫研一同', color:'#4af', desc:'── 第1話「放課後のメロディ」──' },
            { type:'scene', layout:'warm', lines: [
                { pos:'narration', text:'── 春。桜が散る校庭。' },
                { pos:'narration', text:'転校生のソラは、この学校に馴染めずにいた。\n教室の隅で、いつもスケッチブックを開いている。' },
                { pos:'dialogue', speaker:'ソラ', text:'（また一人か……。まあ、慣れてるけど）' },
                { pos:'narration', text:'その日、屋上から不思議な音が聞こえた。\nギターの、下手くそだけど一生懸命な音。' }
            ]},
            { type:'scene', layout:'lively', lines: [
                { pos:'dialogue', speaker:'カイ', text:'お！ 聴いてたのか！？\n恥ずかしいとこ見られたな〜ハハハ！' },
                { pos:'dialogue', speaker:'ソラ', text:'……なんか、楽しそうだなって。' },
                { pos:'dialogue', speaker:'カイ', text:'だろ！ 下手でも楽しけりゃ最高じゃん！\nなあ、お前も何かやろうぜ！' },
                { pos:'narration', text:'カイの笑顔は、春の陽だまりのようだった。' }
            ]},
            { type:'scene', layout:'emotional', lines: [
                { pos:'narration', text:'── 放課後。ソラは初めてスケッチブックを誰かに見せた。' },
                { pos:'dialogue', speaker:'カイ', text:'……すっげえ。お前、天才じゃん。' },
                { pos:'dialogue', speaker:'ソラ', text:'……ありがとう。\n誰かにそう言ってもらえたの、初めてだ。' },
                { pos:'narration', text:'二人の放課後が、群青色に染まっていく。\nこの出会いが、全てを変える──。' }
            ]},
            { type:'endcard', text:'第1話「放課後のメロディ」── 完\n\n「群青ラプソディ」──6人の青春は続く。', color:'#4af' }
        ]
    }
};

const dateEpilogues = {
    date_homura: { type:'scene', layout:'warm', lines: [
        { pos:'narration', text:'── 特別描き下ろし：蒼と焔 ──' },
        { pos:'dialogue', speaker:'焔', text:'次はもっとすげえの描こうぜ！\nお前となら、どこまでも行ける気がする！' },
        { pos:'dialogue', speaker:'蒼', text:'……ああ。お前の原作があれば、俺はどこまでも描ける。' },
        { pos:'narration', text:'最高のコンビは、次の原稿に向けてペンを握った。' }
    ]},
    date_shizuki: { type:'scene', layout:'quiet', lines: [
        { pos:'narration', text:'── 特別描き下ろし：蒼と紫月 ──' },
        { pos:'dialogue', speaker:'紫月', text:'ねえ蒼くん。次の作品、二人で描いてみない？' },
        { pos:'dialogue', speaker:'蒼', text:'……先輩と二人で？ でも、僕なんかが──' },
        { pos:'dialogue', speaker:'紫月', text:'あなたの絵が好きなの。……作品として、ね。' },
        { pos:'narration', text:'月明かりの下、二人の新しい物語が始まる。' }
    ]},
    date_sui: { type:'scene', layout:'tech', lines: [
        { pos:'narration', text:'── 特別描き下ろし：蒼と翠 ──' },
        { pos:'dialogue', speaker:'翠', text:'次回作の読者ターゲット分析、完了しました。' },
        { pos:'dialogue', speaker:'蒼', text:'翠。データじゃなくて、翠が読みたい漫画を教えてよ。' },
        { pos:'dialogue', speaker:'翠', text:'…………蒼さんが描く漫画なら、何でも。' },
        { pos:'narration', text:'雨上がりの帰り道、二人の距離がまた少し近づいた。' }
    ]},
    date_akari: { type:'scene', layout:'lively', lines: [
        { pos:'narration', text:'── 特別描き下ろし：蒼と灯 ──' },
        { pos:'dialogue', speaker:'灯', text:'次の表紙、もっと派手にしたい！\n蒼くんの絵に私の色、最強コンビだよね！' },
        { pos:'dialogue', speaker:'蒼', text:'……灯の色彩感覚には、いつも驚かされるよ。' },
        { pos:'dialogue', speaker:'灯', text:'えへへ……じゃあ、ずっと一緒に描こうね。約束だもん。' },
        { pos:'narration', text:'小指の約束は、色とりどりの未来へ繋がっている。' }
    ]}
};

function determineMangaType() {
    const s = { blaze:0, silence:0, data:0, azure:0 };
    if (flags.includes('serious'))  { s.silence+=1; s.blaze+=1; }
    if (flags.includes('afraid'))   { s.azure+=2; }
    if (flags.includes('curious'))  { s.data+=1; s.azure+=1; }
    if (flags.includes('front'))    { s.blaze+=2; }
    if (flags.includes('analyze'))  { s.data+=2; }
    if (flags.includes('solo'))     { s.silence+=2; }
    if (flags.includes('date_homura'))  { s.blaze+=1; s.azure+=1; }
    if (flags.includes('date_shizuki')) { s.silence+=1; s.azure+=1; }
    if (flags.includes('date_sui'))     { s.data+=1; }
    if (flags.includes('date_akari'))   { s.azure+=1; s.blaze+=1; }
    if (flags.includes('seal'))     { s.blaze+=2; }
    if (flags.includes('preempt'))  { s.silence+=1; s.azure+=1; }
    if (flags.includes('intel'))    { s.data+=2; }
    if (flags.includes('all_attack'))   { s.blaze+=1; }
    if (flags.includes('trust_homura')) { s.azure+=1; s.blaze+=1; }
    if (flags.includes('sacrifice'))    { s.silence+=1; s.azure+=1; }
    let best='azure', max=0;
    for (const [t,sc] of Object.entries(s)) { if(sc>max){max=sc;best=t;} }
    return best;
}

function getDateFlag() {
    for (const f of ['date_homura','date_shizuki','date_sui','date_akari']) { if (flags.includes(f)) return f; }
    return null;
}

function renderMangaPanel(panel, genreText) {
    const div = document.createElement('div'); div.className = 'manga-page';
    if (panel.type === 'cover') {
        div.classList.add('manga-cover');
        div.innerHTML = `<div class="manga-cover-border" style="border-color:${panel.color}"><div class="manga-genre-tag" style="background:${panel.color}">${genreText||''}</div><h2 class="manga-cover-title" style="text-shadow:0 0 30px ${panel.color}">${panel.title}</h2><p class="manga-cover-subtitle">${panel.subtitle}</p><p class="manga-cover-author">${panel.author}</p><p class="manga-cover-desc">${panel.desc}</p></div>`;
    } else if (panel.type === 'endcard') {
        div.classList.add('manga-endcard');
        div.innerHTML = `<div class="manga-endcard-inner" style="border-color:${panel.color}"><p>${panel.text.replace(/\n/g,'<br>')}</p></div>`;
    } else {
        div.classList.add('manga-scene','manga-layout-'+(panel.layout||'default'));
        let h = '<div class="manga-panels-grid">';
        panel.lines.forEach(l => {
            if (l.pos==='dramatic') h += `<div class="manga-sfx">${l.text}</div>`;
            else if (l.pos==='silence') h += `<div class="manga-silence">${l.text}</div>`;
            else if (l.pos==='dialogue') h += `<div class="manga-balloon"><span class="manga-speaker">${l.speaker}</span>${l.text}</div>`;
            else h += `<div class="manga-narration">${l.text}</div>`;
        });
        div.innerHTML = h + '</div>';
    }
    return div;
}

function buildMangaViewer(mangaKey) {
    const m = mangaTypes[mangaKey];
    const c = document.getElementById('manga-container');
    const hdr = document.getElementById('manga-header');
    c.innerHTML = '';
    hdr.innerHTML = `<h2 style="color:${m.color};text-shadow:0 0 15px ${m.color}">${m.title}</h2><p style="color:#888">${m.genre}</p>`;
    m.panels.forEach(p => c.appendChild(renderMangaPanel(p, m.genre)));
    const df = getDateFlag();
    if (df && dateEpilogues[df]) c.appendChild(renderMangaPanel(dateEpilogues[df], m.genre));
}

// --- Manga Viewer Open/Close (Global functions for onclick) --- //
function openMangaViewer() {
    mangaViewerOpen = true;
    const v = document.getElementById('manga-viewer');
    v.classList.remove('hidden'); v.style.display = 'flex'; v.scrollTop = 0;
}
function closeMangaViewer() {
    mangaViewerOpen = false;
    const v = document.getElementById('manga-viewer');
    v.classList.add('hidden'); v.style.display = 'none';
}

// --- Ending --- //
function showEnding() {
    uiLayer.style.display = 'none'; clearChars(); document.body.classList.remove('shake-anim');
    const mk = determineMangaType(), m = mangaTypes[mk];
    document.getElementById('end-title').textContent = m.endTitle;
    document.getElementById('end-title').style.color = m.color;
    document.getElementById('end-desc').textContent = m.endDesc;
    document.getElementById('end-manga-info').innerHTML = `<div class="end-manga-badge" style="border-color:${m.color};color:${m.color}">完成作品：「${m.title}」<br><small>${m.genre}</small></div>`;
    buildMangaViewer(mk);
    const es = document.getElementById('end-screen');
    es.classList.remove('hidden'); es.style.display = 'flex';
    AudioSys.stopBGM(); AudioSys.playSE('audio/kaisou.mp3', 0.4);
}

// --- Start --- //
document.getElementById('start-btn').onclick = () => {
    AudioSys.init();
    const ss = document.getElementById('start-screen'); ss.style.opacity = '0';
    setTimeout(() => { ss.style.display='none'; ss.classList.add('hidden'); uiLayer.style.display='flex'; showNode('pro_0'); }, 1000);
};
