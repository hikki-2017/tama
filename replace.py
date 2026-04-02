import re

with open(r'd:\tama\best_game\main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace title comment
content = re.sub(r'// ゴーストハンター・アカデミー - Visual Novel', r'// 星嶺学園 青春ダイアリー - Visual Novel', content)

# Replace the script array
new_script = """const script = [
    // ── PROLOGUE ──
    { id: 'pro_0', chapter: ['PROLOGUE', '出会い'], next: 'pro_1' },
    { id: 'pro_1', text: '四月──。\\n桜の花びらが風に舞う、穏やかな朝だった。', bg: 'school', bgm: 'audio/morning.mp3', next: 'pro_2' },
    { id: 'pro_2', text: '私立・星嶺学園。\\n僕はまた、この新しい環境になじめるかどうか不安を抱えていた。', next: 'pro_3' },
    { id: 'pro_3', text: '何か夢中になれるものを見つけたい。\\nでも、何から始めればいいかわからなかった。', se: 'audio/wind.mp3', next: 'pro_4' },
    { id: 'pro_4', text: 'そんな時、ふと目にしたのは──\\n一枚の色褪せたポスター。「演劇部、部員募集中」。', next: 'pro_5' },

    { id: 'pro_5', text: '── 1年B組・教室 ──', bg: 'school', bgm: 'audio/classroom.mp3', chars: {}, se: 'audio/chime.mp3', next: 'pro_6' },
    { id: 'pro_6', text: '放課後のチャイムが鳴り響く。\\n帰る準備をしていると、クラスで一番活発な男子が話しかけてきた。', chars: { center: 'aoi' }, next: 'pro_7' },
    { id: 'pro_7', speaker: '蒼', sc: 'aoi', text: '（……今日もまっすぐ帰るか）', next: 'pro_10' },
    { id: 'pro_10', text: '突然、背後からドンッと肩を叩かれた。', se: 'audio/taiko.mp3', next: 'pro_11' },
    { id: 'pro_11', speaker: '焔', sc: 'homura', text: 'よう！ お前、演劇部のポスター見てたよな？', chars: { left: 'aoi', right: 'homura' }, next: 'pro_12' },
    { id: 'pro_12', speaker: '蒼', sc: 'aoi', text: '……えっ？\\nいや、ただ見てただけで──', next: 'pro_13' },
    { id: 'pro_13', speaker: '焔', sc: 'homura', text: 'いいから来いって！ 俺が見学に行くの付き合えよ！\\n俺は焔。1年A組だ、よろしくな！', next: 'pro_14' },
    { id: 'pro_14', speaker: '蒼', sc: 'aoi', text: 'ええっ……！？', next: 'pro_16' },
    { id: 'pro_16', text: '腕を引かれるまま、蒼は教室を後にした。', next: 'ch1_0' },

    // ── CHAPTER 1 ──
    { id: 'ch1_0', chapter: ['CHAPTER 1', '演劇部'], next: 'ch1_1' },
    { id: 'ch1_1', text: '── 旧校舎・演劇部部室 ──', bg: 'peaceful', bgm: 'audio/underground.mp3', chars: {}, next: 'ch1_2' },
    { id: 'ch1_2', text: '旧校舎にある部室。\\n中には大道具や小道具が所狭しと並んでいる。', next: 'ch1_3' },
    { id: 'ch1_3', speaker: '紫月', sc: 'shizuki', text: 'いらっしゃい。見学者かしら？', chars: { center: 'shizuki' }, next: 'ch1_4' },
    { id: 'ch1_4', text: '長い紫の髪をした上級生が、優雅に微笑んでいた。\\nその落ち着いた雰囲気に、空気が変わる。', next: 'ch1_5' },
    { id: 'ch1_5', speaker: '紫月', sc: 'shizuki', text: '私は紫月。3年生で、演劇部の部長よ。\\nよく来てくれたわね。', next: 'ch1_6' },
    { id: 'ch1_6', speaker: '焔', sc: 'homura', text: 'おお、部長！ 俺、焔っす！\\n主役やる気満々で来ました！', chars: { left: 'homura', right: 'shizuki' }, next: 'ch1_7' },
    { id: 'ch1_7', speaker: '紫月', sc: 'shizuki', text: '……元気ね。嫌いじゃないわ。', next: 'ch1_8' },
    { id: 'ch1_8', speaker: '蒼', sc: 'aoi', text: 'あの……僕は蒼です。\\nその、無理やり連れてこられただけで、演技とかは……', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch1_9' },
    { id: 'ch1_9', speaker: '紫月', sc: 'shizuki', text: '裏方でも大歓迎よ。\\n演劇は表に立つ人だけじゃ成り立たないから。', next: 'ch1_10' },
    { id: 'ch1_10', text: 'その時、部室のドアがゆっくりと開いた。', se: 'audio/switch.mp3', next: 'ch1_11' },
    { id: 'ch1_11', speaker: '翠', sc: 'sui', text: '……遅れました。1年C組の、翠です。', chars: { left: 'aoi', center: 'sui', right: 'shizuki' }, next: 'ch1_12' },
    { id: 'ch1_12', text: '緑がかった髪の静かな少女。\\n手には分厚い台本を持っている。', next: 'ch1_13' },
    { id: 'ch1_13', speaker: '翠', sc: 'sui', text: '脚本志望です。\\n皆さんの演技、データとして見せてもらえませんか。', next: 'ch1_14' },
    { id: 'ch1_14', speaker: '焔', sc: 'homura', text: '……変わったやつだな。', chars: { left: 'homura', center: 'sui', right: 'shizuki' }, next: 'ch1_15' },
    { id: 'ch1_15', speaker: '翠', sc: 'sui', text: '変わってるのはお互い様。\\n普通はこんなに急に来ないでしょうに。', next: 'ch1_16' },
    { id: 'ch1_16', speaker: '紫月', sc: 'shizuki', text: 'ふふ、個性豊かな一年生ね。\\nでは──まずは簡単な自己紹介から始めましょうか。', next: 'ch1_17' },
    { id: 'ch1_17', speaker: '紫月', sc: 'shizuki', text: '私たちの目標は、秋の文化祭で大成功を収めること。\\n最高の舞台を作るための、大切な仲間よ。', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch1_c' },

    { id: 'ch1_c', speaker: '紫月', sc: 'shizuki', text: '蒼、あなたはどう関わってみたい？', chars: { left: 'aoi', right: 'shizuki' }, choices: [
        { label: '真剣に取り組む──「役者に挑戦してみたい」', next: 'ch1_ca', flag: 'serious' },
        { label: '不安を伝える──「裏方ならなんとか…」', next: 'ch1_cb', flag: 'afraid' },
        { label: '好奇心で挑む──「全部やってみたい」', next: 'ch1_cc', flag: 'curious' }
    ]},
    { id: 'ch1_ca', speaker: '蒼', sc: 'aoi', text: '……役者に挑戦してみたいです。\\nせっかくなら、新しい自分になってみたい。', next: 'ch1_ca2' },
    { id: 'ch1_ca2', speaker: '紫月', sc: 'shizuki', text: '……良い目ね。期待しているわ。', next: 'ch1_end' },
    { id: 'ch1_cb', speaker: '蒼', sc: 'aoi', text: '正直……人前は怖い。\\nだから、裏方ならお手伝いできるかも。', next: 'ch1_cb2' },
    { id: 'ch1_cb2', speaker: '焔', sc: 'homura', text: '大丈夫だ！ 俺が引っ張ってやるから！\\n一緒にスポットライト浴びようぜ！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch1_cb3' },
    { id: 'ch1_cb3', speaker: '蒼', sc: 'aoi', text: '……ありがとう、焔。', next: 'ch1_end' },
    { id: 'ch1_cc', speaker: '蒼', sc: 'aoi', text: '少し……面白そうだ。\\n役者も裏方も、色々やってみたいです。', next: 'ch1_cc2' },
    { id: 'ch1_cc2', speaker: '翠', sc: 'sui', text: '同感。全体を把握するのは良いこと。\\n一緒に演出を考えましょう。', chars: { left: 'aoi', center: 'sui', right: 'shizuki' }, next: 'ch1_end' },

    { id: 'ch1_end', text: 'こうして、4人の演劇部での日々が始まった。\\nまだ誰も知らない──この後待ち受ける、文化祭までの道のりを。', next: 'ch2_0' },

    // ── CHAPTER 2 ──
    { id: 'ch2_0', chapter: ['CHAPTER 2', '初めての稽古'], next: 'ch2_1' },
    { id: 'ch2_1', text: '── 数日後・放課後 ──', bg: 'school', bgm: 'audio/classroom.mp3', chars: {}, next: 'ch2_2' },
    { id: 'ch2_2', speaker: '紫月', sc: 'shizuki', text: 'じゃあ、今日は軽く台本の読み合わせよ。\\n感情を込めることを意識してね。', chars: { center: 'shizuki' }, next: 'ch2_3' },
    { id: 'ch2_3', speaker: '焔', sc: 'homura', text: 'よっしゃ、初舞台だ！ 行くぜ蒼！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch2_4' },
    { id: 'ch2_4', speaker: '翠', sc: 'sui', text: 'セリフのテンポ、計測します。', next: 'ch2_5' },
    { id: 'ch2_5', speaker: '蒼', sc: 'aoi', text: '……わかった。やってみる。', next: 'ch2_b' },

    { id: 'ch2_b', text: '── 体育館ステージ ──', bg: 'school', bgm: 'audio/morning.mp3', chars: {}, next: 'ch2_b1' },
    { id: 'ch2_b1', text: '体育館の広いステージ。\\nここに立つと、声がよく響く。', next: 'ch2_b3' },
    { id: 'ch2_b3', speaker: '焔', sc: 'homura', text: '「俺は負けねえッ！！ 約束したんだ！」', chars: { center: 'homura' }, se: 'audio/taiko.mp3', next: 'ch2_b4' },
    { id: 'ch2_b4', text: '焔の大きな声が響き渡る。だが、少し大げさすぎた。', next: 'ch2_b6' },
    { id: 'ch2_b6', speaker: '翠', sc: 'sui', text: '声量は120%、しかし感情表現が単調。\\nもう少し抑揚をつけるべきです。', chars: { left: 'homura', center: 'sui' }, next: 'ch2_b7' },
    { id: 'ch2_b7', speaker: '蒼', sc: 'aoi', text: '……次は僕の番か。', chars: { left: 'homura', center: 'aoi', right: 'sui' }, next: 'ch2_bc' },

    { id: 'ch2_bc', text: 'どんなふうに演技する？', choices: [
        { label: '焔に負けじと大きな声で', next: 'ch2_x1', flag: 'front' },
        { label: '翠の指摘をふまえ冷静に', next: 'ch2_x2', flag: 'analyze' },
        { label: '自分なりの感情を込める', next: 'ch2_x3', flag: 'solo' }
    ]},
    { id: 'ch2_x1', speaker: '蒼', sc: 'aoi', text: '「だから、僕も頑張るんだ！」', next: 'ch2_x1b' },
    { id: 'ch2_x1b', speaker: '焔', sc: 'homura', text: 'おう！ その意気だぜ！！', chars: { left: 'aoi', right: 'homura' }, next: 'ch2_r' },
    { id: 'ch2_x2', speaker: '蒼', sc: 'aoi', text: '「……だから、僕も頑張るんだ」', next: 'ch2_x2b' },
    { id: 'ch2_x2b', speaker: '翠', sc: 'sui', text: 'テンポは完璧。感情も伝わりやすい。', chars: { left: 'aoi', right: 'sui' }, next: 'ch2_r' },
    { id: 'ch2_x3', speaker: '蒼', sc: 'aoi', text: '（この時の気持ちは……きっとこうだ）', chars: { center: 'aoi' }, next: 'ch2_x3b' },
    { id: 'ch2_x3b', text: '「だから──僕だって、変われるはずだ！」\\n蒼の切実な声が、ステージに静かな余韻を残した。', next: 'ch2_x3c' },
    { id: 'ch2_x3c', speaker: '紫月', sc: 'shizuki', text: '（凄い……あの子、自分の言葉にしている……）', next: 'ch2_r' },

    { id: 'ch2_r', text: '初めての稽古は無事に終わった。', bg: 'school', bgm: 'audio/classroom.mp3', next: 'ch2_r1' },
    { id: 'ch2_r1', speaker: '焔', sc: 'homura', text: 'やった……案外いけるじゃん！', chars: { left: 'aoi', right: 'homura' }, next: 'ch2_r2' },
    { id: 'ch2_r2', speaker: '蒼', sc: 'aoi', text: '……うん。なんだか、楽しい。', next: 'ch2_r3' },
    { id: 'ch2_r3', speaker: '紫月', sc: 'shizuki', text: 'お疲れ様。いい感じね。\\nでも──', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch2_r4' },
    { id: 'ch2_r4', speaker: '紫月', sc: 'shizuki', text: '文化祭まであと1ヶ月。\\nまだまだ壁は高いわよ。', next: 'ch3_0' },

    // ── CHAPTER 3 ──
    { id: 'ch3_0', chapter: ['CHAPTER 3', '立ちはだかる壁'], next: 'ch3_1' },
    { id: 'ch3_1', text: '── 2週間後・部室 ──', bg: 'peaceful', bgm: 'audio/underground.mp3', chars: {}, next: 'ch3_2' },
    { id: 'ch3_2', speaker: '翠', sc: 'sui', text: '報告。衣装と大道具の進捗が思わしくありません。', chars: { center: 'sui' }, next: 'ch3_3' },
    { id: 'ch3_3', speaker: '翠', sc: 'sui', text: 'このままだと、本番に間に合わない確率が70%です。', next: 'ch3_4' },
    { id: 'ch3_4', speaker: '焔', sc: 'homura', text: 'マジかよ……人が足りねえのか？', chars: { left: 'homura', center: 'sui', right: 'shizuki' }, next: 'ch3_6' },
    { id: 'ch3_6', speaker: '蒼', sc: 'aoi', text: '紫月先輩……どうしましょう？', chars: { left: 'aoi', right: 'shizuki' }, next: 'ch3_7' },
    { id: 'ch3_7', speaker: '紫月', sc: 'shizuki', text: '……実は、生徒会から予算を削られそうなの。', next: 'ch3_8' },
    { id: 'ch3_8', speaker: '紫月', sc: 'shizuki', text: '実績がないから、って。\\nこのままじゃ、舞台の演出を大幅にカットしないといけない。', next: 'ch3_10' },
    { id: 'ch3_10', speaker: '焔', sc: 'homura', text: 'そんなの嫌だ！ 最高の舞台にしたいんだ！', chars: { left: 'aoi', center: 'homura', right: 'shizuki' }, next: 'ch3_12' },
    { id: 'ch3_12', text: '部室に重い沈黙が落ちた。', next: 'ch3_c' },

    { id: 'ch3_c', text: '……どうする？', choices: [
        { label: '「生徒会に直談判に行こう」', next: 'ch3_c1', flag: 'seal' },
        { label: '「自分たちで材料を集めよう」', next: 'ch3_c2', flag: 'preempt' },
        { label: '「演出プランを見直そう」', next: 'ch3_c3', flag: 'intel' }
    ]},
    { id: 'ch3_c1', speaker: '蒼', sc: 'aoi', text: '生徒会に直談判に行こう。\\n僕たちの熱意を伝えれば、わかってくれるはずだ。', next: 'ch3_c1b' },
    { id: 'ch3_c1b', speaker: '紫月', sc: 'shizuki', text: '……そうね。諦めるのは早いわ。', next: 'ch3_m' },
    { id: 'ch3_c2', speaker: '蒼', sc: 'aoi', text: '自分たちで材料を集めよう。\\n廃材をもらったり、工夫すればできるはず。', next: 'ch3_c2b' },
    { id: 'ch3_c2b', speaker: '焔', sc: 'homura', text: 'それだ！ 俺、手伝ってくれそうなヤツ探してくる！', next: 'ch3_m' },
    { id: 'ch3_c3', speaker: '蒼', sc: 'aoi', text: '演出プランを見直そう。\\nお金をかけなくても、演技でカバーできるはずだ。', next: 'ch3_c3b' },
    { id: 'ch3_c3b', speaker: '翠', sc: 'sui', text: '同意。\\n最小のコストで最大の効果を計算します。', next: 'ch3_m' },

    { id: 'ch3_m', text: 'それぞれが役割を見出し、動き始めた。', bg: 'school', bgm: 'audio/morning.mp3', next: 'ch3_d1' },
    { id: 'ch3_d1', text: '── 翌日・昼休み ──', chars: {}, next: 'ch3_d2' },
    { id: 'ch3_d2', speaker: '焔', sc: 'homura', text: 'なあ蒼、演劇やってみてどうだ？', chars: { left: 'aoi', right: 'homura' }, next: 'ch3_d3' },
    { id: 'ch3_d3', speaker: '蒼', sc: 'aoi', text: '……大変だけどね。\\nでも、一人で過ごしてた時よりずっといい。', next: 'ch3_d4' },
    { id: 'ch3_d4', speaker: '焔', sc: 'homura', text: 'だろ！ 一緒にひとつのモン作るのは最高だよな。\\n絶対成功させようぜ！', next: 'ch3_d5' },
    { id: 'ch3_d5', speaker: '翠', sc: 'sui', text: 'あ、2人ともここに。\\n準備の進行度、再計算しました。', chars: { left: 'aoi', center: 'sui', right: 'homura' }, next: 'ch3_d6' },
    { id: 'ch3_d6', speaker: '翠', sc: 'sui', text: '皆さんの協力のおかげで、100%達成見込みです。', next: 'ch3_d7' },
    { id: 'ch3_d7', speaker: '焔', sc: 'homura', text: '……よし！ あとは本番だけだ！', next: 'ch3_d8' },
    { id: 'ch3_d8', text: '誰もが、舞台への情熱でひとつになっていた。\\nいよいよ、文化祭の幕が上がる。', next: 'ch4_0' },

    // ── FINAL CHAPTER ──
    { id: 'ch4_0', chapter: ['FINAL CHAPTER', '開演'], next: 'ch4_1' },
    { id: 'ch4_1', text: '── 文化祭当日 ──', bg: 'peaceful', bgm: 'audio/morning.mp3', chars: {}, next: 'ch4_2' },
    { id: 'ch4_2', text: '客席は満員。\\nざわめきが、舞台袖にまで響いてくる。', next: 'ch4_3' },
    { id: 'ch4_3', speaker: '紫月', sc: 'shizuki', text: 'みんな、準備はいい？\\nいよいよ開演よ。', chars: { center: 'shizuki' }, next: 'ch4_5' },
    { id: 'ch4_5', text: '幕が上がる。\\nそこには──僕たちが数カ月かけて作り上げた世界が広がっていた。', next: 'ch4_6' },
    { id: 'ch4_6', speaker: '焔', sc: 'homura', text: '（緊張するけど……やるしかねえ！）', chars: { left: 'homura', right: 'aoi' }, next: 'ch4_7' },
    { id: 'ch4_7', speaker: '翠', sc: 'sui', text: '（照明、音響、スタンバイOKです）', chars: { left: 'homura', center: 'sui', right: 'aoi' }, next: 'ch4_8' },
    { id: 'ch4_8', speaker: '蒼', sc: 'aoi', text: '（……大丈夫。みんながいるから）', next: 'ch4_b1' },

    { id: 'ch4_b1', text: '劇は順調に進んでいった。\\nしかし、クライマックスの直前──。', next: 'ch4_b2' },
    { id: 'ch4_b2', speaker: '焔', sc: 'homura', text: '（やばい、次のセリフ……飛んだ！）', chars: { center: 'homura' }, next: 'ch4_b3' },
    { id: 'ch4_b3', text: '焔が一瞬言葉に詰まり、舞台に空白の時間が生まれた。', next: 'ch4_fc' },

    { id: 'ch4_fc', text: 'どうする？', choices: [
        { label: '自分がアドリブで繋ぐ', next: 'ch4_f1', flag: 'all_attack' },
        { label: '焔が思い出すのを信じて待つ', next: 'ch4_f2', flag: 'trust_homura' },
        { label: '自分がきっかけのセリフを言う', next: 'ch4_f3', flag: 'sacrifice' }
    ]},
    { id: 'ch4_f1', speaker: '蒼', sc: 'aoi', text: '（僕が繋ぐ！）\\n「ねえ、君はそこで何を迷っているんだ！」', next: 'ch4_f1b' },
    { id: 'ch4_f1b', speaker: '焔', sc: 'homura', text: '（！ そうだ……！）\\n「迷ってなんかねえ！ 俺は──」', next: 'ch4_f1c' },
    { id: 'ch4_f1c', text: '蒼のアドリブが見事に場を繋いだ。', next: 'ch4_climax' },
    { id: 'ch4_f2', speaker: '蒼', sc: 'aoi', text: '（焔なら、絶対に大丈夫だ）', next: 'ch4_f2b' },
    { id: 'ch4_f2b', speaker: '焔', sc: 'homura', text: '「……俺は、絶対に諦めない！」', next: 'ch4_f2c' },
    { id: 'ch4_f2c', text: '緊迫した間が、逆に演技のリアリティを生み出した。', next: 'ch4_climax' },
    { id: 'ch4_f3', speaker: '蒼', sc: 'aoi', text: '（僕のセリフを先に…！）\\n「約束したじゃないか、一緒に行くって！」', next: 'ch4_f3b' },
    { id: 'ch4_f3b', speaker: '焔', sc: 'homura', text: '「ああ……そうだったな。行こうぜ！」', next: 'ch4_f3e' },
    { id: 'ch4_f3e', text: '蒼の機転が、劇のテンポを取り戻した。', next: 'ch4_climax' },

    { id: 'ch4_climax', text: 'そして、迎えた最後のシーン。', next: 'ch4_cx1' },
    { id: 'ch4_cx1', text: '観客席から、割れんばかりの拍手が巻き起こった！！', next: 'ch4_cx4' },
    { id: 'ch4_cx4', text: 'カーテンコール。\\nやり切った汗と笑顔が、舞台上で輝いていた。', next: 'ch4_e1' },
    { id: 'ch4_e1', speaker: '焔', sc: 'homura', text: '……大成功、だな……！', chars: { left: 'homura', right: 'aoi' }, next: 'ch4_e2' },
    { id: 'ch4_e2', speaker: '翠', sc: 'sui', text: '観客の拍手の音量、120デシベル。\\n大喝采です。', chars: { left: 'homura', center: 'sui', right: 'aoi' }, next: 'ch4_e3' },
    { id: 'ch4_e3', speaker: '紫月', sc: 'shizuki', text: 'お疲れ様。みんな、最高の演技だったわ。', chars: { left: 'aoi', center: 'shizuki', right: 'homura' }, next: 'ch4_e4' },
    { id: 'ch4_e4', speaker: '焔', sc: 'homura', text: 'はは……緊張で足震えてたけど、\\n今、最高に気分がいいぜ。', next: 'ch4_e5' },
    { id: 'ch4_e5', speaker: '蒼', sc: 'aoi', text: '……演劇部に入って、本当によかった。', next: 'ch4_e6' },
    { id: 'ch4_e6', speaker: '焔', sc: 'homura', text: 'だろ！ これからもよろしくな！\\n俺たちの舞台は、まだまだこれからだ！', next: 'ch4_e9' },
    { id: 'ch4_e9', speaker: '蒼', sc: 'aoi', text: 'ああ──何度でも、一緒に作ろう。\\nこの仲間と一緒に。', next: 'ch4_epi' },
    { id: 'ch4_epi', text: '幕が下りても、僕たちの青春は終わらない。\\n\\n文化祭を乗り越えた4人は、\\n次の舞台を目指して歩き出すのだった。', next: '__END__' }
];"""

content = re.sub(r'const script = \[.*?\];', new_script, content, flags=re.DOTALL)

# Replace the ending strings
end_title = "let title = 'ENDING：幕引きと新たな始まり';"
end_desc = r"""let desc = '4人の演劇部員は、最高の舞台を作り上げた。\n\n蒼──悩みながらも成長した、新米役者。\n焔──情熱で皆を引っ張る、ムードメーカー。\n紫月──部員を優しく導く、頼れる部長。\n翠──正確なデータで舞台を支える、演出家。\n\n彼らの青春は続く──新たな幕が上がる限り。\nきっと、最高の学生生活になる。';"""

content = re.sub(r"let title = 'ENDING：夜明けの守護者たち';", end_title, content)
content = re.sub(r"let desc = '4人の学園ゴーストハンターは.*?';\n", end_desc + "\n", content, flags=re.DOTALL)

end_sac_title = "'ENDING：機転の連携';"
end_sac_desc = r"""'自分から動いた蒼の機転が、仲間たちを救った。\n\n「あの時のアドリブ、マジで助かったぜ」\n「……次からはセリフ忘れないでよ」\n\n4人の絆は、舞台を通してより深まった。';"""

content = re.sub(r"'ENDING：自己犠牲の英雄';", end_sac_title, content)
content = re.sub(r"'自らを囮にした蒼の覚悟が.*?誰にも断ち切れない。';", end_sac_desc, content, flags=re.DOTALL)

end_trust_title = "'ENDING：信頼の絆';"
end_trust_desc = r"""'蒼は焔を信じ、焔はその信頼に応えた。\n\n「お前が信じてくれたから、思い出したんだ」\n焔の言葉に、蒼は笑った。\n\n正反対の2人だからこそ、最高のコンビだった。';"""
content = re.sub(r"'ENDING：信頼の炎';", end_trust_title, content)
content = re.sub(r"'蒼は焔を信じ、焔はその信頼に応えた。.*?最強のコンビだった。';", end_trust_desc, content, flags=re.DOTALL)

with open(r'd:\tama\best_game\main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
