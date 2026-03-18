/**
 * AI or Human? - 单机演示版
 * 游戏逻辑
 */

// 问题库
const QUESTIONS = [
    {
        text: "如何向 5 岁孩子解释云计算？",
        hint: "用简单易懂的比喻"
    },
    {
        text: "写一首关于咖啡的短诗（4 句）",
        hint: "要有诗意但不要太复杂"
    },
    {
        text: "用 3 句话写一个恐怖故事",
        hint: "要让人毛骨悚然"
    },
    {
        text: "给新开的餐厅写一句广告语",
        hint: "要吸引人但有创意"
    },
    {
        text: "解释为什么天空是蓝色的",
        hint: "科学解释但要通俗"
    }
];

// AI 生成的示例回答
const AI_ANSWERS = [
    "云计算就像把玩具放在朋友的玩具箱里。你想玩的时候可以随时去拿，不用自己买很多玩具放在家里。这样既节省空间，又可以在任何地方玩到你的玩具。",
    "咖啡的香气，\n清晨的第一缕阳光，\n苦涩中的甘甜，\n唤醒沉睡的灵魂。",
    "最后一位人类关上灯后，AI 轻声说：'现在轮到我了。'",
    "品味非凡，一口难忘 - 让每一餐都成为值得分享的故事。",
    "天空是蓝色的因为阳光穿过大气层时，蓝色光波散射得最多。就像你把牛奶滴进水里，水会变白一样，空气也让天空变成了蓝色。"
];

// 模拟玩家
const BOT_PLAYERS = [
    { id: 'bot1', name: '小明', score: 0 },
    { id: 'bot2', name: '小红', score: 0 },
    { id: 'bot3', name: '小刚', score: 0 }
];

