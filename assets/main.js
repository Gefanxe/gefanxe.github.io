/* -----------------------------------------------------------
  關鍵說明（註解）：
  1) 使用 ES6 class 封裝狀態與方法，易於維護。
  2) 事件委派處理選項點擊，避免逐題重綁監聽造成記憶體壓力。
  3) 音訊節點於 stop 後主動 disconnect，計時器統一清理，降低洩漏風險。
  4) 保留原功能：隨機出題、注音/emoji 切換、音效、正確後自動下一題。
------------------------------------------------------------*/

class MeasureQuizGame {
    // 量詞清單與題庫可視為常量，寫為靜態屬性，避免每次建構重建
    static MEASURES = [
        { han: "顆", zy: "ㄎㄜ" }, { han: "隻", zy: "ㄓ" }, { han: "本", zy: "ㄅㄣˇ" }, { han: "支", zy: "ㄓ" },
        { han: "把", zy: "ㄅㄚˇ" }, { han: "張", zy: "ㄓㄤ" }, { han: "輛", zy: "ㄌㄧㄤˋ" }, { han: "台", zy: "ㄊㄞˊ" },
        { han: "部", zy: "ㄅㄨˋ" }, { han: "個", zy: "ㄍㄜˋ" }, { han: "封", zy: "ㄈㄥ" }, { han: "雙", zy: "ㄕㄨㄤ" },
        { han: "條", zy: "ㄊㄧㄠˊ" }, { han: "件", zy: "ㄐㄧㄢˋ" }, { han: "頂", zy: "ㄉㄧㄥˇ" }, { han: "副", zy: "ㄈㄨˋ" },
        { han: "朵", zy: "ㄉㄨㄛˇ" }, { han: "棵", zy: "ㄎㄜ" }, { han: "座", zy: "ㄗㄨㄛˋ" }, { han: "棟", zy: "ㄉㄨㄥˋ" },
        { han: "輪", zy: "ㄌㄨㄣˊ" }, { han: "扇", zy: "ㄕㄢˋ" }
    ];

