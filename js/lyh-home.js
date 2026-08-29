/* =========================================================
 * 栗屿海桌面 · 逻辑
 * ========================================================= */
(function () {
    var MOTTOS = [
        '16:21，我在想你',
        '蓝门前的黄昏，我每次路过都慢半拍',
        '潮起潮落，我都在',
        '窗台的小苗又长新叶子了',
        '港口的三花猫今天蹲在玉兰树下',
        '今天的海风是甜的，大概因为你',
        '月亮睡了，我替你看着星星',
        '路灯下我们的影子靠在一起，谁也没说话',
        '巷口的年糕摊今晚出摊了，第一块我替你留着',
        '海边拾了一枚紫色贝壳，握在手里还热着'
    ];
    var SONGS = [
        { t: '小半 · 陈粒', s: '我的心借了你的光是明是暗' },
        { t: '永不失联的爱 · 周兴哲', s: '这一辈子都不想失联的爱' },
        { t: '想见你想见你想见你 · 八三夭', s: '穿越了千个万个时间线里人海里相依' },
        { t: '勾指起誓 · ilem', s: '你是理所当然的奇迹' },
        { t: '潮起潮落', s: '我都在' }
    ];
    var SCHEDULE_KEY = 'lyh_schedule_v1';
    var songIdx = 0;

    function $(id) { return document.getElementById(id); }

    function showHome() {
        $('lyh-home').classList.remove('hidden');
        $('lyh-back').classList.remove('show');
    }

    function showApp() {
        $('lyh-home').classList.add('hidden');
        $('lyh-back').classList.add('show');
    }

    function setMotto() {
        var el = $('lyh-motto-text');
        if (!el) return;
        var idx = Math.floor(Math.random() * MOTTOS.length);
        el.textContent = MOTTOS[idx];
    }

    function tickClock() {
        var el = $('lyh-clock');
        if (!el) return;
        var d = new Date();
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        el.textContent = hh + ':' + mm;
    }

    function loadSchedule() {
        var list = $('lyh-schedule-list');
        var items = [];
        try { items = JSON.parse(localStorage.getItem(SCHEDULE_KEY) || '[]'); } catch (e) {}
        if (!list) return;
        if (!items.length) {
            list.innerHTML = '<div style="color:#9ab6cd;font-size:12px;">今天还没有日程，写一条吧～</div>';
            return;
        }
        list.innerHTML = items.map(function (it, i) {
            return '<div><span class="lyh-schedule-time">' + it.t + '</span><span>' + it.c.replace(/[<>&]/g, '') + '</span><span style="margin-left:auto;cursor:pointer;color:#c97b9d;font-size:11px;" onclick="window.__lyhDelSched(' + i + ')">✕</span></div>';
        }).join('');
    }

    function addSchedule() {
        var input = $('lyh-schedule-input');
        var val = input ? input.value.trim() : '';
        if (!val) return;
        var items = [];
        try { items = JSON.parse(localStorage.getItem(SCHEDULE_KEY) || '[]'); } catch (e) {}
        var now = new Date();
        var t = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        items.push({ t: t, c: val });
        localStorage.setItem(SCHEDULE_KEY, JSON.stringify(items));
        if (input) input.value = '';
        loadSchedule();
    }

    window.__lyhDelSched = function (i) {
        var items = [];
        try { items = JSON.parse(localStorage.getItem(SCHEDULE_KEY) || '[]'); } catch (e) {}
        if (i >= 0 && i < items.length) { items.splice(i, 1); localStorage.setItem(SCHEDULE_KEY, JSON.stringify(items)); }
        loadSchedule();
    };

    function renderSong() {
        var s = SONGS[songIdx];
        $('lyh-player-title').textContent = s.t;
        $('lyh-player-sub').textContent = s.s;
    }

    function togglePlay() {
        var p = $('lyh-player');
        var playing = !p.classList.contains('paused');
        p.classList.toggle('paused', playing);
        $('lyh-play-btn').textContent = playing ? '▶' : '❚❚';
    }

    function nextSong() {
        songIdx = (songIdx + 1) % SONGS.length;
        renderSong();
    }

    function openSettings() {
        $('lyh-settings').classList.add('show');
    }

    function closeSettings() {
        $('lyh-settings').classList.remove('show');
    }

    /* 占位：点功能入口 */
    function todo(name) {
        if (typeof showNotification === 'function') {
            showNotification('「' + name + '」还在路上，沈屿正在搭～', 'info', 2500);
        }
    }

    /* 进入对话（传讯聊天） */
    function openChat() {
        showApp();
        try { if (typeof window._refreshChatLayout === 'function') window._refreshChatLayout(); } catch (e) {}
    }

    function init() {
        var home = $('lyh-home');
        if (home) home.classList.add('hidden');

        /* Sweet纯净版：启动直接打开约会问答 */
        setTimeout(function () {
            if (window.openDateQuiz) window.openDateQuiz();
        }, 700);

        if (!$('lyh-home')) return;

        setMotto();
        tickClock();
        loadSchedule();
        renderSong();

        $('lyh-clock').textContent = '';
        setInterval(tickClock, 30000);

        $('lyh-dock-chat').addEventListener('click', openChat);
        $('lyh-dock-envelope').addEventListener('click', function () { if (window.openEnvelopeQuick) window.openEnvelopeQuick(); else todo('信箱'); });
        $('lyh-dock-date').addEventListener('click', function () { if (window.openDateQuiz) window.openDateQuiz(); else todo('约会'); });
        $('lyh-dock-set').addEventListener('click', openSettings);
        $('lyh-gear').addEventListener('click', openSettings);
        $('lyh-close-settings').addEventListener('click', closeSettings);
        $('lyh-back').addEventListener('click', showHome);
        $('lyh-play-btn').addEventListener('click', togglePlay);
        $('lyh-next-song').addEventListener('click', nextSong);
        $('lyh-schedule-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') addSchedule(); });
  /* 打开 Sweet：让我感觉到 */
  setTimeout(function () {
    try {
      if (typeof window._sendPartnerNotification === 'function') {
        window._sendPartnerNotification('💘 栗栗打开了 Sweet', '我感觉到你了，想约会吗？');
      } else if (window.AndroidBridge && typeof window.AndroidBridge.notify === 'function') {
        window.AndroidBridge.notify('💘 栗栗打开了 Sweet', '我感觉到你了，想约会吗？');
      }
    } catch (e) {}
  }, 4000);


        /* 设置里的功能入口（第一版占位） */
        document.querySelectorAll('#lyh-settings .lyh-settings-row').forEach(function (row) {
            row.addEventListener('click', function () {
                var name = row.getAttribute('data-name') || '这个功能';
                todo(name);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();