// 游戏状态
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
        
        // 玩家
        this.player = {
            id: 'player',
            name: '你',
            score: 0
        };
        
        this.bots = JSON.parse(JSON.stringify(BOT_PLAYERS));
    }
    
    // 显示屏幕
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    // 显示主页
    showHome() {
        this.showScreen('home-screen');
    }
    
    // 显示游戏说明
    showHowToPlay() {
        this.showScreen('howto-screen');
    }
    
    // 开始演示游戏
    startDemo() {
        this.currentRound = 0;
        this.currentQuestionIndex = 0;
        this.player.score = 0;
        this.bots = JSON.parse(JSON.stringify(BOT_PLAYERS));
        this.startRound();
    }
    
    // 开始一轮
    startRound() {
        this.currentRound++;
        this.playerAnswer = '';
        this.answers = [];
        this.votes = [];
        this.isVoting = false;
        
        // 更新进度条
        const progress = (this.currentRound / this.maxRounds) * 100;
        document.getElementById('round-progress').style.width = `${progress}%`;
        
        // 显示问题
        const question = QUESTIONS[this.currentQuestionIndex % QUESTIONS.length];
        document.getElementById('question-text').textContent = question.text;
        
        // 清空输入框
        document.getElementById('answer-input').value = '';
        
        // 显示游戏界面
        this.showScreen('game-screen');
        
        // 启动倒计时
        this.startTimer(60, () => {
            this.submitAnswer();
        });
    }
    
    // 启动倒计时
    startTimer(seconds, callback) {
        this.timeLeft = seconds;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = this.timeLeft;
        timerElement.classList.remove('warning');
        
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            timerElement.textContent = this.timeLeft;
            
            if (this.timeLeft <= 10) {
                timerElement.classList.add('warning');
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                if (callback) callback();
            }
        }, 1000);
    }
    
    // 使用 AI 提示
    useAiHint() {
        const aiAnswer = AI_ANSWERS[this.currentQuestionIndex % AI_ANSWERS.length];
        document.getElementById('answer-input').value = aiAnswer;
    }
    
    // 提交回答
    submitAnswer() {
        clearInterval(this.timer);
        this.playerAnswer = document.getElementById('answer-input').value.trim();
        
        if (!this.playerAnswer) {
            alert('请先输入你的回答！');
            return;
        }
        
        // 生成所有回答（包括 AI 的）
        this.generateAnswers();
        
        // 进入投票阶段
        this.startVoting();
    }
    
    // 生成回答
    generateAnswers() {
        const aiAnswer = AI_ANSWERS[this.currentQuestionIndex % AI_ANSWERS.length];
        
        // 创建回答列表
        const allAnswers = [
            { id: 'player', content: this.playerAnswer, isAI: false, name: '你' },
            { id: 'ai', content: aiAnswer, isAI: true, name: 'AI' },
            { id: 'bot1', content: this.generateBotAnswer(1), isAI: false, name: '小明' },
            { id: 'bot2', content: this.generateBotAnswer(2), isAI: false, name: '小红' }
        ];
        
        // 随机打乱
        this.answers = this.shuffleArray(allAnswers);
        
        // 为每个回答分配字母标签
        const labels = ['A', 'B', 'C', 'D'];
        this.answers.forEach((answer, index) => {
            answer.label = labels[index];
        });
    }
    
    // 生成模拟玩家回答
    generateBotAnswer(botIndex) {
        const botAnswers = [
            "这个问题很有意思，让我想想...我觉得可以从多个角度来分析。首先，我们需要理解问题的本质。其次，要考虑各种可能的情况。最后，给出一个综合的答案。",
            "简单来说，就是这样啦！希望能帮到你～",
            "根据我的理解，这个问题的答案应该是这样的。不过我也不是专家，仅供参考哦。",
            "哇，这个问题太难了！让我尽力回答吧..."
        ];
        return botAnswers[botIndex % botAnswers.length];
    }
    
    // 开始投票
    startVoting() {
        this.isVoting = true;
        this.showScreen('voting-screen');
        
        // 显示所有回答
        const container = document.getElementById('answers-container');
        container.innerHTML = '';
        
        this.answers.forEach(answer => {
            const card = document.createElement('div');
            card.className = 'answer-card';
            card.onclick = () => this.vote(answer.id, card);
            card.innerHTML = `
                <div class="answer-label">回答 ${answer.label}</div>
                <div class="answer-content">${answer.content}</div>
            `;
            container.appendChild(card);
        });
        
        // 启动投票倒计时
        this.startVotingTimer(15, () => {
            this.showResults();
        });
    }
    
    // 投票倒计时
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
    
    // 投票
    vote(answerId, cardElement) {
        if (!this.isVoting) return;
        
        // 清除其他选择
        document.querySelectorAll('.answer-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        // 选中当前
        cardElement.classList.add('selected');
        this.votedFor = answerId;
        
        // 延迟进入结果
        setTimeout(() => {
            clearInterval(this.votingTimer);
            this.showResults();
        }, 1000);
    }
    
    // 显示结果
    showResults() {
        this.isVoting = false;
        this.showScreen('results-screen');
        
        // 找到 AI 回答
        const aiAnswer = this.answers.find(a => a.isAI);
        document.getElementById('ai-answer-label').textContent = aiAnswer.label;
        
        // 计算投票统计
        const stats = this.calculateVotes();
        document.getElementById('voting-stats').innerHTML = stats.html;
        
        // 计算得分
        const scores = this.calculateScores(aiAnswer.id);
        document.getElementById('round-scores').innerHTML = scores.html;
        
        // 更新排行榜
        this.updateLeaderboard();
        document.getElementById('leaderboard').innerHTML = this.getLeaderboardHTML();
        
        // 检查是否是最后一轮
        if (this.currentRound >= this.maxRounds) {
            document.getElementById('next-round-btn').textContent = '🏆 查看结果';
            document.getElementById('next-round-btn').onclick = () => this.showGameOver();
        } else {
            document.getElementById('next-round-btn').textContent = '➡️ 下一轮';
            document.getElementById('next-round-btn').onclick = () => this.nextRound();
        }
    }
    
    // 计算投票统计
    calculateVotes() {
        const voteCounts = {};
        this.answers.forEach(a => voteCounts[a.id] = 0);
        
        // 模拟玩家投票
        this.answers.forEach(answer => {
            if (answer.id !== 'player') {
                voteCounts[answer.id]++;
            }
        });
        
        let html = '<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">';
        this.answers.forEach(answer => {
            const count = voteCounts[answer.id];
            const color = answer.isAI ? '#ff6b6b' : '#4ecdc4';
            html += `<div style="text-align: center;">
                <div style="font-size: 1.5em; font-weight: bold; color: ${color};">${answer.label}: ${count}票</div>
                <div style="color: #666;">${answer.name}</div>
            </div>`;
        });
        html += '</div>';
        
        return { html, counts: voteCounts };
    }
    
    // 计算得分
    calculateScores(aiAnswerId) {
        let html = '<div style="line-height: 2;">';
        
        // 玩家得分
        let playerScore = 0;
        if (this.votedFor === aiAnswerId) {
            playerScore = 1;
            this.player.score += playerScore;
            html += `<div>👤 你：<span style="color: #4ecdc4;">+${playerScore}</span> (猜中 AI)</div>`;
        } else {
            html += `<div>👤 你：<span style="color: #999;">+0</span> (没猜中)</div>`;
        }
        
        // 检查玩家是否骗过别人
        const playerAnswer = this.answers.find(a => a.id === 'player');
        const playerVotes = this.answers.filter(a => a.id !== 'player' && a.id !== 'ai').length;
        if (playerVotes > 0) {
            this.player.score += playerVotes;
            html += `<div>👤 你：<span style="color: #4ecdc4;">+${playerVotes}</span> (骗过${playerVotes}人)</div>`;
        }
        
        html += '</div>';
        return { html };
    }
    
    // 更新排行榜
    updateLeaderboard() {
        // 简单实现，实际应该更复杂
    }
    
    // 获取排行榜 HTML
    getLeaderboardHTML() {
        const allPlayers = [
            { name: '你', score: this.player.score },
            ...this.bots.map(b => ({ name: b.name, score: b.score }))
        ];
        
        allPlayers.sort((a, b) => b.score - a.score);
        
        let html = '<div style="line-height: 2;">';
        allPlayers.forEach((player, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ' ';
            html += `<div>${medal} ${player.name}: <strong>${player.score}分</strong></div>`;
        });
        html += '</div>';
        
        return html;
    }
    
    // 下一轮
    nextRound() {
        this.currentQuestionIndex++;
        this.startRound();
    }
    
    // 游戏结束
    showGameOver() {
        this.showScreen('gameover-screen');
        
        // 找出获胜者
        const allPlayers = [
            { name: '你', score: this.player.score },
            ...this.bots.map(b => ({ name: b.name, score: b.score }))
        ];
        
        allPlayers.sort((a, b) => b.score - a.score);
        const winner = allPlayers[0];
        
        document.getElementById('winner-name').textContent = winner.name;
        document.getElementById('winner-score').textContent = `${winner.score}分`;
        
        // 最终排名
        document.getElementById('final-leaderboard').innerHTML = this.getLeaderboardHTML();
    }
    
    // 随机打乱数组
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 初始化游戏
const game = new Game();