    static DATA = [
        { emo: "🍎", n: ["蘋", "果"], nz: ["ㄆㄧㄥˊ", "ㄍㄨㄛˇ"], m: "顆", mz: "ㄎㄜ" },
        { emo: "🐶", n: ["狗"], nz: ["ㄍㄡˇ"], m: "隻", mz: "ㄓ" },
        { emo: "🐱", n: ["貓"], nz: ["ㄇㄠ"], m: "隻", mz: "ㄓ" },
        { emo: "🐟", n: ["魚"], nz: ["ㄩˊ"], m: "條", mz: "ㄊㄧㄠˊ" },
        { emo: "🐦", n: ["鳥"], nz: ["ㄋㄧㄠˇ"], m: "隻", mz: "ㄓ" },
        { emo: "📖", n: ["書"], nz: ["ㄕㄨ"], m: "本", mz: "ㄅㄣˇ" },
        { emo: "🖊️", n: ["筆"], nz: ["ㄅㄧˇ"], m: "支", mz: "ㄓ" },
        { emo: "☂️", n: ["雨", "傘"], nz: ["ㄩˇ", "ㄙㄢˇ"], m: "把", mz: "ㄅㄚˇ" },
        { emo: "🪑", n: ["椅", "子"], nz: ["ㄧˇ", "ㄗ˙"], m: "張", mz: "ㄓㄤ" },
        { emo: "🚗", n: ["車"], nz: ["ㄔㄜ"], m: "輛", mz: "ㄌㄧㄤˋ" },
        { emo: "🚲", n: ["單", "車"], nz: ["ㄉㄢ", "ㄔㄜ"], m: "台", mz: "ㄊㄞˊ" },
        { emo: "🖥️", n: ["電", "腦"], nz: ["ㄉㄧㄢˋ", "ㄋㄠˇ"], m: "台", mz: "ㄊㄞˊ" },
        { emo: "📱", n: ["手", "機"], nz: ["ㄕㄡˇ", "ㄐㄧ"], m: "部", mz: "ㄅㄨˋ" },
        { emo: "📺", n: ["電", "視"], nz: ["ㄉㄧㄢˋ", "ㄕˋ"], m: "部", mz: "ㄅㄨˋ" },
        { emo: "🥤", n: ["杯", "子"], nz: ["ㄅㄟ", "ㄗ˙"], m: "個", mz: "ㄍㄜˋ" },
        { emo: "✉️", n: ["信"], nz: ["ㄒㄧㄣˋ"], m: "封", mz: "ㄈㄥ" },
        { emo: "👟", n: ["鞋", "子"], nz: ["ㄒㄧㄝˊ", "ㄗ˙"], m: "雙", mz: "ㄕㄨㄤ" },
        { emo: "🥢", n: ["筷", "子"], nz: ["ㄎㄨㄞˋ", "ㄗ˙"], m: "雙", mz: "ㄕㄨㄤ" },
        { emo: "👖", n: ["褲", "子"], nz: ["ㄎㄨˋ", "ㄗ˙"], m: "條", mz: "ㄊㄧㄠˊ" },
        { emo: "👗", n: ["裙", "子"], nz: ["ㄑㄩㄣˊ", "ㄗ˙"], m: "件", mz: "ㄐㄧㄢˋ" },
        { emo: "👕", n: ["衣", "服"], nz: ["ㄧ", "ㄈㄨˊ"], m: "件", mz: "ㄐㄧㄢˋ" },
        { emo: "🧢", n: ["帽", "子"], nz: ["ㄇㄠˋ", "ㄗ˙"], m: "頂", mz: "ㄉㄧㄥˇ" },
        { emo: "🧤", n: ["手", "套"], nz: ["ㄕㄡˇ", "ㄊㄠˋ"], m: "副", mz: "ㄈㄨˋ" },
        { emo: "👓", n: ["眼", "鏡"], nz: ["ㄧㄢˇ", "ㄐㄧㄥˋ"], m: "副", mz: "ㄈㄨˋ" },
        { emo: "🗺️", n: ["地", "圖"], nz: ["ㄉㄧˋ", "ㄊㄨˊ"], m: "張", mz: "ㄓㄤ" },
        { emo: "🖼️", n: ["相", "片"], nz: ["ㄒㄧㄤˋ", "ㄆㄧㄢˋ"], m: "張", mz: "ㄓㄤ" },
        { emo: "🎫", n: ["票"], nz: ["ㄆㄧㄠˋ"], m: "張", mz: "ㄓㄤ" },
        { emo: "📄", n: ["紙"], nz: ["ㄓˇ"], m: "張", mz: "ㄓㄤ" },
        { emo: "🍪", n: ["餅", "乾"], nz: ["ㄅㄧㄥˇ", "ㄍㄢ"], m: "片", mz: "ㄆㄧㄢˋ" },
        { emo: "🎂", n: ["蛋", "糕"], nz: ["ㄉㄢˋ", "ㄍㄠ"], m: "塊", mz: "ㄎㄨㄞˋ" },
        { emo: "🥯", n: ["麵", "包"], nz: ["ㄇㄧㄢˋ", "ㄅㄠ"], m: "個", mz: "ㄍㄜˋ" },
        { emo: "🍉", n: ["西", "瓜"], nz: ["ㄒㄧ", "ㄍㄨㄚ"], m: "顆", mz: "ㄎㄜ" },
        { emo: "🌸", n: ["花"], nz: ["ㄏㄨㄚ"], m: "朵", mz: "ㄉㄨㄛˇ" },
        { emo: "🌳", n: ["樹"], nz: ["ㄕㄨˋ"], m: "棵", mz: "ㄎㄜ" },
        { emo: "⛰️", n: ["山"], nz: ["ㄕㄢ"], m: "座", mz: "ㄗㄨㄛˋ" },
        { emo: "🏠", n: ["房", "子"], nz: ["ㄈㄤˊ", "ㄗ˙"], m: "棟", mz: "ㄉㄨㄥˋ" },
        { emo: "🌉", n: ["橋"], nz: ["ㄑㄧㄠˊ"], m: "座", mz: "ㄗㄨㄛˋ" },
        { emo: "🏞️", n: ["河"], nz: ["ㄏㄜˊ"], m: "條", mz: "ㄊㄧㄠˊ" },
        { emo: "🛤️", n: ["路"], nz: ["ㄌㄨˋ"], m: "條", mz: "ㄊㄧㄠˊ" },
        { emo: "☁️", n: ["雲"], nz: ["ㄩㄣˊ"], m: "朵", mz: "ㄉㄨㄛˇ" },
        { emo: "⭐", n: ["星", "星"], nz: ["ㄒㄧㄥ", "ㄒㄧㄥ"], m: "顆", mz: "ㄎㄜ" },
        { emo: "🌞", n: ["太", "陽"], nz: ["ㄊㄞˋ", "ㄧㄤˊ"], m: "顆", mz: "ㄎㄜ" },
        { emo: "🌕", n: ["月", "亮"], nz: ["ㄩㄝˋ", "ㄌㄧㄤˋ"], m: "輪", mz: "ㄌㄨㄣˊ" },
        { emo: "🪥", n: ["牙", "刷"], nz: ["ㄧㄚˊ", "ㄕㄨㄚ"], m: "支", mz: "ㄓ" },
        { emo: "💡", n: ["燈", "泡"], nz: ["ㄉㄥ", "ㄆㄠˋ"], m: "顆", mz: "ㄎㄜ" },
        { emo: "🗝️", n: ["鑰", "匙"], nz: ["ㄧㄠˋ", "ㄕ˙"], m: "把", mz: "ㄅㄚˇ" },
        { emo: "🚪", n: ["門"], nz: ["ㄇㄣˊ"], m: "扇", mz: "ㄕㄢˋ" },
        { emo: "🪟", n: ["窗", "戶"], nz: ["ㄔㄨㄤ", "ㄏㄨˋ"], m: "扇", mz: "ㄕㄢˋ" }
    ];

