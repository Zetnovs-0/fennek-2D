/* ==========================================================================
   ФЕНЁК · 2D — движок визуальной новеллы
   ========================================================================== */
(function () {
  'use strict';

  const S = window.FENNEK_STORY;
  const Art = window.Art2D;
  const Audio = window.AudioEngine;
  if (!S || !Art || !Audio) {
    console.error('Не загрузились модули истории/арта/звука');
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SAVE_KEY = 'fennek2d_save_v1';
  const SEEN_KEY = 'fennek2d_endings_v1';
  const STAT_KEYS = ['study', 'courage', 'family', 'bond'];
  const STAT_LABEL = { study: 'Учёба', courage: 'Смелость', family: 'Тепло', bond: 'Фенёк' };
  const STAT_MAX = 14;
  const HAIR_STYLES = ['short', 'bob', 'curls', 'pony'];
  const TONE_CHAR = { mom: 'mom', dad: 'dad', sister: 'sister', you: 'player' };
  const MOOD_LABEL = { warm: 'тёплая', cool: 'светлая', cold: 'тихая', amber: 'янтарная' };
  const RARE_ENDINGS = new Set(['second_try', 'own_path']);
  const DICE_NAMES = ['Алекс', 'Соня', 'Мика', 'Тимур', 'Ая', 'Ника', 'Саша', 'Кирилл', 'Лера', 'Даня', 'Юна', 'Марк', 'Ева', 'Рома', 'Ася', 'Лев', 'Майя', 'Илья'];
  const DREAM_ICONS = {
    arch: '<svg viewBox="0 0 24 24"><path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6M4 21h16M8 9h2M14 9h2"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5M13.5 5l-3 14"/></svg>',
    bio: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 3.7C19 15.6 12 20 12 20Z"/><path d="M7.8 12h2.4l1.2-2.4 1.7 4.6 1.2-2.2h2"/></svg>',
  };
  const STAT_ICONS = {
    study: '<svg viewBox="0 0 24 24"><path d="M4 6.2A2.2 2.2 0 0 1 6.2 4H20v15.2H6.2A2.2 2.2 0 0 0 4 21.4Z"/><path d="M4 6.2v15.2M8 8h8M8 11.5h6"/></svg>',
    courage: '<svg viewBox="0 0 24 24"><path d="M12 3c1 3.2 4.4 5 4.4 8.8A4.4 4.4 0 0 1 12 16.2a4.4 4.4 0 0 1-4.4-4.4C7.6 8 11 6.2 12 3Z"/><path d="M12 12.2c.7 1.7 2 2.4 2 4a2 2 0 0 1-4 0c0-1.6 1.3-2.3 2-4Z"/></svg>',
    family: '<svg viewBox="0 0 24 24"><path d="M12 20.2S4.5 15.7 4.5 10.4A4.2 4.2 0 0 1 12 7.1a4.2 4.2 0 0 1 7.5 3.3c0 5.3-7.5 9.8-7.5 9.8Z"/></svg>',
    bond: '<svg viewBox="0 0 24 24"><circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="7" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M12 20c-4.2 0-7-2.9-7-6.1 0-2.2 1.7-3.6 3.4-2.6 1.2.7 2.4 1.1 3.6 1.1s2.4-.4 3.6-1.1c1.7-1 3.4.4 3.4 2.6C19 17.1 16.2 20 12 20Z"/></svg>',
  };
  const HOTSPOT_MAP = {
    bedroom: ['photo_bedroom', 'desk', 'poster'],
    kitchen: ['photo_kitchen', 'fridge_note'],
    yard: ['fennec_box'],
    classroom: ['chalkboard'],
    livingroom: ['family_album'],
  };
  const FENNEC_NODES = new Set([
    'ch1_yard', 'leave_walk',
    'take_room', 'take_morning', 'take_montage', 'take_caught', 'take_eve', 'take_results', 'take_final',
    'leave_week', 'leave_montage', 'leave_eve', 'leave_results', 'leave_final',
  ]);

  /* ------------------------------------------------------------------ */
  /*  Утилиты состояния                                                 */
  /* ------------------------------------------------------------------ */
  function defaultLooks() {
    return { skin: 1, hair: 1, eye: 0, hairStyle: 'short', shirt: 0 };
  }

  function defaultState() {
    return {
      version: 2,
      name: 'Алекс',
      gender: 'm',
      dreamKey: 'arch',
      looks: defaultLooks(),
      stats: { study: 0, courage: 0, family: 0, bond: 0 },
      flags: {},
      fennecName: null,
      nodeId: S.STORY_START,
      chapter: { n: 1, title: 'Свой угол', sub: 'Дом. Вечер. Всё как всегда.' },
      location: 'Квартира · твоя комната',
      usedHotspots: [],
      log: [],
      startedAt: null,
    };
  }

  function sanitizeState(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const base = defaultState();
    const s = { ...base, ...raw };
    s.looks = { ...base.looks, ...(raw.looks && typeof raw.looks === 'object' ? raw.looks : {}) };
    s.looks.hairStyle = HAIR_STYLES.includes(s.looks.hairStyle) ? s.looks.hairStyle : 'short';
    s.looks.skin = clamp(Number(s.looks.skin) || 0, 0, Art.SKIN_TONES.length - 1);
    s.looks.hair = clamp(Number(s.looks.hair) || 0, 0, Art.HAIR_COLORS.length - 1);
    s.looks.eye = clamp(Number(s.looks.eye) || 0, 0, Art.EYE_COLORS.length - 1);
    s.looks.shirt = clamp(Number(s.looks.shirt) || 0, 0, Art.SHIRT_COLORS.length - 1);
    s.name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 16) : base.name;
    s.gender = raw.gender === 'f' ? 'f' : 'm';
    s.dreamKey = S.DREAMS[raw.dreamKey] ? raw.dreamKey : 'arch';
    s.stats = { ...base.stats, ...(raw.stats && typeof raw.stats === 'object' ? raw.stats : {}) };
    for (const k of STAT_KEYS) s.stats[k] = clamp(Number(s.stats[k]) || 0, 0, 99);
    s.flags = raw.flags && typeof raw.flags === 'object' ? { ...raw.flags } : {};
    s.usedHotspots = Array.isArray(raw.usedHotspots) ? raw.usedHotspots.filter((x) => typeof x === 'string') : [];
    s.log = Array.isArray(raw.log)
      ? raw.log
          .filter((x) => x && typeof x.text === 'string')
          .slice(-220)
          .map((x) => ({ who: String(x.who || ''), text: String(x.text).slice(0, 1200), chapter: String(x.chapter || '') }))
      : [];
    if (!S.NODES[s.nodeId]) s.nodeId = S.STORY_START;
    if (!s.chapter || typeof s.chapter.n !== 'number') s.chapter = { ...base.chapter };
    s.fennecName = typeof raw.fennecName === 'string' ? raw.fennecName.slice(0, 18) : null;
    s.startedAt = Number(raw.startedAt) || null;
    return s;
  }

  function baseLayout(layout) {
    if (!layout) return '';
    if (layout.startsWith('bedroom')) return 'bedroom';
    if (layout.startsWith('kitchen')) return 'kitchen';
    return layout;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ------------------------------------------------------------------ */
  /*  Звук и частицы                                                    */
  /* ------------------------------------------------------------------ */
  const FX_THEMES = {
    sakura: { colors: ['#f6bcc8', '#e9a1b4', '#f3d3b2', '#fff1d4'], count: 36, kind: 'petal' },
    dust: { colors: ['#ffe9c7', '#f5d9bb', '#fff6e6'], count: 26, kind: 'dust' },
    night: { colors: ['#ffe6a3', '#ffd987', '#fff2c4'], count: 26, kind: 'firefly' },
    leaves: { colors: ['#d69a6d', '#c27c5f', '#e3b285'], count: 26, kind: 'leaf' },
    rain: { colors: ['#b9c8d9', '#dbe4ee'], count: 34, kind: 'rain' },
    snow: { colors: ['#e9eff7', '#ffffff', '#c9d6e6'], count: 40, kind: 'snow' },
    warm: { colors: ['#ffe0aa', '#f5b98e', '#fff3d2'], count: 28, kind: 'firefly' },
  };

  class Fx {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.parts = [];
      this.theme = 'sakura';
      this.raf = null;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.resize = this.resize.bind(this);
      this.tick = this.tick.bind(this);
      window.addEventListener('resize', this.resize);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stop();
        else this.start();
      });
      this.resize();
      this.setTheme('sakura');
      this.start();
    }
    resize() {
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.canvas.width = Math.floor(this.w * this.dpr);
      this.canvas.height = Math.floor(this.h * this.dpr);
      this.canvas.style.width = this.w + 'px';
      this.canvas.style.height = this.h + 'px';
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    setTheme(name) {
      this.theme = FX_THEMES[name] ? name : 'dust';
      const t = FX_THEMES[this.theme];
      const old = this.parts;
      this.parts = [];
      for (let i = 0; i < t.count; i++) {
        const src = old[i];
        this.parts.push({
          x: src ? src.x : Math.random() * this.w,
          y: src ? src.y : Math.random() * this.h,
          r: 1.2 + Math.random() * (t.kind === 'petal' ? 3.8 : t.kind === 'snow' ? 2.2 : 2),
          vy: t.kind === 'rain' ? 2.6 + Math.random() * 2.8 : 0.12 + Math.random() * 0.34,
          vx: -0.16 + Math.random() * 0.32,
          a: 0.2 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.9,
          rot: Math.random() * Math.PI,
          seed: Math.random(),
        });
      }
    }
    start() {
      if (this.raf || prefersReduced) return;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    tick(now) {
      const dt = Math.min(40, now - this.last) / 16.666;
      this.last = now;
      const ctx = this.ctx;
      const t = FX_THEMES[this.theme];
      ctx.clearRect(0, 0, this.w, this.h);
      for (const p of this.parts) {
        p.phase += 0.012 * dt;
        p.x += (p.vx + Math.sin(p.phase * 0.8) * 0.18) * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * 0.012 * dt;
        if (p.y > this.h + 20) { p.y = -20; p.x = Math.random() * this.w; }
        if (p.y < -30) { p.y = this.h + 10; p.x = Math.random() * this.w; }
        if (p.x < -30) p.x = this.w + 20;
        if (p.x > this.w + 30) p.x = -20;
        const color = t.colors[Math.floor(p.seed * t.colors.length) % t.colors.length];
        ctx.save();
        ctx.translate(p.x, p.y);
        if (t.kind === 'firefly') {
          const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 6);
          glow.addColorStop(0, color);
          glow.addColorStop(1, 'rgba(255,220,150,0)');
          ctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(p.phase * 1.4));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = Math.min(1, p.a + 0.2);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (t.kind === 'rain') {
          ctx.globalAlpha = p.a * 0.55;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-2, 16 + p.r * 3);
          ctx.stroke();
        } else if (t.kind === 'snow') {
          ctx.globalAlpha = p.a;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (t.kind === 'leaf' || t.kind === 'petal') {
          ctx.globalAlpha = p.a * 0.8;
          ctx.fillStyle = color;
          ctx.rotate(p.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * (t.kind === 'leaf' ? 1.6 : 1.15), p.r * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = p.a * 0.5;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Игра                                                              */
  /* ------------------------------------------------------------------ */
  class Game {
    constructor() {
      this.audio = new Audio();
      this.fx = new Fx($('#fx'));
      this.state = null;
      this.node = null;
      this.seq = [];
      this.seqIndex = -1;
      this.seqDone = null;
      this.typing = null;
      this.waiting = false;
      this.phase = 'idle';
      this.nodeToken = 0;
      this.typeToken = 0;
      this.currentActor = null;
      this.fennecEl = null;
      this.currentLayout = '';
      this.bgIndex = 0;
      this.lastChapterKey = null;
      this.chapterBusy = false;
      this.gameActive = false;
      this.montage = null;
      this.seen = this.loadSeen();
      this.galleryFrom = 'title';
      this.instantType = false;
      this.skipChapters = false;
      this.memoryOpen = false;
      this.soundMuted = this.audio.muted;

      this.cacheDom();
      this.buildStatic();
      this.bindEvents();
      this.showTitle();
      this.initDevMode();
    }

    /* ------------------------- DOM ------------------------- */
    cacheDom() {
      this.screens = {
        title: $('#screen-title'),
        creator: $('#screen-creator'),
        game: $('#screen-game'),
        ending: $('#screen-ending'),
        gallery: $('#screen-gallery'),
      };
      this.ui = {
        game: $('#screen-game'),
        titleArt: $('#title-art'),
        btnNew: $('#btn-new'),
        btnContinue: $('#btn-continue'),
        btnGallery: $('#btn-gallery'),
        galleryCount: $('#gallery-count'),

        creatorBg: $('#creator-bg'),
        creatorBack: $('#creator-back'),
        previewPortrait: $('#preview-portrait'),
        previewName: $('#preview-name'),
        previewDream: $('#preview-dream'),
        nameInput: $('#name-input'),
        nameDice: $('#name-dice'),
        genderGroup: $('#gender-group'),
        skinSwatches: $('#skin-swatches'),
        eyeSwatches: $('#eye-swatches'),
        hairSwatches: $('#hair-swatches'),
        shirtSwatches: $('#shirt-swatches'),
        hairstyleGroup: $('#hairstyle-group'),
        dreamCards: $('#dream-cards'),
        startBtn: $('#start-btn'),

        bgLayers: [$('#bg-a'), $('#bg-b')],
        tint: $('.scene-tint'),
        hud: $('#hud'),
        hudChapter: $('#hud-chapter'),
        hudChapterTitle: $('#hud-chapter-title'),
        hudLocation: $('#hud-location'),
        objective: $('#objective'),
        objectiveText: $('#objective-text'),
        stats: $('#stats'),
        portraits: $('#portraits'),
        storyUI: $('#story-ui'),
        choices: $('#choices'),
        dialogue: $('#dialogue'),
        speaker: $('#speaker'),
        dialogueText: $('#dialogue-text'),
        dialogueHint: $('#dialogue-hint'),
        nextHint: $('#next-hint'),

        lookBtn: $('#btn-look'),
        lookPanel: $('#look-panel'),
        lookList: $('#look-list'),
        memoryCard: $('#memory-card'),
        memoryTitle: $('#memory-title'),
        memoryBody: $('#memory-body'),
        memoryClose: $('#memory-close'),

        journalBtn: $('#btn-journal'),
        journalPanel: $('#journal-panel'),
        journalList: $('#journal-list'),

        pause: $('#pause'),
        pauseStats: $('#pause-stats'),
        pauseResume: $('#pause-resume'),
        pauseJournal: $('#pause-journal'),
        pauseSound: $('#pause-sound'),
        pauseRestart: $('#pause-restart'),
        pauseMenu: $('#pause-menu'),
        pauseClose: $('#pause-close'),

        montage: $('#montage'),
        montageTitle: $('#montage-title'),
        montageHint: $('#montage-hint'),
        montageCount: $('#montage-count'),
        montageFill: $('#montage-fill'),
        montageOptions: $('#montage-options'),
        montageLog: $('#montage-log'),
        montageConfirm: $('#montage-confirm'),

        chapterCard: $('#chapter-card'),
        ccNumber: $('#cc-number'),
        ccTitle: $('#cc-title'),
        ccSub: $('#cc-sub'),
        ccLocation: $('#cc-location'),

        endingArt: $('#ending-art'),
        endingNumber: $('#ending-number'),
        endingMood: $('#ending-mood'),
        endingTitle: $('#ending-title'),
        endingTag: $('#ending-tag'),
        endingBody: $('#ending-body'),
        endingDream: $('#ending-dream'),
        endingPet: $('#ending-pet'),
        endingStats: $('#ending-stats'),
        endingAgain: $('#ending-again'),
        endingGallery: $('#ending-gallery'),
        endingMenu: $('#ending-menu'),

        galleryArt: $('#gallery-art'),
        galleryProgress: $('#gallery-progress'),
        galleryGrid: $('#gallery-grid'),
        galleryBack: $('#gallery-back'),
        galleryDetail: $('#gallery-detail'),
        gdKicker: $('#gd-kicker'),
        gdTitle: $('#gd-title'),
        gdTag: $('#gd-tag'),
        gdBody: $('#gd-body'),
        gdClose: $('#gallery-detail-close'),
        gdBack: $('#gd-back'),

        toasts: $('#toasts'),
      };
    }

    buildStatic() {
      // фон-заглушка
      this.ui.bgLayers.forEach((l) => { l.innerHTML = Art.background('bedroom'); });
      this.renderTitleArt();
      this.ui.creatorBg.innerHTML = Art.background('bedroom_night');
      this.ui.galleryArt.innerHTML = Art.endingScene('warm');
      this.ui.endingArt.innerHTML = Art.endingScene('warm');

      // статы
      this.ui.stats.innerHTML = STAT_KEYS.map((k) => `
        <div class="stat" data-stat="${k}">
          <span class="stat-icon" aria-hidden="true">${STAT_ICONS[k]}</span>
          <span class="stat-col">
            <span class="stat-top"><span class="stat-name">${STAT_LABEL[k]}</span><span class="stat-value">0</span></span>
            <span class="stat-meter"><i></i></span>
          </span>
        </div>`).join('');
      this.statEls = {};
      for (const k of STAT_KEYS) {
        const el = this.ui.stats.querySelector(`[data-stat="${k}"]`);
        this.statEls[k] = { root: el, value: el.querySelector('.stat-value'), fill: el.querySelector('.stat-meter i') };
      }

      this.buildCreatorSwatches();
      this.buildDreamCards();
      this.updateStats();
      this.syncSound();
    }

    /* ------------------------- события ------------------------- */
    bindEvents() {
      // первый жест — запуск звука
      const initAudio = () => { this.audio.init(); };
      window.addEventListener('pointerdown', initAudio, { once: true });
      window.addEventListener('keydown', initAudio, { once: true });

      this.ui.btnNew.addEventListener('click', () => { this.audio.click(); this.openCreator(); });
      this.ui.btnContinue.addEventListener('click', () => { this.audio.click(); this.continueGame(); });
      this.ui.btnGallery.addEventListener('click', () => { this.audio.click(); this.openGallery('title'); });
      this.ui.btnGallery.addEventListener('mouseenter', () => this.audio.tone && this.audio.tone(76, .2, { type: 'sine', gain: .02 }));

      this.ui.creatorBack.addEventListener('click', () => { this.audio.click(); this.showTitle(); });
      this.ui.startBtn.addEventListener('click', () => this.startNewGame());
      this.ui.nameDice.addEventListener('click', () => this.rollName());
      this.ui.nameInput.addEventListener('input', () => {
        if (!this.state) return;
        this.state.name = this.ui.nameInput.value;
        this.ui.previewName.textContent = this.state.name.trim() || '…';
      });
      this.ui.nameInput.addEventListener('blur', () => {
        if (!this.state) return;
        if (!this.ui.nameInput.value.trim()) this.ui.nameInput.value = 'Алекс';
        this.state.name = this.ui.nameInput.value.trim().slice(0, 16) || 'Алекс';
        this.ui.nameInput.value = this.state.name;
        this.ui.previewName.textContent = this.state.name;
      });

      this.ui.genderGroup.addEventListener('click', (e) => {
        const b = e.target.closest('[data-gender]');
        if (!b || !this.state) return;
        this.state.gender = b.dataset.gender === 'f' ? 'f' : 'm';
        this.refreshCreator();
        this.audio.click();
      });
      this.ui.hairstyleGroup.addEventListener('click', (e) => {
        const b = e.target.closest('[data-hair]');
        if (!b || !this.state) return;
        this.state.looks.hairStyle = b.dataset.hair;
        this.refreshCreator();
        this.audio.click();
      });

      const swatchHandler = (key, container, list) => {
        container.addEventListener('click', (e) => {
          const b = e.target.closest('[data-index]');
          if (!b || !this.state) return;
          this.state.looks[key] = clamp(Number(b.dataset.index) || 0, 0, list.length - 1);
          this.refreshCreator();
          this.audio.click();
        });
      };
      swatchHandler('skin', this.ui.skinSwatches, Art.SKIN_TONES);
      swatchHandler('eye', this.ui.eyeSwatches, Art.EYE_COLORS);
      swatchHandler('hair', this.ui.hairSwatches, Art.HAIR_COLORS);
      swatchHandler('shirt', this.ui.shirtSwatches, Art.SHIRT_COLORS);

      this.ui.dreamCards.addEventListener('click', (e) => {
        const b = e.target.closest('[data-dream]');
        if (!b || !this.state) return;
        this.state.dreamKey = b.dataset.dream;
        this.refreshCreator();
        this.audio.select();
      });

      this.ui.dialogue.addEventListener('click', () => this.advance());
      this.ui.menuBtn = $('#menu-btn');
      this.ui.menuBtn.addEventListener('click', () => this.openPause());
      this.ui.lookBtn.addEventListener('click', () => this.openLook());
      this.ui.journalBtn.addEventListener('click', () => this.openJournal());
      $('#sound-btn').addEventListener('click', () => this.toggleSound());

      this.ui.montageConfirm.addEventListener('click', () => this.confirmMontage());
      this.ui.pauseResume.addEventListener('click', () => this.closePause());
      this.ui.pauseClose.addEventListener('click', () => this.closePause());
      this.ui.pauseJournal.addEventListener('click', () => { this.closePause(); this.openJournal(); });
      this.ui.pauseSound.addEventListener('click', () => this.toggleSound());
      this.ui.pauseRestart.addEventListener('click', () => this.askRestart());
      this.ui.pauseMenu.addEventListener('click', () => { this.closePause(); this.showTitle(); });

      document.querySelectorAll('[data-close]').forEach((b) => {
        b.addEventListener('click', () => this.closePanel(b.dataset.close));
      });
      this.ui.memoryClose.addEventListener('click', () => this.hideMemory());
      this.ui.galleryBack.addEventListener('click', () => this.closeGallery());
      this.ui.gdClose.addEventListener('click', () => this.hideGalleryDetail());
      this.ui.gdBack.addEventListener('click', () => this.hideGalleryDetail());
      this.ui.galleryGrid.addEventListener('click', (e) => {
        const card = e.target.closest('[data-ending]');
        if (!card) return;
        this.openGalleryDetail(card.dataset.ending);
      });
      this.ui.endingAgain.addEventListener('click', () => { this.audio.click(); this.openCreator(); });
      this.ui.endingGallery.addEventListener('click', () => { this.audio.click(); this.openGallery('ending'); });
      this.ui.endingMenu.addEventListener('click', () => { this.audio.click(); this.showTitle(); });
      this.ui.galleryDetail.addEventListener('click', (e) => { if (e.target === this.ui.galleryDetail) this.hideGalleryDetail(); });
      this.ui.pause.addEventListener('click', (e) => { if (e.target === this.ui.pause) this.closePause(); });
      this.ui.chapterCard.addEventListener('click', () => { if (this.chapterBusy && this.chapterSkip) this.chapterSkip(); });

      window.addEventListener('keydown', (e) => this.onKey(e));
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!this.screens.title.classList.contains('hidden')) this.renderTitleArt();
        }, 220);
      });
      window.addEventListener('beforeunload', () => {
        if (this.gameActive && this.state) this.save();
      });
    }

    buildCreatorSwatches() {
      const mk = (list, cls, styleFn, titleFn) => list.map((item, i) =>
        `<button type="button" class="swatch ${cls}" data-index="${i}" title="${escapeHtml(titleFn(item))}" aria-label="${escapeHtml(titleFn(item))}" style="${styleFn(item)}"></button>`
      ).join('');
      this.ui.skinSwatches.innerHTML = mk(Art.SKIN_TONES, '', (c) => `background:linear-gradient(140deg, ${c.base}, ${c.shade});`, (c) => c.name);
      this.ui.eyeSwatches.innerHTML = mk(Art.EYE_COLORS, 'eye-swatch', (c) => `background:radial-gradient(circle at 42% 36%, ${c.light} 0 18%, ${c.base} 55%, ${c.dark} 100%);`, (c) => c.name);
      this.ui.hairSwatches.innerHTML = mk(Art.HAIR_COLORS, '', (c) => `background:linear-gradient(140deg, ${c.light}, ${c.base} 46%, ${c.dark});`, (c) => c.name);
      this.ui.shirtSwatches.innerHTML = mk(Art.SHIRT_COLORS, '', (c) => `background:linear-gradient(140deg, ${c.light}, ${c.base} 55%, ${c.dark});`, (c) => c.name);
    }

    buildDreamCards() {
      this.ui.dreamCards.innerHTML = S.DREAM_ORDER.map((key) => {
        const d = S.DREAMS[key];
        return `<button type="button" class="dream-card" data-dream="${key}">
          <span class="dream-icon" aria-hidden="true">${DREAM_ICONS[d.icon] || DREAM_ICONS.arch}</span>
          <span class="dream-name">${escapeHtml(d.label)}</span>
          <span class="dream-desc">${escapeHtml(d.desc)}</span>
        </button>`;
      }).join('');
    }

    /* ------------------------- экраны ------------------------- */
    renderTitleArt() {
      this.ui.titleArt.innerHTML = window.innerWidth <= 700 ? Art.titleSceneMobile() : Art.titleScene();
    }

    showScreen(name) {
      Object.entries(this.screens).forEach(([key, el]) => el.classList.toggle('hidden', key !== name));
    }

    showTitle() {
      if (this.gameActive && this.state) this.save();
      this.renderTitleArt();
      this.gameActive = false;
      this.stopTyping();
      this.closeAllPanels();
      this.ui.pause.classList.add('hidden');
      this.showScreen('title');
      this.ui.btnContinue.classList.toggle('hidden', !this.readSave());
      this.updateGalleryCount();
      this.fx.setTheme('sakura');
      this.audio.setMood('calm');
      this.state = this.state || null;
      if (this.typing) this.stopTyping();
    }

    openCreator() {
      this.gameActive = false;
      this.state = defaultState();
      this.state.name = this.randomName();
      this.ui.nameInput.value = this.state.name;
      this.ui.previewName.textContent = this.state.name;
      this.ui.btnContinue.classList.add('hidden');
      this.refreshCreator();
      this.showScreen('creator');
      this.fx.setTheme('dust');
      this.audio.setMood('calm');
      this.screens.creator.scrollTop = 0;
      window.scrollTo(0, 0);
      setTimeout(() => this.ui.nameInput.focus({ preventScroll: true }), 250);
    }

    refreshCreator() {
      if (!this.state) return;
      const s = this.state;
      this.ui.previewPortrait.innerHTML = Art.portrait('player', { looks: s.looks, expr: 'soft' });
      this.ui.previewName.textContent = (s.name || '').trim() || '…';
      this.ui.previewDream.textContent = (S.DREAMS[s.dreamKey] || S.DREAMS.arch).label;
      this.ui.genderGroup.querySelectorAll('[data-gender]').forEach((b) => b.classList.toggle('active', b.dataset.gender === s.gender));
      this.ui.hairstyleGroup.querySelectorAll('[data-hair]').forEach((b) => b.classList.toggle('active', b.dataset.hair === s.looks.hairStyle));
      this.ui.skinSwatches.querySelectorAll('[data-index]').forEach((b) => b.classList.toggle('active', Number(b.dataset.index) === s.looks.skin));
      this.ui.eyeSwatches.querySelectorAll('[data-index]').forEach((b) => b.classList.toggle('active', Number(b.dataset.index) === s.looks.eye));
      this.ui.hairSwatches.querySelectorAll('[data-index]').forEach((b) => b.classList.toggle('active', Number(b.dataset.index) === s.looks.hair));
      this.ui.shirtSwatches.querySelectorAll('[data-index]').forEach((b) => b.classList.toggle('active', Number(b.dataset.index) === s.looks.shirt));
      this.ui.dreamCards.querySelectorAll('[data-dream]').forEach((b) => b.classList.toggle('active', b.dataset.dream === s.dreamKey));
    }

    randomName() {
      const cur = this.state && this.state.name;
      let n = DICE_NAMES[Math.floor(Math.random() * DICE_NAMES.length)];
      if (n === cur) n = DICE_NAMES[(DICE_NAMES.indexOf(n) + 1) % DICE_NAMES.length];
      return n;
    }

    rollName() {
      if (!this.state) return;
      this.state.name = this.randomName();
      this.ui.nameInput.value = this.state.name;
      this.ui.previewName.textContent = this.state.name;
      this.audio.select();
      this.ui.nameInput.focus({ preventScroll: true });
    }

    startNewGame() {
      if (!this.state) return;
      this.audio.init();
      this.audio.select();
      let name = this.ui.nameInput.value.trim().slice(0, 16);
      if (!name) name = this.randomName();
      this.state.name = name;
      this.state.nodeId = S.STORY_START;
      this.state.chapter = { n: 1, title: 'Свой угол', sub: 'Дом. Вечер. Всё как всегда.' };
      this.state.location = 'Квартира · твоя комната';
      this.state.stats = { study: 0, courage: 0, family: 0, bond: 0 };
      this.state.flags = {};
      this.state.fennecName = null;
      this.state.usedHotspots = [];
      this.state.log = [];
      this.state.startedAt = Date.now();
      this.lastChapterKey = null;
      this.gameActive = true;
      this.showScreen('game');
      this.save();
      this.loadNode(S.STORY_START);
    }

    continueGame() {
      const saved = this.readSave();
      if (!saved) { this.toast('Сохранение не найдено'); return; }
      this.audio.init();
      this.audio.select();
      this.state = saved;
      this.gameActive = true;
      this.lastChapterKey = saved.chapter ? `${saved.chapter.n}|${saved.chapter.title}` : null;
      this.showScreen('game');
      this.loadNode(saved.nodeId, { skipChapter: true });
    }

    /* ------------------------- сохранения ------------------------- */
    save() {
      if (!this.state) return;
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.state)); } catch { /* noop */ }
      this.ui.btnContinue.classList.toggle('hidden', !this.readSave());
    }

    readSave() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return sanitizeState(parsed);
      } catch { return null; }
    }

    clearSave() {
      try { localStorage.removeItem(SAVE_KEY); } catch { /* noop */ }
      this.ui.btnContinue.classList.add('hidden');
    }

    loadSeen() {
      try {
        const raw = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}');
        if (raw && typeof raw === 'object' && raw.entries && typeof raw.entries === 'object') {
          const out = {};
          for (const [id, e] of Object.entries(raw.entries)) {
            if (S.ENDINGS[id] && e && typeof e === 'object') out[id] = e;
          }
          return out;
        }
      } catch { /* noop */ }
      return {};
    }

    saveSeen() {
      try { localStorage.setItem(SEEN_KEY, JSON.stringify({ version: 1, entries: this.seen })); } catch { /* noop */ }
    }

    updateGalleryCount() {
      const n = Object.keys(this.seen).length;
      this.ui.galleryCount.textContent = `${n}/${S.ENDING_ORDER.length}`;
    }

    /* ------------------------- звук ------------------------- */
    syncSound() {
      this.soundMuted = this.audio.muted;
      document.querySelectorAll('.sound-btn').forEach((b) => b.classList.toggle('muted', this.soundMuted));
      this.ui.pauseSound.textContent = `Звук: ${this.soundMuted ? 'выкл' : 'вкл'}`;
    }

    toggleSound() {
      this.audio.init();
      this.audio.toggleMute();
      this.syncSound();
      if (!this.soundMuted) this.audio.select();
    }

    /* ------------------------- игра: узлы ------------------------- */
    loadNode(id, opts = {}) {
      const node = S.NODES[id];
      if (!node) { console.warn('Неизвестный узел', id); return; }
      const token = ++this.nodeToken;
      this.stopTyping();
      this.node = node;
      this.node.id = id;
      this.state.nodeId = id;
      this.state.location = node.location || this.state.location || '';
      if (node.chapter) this.state.chapter = { ...node.chapter };
      this.updateHud();
      this.updateStats();
      this.setBackground(node.layout);
      this.updateLookButton();
      this.clearActor();
      this.updateFennec(id);
      this.clearChoices();
      this.closeAllPanels();
      this.ui.dialogue.classList.remove('hidden-dialogue');
      this.ui.storyUI.classList.remove('hidden');
      this.ui.game.classList.remove('choosing');
      this.ui.dialogueHint.innerHTML = 'клик / пробел <b>▸</b>';
      closeMemoryIfOpen(this);
      this.save();

      const chapterKey = node.chapter ? `${node.chapter.n}|${node.chapter.title}` : null;
      const needCard = !opts.skipChapter && !!node.chapter && chapterKey !== this.lastChapterKey && !this.skipChapters;
      if (chapterKey) this.lastChapterKey = chapterKey;

      const begin = () => {
        if (token !== this.nodeToken) return;
        this.phase = 'lines';
        this.startSequence(node.lines || [], () => this.afterNodeLines(node));
      };

      if (needCard) {
        this.updateHud();
        this.showChapterCard(node.chapter).then(begin);
      } else {
        begin();
      }
    }

    afterNodeLines(node) {
      if (node.type === 'montage') { this.showMontage(node); return; }
      if (node.type === 'ending') { this.finishEnding(node); return; }
      if (node.choices && node.choices.length) { this.showChoices(node.choices); return; }
      if (node.next) { this.loadNode(node.next); return; }
      console.warn('Тупик в узле', node.id || this.state.nodeId);
    }

    /* ------------------------- главы ------------------------- */
    updateHud() {
      const ch = this.state.chapter || { n: 1, title: '' };
      this.ui.hudChapter.textContent = `Глава ${ch.n || 1}`;
      this.ui.hudChapterTitle.textContent = ch.title || '';
      this.ui.hudLocation.textContent = this.state.location || this.node?.location || '';
      const obj = this.node?.objective || '';
      this.ui.objectiveText.textContent = obj;
      this.ui.objective.style.opacity = obj ? '1' : '0';
    }

    showChapterCard(ch) {
      if (prefersReduced) return Promise.resolve();
      return new Promise((resolve) => {
        const el = this.ui.chapterCard;
        this.chapterBusy = true;
        this.ui.ccNumber.textContent = ch.n;
        this.ui.ccTitle.textContent = ch.title;
        this.ui.ccSub.textContent = ch.sub || '';
        this.ui.ccLocation.textContent = this.state.location || '';
        el.classList.remove('hidden');
        el.classList.remove('show');
        void el.offsetWidth;
        el.classList.add('show');
        el.style.pointerEvents = 'auto';
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          el.removeEventListener('click', finish);
          this.chapterSkip = null;
          this.chapterBusy = false;
          el.classList.remove('show');
          el.classList.add('hidden');
          el.style.pointerEvents = 'none';
          resolve();
        };
        this.chapterSkip = finish;
        const timer = setTimeout(finish, 3000);
        el.addEventListener('click', finish);
        this.audio.chapter();
      });
    }

    /* ------------------------- фон ------------------------- */
    setBackground(layout) {
      if (!layout || layout === this.currentLayout) {
        if (layout) this.updateMood(layout);
        return;
      }
      const oldLayer = this.ui.bgLayers[this.bgIndex];
      const newIndex = this.bgIndex ^ 1;
      const newLayer = this.ui.bgLayers[newIndex];
      newLayer.innerHTML = Art.background(layout);
      newLayer.classList.add('visible');
      oldLayer.classList.remove('visible');
      this.bgIndex = newIndex;
      this.currentLayout = layout;
      this.updateMood(layout);
      this.updateLookButton();
    }

    updateMood(layout) {
      const tint = this.ui.tint;
      tint.classList.remove('night', 'tense');
      if (layout.includes('night') || layout === 'yard' || layout === 'livingroom') tint.classList.add('night');
      if (layout === 'kitchen_confession' || layout === 'yard') tint.classList.add('tense');
      let fx = 'dust';
      if (layout === 'yard') fx = 'leaves';
      else if (layout.includes('night')) fx = 'night';
      else if (layout === 'classroom') fx = 'dust';
      else if (layout === 'kitchen_confession') fx = 'rain';
      else if (layout.startsWith('bedroom') || layout.startsWith('kitchen')) fx = 'dust';
      this.fx.setTheme(fx);
      const mood = layout === 'kitchen_confession' || layout === 'yard' ? 'tense' : layout.includes('night') ? 'night' : 'calm';
      this.audio.setMood(mood);
    }

    /* ------------------------- последовательность ------------------------- */
    startSequence(lines, done) {
      this.seq = lines.map((l) => S.lineView(l, this.state));
      this.seqIndex = -1;
      this.seqDone = done;
      this.phase = 'lines';
      this.waiting = false;
      this.nextLine();
    }

    nextLine() {
      if (!this.seq || this.seq.length === 0) { this.finishSequence(); return; }
      this.seqIndex++;
      if (this.seqIndex >= this.seq.length) { this.finishSequence(); return; }
      this.displayLine(this.seq[this.seqIndex]);
    }

    finishSequence() {
      const cb = this.seqDone;
      this.seqDone = null;
      this.phase = 'done';
      this.waiting = false;
      if (typeof cb === 'function') cb();
    }

    displayLine(line) {
      const isNarration = !line.who;
      this.ui.dialogue.classList.toggle('narration', isNarration);
      this.ui.speaker.textContent = isNarration ? '' : (line.who === 'Ты' ? this.state.name : line.who);
      const char = line.tone && TONE_CHAR[line.tone] ? TONE_CHAR[line.tone] : null;
      if (char) {
        this.setActor(char, this.expressionFor(char, line));
      } else {
        this.dimActor();
      }
      this.pushLog(line.who || '', line.text);
      this.ui.dialogue.classList.remove('done');
      this.ui.dialogueHint.innerHTML = 'клик / пробел <b>▸</b>';
      this.startTyping(line.text || '');
    }

    expressionFor(char, line) {
      const t = (line.text || '').toLowerCase();
      const id = this.node?.id || '';
      if (char === 'sister') {
        if (/не отдавай|плач|груст|испуг/.test(t)) return 'sad';
        return 'happy';
      }
      if (char === 'dad') {
        if (/ого|серьёзно|правда\?/.test(t)) return 'surprised';
        if (/улыб|сме|спасибо|хорошо/.test(t)) return 'soft';
        if (/устал|вздых|молч|смотр/.test(t)) return 'tired';
        return 'neutral';
      }
      if (char === 'mom') {
        if (/улыб|смеёт|смеет|обнима|горжусь/.test(t)) return 'soft';
        if (/немедленно|прекрати|не сметь|объяснись|что это|я не узнаю|провал/.test(t)) return 'angry';
        if (/пожалуйста|прости|устал|боюсь|тихо/.test(t)) return 'worried';
        if (/family|eve|week/.test(id) && !/приют|провал/.test(t)) return 'soft';
        return 'stern';
      }
      if (char === 'player') {
        if (/не отдам|не буду|я подам|сама|сам|хочу|уйду/.test(t)) return 'brave';
        if (/прости|не знаю|боюсь|страшно|устал|пусто/.test(t)) return 'sad';
        if (/спасибо|люблю|хорошо|рад/.test(t)) return 'soft';
        return 'neutral';
      }
      return 'neutral';
    }

    setActor(char, expr) {
      if (this.currentActor && this.currentActor.char === char) {
        if (this.currentActor.expr !== expr) {
          this.currentActor.expr = expr;
          this.currentActor.el.innerHTML = Art.portrait(char, { looks: this.state.looks, expr });
        }
        this.currentActor.el.classList.remove('dim');
        this.currentActor.el.classList.add('speaking');
        return;
      }
      const old = this.currentActor;
      if (old) {
        old.el.classList.remove('visible', 'speaking');
        setTimeout(() => { if (old.el.parentNode) old.el.remove(); }, 380);
      }
      const wrap = document.createElement('div');
      wrap.className = 'portrait-wrap center';
      if (char === 'sister') wrap.classList.add('kid');
      wrap.innerHTML = Art.portrait(char, { looks: this.state.looks, expr });
      this.ui.portraits.appendChild(wrap);
      requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('visible', 'speaking')));
      this.currentActor = { char, expr, el: wrap };
    }

    dimActor() {
      if (!this.currentActor) return;
      this.currentActor.el.classList.add('dim');
      this.currentActor.el.classList.remove('speaking');
    }

    clearActor() {
      if (this.currentActor) {
        const el = this.currentActor.el;
        el.classList.remove('visible', 'speaking');
        setTimeout(() => { if (el.parentNode) el.remove(); }, 350);
        this.currentActor = null;
      }
    }

    updateFennec(nodeId) {
      const active = this.gameActive && FENNEC_NODES.has(nodeId) &&
        (this.state.flags.tookFennec || this.state.flags.leftFennec || nodeId === 'ch1_yard' || nodeId === 'leave_walk');
      if (!active) {
        if (this.fennecEl) {
          const el = this.fennecEl;
          el.classList.remove('visible');
          setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
          this.fennecEl = null;
        }
        return;
      }
      if (!this.fennecEl) {
        const wrap = document.createElement('div');
        wrap.className = 'portrait-wrap fennec';
        wrap.dataset.fennec = '1';
        this.ui.portraits.appendChild(wrap);
        this.fennecEl = wrap;
        requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('visible')));
      }
      const ex = /take_caught|leave_week/.test(nodeId) ? 'sad' : /take_room|take_eve|leave_eve|take_montage|leave_montage/.test(nodeId) ? 'happy' : 'neutral';
      const name = this.state.fennecName || (this.state.flags.leftFennec ? 'Рыжик' : 'фенёк');
      this.fennecEl.innerHTML = Art.portrait('fennec', { expr: ex, collar: !!this.state.flags.leftFennec });
      this.fennecEl.setAttribute('aria-label', name);
      this.fennecEl.classList.add('visible');
    }

    /* ------------------------- печать текста ------------------------- */
    startTyping(text) {
      this.stopTyping();
      const token = ++this.typeToken;
      const el = this.ui.dialogueText;
      el.textContent = '';
      this.waiting = false;
      this.ui.dialogue.classList.add('typing');
      if (this.instantType || prefersReduced || !text) {
        el.textContent = text || '';
        this.typing = null;
        this.waiting = true;
        this.ui.dialogue.classList.remove('typing');
        this.ui.dialogue.classList.add('done');
        return;
      }
      const typing = { i: 0, text, timer: null, token };
      this.typing = typing;
      const step = () => {
        if (!this.typing || this.typing.token !== token) return;
        const i = typing.i;
        if (i >= text.length) {
          this.typing = null;
          this.waiting = true;
          this.ui.dialogue.classList.remove('typing');
          this.ui.dialogue.classList.add('done');
          return;
        }
        const ch = text[i];
        el.textContent = text.slice(0, i + 1);
        typing.i = i + 1;
        let delay = 15 + Math.random() * 9;
        if ('.!?…'.includes(ch)) delay = 200;
        else if (',;:—'.includes(ch)) delay = 88;
        else if (ch === ' ') delay = 17;
        typing.timer = setTimeout(step, delay);
      };
      step();
    }

    stopTyping() {
      if (this.typing && this.typing.timer) clearTimeout(this.typing.timer);
      this.typing = null;
      this.ui?.dialogue?.classList.remove('typing');
      if (this.typeToken) this.typeToken++;
    }

    finishTyping() {
      if (!this.typing) return;
      clearTimeout(this.typing.timer);
      this.ui.dialogueText.textContent = this.typing.text;
      this.typing = null;
      this.waiting = true;
      this.ui.dialogue.classList.remove('typing');
      this.ui.dialogue.classList.add('done');
    }

    advance() {
      if (!this.gameActive) return;
      if (this.chapterBusy || this.montage) return;
      if (!this.ui.pause.classList.contains('hidden')) return;
      if (!this.ui.lookPanel.classList.contains('hidden') || !this.ui.journalPanel.classList.contains('hidden')) return;
      if (this.typing) { this.finishTyping(); return; }
      if (!this.waiting) return;
      if (this.phase !== 'lines') return;
      this.waiting = false;
      this.audio.advance();
      this.nextLine();
    }

    /* ------------------------- выборы ------------------------- */
    showChoices(choices) {
      this.phase = 'choices';
      this.waiting = false;
      this.ui.game.classList.add('choosing');
      this.ui.dialogueHint.innerHTML = 'выбери вариант';
      this.ui.choices.innerHTML = '';
      choices.forEach((choice, i) => {
        const view = S.choiceView(choice, this.state);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice';
        btn.style.animationDelay = `${i * 70}ms`;
        btn.dataset.index = String(i);
        const chips = Object.entries(view.effects || {}).map(([k, v]) => {
          const sign = v > 0 ? '+' : '−';
          return `<span class="effect-chip" data-stat="${k}">${STAT_LABEL[k] || k} ${sign}${Math.abs(v)}</span>`;
        }).join('');
        btn.innerHTML = `
          <span class="choice-index">${i + 1}</span>
          <span class="choice-main">
            <span class="choice-text">${escapeHtml(view.text)}</span>
            ${view.sub ? `<span class="choice-sub">${escapeHtml(view.sub)}</span>` : ''}
            ${chips ? `<span class="choice-effects">${chips}</span>` : ''}
          </span>`;
        btn.addEventListener('click', () => this.choose(choice));
        this.ui.choices.appendChild(btn);
      });
      this.audio.select();
    }

    clearChoices() {
      this.ui.choices.innerHTML = '';
      this.ui.game.classList.remove('choosing');
    }

    choose(choice) {
      if (this.phase !== 'choices') return;
      this.phase = 'transition';
      this.audio.select();
      this.clearChoices();
      this.ui.dialogueHint.innerHTML = 'клик / пробел <b>▸</b>';
      this.applyEffects(choice.effects || {});
      if (choice.flags) Object.assign(this.state.flags, choice.flags);
      if (choice.set) Object.assign(this.state, choice.set);
      if (choice.next) this.state.nodeId = choice.next;
      this.save();
      if (choice.reply && choice.reply.length) {
        this.startSequence(choice.reply, () => {
          if (choice.next) this.loadNode(choice.next);
        });
      } else if (choice.next) {
        this.loadNode(choice.next);
      }
    }

    applyEffects(effects = {}, opts = {}) {
      const bits = [];
      let any = false;
      for (const [k, v] of Object.entries(effects)) {
        if (!STAT_KEYS.includes(k) || !v) continue;
        const before = this.state.stats[k] || 0;
        this.state.stats[k] = clamp(before + v, 0, 99);
        const delta = this.state.stats[k] - before;
        if (delta) {
          bits.push(`${STAT_LABEL[k]} ${delta > 0 ? '+' : '−'}${Math.abs(delta)}`);
          any = true;
        }
      }
      this.updateStats(any ? Object.keys(effects) : []);
      if (any) {
        if (!opts.silent) this.toast(bits.join(' · '));
        this.audio.stat();
      }
    }

    updateStats(bump = []) {
      for (const k of STAT_KEYS) {
        const el = this.statEls[k];
        const value = (this.state?.stats?.[k]) || 0;
        el.value.textContent = value;
        el.fill.style.width = `${clamp((value / STAT_MAX) * 100, 0, 100)}%`;
        if (bump.includes(k)) {
          el.root.classList.remove('bump');
          void el.root.offsetWidth;
          el.root.classList.add('bump');
          setTimeout(() => el.root.classList.remove('bump'), 700);
        }
      }
    }

    /* ------------------------- хотспоты ------------------------- */
    availableHotspots() {
      if (!this.node) return [];
      const base = baseLayout(this.node.layout);
      const list = (HOTSPOT_MAP[base] || []).filter((id) => S.HOTSPOTS[id]);
      if (base === 'bedroom' && this.state.flags.tookFennec) list.push('nest');
      return list.filter((id) => !this.state.usedHotspots.includes(id));
    }

    updateLookButton() {
      if (!this.node) { this.ui.lookBtn.classList.add('empty'); return; }
      const n = this.availableHotspots().length;
      this.ui.lookBtn.classList.toggle('empty', n === 0);
      this.ui.lookBtn.title = n ? `Осмотреться (${n})` : 'Здесь больше нечего рассматривать';
      const label = this.ui.lookBtn.querySelector('span');
      if (label) label.textContent = n ? `осмотреться · ${n}` : 'осмотреться';
    }

    openLook() {
      if (!this.node) return;
      this.audio.click();
      this.closePanel('journal-panel');
      this.ui.lookPanel.classList.remove('hidden');
      this.ui.memoryCard.classList.add('hidden');
      this.renderLookList();
    }

    renderLookList() {
      const list = this.availableHotspots();
      if (!list.length) {
        this.ui.lookList.innerHTML = '<p class="look-empty">Ты уже всё здесь рассмотрел. Осталось только жить дальше.</p>';
        return;
      }
      this.ui.lookList.innerHTML = list.map((id) => {
        const h = S.hotspotView(id, this.state);
        return `<button type="button" class="look-item" data-hotspot="${id}">
          <span class="look-orb">✦</span>
          <span><span>${escapeHtml(h.label)}</span></span>
        </button>`;
      }).join('');
      this.ui.lookList.querySelectorAll('[data-hotspot]').forEach((b) => {
        b.addEventListener('click', () => this.openMemory(b.dataset.hotspot));
      });
    }

    openMemory(id) {
      const view = S.hotspotView(id, this.state);
      if (!view) return;
      this.memoryOpen = true;
      this.audio.memory();
      this.ui.memoryTitle.textContent = view.title;
      this.ui.memoryBody.innerHTML = view.lines.map((l) => `<p>${escapeHtml(l)}</p>`).join('');
      const chips = Object.entries(view.effects || {}).map(([k, v]) => `<span class="effect-chip" data-stat="${k}">${STAT_LABEL[k]} +${v}</span>`).join('');
      this.ui.memoryBody.insertAdjacentHTML('beforeend', chips ? `<div class="choice-effects">${chips}</div>` : '');
      this.ui.memoryCard.classList.remove('hidden');
      if (!this.state.usedHotspots.includes(id)) {
        this.state.usedHotspots.push(id);
        this.applyEffects(view.effects || {});
        this.save();
      }
      this.updateLookButton();
    }

    hideMemory() {
      this.memoryOpen = false;
      this.ui.memoryCard.classList.add('hidden');
      this.renderLookList();
    }

    closePanel(id) {
      const panel = document.getElementById(id);
      if (!panel) return;
      panel.classList.add('hidden');
      if (id === 'look-panel') {
        this.ui.memoryCard.classList.add('hidden');
        this.memoryOpen = false;
      }
    }

    closeAllPanels() {
      this.closePanel('look-panel');
      this.closePanel('journal-panel');
      this.ui.memoryCard.classList.add('hidden');
      this.memoryOpen = false;
    }

    openJournal() {
      if (!this.state) return;
      this.audio.click();
      this.closePanel('look-panel');
      this.ui.journalPanel.classList.remove('hidden');
      this.renderJournal();
    }

    renderJournal() {
      const log = this.state.log || [];
      if (!log.length) {
        this.ui.journalList.innerHTML = '<p class="journal-empty">Пока здесь тихо. История только начинается.</p>';
        return;
      }
      this.ui.journalList.innerHTML = log.slice(-160).map((e) => `
        <div class="journal-item">
          ${e.who ? `<span class="journal-who">${escapeHtml(e.who)}</span>` : ''}
          <p class="journal-text">${escapeHtml(e.text)}</p>
        </div>`).join('');
      this.ui.journalList.scrollTop = this.ui.journalList.scrollHeight;
    }

    pushLog(who, text) {
      if (!this.state || !text) return;
      this.state.log.push({ who: who === 'Ты' ? this.state.name : (who || ''), text, chapter: this.state.chapter?.title || '' });
      if (this.state.log.length > 240) this.state.log.shift();
    }

    /* ------------------------- пауза ------------------------- */
    openPause() {
      this.audio.click();
      this.closeAllPanels();
      this.ui.pause.classList.remove('hidden');
      this.ui.pauseStats.innerHTML = STAT_KEYS.map((k) =>
        `<div class="pause-stat" style="--c:var(--${k})"><span>${STAT_LABEL[k]}</span><strong>${this.state?.stats?.[k] || 0}</strong></div>`
      ).join('');
      this.ui.pauseSound.textContent = `Звук: ${this.audio.muted ? 'выкл' : 'вкл'}`;
    }

    closePause() {
      this.ui.pause.classList.add('hidden');
      this.resetRestartButton();
    }

    askRestart() {
      const b = this.ui.pauseRestart;
      if (b.dataset.armed === '1') {
        b.dataset.armed = '';
        b.textContent = 'Начать заново';
        this.closePause();
        this.clearSave();
        this.openCreator();
        return;
      }
      b.dataset.armed = '1';
      b.textContent = 'Точно начать заново?';
      clearTimeout(this._restartTimer);
      this._restartTimer = setTimeout(() => this.resetRestartButton(), 3200);
    }

    resetRestartButton() {
      const b = this.ui.pauseRestart;
      if (!b) return;
      b.dataset.armed = '';
      b.textContent = 'Начать заново';
      clearTimeout(this._restartTimer);
    }

    /* ------------------------- монтаж ------------------------- */
    showMontage(node) {
      this.phase = 'montage';
      this.montage = { picks: [], options: node.montage.options, picksRequired: node.montage.picks || 3, node };
      this.ui.storyUI.classList.add('hidden');
      this.ui.montage.classList.remove('hidden');
      this.ui.montageTitle.textContent = node.montage.title;
      this.ui.montageHint.textContent = node.montage.hint;
      this.ui.montageCount.textContent = '0';
      this.ui.montageFill.style.width = '0%';
      this.ui.montageLog.innerHTML = '';
      this.ui.montageConfirm.disabled = true;
      this.ui.montageOptions.innerHTML = '';
      node.montage.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'montage-option';
        b.dataset.option = String(i);
        b.innerHTML = `<span class="mo-title">${escapeHtml(S.formatText(opt.title, this.state))}</span>
          <span class="mo-desc">${escapeHtml(S.formatText(opt.desc, this.state))}</span>`;
        b.addEventListener('click', () => this.pickMontage(i));
        this.ui.montageOptions.appendChild(b);
      });
      this.audio.select();
    }

    pickMontage(index) {
      if (!this.montage) return;
      if (this.montage.picks.length >= this.montage.picksRequired) return;
      if (this.montage.picks.includes(index)) return;
      const opt = this.montage.options[index];
      this.montage.picks.push(index);
      this.applyEffects(opt.effects || {});
      const btn = this.ui.montageOptions.querySelector(`[data-option="${index}"]`);
      if (btn) btn.classList.add('picked');
      const result = S.formatText(opt.result, this.state);
      this.ui.montageLog.insertAdjacentHTML('beforeend',
        `<div class="montage-log-item"><b>${escapeHtml(S.formatText(opt.title, this.state))}.</b> ${escapeHtml(result)}</div>`);
      const n = this.montage.picks.length;
      this.ui.montageCount.textContent = String(n);
      this.ui.montageFill.style.width = `${(n / this.montage.picksRequired) * 100}%`;
      this.ui.montageConfirm.disabled = n < this.montage.picksRequired;
      if (n === this.montage.picksRequired) {
        this.ui.montageConfirm.focus({ preventScroll: true });
      }
    }

    confirmMontage() {
      if (!this.montage) return;
      if (this.montage.picks.length < this.montage.picksRequired) return;
      const next = this.montage.node.next;
      this.montage = null;
      this.ui.montage.classList.add('hidden');
      this.ui.storyUI.classList.remove('hidden');
      this.ui.montageOptions.innerHTML = '';
      this.ui.montageLog.innerHTML = '';
      if (next) {
        this.state.nodeId = next;
        this.save();
        this.loadNode(next);
      }
    }

    /* ------------------------- концовка ------------------------- */
    finishEnding(node) {
      const id = S.resolveEnding(this.state, node.resolve);
      this.showEnding(id, true);
    }

    showEnding(id, unlock = true) {
      const view = S.endingView(id, this.state);
      if (!view) { console.warn('Неизвестная концовка', id); return; }
      this.gameActive = false;
      this.stopTyping();
      this.closeAllPanels();
      const dream = S.DREAMS[this.state.dreamKey] || S.DREAMS.arch;
      const pet = this.state.fennecName || (this.state.flags.leftFennec ? 'Рыжик' : '—');
      this.ui.endingArt.innerHTML = Art.endingScene(view.mood);
      this.ui.endingNumber.textContent = String(S.ENDING_ORDER.indexOf(id) + 1);
      this.ui.endingMood.textContent = MOOD_LABEL[view.mood] || view.mood;
      this.ui.endingTitle.textContent = view.title;
      this.ui.endingTag.textContent = view.tag;
      this.ui.endingBody.innerHTML = view.body.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
      this.ui.endingDream.textContent = dream.label;
      this.ui.endingPet.textContent = pet;
      this.ui.endingStats.innerHTML = STAT_KEYS.map((k) =>
        `<span class="ending-stat" style="--c:var(--${k})">${STAT_LABEL[k]} <b>${this.state.stats[k] || 0}</b></span>`
      ).join('');
      this.showScreen('ending');
      this.fx.setTheme(view.mood === 'cold' || view.mood === 'cool' ? 'snow' : view.mood === 'amber' ? 'leaves' : 'warm');
      this.audio.ending(view.mood);
      this.screens.ending.scrollTop = 0;
      if (unlock) {
        this.seen[id] = {
          id,
          title: view.title,
          tag: view.tag,
          body: view.body,
          mood: view.mood,
          dream: dream.label,
          pet,
          at: Date.now(),
        };
        this.saveSeen();
        this.clearSave();
      }
      this.updateGalleryCount();
    }

    /* ------------------------- галерея ------------------------- */
    openGallery(from = 'title') {
      this.galleryFrom = from;
      this.renderGallery();
      this.showScreen('gallery');
      this.fx.setTheme('dust');
      this.ui.galleryArt.innerHTML = Art.endingScene('warm');
      window.scrollTo(0, 0);
    }

    closeGallery() {
      this.hideGalleryDetail();
      if (this.galleryFrom === 'ending') {
        this.showScreen('ending');
      } else {
        this.showTitle();
      }
    }

    renderGallery() {
      const seenCount = Object.keys(this.seen).length;
      this.ui.galleryProgress.textContent = `${seenCount} / ${S.ENDING_ORDER.length}`;
      this.ui.galleryGrid.innerHTML = S.ENDING_ORDER.map((id, i) => {
        const e = this.seen[id];
        if (e) {
          return `<button type="button" class="gallery-card unlocked ${RARE_ENDINGS.has(id) ? 'rare' : ''}" data-ending="${id}">
            <span class="gc-num">${String(i + 1).padStart(2, '0')} · открыта</span>
            <h4>${escapeHtml(e.title)}</h4>
            <p>${escapeHtml(e.tag || '')}</p>
            <span class="gc-mood">${escapeHtml(MOOD_LABEL[e.mood] || e.mood || '')}</span>
          </button>`;
        }
        return `<div class="gallery-card locked">
          <span class="gc-num">${String(i + 1).padStart(2, '0')} · закрыта</span>
          <h4>???</h4>
          <p>Эта история ещё не прожита.</p>
        </div>`;
      }).join('');
    }

    openGalleryDetail(id) {
      const e = this.seen[id];
      if (!e) return;
      this.audio.select();
      this.ui.gdKicker.textContent = `концовка · ${MOOD_LABEL[e.mood] || e.mood || ''}`;
      this.ui.gdTitle.textContent = e.title;
      this.ui.gdTag.textContent = e.tag || '';
      this.ui.gdBody.innerHTML = (e.body || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
      this.ui.galleryDetail.classList.remove('hidden');
    }

    hideGalleryDetail() {
      this.ui.galleryDetail.classList.add('hidden');
    }

    /* ------------------------- клавиши ------------------------- */
    onKey(e) {
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      const inputFocused = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      if (inputFocused) return;

      if (e.key === 'Escape') {
        if (!this.ui.galleryDetail.classList.contains('hidden')) { this.hideGalleryDetail(); e.preventDefault(); return; }
        if (!this.ui.pause.classList.contains('hidden')) { this.closePause(); e.preventDefault(); return; }
        if (!this.ui.lookPanel.classList.contains('hidden')) { this.closePanel('look-panel'); e.preventDefault(); return; }
        if (!this.ui.journalPanel.classList.contains('hidden')) { this.closePanel('journal-panel'); e.preventDefault(); return; }
        if (!this.screens.gallery.classList.contains('hidden')) { this.closeGallery(); e.preventDefault(); return; }
        if (!this.screens.ending.classList.contains('hidden')) { this.showTitle(); e.preventDefault(); return; }
        if (this.gameActive) { this.openPause(); e.preventDefault(); }
        return;
      }

      if (this.screens.creator.classList.contains('hidden') === false) {
        if (e.key === 'Enter' && tag !== 'BUTTON') { this.startNewGame(); e.preventDefault(); }
        return;
      }

      if (!this.gameActive) return;
      if (!this.ui.pause.classList.contains('hidden')) return;
      if (this.montage) return;

      if (e.key === 'Escape') return;

      if (tag === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (!this.ui.lookPanel.classList.contains('hidden') || !this.ui.journalPanel.classList.contains('hidden')) return;
        e.preventDefault();
        this.advance();
        return;
      }
      if (/^[1-9]$/.test(e.key) && this.phase === 'choices') {
        const idx = Number(e.key) - 1;
        const btn = this.ui.choices.querySelectorAll('.choice')[idx];
        if (btn) { e.preventDefault(); btn.click(); }
      }
    }

    /* ------------------------- утилиты UI ------------------------- */
    toast(text) {
      if (!text) return;
      const el = document.createElement('div');
      el.className = 'toast';
      el.textContent = text;
      this.ui.toasts.appendChild(el);
      setTimeout(() => el.remove(), 2800);
    }

    /* ------------------------- dev / скриншоты ------------------------- */
    initDevMode() {
      const q = new URLSearchParams(location.search);
      if (q.has('instant')) {
        this.instantType = true;
        document.body.classList.add('instant');
      }
      if (q.has('nocard')) this.skipChapters = true;
      if (q.get('mute') === '1') {
        this.audio.muted = true;
        this.syncSound();
      }
      const dev = q.get('dev');
      if (!dev) return;
      const sample = defaultState();
      sample.name = q.get('name') || 'Алекс';
      sample.gender = q.get('gender') === 'f' ? 'f' : 'm';
      sample.dreamKey = S.DREAMS[q.get('dream')] ? q.get('dream') : 'arch';
      sample.looks = {
        skin: 1,
        hair: 3,
        eye: 2,
        hairStyle: 'bob',
        shirt: 1,
      };
      sample.stats = { study: 5, courage: 4, family: 3, bond: 5 };
      sample.flags = { tookFennec: true };
      sample.fennecName = 'Шум';
      if (dev === 'creator') {
        this.openCreator();
        this.state.looks = { skin: 1, hair: 1, eye: 0, hairStyle: 'short', shirt: 0 };
        this.refreshCreator();
      } else if (dev === 'game') {
        const id = q.get('node') || S.STORY_START;
        if (/^ch1_/.test(id)) {
          sample.flags = {};
          sample.fennecName = null;
        } else if (/^(leave_|exam_leave|leave_results|leave_final)/.test(id)) {
          sample.flags = { leftFennec: true };
          sample.fennecName = null;
        } else {
          sample.flags = { tookFennec: true };
          sample.fennecName = 'Шум';
        }
        const node = S.NODES[id];
        if (node?.chapter) sample.chapter = { ...node.chapter };
        this.state = sample;
        this.gameActive = true;
        this.lastChapterKey = node?.chapter ? `${node.chapter.n}|${node.chapter.title}` : null;
        this.showScreen('game');
        this.loadNode(id, { skipChapter: true });
        const skipLines = Math.max(0, Math.min(12, Number(q.get('line')) || 0));
        if (skipLines) {
          setTimeout(() => {
            for (let i = 0; i < skipLines; i++) {
              if (this.phase !== 'lines') break;
              this.advance();
            }
          }, 140);
        }
      } else if (dev === 'ending') {
        const id = q.get('id') || 'warm_uni';
        sample.flags = { tookFennec: true };
        sample.stats = { study: 8, courage: 5, family: 6, bond: 7 };
        this.state = sample;
        this.showEnding(id, false);
      } else if (dev === 'gallery') {
        this.state = sample;
        this.openGallery('title');
      }
    }
  }

  function closeMemoryIfOpen(game) {
    if (game.memoryOpen) {
      game.memoryOpen = false;
      game.ui.memoryCard.classList.add('hidden');
    }
  }

  // Проверка целостности данных
  try {
    const errors = S.checkState();
    if (errors.length) console.warn('Проверка истории:', errors);
  } catch { /* noop */ }

  window.__fennek = new Game();
})();
