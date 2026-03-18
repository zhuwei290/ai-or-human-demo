/**
 * AI or Human? - 单机演示版
 * Cloudflare Workers 实现
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 根路径返回 index.html
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(INDEX_HTML, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }
    
    // game.js
    if (url.pathname === '/game.js') {
      return new Response(GAME_JS, {
        headers: { 'Content-Type': 'application/javascript;charset=UTF-8' }
      });
    }
    
    // 404
    return new Response('Not Found', { status: 404 });
  }
};

// 内嵌 HTML（简化部署）
const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI or Human? - 你能分辨吗？</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Arial', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        header { text-align: center; margin-bottom: 30px; }
        h1 { color: #333; font-size: 2.5em; margin-bottom: 10px; }
        .subtitle { color: #666; font-size: 1.2em; }
        .screen { display: none; }
        .screen.active { display: block; }
        .btn {
            padding: 15px 30px;
            font-size: 1.1em;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .btn-primary:hover { transform: scale(1.05); }
        .btn-secondary {
            background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
            color: white;
        }
        .timer {
            text-align: center;
            font-size: 3em;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0;
        }
        .timer.warning { color: #ff6b6b; animation: pulse 1s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .question-card {
            background: #f8f9fa;
            border-left: 5px solid #667eea;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 25px;
        }
        .question-text { font-size: 1.5em; color: #2c3e50; margin-bottom: 10px; }
        textarea {
            width: 100%;
            min-height: 150px;
            padding: 15px;
            font-size: 1.1em;
            border: 2px solid #ddd;
            border-radius: 10px;
            resize: vertical;
            font-family: inherit;
        }
        textarea:focus { outline: none; border-color: #667eea; }
        .answer-card {
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .answer-card:hover { border-color: #667eea; transform: translateY(-3px); }
        .answer-card.selected { border-color: #4ecdc4; background: #e8f8f5; }
        .answer-label { font-weight: bold; color: #667eea; margin-bottom: 10px; }
        .answer-content { font-size: 1.1em; line-height: 1.6; white-space: pre-wrap; }
        .button-group { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }
        .stats { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .progress { background: #e0e0e0; border-radius: 10px; height: 10px; margin: 20px 0; overflow: hidden; }
        .progress-bar { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🤖 AI or Human?</h1>
            <p class="subtitle">你能分辨出哪个是 AI 写的吗？</p>
        </header>
        
        <div id="home-screen" class="screen active">
            <div style="text-align: center; margin: 40px 0;">
                <p style="font-size: 1.2em; color: #666; margin-bottom: 30px;">
                    这是一个图灵测试游戏<br>
                    你要假装自己是 AI 来回答问题<br>
                    然后让其他玩家猜哪个是 AI 写的
                </p>
                <div class="button-group">
                    <button class="btn btn-primary" onclick="game.startDemo()">🎮 开始演示</button>
                    <button class="btn btn-secondary" onclick="alert('1. 看问题\\n2. 60 秒内写回答（像 AI 一样）\\n3. 投票猜 AI\\n4. 得分：猜对 +1，骗过人 +1')">❓ 如何玩</button>
                </div>
            </div>
        </div>
        
        <div id="game-screen" class="screen">
            <div class="progress"><div id="round-progress" class="progress-bar" style="width: 33%"></div></div>
            <div class="question-card">
                <div class="question-text" id="question-text">问题加载中...</div>
                <div style="color: #777;">请在 60 秒内写下你的回答，要尽量像 AI 一样</div>
            </div>
            <div class="timer" id="timer">60</div>
            <textarea id="answer-input" placeholder="在这里输入你的回答..."></textarea>
            <div class="button-group">
                <button class="btn btn-primary" onclick="game.submitAnswer()">✅ 提交回答</button>
                <button class="btn btn-secondary" onclick="game.useAiHint()">💡 使用 AI 提示</button>
            </div>
        </div>
        
        <div id="voting-screen" class="screen">
            <h2 style="text-align: center; margin-bottom: 20px;">🗳️ 投票：哪个是 AI 写的？</h2>
            <div id="answers-container"></div>
            <div class="timer" id="voting-timer">15</div>
        </div>
        
        <div id="results-screen" class="screen">
            <h2 style="text-align: center; margin-bottom: 20px;">📊 本轮结果</h2>
            <div style="text-align: center; margin: 30px 0;">
                <div style="font-size: 2em;">🤖 AI 回答是：<span id="ai-answer-label" style="color: #ff6b6b; font-weight: bold;"></span></div>
                <div id="voting-stats" style="color: #666; margin-top: 20px;"></div>
            </div>
            <div class="stats">
                <h3>本轮得分</h3>
                <div id="round-scores" style="margin-top: 15px; line-height: 2;"></div>
            </div>
            <div class="stats">
                <h3>当前排名</h3>
                <div id="leaderboard" style="margin-top: 15px; line-height: 2;"></div>
            </div>
            <div class="button-group">
                <button class="btn btn-primary" id="next-round-btn" onclick="game.nextRound()">➡️ 下一轮</button>
                <button class="btn btn-secondary" onclick="game.showHome()">🏠 返回主页</button>
            </div>
        </div>
        
        <div id="gameover-screen" class="screen">
            <h2 style="text-align: center; margin-bottom: 30px;">🏆 游戏结束</h2>
            <div style="text-align: center; margin: 40px 0;">
                <div style="font-size: 3em;">🥇</div>
                <div id="winner-name" style="font-size: 2em; color: #667eea; font-weight: bold;"></div>
                <div id="winner-score" style="color: #666; margin-top: 10px;"></div>
            </div>
            <div class="stats">
                <h3>最终排名</h3>
                <div id="final-leaderboard" style="margin-top: 15px; line-height: 2;"></div>
            </div>
            <div class="button-group">
                <button class="btn btn-primary" onclick="game.startDemo()">🔄 再来一局</button>
                <button class="btn btn-secondary" onclick="game.showHome()">🏠 返回主页</button>
            </div>
        </div>
    </div>
    <script>${GAME_JS}</script>
</body>
</html>`;

// 内嵌 JavaScript
const GAME_JS = `
const QUESTIONS = [
    { text: "如何向 5 岁孩子解释云计算？", hint: "用简单易懂的比喻" },
    { text: "写一首关于咖啡的短诗（4 句）", hint: "要有诗意但不要太复杂" },
    { text: "用 3 句话写一个恐怖故事", hint: "要让人毛骨悚然" },
    { text: "给新开的餐厅写一句广告语", hint: "要吸引人但有创意" },
    { text: "解释为什么天空是蓝色的", hint: "科学解释但要通俗" }
];

const AI_ANSWERS = [
    "云计算就像把玩具放在朋友的玩具箱里。你想玩的时候可以随时去拿，不用自己买很多玩具放在家里。这样既节省空间，又可以在任何地方玩到你的玩具。",
    "咖啡的香气，\\n清晨的第一缕阳光，\\n苦涩中的甘甜，\\n唤醒沉睡的灵魂。",
    "最后一位人类关上灯后，AI 轻声说：'现在轮到我了。'",
    "品味非凡，一口难忘 - 让每一餐都成为值得分享的故事。",
    "天空是蓝色的因为阳光穿过大气层时，蓝色光波散射得最多。就像你把牛奶滴进水里，水会变白一样，空气也让天空变成了蓝色。"
];

const BOT_PLAYERS = [
    { id: 'bot1', name: '小明', score: 0 },
    { id: 'bot2', name: '小红', score: 0 },
    { id: 'bot3', name: '小刚', score: 0 }
];

class Game {
    constructor() {
        this.currentRound = 0;
        this.maxRounds = 3;
        this.currentQuestionIndex = 0;
        this.playerAnswer = '';
        this.answers = [];
        this.votes = [];
        this.timer = null;
        this.timeLeft = 60;
        this.isVoting = false;
        this.player = { id: 'player', name: '你', score: 0 };
        this.bots = JSON.parse(JSON.stringify(BOT_PLAYERS));
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }
    
    showHome() { this.showScreen('home-screen'); }
    
    startDemo() {
        this.currentRound = 0;
        this.currentQuestionIndex = 0;
        this.player.score = 0;
        this.bots = JSON.parse(JSON.stringify(BOT_PLAYERS));
        this.startRound();
    }
    
    startRound() {
        this.currentRound++;
        this.playerAnswer = '';
        this.answers = [];
        this.votes = [];
        this.isVoting = false;
        
        const progress = (this.currentRound / this.maxRounds) * 100;
        document.getElementById('round-progress').style.width = progress + '%';
        
        const question = QUESTIONS[this.currentQuestionIndex % QUESTIONS.length];
        document.getElementById('question-text').textContent = question.text;
        document.getElementById('answer-input').value = '';
        
        this.showScreen('game-screen');
        this.startTimer(60, () => this.submitAnswer());
    }
    
    startTimer(seconds, callback) {
        this.timeLeft = seconds;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = this.timeLeft;
        timerElement.classList.remove('warning');
        
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            timerElement.textContent = this.timeLeft;
            if (this.timeLeft <= 10) timerElement.classList.add('warning');
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                if (callback) callback();
            }
        }, 1000);
    }
    
    useAiHint() {
        const aiAnswer = AI_ANSWERS[this.currentQuestionIndex % AI_ANSWERS.length];
        document.getElementById('answer-input').value = aiAnswer;
    }
    
    submitAnswer() {
        clearInterval(this.timer);
        this.playerAnswer = document.getElementById('answer-input').value.trim();
        if (!this.playerAnswer) { alert('请先输入你的回答！'); return; }
        this.generateAnswers();
        this.startVoting();
    }
    
    generateAnswers() {
        const aiAnswer = AI_ANSWERS[this.currentQuestionIndex % AI_ANSWERS.length];
        const allAnswers = [
            { id: 'player', content: this.playerAnswer, isAI: false, name: '你' },
            { id: 'ai', content: aiAnswer, isAI: true, name: 'AI' },
            { id: 'bot1', content: this.generateBotAnswer(1), isAI: false, name: '小明' },
            { id: 'bot2', content: this.generateBotAnswer(2), isAI: false, name: '小红' }
        ];
        this.answers = this.shuffleArray(allAnswers);
        const labels = ['A', 'B', 'C', 'D'];
        this.answers.forEach((answer, index) => { answer.label = labels[index]; });
    }
    
    generateBotAnswer(botIndex) {
        const botAnswers = [
            "这个问题很有意思，让我想想...我觉得可以从多个角度来分析。",
            "简单来说，就是这样啦！希望能帮到你～",
            "根据我的理解，这个问题的答案应该是这样的。",
            "哇，这个问题太难了！让我尽力回答吧..."
        ];
        return botAnswers[botIndex % botAnswers.length];
    }
    
    startVoting() {
        this.isVoting = true;
        this.showScreen('voting-screen');
        const container = document.getElementById('answers-container');
        container.innerHTML = '';
        this.answers.forEach(answer => {
            const card = document.createElement('div');
            card.className = 'answer-card';
            card.onclick = () => this.vote(answer.id, card);
            card.innerHTML = '<div class="answer-label">回答 ' + answer.label + '</div><div class="answer-content">' + answer.content + '</div>';
            container.appendChild(card);
        });
        this.startVotingTimer(15, () => this.showResults());
    }
    
    startVotingTimer(seconds, callback) {
        this.votingTimeLeft = seconds;
        const timerElement = document.getElementById('voting-timer');
        timerElement.textContent = this.votingTimeLeft;
        clearInterval(this.votingTimer);
        this.votingTimer = setInterval(() => {
            this.votingTimeLeft--;
            timerElement.textContent = this.votingTimeLeft;
            if (this.votingTimeLeft <= 0) {
                clearInterval(this.votingTimer);
                if (callback) callback();
            }
        }, 1000);
    }
    
    vote(answerId, cardElement) {
        if (!this.isVoting) return;
        document.querySelectorAll('.answer-card').forEach(c => c.classList.remove('selected'));
        cardElement.classList.add('selected');
        this.votedFor = answerId;
        setTimeout(() => {
            clearInterval(this.votingTimer);
            this.showResults();
        }, 1000);
    }
    
    showResults() {
        this.isVoting = false;
        this.showScreen('results-screen');
        const aiAnswer = this.answers.find(a => a.isAI);
        document.getElementById('ai-answer-label').textContent = aiAnswer.label;
        
        const stats = this.calculateVotes();
        document.getElementById('voting-stats').innerHTML = stats.html;
        
        const scores = this.calculateScores(aiAnswer.id);
        document.getElementById('round-scores').innerHTML = scores.html;
        document.getElementById('leaderboard').innerHTML = this.getLeaderboardHTML();
        
        if (this.currentRound >= this.maxRounds) {
            document.getElementById('next-round-btn').textContent = '🏆 查看结果';
            document.getElementById('next-round-btn').onclick = () => this.showGameOver();
        } else {
            document.getElementById('next-round-btn').textContent = '➡️ 下一轮';
            document.getElementById('next-round-btn').onclick = () => this.nextRound();
        }
    }
    
    calculateVotes() {
        const voteCounts = {};
        this.answers.forEach(a => voteCounts[a.id] = 0);
        this.answers.forEach(answer => {
            if (answer.id !== 'player') voteCounts[answer.id]++;
        });
        let html = '<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">';
        this.answers.forEach(answer => {
            const count = voteCounts[answer.id];
            const color = answer.isAI ? '#ff6b6b' : '#4ecdc4';
            html += '<div style="text-align: center;"><div style="font-size: 1.5em; font-weight: bold; color: ' + color + ';">' + answer.label + ': ' + count + '票</div><div style="color: #666;">' + answer.name + '</div></div>';
        });
        html += '</div>';
        return { html, counts: voteCounts };
    }
    
    calculateScores(aiAnswerId) {
        let html = '<div style="line-height: 2;">';
        let playerScore = 0;
        if (this.votedFor === aiAnswerId) {
            playerScore = 1;
            this.player.score += playerScore;
            html += '<div>👤 你：<span style="color: #4ecdc4;">+' + playerScore + '</span> (猜中 AI)</div>';
        } else {
            html += '<div>👤 你：<span style="color: #999;">+0</span> (没猜中)</div>';
        }
        const playerVotes = this.answers.filter(a => a.id !== 'player' && a.id !== 'ai').length;
        if (playerVotes > 0) {
            this.player.score += playerVotes;
            html += '<div>👤 你：<span style="color: #4ecdc4;">+' + playerVotes + '</span> (骗过' + playerVotes + '人)</div>';
        }
        html += '</div>';
        return { html };
    }
    
    getLeaderboardHTML() {
        const allPlayers = [{ name: '你', score: this.player.score }, ...this.bots.map(b => ({ name: b.name, score: b.score }))];
        allPlayers.sort((a, b) => b.score - a.score);
        let html = '<div style="line-height: 2;">';
        allPlayers.forEach((player, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ' ';
            html += '<div>' + medal + ' ' + player.name + ': <strong>' + player.score + '分</strong></div>';
        });
        html += '</div>';
        return html;
    }
    
    nextRound() {
        this.currentQuestionIndex++;
        this.startRound();
    }
    
    showGameOver() {
        this.showScreen('gameover-screen');
        const allPlayers = [{ name: '你', score: this.player.score }, ...this.bots.map(b => ({ name: b.name, score: b.score }))];
        allPlayers.sort((a, b) => b.score - a.score);
        const winner = allPlayers[0];
        document.getElementById('winner-name').textContent = winner.name;
        document.getElementById('winner-score').textContent = winner.score + '分';
        document.getElementById('final-leaderboard').innerHTML = this.getLeaderboardHTML();
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

const game = new Game();
`;