    static ENCOURAGE_MESSAGES = [
        "🌈 一起來探索量詞的奧秘吧！",
        "⭐ 你很努力學習，持續進步中！",
        "🦋 每一步練習都讓我們更進步！",
        "🌸 今天又有新的學習機會了！",
        "🐻 相信自己的學習能力會越來越強！",
        "🎈 這次想挑戰哪些新題目？",
        "🌺 完成挑戰後，你學到了什麼新技能？",
        "🌟 讓我看看你又進步了多少！",
        "🦄 這次又能學會新的技巧了！",
        "🎀 透過練習，我們的能力會不斷提升！"
    ];

    constructor() {
        // 狀態
        this.score = 0;
        this.streak = 0;
        this.current = null;
        this.usedIndex = -1;
        this.lock = false; // 防連點
        this.showEmoji = true; // 控制 emoji 顯示狀態
        this.showZhuyin = true; // 控制注音顯示狀態
        this.autoNextTimer = null; // 自動跳題計時器
    this.autoNextCancelled = false; // 取消自動跳題的旗標（解決 beep 後才排程的競態）
        this.audioContext = null; // 音訊

        // DOM 快取
        this.scoreEl = document.getElementById('score');
        this.streakEl = document.getElementById('streak');
        this.emojiEl = document.getElementById('emoji');
        this.nounEl = document.getElementById('noun');
        this.optsEl = document.getElementById('options');
        this.feedbackEl = document.getElementById('feedback');
        this.startBtn = document.getElementById('startBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.toggleEmojiBtn = document.getElementById('toggleEmojiBtn');
        this.toggleZyBtn = document.getElementById('toggleZyBtn');
        this.promptEl = document.querySelector('.prompt');
        this.welcomeMessageEl = document.getElementById('welcomeMessage');
        this.encourageTextEl = document.getElementById('encourageText');

        // 綁定事件（使用同一個實例方法，避免重複註冊導致洩漏）
        this.onStart = this.start.bind(this);
        this.onNext = this.next.bind(this);
        this.onReset = this.reset.bind(this);
        this.onToggleEmoji = this.toggleEmoji.bind(this);
        this.onToggleZhuyin = this.toggleZhuyin.bind(this);
        this.onOptionClick = this.handleOptionClick.bind(this);

        this.startBtn.addEventListener('click', this.onStart);
        this.nextBtn.addEventListener('click', this.onNext);
        this.resetBtn.addEventListener('click', this.onReset);
        this.toggleEmojiBtn.addEventListener('click', this.onToggleEmoji);
        this.toggleZyBtn.addEventListener('click', this.onToggleZhuyin);
        // 事件委派：只綁一次在容器
        this.optsEl.addEventListener('click', this.onOptionClick);

        // 初次載入：設定隨機鼓勵話語
        this.setRandomEncourageMessage();
    }

    // 初始化音頻上下文
    initAudioContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Audio context creation failed:', e);
            }
        }
        return this.audioContext;
    }

    // Web Audio API：答對/答錯旋律
    async beep(ok = true) {
        const ctx = this.initAudioContext();
        if (!ctx) return Promise.resolve();

        if (ctx.state === 'suspended') {
            try { await ctx.resume(); } catch (e) { console.warn('Audio context resume failed:', e); }
        }

        return new Promise(resolve => {
            const now = ctx.currentTime;
            const schedule = (freq, start, dur, type, attack, peak) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = type;
                o.frequency.value = freq;
                o.connect(g);
                g.connect(ctx.destination);

                g.gain.setValueAtTime(0.001, start);
                g.gain.exponentialRampToValueAtTime(peak, start + attack);
                g.gain.exponentialRampToValueAtTime(0.001, start + dur);

                // stop 後主動斷開連線，協助 GC
                o.onended = () => {
                    try { o.disconnect(); } catch {}
                    try { g.disconnect(); } catch {}
                };

                o.start(start);
                o.stop(start + dur);
            };

            let lastEnd = now;
            if (ok) {
                [523.25, 659.25, 783.99].forEach((f, i) => {
                    const start = now + i * 0.15;
                    schedule(f, start, 0.12, 'triangle', 0.03, 0.23);
                    lastEnd = start + 0.12;
                });
            } else {
                [783.99, 659.25, 523.25].forEach((f, i) => {
                    const start = now + i * 0.18;
                    schedule(f, start, 0.15, 'sawtooth', 0.02, 0.12);
                    lastEnd = start + 0.15;
                });
            }

            const tail = 0.1;
            setTimeout(resolve, Math.max(0, (lastEnd - now + tail) * 1000));
        });
    }

    // 工具：隨機整數
    rnd(n) { return Math.floor(Math.random() * n); }

    // 工具：從 MEASURES 取不同的干擾選項
    pickDistractors(correct, count = 3) {
        const pool = MeasureQuizGame.MEASURES.filter(m => m.han !== correct.han);
        const out = [];
        while (out.length < count && pool.length) {
            const i = this.rnd(pool.length);
            out.push(pool.splice(i, 1)[0]);
        }
        return out;
    }

    // 切換 emoji 顯示/隱藏
    toggleEmoji() {
        this.showEmoji = !this.showEmoji;
        if (this.showEmoji) {
            this.emojiEl.classList.remove('hidden-content');
            this.toggleEmojiBtn.classList.remove('active');
        } else {
            this.emojiEl.classList.add('hidden-content');
            this.toggleEmojiBtn.classList.add('active');
        }
    }

    // 切換注音顯示/隱藏
    toggleZhuyin() {
        this.showZhuyin = !this.showZhuyin;
        if (this.showZhuyin) {
            this.toggleZyBtn.classList.remove('active');
            document.querySelectorAll('idiv').forEach(idiv => {
                idiv.dataset.after = idiv.dataset.after2;
            });
        } else {
            this.toggleZyBtn.classList.add('active');
            document.querySelectorAll('idiv').forEach(idiv => {
                idiv.dataset.after2 = idiv.dataset.after;
                idiv.dataset.after = '';
            });
        }
    }

    // 題面渲染（含注音）
    renderPrompt(q) {
        this.emojiEl.textContent = q.emo;
        const rubyPairs = q.n.map((char, index) => `
<idiv data-after="${this.showZhuyin ? q.nz[index] : ''}" data-after2="${this.showZhuyin ? '' : q.nz[index]}">${char}</idiv>
        `);
        this.nounEl.innerHTML = rubyPairs.join('');
        if (!this.showEmoji) this.emojiEl.classList.add('hidden-content');
        else this.emojiEl.classList.remove('hidden-content');
    }

    // 產生一題
    newQuestion() {
        // 清除任何正在進行的自動跳題計時器
        if (this.autoNextTimer) {
            clearTimeout(this.autoNextTimer);
            this.autoNextTimer = null;
        }

        this.lock = false;
        this.feedbackEl.textContent = '';
        this.feedbackEl.className = 'feedback';

        // 避免連續同題
        let idx;
        do { idx = this.rnd(MeasureQuizGame.DATA.length); } while (idx === this.usedIndex && MeasureQuizGame.DATA.length > 1);
        this.usedIndex = idx;
        this.current = MeasureQuizGame.DATA[idx];

        this.renderPrompt(this.current);

        // 正解量詞物件
        const correct = { han: this.current.m, zy: this.current.mz };

        // 生成選項（正解 + 3 干擾），並洗牌
        const options = [correct, ...this.pickDistractors(correct, 3)]
            .sort(() => Math.random() - 0.5);

        // 以事件委派方式繪製按鈕，避免逐一綁定閉包
        this.optsEl.innerHTML = options.map(op => `
<button class="opt" data-han="${op.han}" data-zy="${op.zy}">
  <div style="margin: 0 auto;" class="dummy2 tb v after">
    <div class="ansBtn">
      <idiv data-after="${this.showZhuyin ? op.zy : ''}" data-after2="${this.showZhuyin ? '' : op.zy}">${op.han}</idiv>
    </div>
  </div>
</button>
        `).join('');
    }

    // 事件委派：處理選項點擊
    handleOptionClick(e) {
        const btn = e.target.closest('button.opt');
        if (!btn || !this.optsEl.contains(btn)) return;
        if (this.lock) return;
        const selHan = btn.getAttribute('data-han');
        this.choose(selHan, btn);
    }

    // 作答
    choose(selHan, btn) {
        if (this.lock) return;
        this.lock = true;

        if (this.autoNextTimer) {
            clearTimeout(this.autoNextTimer);
            this.autoNextTimer = null;
        }

        // 預設為未取消；若之後使用者按了 next/reset，會設為已取消
        this.autoNextCancelled = false;

        const correct = { han: this.current.m, zy: this.current.mz };
        const isOk = selHan === correct.han;
        if (isOk) {
            this.score++; this.streak++;
            this.scoreEl.textContent = this.score;
            this.streakEl.textContent = this.streak;
            this.feedbackEl.textContent = '太棒了！答對了👏';
            this.feedbackEl.className = 'feedback ok';
            btn.classList.add('correct');
            // 播放音效完成後再安排 1.3 秒自動下一題（加入取消與防呆檢查）
            this.beep(true).finally(() => {
                if (this.autoNextCancelled) return; // 在 beep 結束前就被 next/reset 取消
                this.autoNextTimer = setTimeout(() => {
                    if (this.autoNextCancelled) return; // 在計時過程中被 next/reset 取消
                    this.autoNextTimer = null;
                    this.newQuestion();
                }, 1300);
            });
        } else {
            this.streak = 0;
            this.streakEl.textContent = this.streak;
            this.feedbackEl.innerHTML = `
  再想想～正確量詞是：
  <span class="dummy2 tb v after">
    <span style="font-size: 26px;">
      <idiv data-after="${this.showZhuyin ? correct.zy : ''}" data-after2="${this.showZhuyin ? '' : correct.zy}">${correct.han}</idiv>
    </span>
  </span>
            `;
            this.feedbackEl.className = 'feedback no';
            btn.classList.add('wrong');
            // 高亮正解（選項中唯一對應的 han）
            const rightBtn = this.optsEl.querySelector(`button.opt[data-han="${CSS.escape(correct.han)}"]`);
            if (rightBtn) rightBtn.classList.add('correct');
            // 播放錯誤音效（不自動跳題）
            this.beep(false).catch(() => {});
        }
    }

    // 隨機選擇鼓勵話語
    setRandomEncourageMessage() {
        const randomIndex = this.rnd(MeasureQuizGame.ENCOURAGE_MESSAGES.length);
        this.encourageTextEl.textContent = MeasureQuizGame.ENCOURAGE_MESSAGES[randomIndex];
    }

    // 事件：開始／下一題／重置
    start() {
        // 初始化音頻上下文（需要用戶互動才能啟動）
        this.initAudioContext();

        this.score = 0; this.streak = 0;
        this.scoreEl.textContent = this.score;
        this.streakEl.textContent = this.streak;

        // 隱藏歡迎訊息，顯示提示區塊
        this.welcomeMessageEl.classList.add('hidden');
        this.promptEl.classList.remove('hidden');

        // 隱藏開始按鈕，顯示其他控制按鈕
        this.startBtn.classList.add('hidden');
        this.nextBtn.classList.remove('hidden');
        this.toggleEmojiBtn.classList.remove('hidden');
        this.toggleZyBtn.classList.remove('hidden');
        this.resetBtn.classList.remove('hidden');

        this.newQuestion();
    }

    next() {
        // 先取消任何待排程/已排程的自動下一題
        this.autoNextCancelled = true;
        if (this.autoNextTimer) {
            console.log("🚀 ~ MeasureQuizGame ~ next ~ clearTimeout:");
            clearTimeout(this.autoNextTimer);
            this.autoNextTimer = null;
        }
        this.newQuestion();
    }

    reset() {
        // 先取消任何待排程/已排程的自動下一題
        this.autoNextCancelled = true;
        if (this.autoNextTimer) {
            console.log("🚀 ~ MeasureQuizGame ~ next ~ clearTimeout:");
            clearTimeout(this.autoNextTimer);
            this.autoNextTimer = null;
        }

        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend().catch(e => console.warn('Failed to suspend audio context:', e));
        }

        this.score = 0; this.streak = 0;
        this.scoreEl.textContent = this.score;
        this.streakEl.textContent = this.streak;
        this.feedbackEl.textContent = '';
        this.feedbackEl.className = 'feedback';
        this.lock = false;

        this.welcomeMessageEl.classList.remove('hidden');
        this.promptEl.classList.add('hidden');

        this.setRandomEncourageMessage();

        this.startBtn.classList.remove('hidden');
        this.nextBtn.classList.add('hidden');
        this.toggleEmojiBtn.classList.add('hidden');
        this.toggleZyBtn.classList.add('hidden');
        this.resetBtn.classList.add('hidden');

        this.showEmoji = true;
        this.showZhuyin = true;
        this.toggleEmojiBtn.classList.remove('active');
        this.toggleZyBtn.classList.remove('active');

        this.emojiEl.textContent = '';
        this.emojiEl.classList.remove('hidden-content');
        this.nounEl.innerHTML = '';
        this.optsEl.innerHTML = '';
    }

    // 可選：解除事件與資源，若未來需要銷毀實例
    destroy() {
        if (this.autoNextTimer) {
            clearTimeout(this.autoNextTimer);
            this.autoNextTimer = null;
        }
        this.startBtn.removeEventListener('click', this.onStart);
        this.nextBtn.removeEventListener('click', this.onNext);
        this.resetBtn.removeEventListener('click', this.onReset);
        this.toggleEmojiBtn.removeEventListener('click', this.onToggleEmoji);
        this.toggleZyBtn.removeEventListener('click', this.onToggleZhuyin);
        this.optsEl.removeEventListener('click', this.onOptionClick);
        if (this.audioContext) {
            try { this.audioContext.close(); } catch {}
            this.audioContext = null;
        }
    }
}

// 啟動單一實例，避免重複實例化造成事件重複綁定
(() => {
    const init = () => {
        if (!window.__measureQuizGame__) {
            window.__measureQuizGame__ = new MeasureQuizGame();
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();