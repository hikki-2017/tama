import re

# Update index.html
with open(r'd:\tama\best_game\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<title>.*?</title>', r'<title>最高の漫画への道</title>', html)
html = re.sub(r'<h1 class="game-title">.*?<br><span class="title-sub-en">.*?</span></h1>',
              r'<h1 class="game-title">星嶺学園 漫画研究会<br><span class="title-sub-en">MANGA CREATORS</span></h1>', html)
html = re.sub(r'<p class="start-sub">.*?</p>',
              r'<p class="start-sub">── 最高の漫画を作るため、少年少女はペンを握る ──</p>', html)

with open(r'd:\tama\best_game\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Update main.js
with open(r'd:\tama\best_game\main.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'// 星嶺学園 青春ダイアリー - Visual Novel', r'// 最高の漫画への道 - Visual Novel', content)

new_script = """const script = [
    // ── PROLOGUE ──
    { id: 'pro_0', chapter: ['PROLOGUE', '出会い'], next: 'pro_1' },
    { id: 'pro_1', text: '四月──。\\n桜の花びらが風に舞う、穏やかな朝だった。', bg: 'school', bgm: 'audio/morning.mp3', next: 'pro_2' },
    { id: 'pro_2', text: '私立・星嶺学園。\\n僕は昔から漫画を読むのが好きで、いつか自分でも描いてみたいと思っていた。', next: 'pro_3' },
    { id: 'pro_3', text: 'でも、一人で作品を完成させる勇気も、画力も足りない。\\nノートの隅に落書きをするだけの日々。', se: 'audio/wind.mp3', next: 'pro_4' },
    { id: 'pro_4', text: 'そんな時、ふと目にしたのは──\\n一枚の手書きポスター。「漫画研究会、部員募集中。本気でプロを目指す者求む」。', next: 'pro_5' },

    { id: 'pro_5', text: '── 1年B組・教室 ──', bg: 'school', bgm: 'audio/classroom.mp3', chars: {}, se: 'audio/chime.mp3', next: 'pro_6' },
    { id: 'pro_6', text: '放課後のチャイムが鳴り響く。\\nノートの端の落書きを見つめていると、不意に声がした。', chars: { center: 'aoi' }, next: 'pro_7' },
    { id: 'pro_7', speaker: '蒼', sc: 'aoi', text: '（……今日も描けなかったな）', next: 'pro_10' },
    { id: 'pro_10', text: '突然、背後からノートを覗き込まれた。', se: 'audio/taiko.mp3', next: 'pro_11' },
    { id: 'pro_11', speaker: '焔', sc: 'homura', text: 'よう！ お前、すっげえ絵描くじゃん！', chars: { left: 'aoi', right: 'homura' }, next: 'pro_12' },
    { id: 'pro_12', speaker: '蒼', sc: 'aoi', text: '……えっ！？\\nいや、これはただの落書きで──', next: 'pro_13' },
    { id: 'pro_13', speaker: '焔', sc: 'homura', text: '俺は焔！ 最高の原作ストーリーを思いついたんだけど、作画がいなくてさ！\\n漫研に見学行くから、お前も来いよ！', next: 'pro_14' },
    { id: 'pro_14', speaker: '蒼', sc: 'aoi', text: 'ええっ……！？', next: 'pro_16' },
    { id: 'pro_16', text: '腕を引かれるまま、蒼は教室を後にした。', next: 'ch1_0' },

    // ── CHAPTER 1 ──
    { id: 'ch1_0', chapter: ['CHAPTER 1', '漫画研究会'], next: 'ch1_1' },
    { id: 'ch1_1', text: '── 旧校舎・漫画研究会 部室 ──', bg: 'peaceful', bgm: 'audio/underground.mp3', chars: {}, next: 'ch1_2' },
    { id: 'ch1_2', text: '旧校舎にある部室。\\nインクの匂いと、山積みの漫画雑誌や画材が広がっている。', next: 'ch1_3' },
    { id: 'ch1_3', speaker: '紫月', sc: 'shizuki', text: 'いらっしゃい。見学者かしら？', chars: { center: 'shizuki' }, next: 'ch1_4' },
    { id: 'ch1_4', text: '長い紫の髪をした上級生が、Gペンを置いて優雅に微笑んだ。\\nその落ち着いた雰囲気に、空気が変わる。', next: 'ch1_5' },
    { id: 'ch1_5', speaker: '紫月', sc: 'shizuki', text: '私は紫月。3年生で、この漫研の部長よ。\\nよく来てくれたわね。', next: 'ch1_6' },
    { id: 'ch1_6', speaker: '焔', sc: 'homura', text: 'おお、部長！ 俺、焔っす！\\nジャンプで一番取るために来ました！', chars: { left: 'homura', right: 'shizuki' }, next: 'ch1_7' },
    { id: 'ch1_7', speaker: '紫月', sc: 'shizuki', text: '……元気ね。嫌いじゃないわ。', next: 'ch1_8' },
    { id: 'ch1_8', speaker: '蒼', sc: 'aoi', text: 'あの……僕は蒼です。\\nその、無理やり連れてこられただけで、漫画作るとかは……', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch1_9' },
    { id: 'ch1_9', speaker: '紫月', sc: 'shizuki', text: '絵を描くのが好きなら大歓迎よ。\\n漫画は一人で描かなくても、分担して作れるから。', next: 'ch1_10' },
    { id: 'ch1_10', text: 'その時、部室のドアがゆっくりと開いた。', se: 'audio/switch.mp3', next: 'ch1_11' },
    { id: 'ch1_11', speaker: '翠', sc: 'sui', text: '……遅れました。1年C組の、翠です。', chars: { left: 'aoi', center: 'sui', right: 'shizuki' }, next: 'ch1_12' },
    { id: 'ch1_12', text: '緑がかった髪の静かな少女。\\n手には分厚いマーケティング資料を持っている。', next: 'ch1_13' },
    { id: 'ch1_13', speaker: '翠', sc: 'sui', text: '編集・データ分析志望です。\\n読者アンケートの傾向データ、持ってきました。', next: 'ch1_14' },
    { id: 'ch1_14', speaker: '焔', sc: 'homura', text: '……変わったやつだな。', chars: { left: 'homura', center: 'sui', right: 'shizuki' }, next: 'ch1_15' },
    { id: 'ch1_15', speaker: '翠', sc: 'sui', text: '変わってるのはお互い様。\\n情熱だけでは連載は勝ち取れません。', next: 'ch1_16' },
    { id: 'ch1_16', speaker: '紫月', sc: 'shizuki', text: 'ふふ、頼もしい一年生たちね。\\nでは──まずは自己紹介から始めましょうか。', next: 'ch1_17' },
    { id: 'ch1_17', speaker: '紫月', sc: 'shizuki', text: '私たちの目標は、夏の同人誌即売会でオリジナル漫画を完成させ、\\nそして新人賞へ応募することよ。', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch1_c' },

    { id: 'ch1_c', speaker: '紫月', sc: 'shizuki', text: '蒼、あなたはどう漫画に関わってみたい？', chars: { left: 'aoi', right: 'shizuki' }, choices: [
        { label: '真剣に取り組む──「作画をがっつりやってみたい」', next: 'ch1_ca', flag: 'serious' },
        { label: '不安を伝える──「アシスタントくらいなら…」', next: 'ch1_cb', flag: 'afraid' },
        { label: '好奇心で挑む──「ネームも作画もやってみたい」', next: 'ch1_cc', flag: 'curious' }
    ]},
    { id: 'ch1_ca', speaker: '蒼', sc: 'aoi', text: '……作画に挑戦してみたいです。\\n自分の描いた絵で、キャラクターを動かしてみたい。', next: 'ch1_ca2' },
    { id: 'ch1_ca2', speaker: '紫月', sc: 'shizuki', text: '……良い目ね。期待しているわ。', next: 'ch1_end' },
    { id: 'ch1_cb', speaker: '蒼', sc: 'aoi', text: '正直……自分の絵に自信がない。\\nだから、背景やトーン貼りのアシスタントなら……。', next: 'ch1_cb2' },
    { id: 'ch1_cb2', speaker: '焔', sc: 'homura', text: '大丈夫だ！ 俺が死ぬほど面白い原作書くから！\\n二人で一緒に最高の漫画描こうぜ！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch1_cb3' },
    { id: 'ch1_cb3', speaker: '蒼', sc: 'aoi', text: '……ありがとう、焔。', next: 'ch1_end' },
    { id: 'ch1_cc', speaker: '蒼', sc: 'aoi', text: '少し……面白そうだ。\\nせっかくだから、原作も作画も全部学んでみたいです。', next: 'ch1_cc2' },
    { id: 'ch1_cc2', speaker: '翠', sc: 'sui', text: '同感。全体工程を知るのは良いこと。\\n一緒にスケジュール管理しましょう。', chars: { left: 'aoi', center: 'sui', right: 'shizuki' }, next: 'ch1_end' },

    { id: 'ch1_end', text: 'こうして、4人の漫画研究会での日々が始まった。\\nまだ誰も知らない──最高の漫画を作るための道のりが、どれほど険しいかを。', next: 'ch2_0' },

    // ── CHAPTER 2 ──
    { id: 'ch2_0', chapter: ['CHAPTER 2', '初めてのネーム'], next: 'ch2_1' },
    { id: 'ch2_1', text: '── 数日後・放課後 ──', bg: 'school', bgm: 'audio/classroom.mp3', chars: {}, next: 'ch2_2' },
    { id: 'ch2_2', speaker: '紫月', sc: 'shizuki', text: 'じゃあ、今日は焔くんが持ち込んだ原作プロットをもとに、\\n蒼くんにネームを切ってもらうわ。', chars: { center: 'shizuki' }, next: 'ch2_3' },
    { id: 'ch2_3', speaker: '焔', sc: 'homura', text: 'よっしゃ、初原稿だ！ 頼むぜ蒼！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch2_4' },
    { id: 'ch2_4', speaker: '翠', sc: 'sui', text: '読者の視線誘導、読了までのテンポを計測します。', next: 'ch2_5' },
    { id: 'ch2_5', speaker: '蒼', sc: 'aoi', text: '……わかった。やってみる。', next: 'ch2_b' },

    { id: 'ch2_b', text: '── 蒼の机の上 ──', bg: 'school', bgm: 'audio/morning.mp3', chars: {}, next: 'ch2_b1' },
    { id: 'ch2_b1', text: 'まっさらな紙。コマ割りの枠線だけが引いてある。\\nここにキャラクターのドラマを描き込んでいく。', next: 'ch2_b3' },
    { id: 'ch2_b3', speaker: '焔', sc: 'homura', text: '「ここでさ、主人公がデカい声で叫ぶんだよ！ 俺は負けねえ！って！」', chars: { center: 'homura' }, se: 'audio/taiko.mp3', next: 'ch2_b4' },
    { id: 'ch2_b4', text: '焔のアイデアは熱いが、そのまま描くと少し大げさに感じる。', next: 'ch2_b6' },
    { id: 'ch2_b6', speaker: '翠', sc: 'sui', text: 'コマのサイズが全体の40%を占めています。\\n大ゴマの連続は読者の緊張感を削ぐ危険があります。', chars: { left: 'homura', center: 'sui' }, next: 'ch2_b7' },
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
    { id: 'ch2_x3b', text: '無言のアップ。瞳に強い決意だけを描き込んだ。\\n読者に想像させる演出が、静かな余韻を残す。', next: 'ch2_x3c' },
    { id: 'ch2_x3c', speaker: '紫月', sc: 'shizuki', text: '（凄い……あの子、絵で物語を語る才能があるわね……）', next: 'ch2_r' },

    { id: 'ch2_r', text: '初めてのネーム作業は無事に終わった。', bg: 'school', bgm: 'audio/classroom.mp3', next: 'ch2_r1' },
    { id: 'ch2_r1', speaker: '焔', sc: 'homura', text: 'やった……案外いけるじゃん！', chars: { left: 'aoi', right: 'homura' }, next: 'ch2_r2' },
    { id: 'ch2_r2', speaker: '蒼', sc: 'aoi', text: '……うん。なんだか、楽しい。\\n初めて、自分の頭の中が形になった気がする。', next: 'ch2_r3' },
    { id: 'ch2_r3', speaker: '紫月', sc: 'shizuki', text: 'お疲れ様。いいネームね。\\nでも──', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch2_r4' },
    { id: 'ch2_r4', speaker: '紫月', sc: 'shizuki', text: '新人賞の締め切りまであと1ヶ月。\\nここからのペン入れと仕上げが地獄よ。', next: 'ch3_0' },

    // ── CHAPTER 3 ──
    { id: 'ch3_0', chapter: ['CHAPTER 3', '立ちはだかる壁'], next: 'ch3_1' },
    { id: 'ch3_1', text: '── 2週間後・部室 ──', bg: 'peaceful', bgm: 'audio/underground.mp3', chars: {}, next: 'ch3_2' },
    { id: 'ch3_2', speaker: '翠', sc: 'sui', text: '報告。作画の進捗が思わしくありません。', chars: { center: 'sui' }, next: 'ch3_3' },
    { id: 'ch3_3', speaker: '翠', sc: 'sui', text: 'このままだと、締め切りに間に合わない確率が70%です。', next: 'ch3_4' },
    { id: 'ch3_4', speaker: '焔', sc: 'homura', text: 'マジかよ……人が足りねえのか？', chars: { left: 'homura', center: 'sui', right: 'shizuki' }, next: 'ch3_6' },
    { id: 'ch3_6', speaker: '蒼', sc: 'aoi', text: '紫月先輩……どうしましょう？\\n背景の描き込みが全く追いついていなくて……', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch3_7' },
    { id: 'ch3_7', speaker: '紫月', sc: 'shizuki', text: '……無理は禁物よ。でも、妥協もしたくないわね。', next: 'ch3_8' },
    { id: 'ch3_8', speaker: '紫月', sc: 'shizuki', text: 'ページ数を減らすか、背景を簡略化するか。\\nこのままでは完成しないわ。', next: 'ch3_10' },
    { id: 'ch3_10', speaker: '焔', sc: 'homura', text: 'そんなの嫌だ！ 最高の漫画にしたいんだ！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch3_12' },
    { id: 'ch3_12', text: '部室に重い沈黙が落ちた。', next: 'ch3_c' },

    { id: 'ch3_c', text: '……どうする？', choices: [
        { label: '「みんなで徹夜してでも仕上げよう」', next: 'ch3_c1', flag: 'seal' },
        { label: '「背景を省略し、キャラの感情で見せよう」', next: 'ch3_c2', flag: 'preempt' },
        { label: '「トーン処理やツヤベタを効率化しよう」', next: 'ch3_c3', flag: 'intel' }
    ]},
    { id: 'ch3_c1', speaker: '蒼', sc: 'aoi', text: 'みんなで気合いで仕上げよう。\\n僕たちの熱意があれば、間に合うはずだ。', next: 'ch3_c1b' },
    { id: 'ch3_c1b', speaker: '紫月', sc: 'shizuki', text: '……そうね。若さゆえの無茶も悪くないわ。', next: 'ch3_m' },
    { id: 'ch3_c2', speaker: '蒼', sc: 'aoi', text: '背景を省略して、キャラの感情で見せよう。\\n余白が逆に演出になるはず。', next: 'ch3_c2b' },
    { id: 'ch3_c2b', speaker: '焔', sc: 'homura', text: 'それだ！ キャラクターで押し切るぜ！', next: 'ch3_m' },
    { id: 'ch3_c3', speaker: '蒼', sc: 'aoi', text: '仕上げ工程を見直そう。\\n時間がかかる処理は避けて、画面を白黒のメリハリで魅せよう。', next: 'ch3_c3b' },
    { id: 'ch3_c3b', speaker: '翠', sc: 'sui', text: '同意。\\n最小のコストで最大の画面効果を生む手法を提案します。', next: 'ch3_m' },

    { id: 'ch3_m', text: 'それぞれが役割を見出し、最後の修羅場に突入した。', bg: 'school', bgm: 'audio/morning.mp3', next: 'ch3_d1' },
    { id: 'ch3_d1', text: '── 締め切り前日・徹夜明けの部室 ──', chars: {}, next: 'ch3_d2' },
    { id: 'ch3_d2', speaker: '焔', sc: 'homura', text: 'なあ蒼、漫画描いてみてどうだ？', chars: { left: 'aoi', right: 'homura' }, next: 'ch3_d3' },
    { id: 'ch3_d3', speaker: '蒼', sc: 'aoi', text: '……本当に大変だけどね。\\nでも、一人で妄想してた時よりずっといい。', next: 'ch3_d4' },
    { id: 'ch3_d4', speaker: '焔', sc: 'homura', text: 'だろ！ 一緒にひとつのモン作るのは最高だよな。\\n絶対ウケるぜ、俺たちの漫画！', next: 'ch3_d5' },
    { id: 'ch3_d5', speaker: '翠', sc: 'sui', text: 'あ、2人とも。\\nペン入れと仕上げの状況、最終確認しました。', chars: { left: 'aoi', center: 'sui', right: 'homura' }, next: 'ch3_d6' },
    { id: 'ch3_d6', speaker: '翠', sc: 'sui', text: '皆さんの協力のおかげで、全ページ完成です。', next: 'ch3_d7' },
    { id: 'ch3_d7', speaker: '焔', sc: 'homura', text: '……よし！ あとは郵送するだけだ！', next: 'ch3_d8' },
    { id: 'ch3_d8', text: '誰もがインクまみれの手で、笑い合った。\\nいよいよ、僕たちの作品が世界に出る。', next: 'ch4_0' },

    // ── FINAL CHAPTER ──
    { id: 'ch4_0', chapter: ['FINAL CHAPTER', '結果発表'], next: 'ch4_1' },
    { id: 'ch4_1', text: '── 数ヵ月後・放課後 ──', bg: 'peaceful', bgm: 'audio/morning.mp3', chars: {}, next: 'ch4_2' },
    { id: 'ch4_2', text: 'ついに、新人賞の結果が掲載された雑誌の発売日。\\n部室は異様な緊張感に包まれていた。', next: 'ch4_3' },
    { id: 'ch4_3', speaker: '紫月', sc: 'shizuki', text: '雑誌、買ってきたわよ。\\n……見る準備はいい？', chars: { center: 'shizuki' }, next: 'ch4_5' },
    { id: 'ch4_5', text: '紫月先輩が机の上に雑誌を置く。\\nページをめくる音が、やけに大きく響いた。', next: 'ch4_6' },
    { id: 'ch4_6', speaker: '焔', sc: 'homura', text: '（心臓飛び出そう……頼む、載っててくれ！）', chars: { left: 'homura', right: 'aoi' }, next: 'ch4_7' },
    { id: 'ch4_7', speaker: '翠', sc: 'sui', text: '（受賞確率は過去のデータから推定して……）', chars: { left: 'homura', center: 'sui', right: 'aoi' }, next: 'ch4_8' },
    { id: 'ch4_8', speaker: '蒼', sc: 'aoi', text: '（……大丈夫。やり切ったんだから）', next: 'ch4_b1' },

    { id: 'ch4_b1', text: 'ページをめくっていくと、結果発表のページが現れた。\\nしかし、一番大きな「大賞」には別の作品の名前がある。', next: 'ch4_b2' },
    { id: 'ch4_b2', speaker: '焔', sc: 'homura', text: '……大賞じゃない。', chars: { center: 'homura' }, next: 'ch4_b3' },
    { id: 'ch4_b3', text: '落選か、それとも──。', next: 'ch4_fc' },

    { id: 'ch4_fc', text: 'どうする？', choices: [
        { label: '最後まで自分の目で確かめる', next: 'ch4_f1', flag: 'all_attack' },
        { label: '焔にページをめくらせる', next: 'ch4_f2', flag: 'trust_homura' },
        { label: 'ページを一気に飛ばして下へ！', next: 'ch4_f3', flag: 'sacrifice' }
    ]},
    { id: 'ch4_f1', speaker: '蒼', sc: 'aoi', text: '（最後まで見届けよう！）\\n「下の方、入賞の欄を見てみて！」', next: 'ch4_f1b' },
    { id: 'ch4_f1b', speaker: '焔', sc: 'homura', text: '（！ おおっ……！）\\n「あった！！ 佳作だ！！」', next: 'ch4_f1c' },
    { id: 'ch4_f1c', text: '蒼と焔の声が重なり、部室に響き渡った。', next: 'ch4_climax' },
    { id: 'ch4_f2', speaker: '蒼', sc: 'aoi', text: '「焔……お前が見つけてくれ」', next: 'ch4_f2b' },
    { id: 'ch4_f2b', speaker: '焔', sc: 'homura', text: '「……うおおおおッ！！ あった！！ 佳作だ！！」', next: 'ch4_f2c' },
    { id: 'ch4_f2c', text: '焔の歓喜の叫びが、プレッシャーを吹き飛ばした。', next: 'ch4_climax' },
    { id: 'ch4_f3', speaker: '蒼', sc: 'aoi', text: '「ええい！！」\\n蒼は雑誌を引ったくり、一覧を見た。', next: 'ch4_f3b' },
    { id: 'ch4_f3b', speaker: '焔', sc: 'homura', text: '「あっ、おいずるいぞ！ ……で、どうだった！？」', next: 'ch4_f3e' },
    { id: 'ch4_f3e', text: '「……佳作。入賞してる！」', next: 'ch4_climax' },

    { id: 'ch4_climax', text: '『佳作：星嶺漫研──圧倒的な情熱と将来性を感じる意欲作』。', next: 'ch4_cx1' },
    { id: 'ch4_cx1', text: '編集部からの熱い講評に、部室は歓喜に包まれた！！', next: 'ch4_cx4' },
    { id: 'ch4_cx4', text: '大賞には届かなかった。でも、第一歩を踏み出した。\\nやり切った達成感と笑顔が、そこにはあった。', next: 'ch4_e1' },
    { id: 'ch4_e1', speaker: '焔', sc: 'homura', text: '……最高だな……！ まじで載りやがった！', chars: { left: 'homura', right: 'aoi' }, next: 'ch4_e2' },
    { id: 'ch4_e2', speaker: '翠', sc: 'sui', text: '初投稿での入賞確率はわずか数％。\\n見事な結果です。', chars: { left: 'homura', center: 'sui', right: 'aoi' }, next: 'ch4_e3' },
    { id: 'ch4_e3', speaker: '紫月', sc: 'shizuki', text: 'お疲れ様。みんな、最高の原稿だったわ。', chars: { left: 'aoi', center: 'shizuki', right: 'homura' }, next: 'ch4_e4' },
    { id: 'ch4_e4', speaker: '焔', sc: 'homura', text: 'はは……徹夜でぶっ倒れそうだったけど、\\n今、最高に気分がいいぜ。', next: 'ch4_e5' },
    { id: 'ch4_e5', speaker: '蒼', sc: 'aoi', text: '……漫研に入って、本当によかった。', next: 'ch4_e6' },
    { id: 'ch4_e6', speaker: '焔', sc: 'homura', text: 'だろ！ これからもよろしくな！\\n俺たちの連載は、まだまだこれからだ！', next: 'ch4_e9' },
    { id: 'ch4_e9', speaker: '蒼', sc: 'aoi', text: 'ああ──何度でも、一緒に描こう。\\nこの仲間たちと。', next: 'ch4_epi' },
    { id: 'ch4_epi', text: '一本の漫画が完成しても、僕らの夢は終わらない。\\n\\n入賞を果たした4人は、\\n次の原稿用紙に向かって、またペンをとるのだった。', next: '__END__' }
];"""

content = re.sub(r'const script = \[.*?\];', new_script, content, flags=re.DOTALL)

end_title = "let title = 'ENDING：漫画家への第一歩';"
end_desc = r"""let desc = '4人の漫画研究部員は、最高の漫画を作り上げた。\n\n蒼──悩みながらも画力を磨いた、新米作画担当。\n焔──情熱で皆を引っ張る、熱血原作者。\n紫月──部員を優しく導く、頼れる部長。\n翠──正確なデータで作品を分析する、有能な編集担当。\n\n彼らの青春は続く──新しいアイデアが湧く限り。\nきっと、最高の連載作家になる。';"""

content = re.sub(r"let title = 'ENDING：幕引きと新たな始まり';", end_title, content)
content = re.sub(r"let desc = '4人の演劇部員は.*?';\n", end_desc + "\n", content, flags=re.DOTALL)

end_sac_title = "'ENDING：機転のネームワーク';"
end_sac_desc = r"""'自分から動いた蒼の機転が、締め切り前の危機を救った。\n\n「あの時の背景処理、マジで助かったぜ」\n「……次からはもっと計画的に描いてよ」\n\n4人の絆は、修羅場を通してより深まった。';"""

content = re.sub(r"'ENDING：機転の連携';", end_sac_title, content)
content = re.sub(r"'自分から動いた蒼の機転が.*?より深まった。';", end_sac_desc, content, flags=re.DOTALL)

end_trust_title = "'ENDING：信頼の合作';"
end_trust_desc = r"""'蒼は焔のネームを信じ、焔はその作画を絶賛した。\n\n「お前が信じてくれたから、最後まで描けたんだ」\n焔の言葉に、蒼は笑った。\n\n正反対の2人だからこそ、最高の漫画家コンビだった。';"""
content = re.sub(r"'ENDING：信頼の絆';", end_trust_title, content)
content = re.sub(r"'蒼は焔を信じ、焔はその信頼に応えた。.*?最大のコンビ.*?';|'蒼は焔を信じ、焔はその信頼に応えた。.*?最高のコンビだった。';", end_trust_desc, content, flags=re.DOTALL)

with open(r'd:\tama\best_game\main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
