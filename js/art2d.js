/* ==========================================================================
   ФЕНЁК · 2D — аниме-арт на чистом SVG
   Портреты персонажей, фоны сцен и титульная иллюстрация.
   ========================================================================== */
(function () {
  'use strict';

  let UID = 0;
  const uid = () => 'fn' + (++UID).toString(36);

  const SKIN_TONES = [
    { name: 'фарфор', base: '#f8ddca', shade: '#e9bda7', deep: '#d99b86' },
    { name: 'светлая', base: '#f1c9a5', shade: '#dea781', deep: '#c98d6b' },
    { name: 'тёплая', base: '#e2b184', shade: '#ca9167', deep: '#ad7450' },
    { name: 'загар', base: '#c89065', shade: '#aa7451', deep: '#8d5b3d' },
    { name: 'бронза', base: '#a5714e', shade: '#875839', deep: '#6b422a' },
    { name: 'какао', base: '#7d5138', shade: '#623d28', deep: '#482b1b' },
  ];

  const HAIR_COLORS = [
    { name: 'чернила', base: '#2c2433', dark: '#1c1623', light: '#514562', shine: '#75658a' },
    { name: 'каштан', base: '#4b2f27', dark: '#35201b', light: '#7a4d3a', shine: '#966650' },
    { name: 'русый', base: '#7a5436', dark: '#5c3d26', light: '#a87a4f', shine: '#c49b6e' },
    { name: 'медовый', base: '#c08a4e', dark: '#9a6934', light: '#e0b274', shine: '#f3d5a2' },
    { name: 'пепел', base: '#8a817b', dark: '#69615d', light: '#b6aca3', shine: '#dad1c8' },
    { name: 'вино', base: '#773b44', dark: '#562a31', light: '#a75a62', shine: '#c47a82' },
    { name: 'ночь', base: '#3b4668', dark: '#29324d', light: '#62719a', shine: '#8392b8' },
    { name: 'роза', base: '#c67a91', dark: '#9e5a71', light: '#e3a0b1', shine: '#f4c5d0' },
    { name: 'серебро', base: '#c9cdd5', dark: '#a6abb6', light: '#e9ecf2', shine: '#ffffff' },
  ];

  const EYE_COLORS = [
    { name: 'янтарь', base: '#c9873e', light: '#f2c681', dark: '#7c4b1e' },
    { name: 'зелень', base: '#4f8a6b', light: '#a8d4b2', dark: '#2c5943' },
    { name: 'небо', base: '#4e7fa8', light: '#a9cde5', dark: '#2d5170' },
    { name: 'фиалка', base: '#7b6aa8', light: '#c0b3e2', dark: '#4e3f76' },
    { name: 'какао', base: '#6b4a38', light: '#af876c', dark: '#422a1e' },
    { name: 'графит', base: '#5a5a67', light: '#a6a5b5', dark: '#363643' },
  ];

  const SHIRT_COLORS = [
    { name: 'океан', base: '#5b7c8a', dark: '#42606c', light: '#88a8b4' },
    { name: 'слива', base: '#7a4d63', dark: '#5d384b', light: '#a87489' },
    { name: 'мох', base: '#5a7a52', dark: '#435e3d', light: '#83a279' },
    { name: 'карамель', base: '#9b6a3f', dark: '#7a5030', light: '#bf8f60' },
    { name: 'индиго', base: '#5b628c', dark: '#434970', light: '#8389b3' },
    { name: 'рябина', base: '#b45151', dark: '#8e3d3d', light: '#d17c7c' },
    { name: 'ночь', base: '#2e394c', dark: '#202836', light: '#526078' },
    { name: 'лён', base: '#d6c6a4', dark: '#b5a583', light: '#efe3c8' },
  ];

  const NPC = {
    mom: {
      skin: 1,
      hair: { base: '#3b2a26', dark: '#2a1c19', light: '#5e4238', shine: '#866255' },
      eye: EYE_COLORS[4],
      hairStyle: 'mom',
      shirt: { base: '#7c5060', dark: '#613c4a', light: '#a27282' },
      extras: ['earrings', 'necklace', 'lashes', 'lips'],
      defaultExpr: 'stern',
      mature: true,
    },
    dad: {
      skin: 2,
      hair: { base: '#514a48', dark: '#3a3432', light: '#7a716b', shine: '#9a918a' },
      eye: EYE_COLORS[5],
      hairStyle: 'dad',
      shirt: { base: '#436a67', dark: '#32514f', light: '#6b918d' },
      extras: ['glasses', 'stubble'],
      defaultExpr: 'tired',
      mature: true,
    },
    sister: {
      skin: 0,
      hair: { base: '#2c211d', dark: '#1c1512', light: '#4a3a31', shine: '#6b574a' },
      eye: EYE_COLORS[4],
      hairStyle: 'sister',
      shirt: { base: '#d98b9a', dark: '#b96f7e', light: '#f0b4c0' },
      extras: ['bows', 'kid'],
      defaultExpr: 'happy',
    },
    player: {
      skin: 1,
      hair: HAIR_COLORS[0],
      eye: EYE_COLORS[0],
      hairStyle: 'short',
      shirt: SHIRT_COLORS[0],
      extras: [],
      defaultExpr: 'neutral',
    },
  };

  const EXPRESSIONS = {
    neutral:  { eye: 1,    brow: 0.05, mouth: 'soft',  blush: 0.24 },
    soft:     { eye: 1,    brow: -0.08, mouth: 'smile', blush: 0.36 },
    happy:    { eye: 1,    brow: -0.18, mouth: 'grin',  blush: 0.46 },
    sad:      { eye: 1,    brow: -1,   mouth: 'frown', blush: 0.14, glisten: true },
    worried:  { eye: 1,    brow: -0.6, mouth: 'small', blush: 0.18 },
    angry:    { eye: 0.64, brow: 1,    mouth: 'flat',  blush: 0.22 },
    stern:    { eye: 0.8,  brow: 0.5,  mouth: 'flat',  blush: 0.16 },
    surprised:{ eye: 1.18, brow: -0.25, mouth: 'o',    blush: 0.34 },
    tired:    { eye: 0.46, brow: 0.18, mouth: 'small', blush: 0.1 },
    brave:    { eye: 0.92, brow: 0.35, mouth: 'set',   blush: 0.2 },
    asleep:   { eye: 0,    brow: 0,    mouth: 'small', blush: 0.3, closed: true },
  };

  function svg(w, h, inner, cls) {
    return `<svg class="${cls || ''}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${inner}</svg>`;
  }

  function starList(count, w, h, seed, color, minR, maxR) {
    let s = seed;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    let out = '';
    for (let i = 0; i < count; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const r = minR + rand() * (maxR - minR);
      const o = 0.35 + rand() * 0.65;
      out += `<circle class="twinkle" style="animation-delay:${(rand() * 5).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${color}" opacity="${o.toFixed(2)}"/>`;
    }
    return out;
  }

  function clouds(w, h, color, opacity, seed, yBase) {
    let s = seed;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    let out = '';
    for (let i = 0; i < 5; i++) {
      const y = yBase + rand() * h * 0.16;
      const x = rand() * w * 0.9;
      const rx = 90 + rand() * 140;
      const ry = 18 + rand() * 26;
      out += `<g class="cloud-drift" style="animation-delay:${(-rand() * 22).toFixed(1)}s">
        <ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="${color}" opacity="${opacity}"/>
        <ellipse cx="${(x + rx * 0.5).toFixed(0)}" cy="${(y - ry * 0.35).toFixed(0)}" rx="${(rx * 0.6).toFixed(0)}" ry="${(ry * 0.8).toFixed(0)}" fill="${color}" opacity="${opacity}"/>
      </g>`;
    }
    return out;
  }

  function windowSky(time, id) {
    const skies = {
      day: ['#b8ddec', '#e8f4f4', '#fdf6e3'],
      morning: ['#f6d7ae', '#f6e8c9', '#cfe4e8'],
      evening: ['#6d5a88', '#e69578', '#f8c98d'],
      dusk: ['#403d6b', '#9a6688', '#f2a379'],
      night: ['#0e1730', '#1d2b4d', '#33466a'],
      rain: ['#4b5265', '#6e7486', '#9a9aa6'],
    };
    const c = skies[time] || skies.day;
    return `<linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c[0]}"/><stop offset=".58" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/>
    </linearGradient>`;
  }

  /* ========================================================================
     ПОРТРЕТЫ
     ======================================================================== */

  function mouth(expr, tint) {
    switch (expr.mouth) {
      case 'smile': return `<path d="M226 374 Q240 386 254 374" fill="none" stroke="${tint}" stroke-width="3.6" stroke-linecap="round"/>`;
      case 'grin': return `<path d="M223 370 Q240 389 257 370 Q240 399 223 370 Z" fill="#7c4550"/><path d="M230 379 Q240 384 250 379" fill="none" stroke="#e9a3a3" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
      case 'frown': return `<path d="M227 383 Q240 374 253 383" fill="none" stroke="${tint}" stroke-width="3.4" stroke-linecap="round"/>`;
      case 'small': return `<path d="M233 378 Q240 382 247 378" fill="none" stroke="${tint}" stroke-width="3" stroke-linecap="round"/>`;
      case 'flat': return `<path d="M228 379 L252 379" fill="none" stroke="${tint}" stroke-width="3.6" stroke-linecap="round"/>`;
      case 'o': return `<ellipse cx="240" cy="379" rx="7.5" ry="9.5" fill="#7c4550"/><ellipse cx="240" cy="383" rx="4" ry="4.5" fill="#c97a7a" opacity=".7"/>`;
      case 'set': return `<path d="M226 379 Q240 373 254 379" fill="none" stroke="${tint}" stroke-width="3.8" stroke-linecap="round"/>`;
      default: return `<path d="M227 376 Q240 384 253 376" fill="none" stroke="${tint}" stroke-width="3.2" stroke-linecap="round"/>`;
    }
  }

  function eyes(expr, eye, skin, id, lashes) {
    const y = 300;
    const lash = lashes ? 8 : 6.4;
    if (expr.closed || expr.mouth === 'grin' && expr.eye === 0) {
      return `<g fill="none" stroke="#2c2130" stroke-linecap="round">
        <path d="M164 306 Q193 280 224 306" stroke-width="${lash}"/>
        <path d="M256 306 Q287 280 316 306" stroke-width="${lash}"/>
        <path d="M164 306 l-7 7 M316 306 l7 7" stroke-width="3.4" opacity=".7"/>
      </g>`;
    }
    const s = expr.eye;
    const eyeScale = `translate(0 ${y}) scale(1 ${s}) translate(0 ${-y})`;
    const glisten = expr.glisten ? `<circle cx="186" cy="312" r="2.2" fill="#fff" opacity=".8"/><circle cx="294" cy="312" r="2.2" fill="#fff" opacity=".8"/>` : '';
    return `<g class="eyes-open">
      <g transform="${eyeScale}">
        <path d="M158 ${y} C164 266 222 261 229 ${y} C223 334 170 337 158 ${y} Z" fill="#fffdf9"/>
        <path d="M251 ${y} C258 266 316 266 322 ${y} C310 337 257 334 251 ${y} Z" fill="#fffdf9"/>
        <ellipse cx="194" cy="${y + 3}" rx="17" ry="22" fill="url(#${id}-iris)"/>
        <ellipse cx="286" cy="${y + 3}" rx="17" ry="22" fill="url(#${id}-iris)"/>
        <ellipse cx="194" cy="${y + 7}" rx="8" ry="12" fill="#261d2a"/>
        <ellipse cx="286" cy="${y + 7}" rx="8" ry="12" fill="#261d2a"/>
        <circle cx="187" cy="${y - 8}" r="5.4" fill="#fff"/>
        <circle cx="279" cy="${y - 8}" r="5.4" fill="#fff"/>
        <circle cx="201" cy="${y + 12}" r="2.8" fill="#fff" opacity=".75"/>
        <circle cx="293" cy="${y + 12}" r="2.8" fill="#fff" opacity=".75"/>
        <path d="M159 ${y - 4} C169 262 221 259 229 ${y - 6}" fill="none" stroke="#332333" stroke-width="${lash}" stroke-linecap="round"/>
        <path d="M251 ${y - 6} C259 259 311 262 321 ${y - 4}" fill="none" stroke="#332333" stroke-width="${lash}" stroke-linecap="round"/>
        <path d="M161 ${y + 18} C176 333 212 333 224 ${y + 14}" fill="none" stroke="#a85f6b" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>
        <path d="M256 ${y + 14} C268 333 304 333 319 ${y + 18}" fill="none" stroke="#a85f6b" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>
      </g>
      ${glisten}
    </g>`;
  }

  function brows(expr) {
    const t = expr.brow;
    return `<g fill="none" stroke="#3a2a30" stroke-linecap="round" stroke-width="4.4" opacity=".9">
      <path d="M162 ${258 - t * 4} Q191 ${256 + t * 3} 220 ${262 + t * 10}"/>
      <path d="M260 ${262 + t * 10} Q289 ${256 + t * 3} 318 ${258 - t * 4}"/>
    </g>`;
  }

  function backHair(style, hair, kid, id) {
    const g = `url(#${id}-hairback)`;
    if (style === 'mom') {
      return `<g>
        <ellipse cx="356" cy="236" rx="58" ry="62" fill="${hair.dark}"/>
        <ellipse cx="350" cy="228" rx="47" ry="50" fill="${hair.base}"/>
        <path d="M112 256 C100 138 380 138 368 256 L378 352 C370 398 340 426 314 436 C328 388 324 306 310 254 C272 228 200 228 166 252 C150 304 150 388 164 436 C138 426 110 398 102 352 Z" fill="${g}"/>
        <path d="M124 300 C118 344 126 388 142 420 C150 384 142 334 152 296 Z" fill="${g}"/>
        <path d="M356 300 C362 344 354 388 338 420 C330 384 338 334 328 296 Z" fill="${g}"/>
      </g>`;
    }
    if (style === 'dad') {
      return `<g>
        <path d="M122 254 C114 142 366 142 358 254 L352 312 C344 342 330 362 316 372 C324 334 320 292 308 258 C272 236 200 236 166 256 C152 292 150 334 158 372 C144 362 130 342 122 312 Z" fill="${g}"/>
        <path d="M140 220 C172 186 308 186 340 220 C312 204 280 196 240 196 C200 196 168 204 140 220 Z" fill="${hair.dark}" opacity=".45"/>
      </g>`;
    }
    if (style === 'sister') {
      return `<g>
        <path d="M122 254 C114 140 366 140 358 254 L366 322 C352 292 340 244 326 232 C288 210 196 210 158 232 C146 246 132 292 118 322 Z" fill="${g}"/>
        <g>
          <ellipse cx="104" cy="246" rx="46" ry="60" fill="${hair.dark}" transform="rotate(20 104 246)"/>
          <ellipse cx="107" cy="240" rx="35" ry="48" fill="${hair.base}" transform="rotate(20 107 240)"/>
          <path d="M78 286 C54 330 68 392 96 418 C104 368 98 320 112 292 Z" fill="${g}"/>
          <ellipse cx="376" cy="246" rx="46" ry="60" fill="${hair.dark}" transform="rotate(-20 376 246)"/>
          <ellipse cx="373" cy="240" rx="35" ry="48" fill="${hair.base}" transform="rotate(-20 373 240)"/>
          <path d="M402 286 C426 330 412 392 384 418 C376 368 382 320 368 292 Z" fill="${g}"/>
        </g>
      </g>`;
    }
    if (style === 'bob') {
      return `<g>
        <path d="M108 256 C100 134 380 134 372 256 L382 388 C376 428 350 452 326 458 C340 410 334 324 316 252 C278 228 202 228 164 252 C146 324 140 410 154 458 C130 452 104 428 98 388 Z" fill="${g}"/>
        <path d="M122 270 C112 330 120 398 140 438 C154 398 142 330 154 264 Z" fill="${g}"/>
        <path d="M358 270 C368 330 360 398 340 438 C326 398 338 330 326 264 Z" fill="${g}"/>
        <path d="M150 400 C196 424 284 424 330 400 C300 440 180 440 150 400 Z" fill="${hair.dark}" opacity=".32"/>
      </g>`;
    }
    if (style === 'curls') {
      let curls = '';
      const pts = [[118, 292], [122, 338], [138, 382], [164, 416], [316, 416], [342, 382], [358, 338], [362, 292], [106, 252], [374, 252]];
      for (const [x, y] of pts) {
        curls += `<circle cx="${x}" cy="${y}" r="28" fill="${hair.dark}"/><circle cx="${x - 2}" cy="${y - 3}" r="22" fill="${g}"/>`;
      }
      return `<path d="M112 254 C104 138 376 138 368 254 L374 330 C354 306 344 254 318 234 C276 214 204 214 162 236 C144 270 150 310 126 336 Z" fill="${g}"/>${curls}`;
    }
    if (style === 'pony') {
      return `<g>
        <path d="M120 254 C112 140 368 140 360 254 L354 316 C346 344 332 362 318 374 C326 332 322 286 308 252 C272 228 198 230 162 252 C150 286 150 332 158 374 C144 362 130 344 122 316 Z" fill="${g}"/>
        <path d="M344 236 C390 202 432 226 434 278 C436 344 396 410 366 452 C380 390 394 328 376 286 C366 262 352 250 338 254 Z" fill="${hair.dark}"/>
        <path d="M348 238 C388 210 422 234 424 280 C426 338 392 398 370 430 C382 376 392 322 376 288 C367 266 356 254 342 258 Z" fill="${g}"/>
        <ellipse cx="346" cy="242" rx="15" ry="19" fill="#c97f8e" transform="rotate(-22 346 242)"/>
      </g>`;
    }
    // short — объёмная шапка волос, видимая вокруг лица
    return `<g>
      <path d="M118 258 C110 138 370 138 362 258 L356 326 C348 356 334 376 318 388 C326 344 322 292 308 256 C272 230 198 232 162 254 C150 292 150 344 158 388 C142 376 128 356 120 326 Z" fill="${g}"/>
      <path d="M124 286 C116 324 122 360 138 388 C150 358 140 316 150 282 Z" fill="${g}"/>
      <path d="M356 286 C364 324 358 360 342 388 C330 358 340 316 330 282 Z" fill="${g}"/>
      <path d="M150 390 C194 414 286 414 330 390 C300 426 180 426 150 390 Z" fill="${hair.dark}" opacity=".28"/>
    </g>`;
  }

  function frontHair(style, hair, kid, id) {
    const light = hair.shine;
    const strand = (d, w = 3, o = .36) => `<path d="${d}" fill="none" stroke="${light}" stroke-width="${w}" opacity="${o}" stroke-linecap="round"/>`;
    if (style === 'mom') {
      return `<g>
        <path d="M116 268 C108 140 366 134 364 254 C342 204 316 178 282 170 C266 198 248 210 226 208 C208 226 188 226 172 210 C154 226 134 240 116 268 Z" fill="url(#${id}-hairfront)"/>
        <path d="M116 266 C122 300 124 340 120 372 C106 340 104 300 116 266 Z" fill="url(#${id}-hairfront)"/>
        <path d="M354 232 C352 292 356 340 348 378 C338 340 344 286 338 240 Z" fill="url(#${id}-hairfront)"/>
        ${strand('M156 196 C202 168 274 162 322 188', 4, .3)}
        ${strand('M196 200 C224 184 252 180 280 188', 3, .28)}
      </g>`;
    }
    if (style === 'dad') {
      return `<g>
        <path d="M118 254 C112 148 368 148 360 254 C342 214 324 190 296 176 C286 202 272 218 252 216 C240 230 224 230 212 216 C196 228 180 226 168 210 C152 228 134 240 118 254 Z" fill="url(#${id}-hairfront)"/>
        <path d="M120 254 C130 286 132 318 126 348 C112 320 110 284 120 254 Z" fill="url(#${id}-hairfront)"/>
        <path d="M132 234 C154 188 200 164 248 166 C298 166 332 194 348 234 C318 204 286 190 246 190 C204 190 168 204 132 234 Z" fill="url(#${id}-hairfront)"/>
        ${strand('M162 196 C202 168 282 162 326 190', 4, .28)}
        ${strand('M238 182 C254 176 270 176 284 180', 3, .24)}
      </g>`;
    }
    if (style === 'sister') {
      return `<g>
        <path d="M118 258 C112 140 368 140 360 258 C342 220 326 198 300 186 C292 210 278 224 260 222 C246 240 226 242 212 226 C198 240 184 240 174 226 C154 240 136 248 118 258 Z" fill="url(#${id}-hairfront)"/>
        <path d="M118 256 C110 304 114 352 128 382 C142 352 134 300 146 250 Z" fill="url(#${id}-hairfront)"/>
        <path d="M360 256 C368 304 364 352 350 382 C336 352 344 300 332 250 Z" fill="url(#${id}-hairfront)"/>
        ${strand('M160 194 C196 170 252 164 292 180', 3.5, .32)}
        ${strand('M208 202 C224 190 240 190 252 198', 3, .3)}
        <g>
          <path d="M100 224 C76 208 62 222 72 240 C82 258 106 258 122 242 Z" fill="#d98b9a"/>
          <path d="M108 228 C92 218 82 228 88 238 C96 248 112 246 118 236 Z" fill="#f0b4c0"/>
          <circle cx="104" cy="234" r="5.5" fill="#b96f7e"/>
          <path d="M380 224 C404 208 418 222 408 240 C398 258 374 258 358 242 Z" fill="#d98b9a"/>
          <path d="M372 228 C388 218 398 228 392 238 C384 248 368 246 362 236 Z" fill="#f0b4c0"/>
          <circle cx="376" cy="234" r="5.5" fill="#b96f7e"/>
          <path d="M96 204 C88 184 108 172 122 186 C112 194 104 200 96 204 Z" fill="#b96f7e" opacity=".55"/>
          <path d="M384 204 C392 184 372 172 358 186 C368 194 376 200 384 204 Z" fill="#b96f7e" opacity=".55"/>
        </g>
      </g>`;
    }
    if (style === 'bob') {
      return `<g>
        <path d="M110 264 C104 136 378 136 370 264 C352 220 330 194 300 182 C288 210 272 226 252 222 C238 240 220 240 206 224 C192 238 178 238 168 222 C150 238 132 246 110 264 Z" fill="url(#${id}-hairfront)"/>
        <path d="M110 260 C100 314 106 376 122 410 C138 372 126 312 138 254 Z" fill="url(#${id}-hairfront)"/>
        <path d="M370 260 C380 314 374 376 358 410 C342 372 354 312 342 254 Z" fill="url(#${id}-hairfront)"/>
        ${strand('M150 194 C190 166 252 158 294 174', 4, .32)}
        ${strand('M276 184 C294 178 310 180 322 188', 3, .24)}
      </g>`;
    }
    if (style === 'curls') {
      let curls = '';
      const pts = [[116, 250], [108, 296], [114, 338], [130, 376], [156, 410], [324, 410], [350, 376], [366, 338], [372, 296], [364, 250]];
      for (const [x, y] of pts) curls += `<circle cx="${x}" cy="${y}" r="25" fill="url(#${id}-hairfront)"/><circle cx="${x - 3}" cy="${y - 4}" r="19" fill="url(#${id}-hairfront)" opacity=".55"/>`;
      return `<g>
        <path d="M112 262 C106 138 374 138 368 262 C350 222 328 198 300 186 C286 210 270 222 252 218 C236 234 218 234 204 220 C188 234 172 232 160 218 C144 232 128 242 112 262 Z" fill="url(#${id}-hairfront)"/>
        ${curls}
        ${strand('M158 194 C196 168 254 162 294 178', 4, .3)}
      </g>`;
    }
    if (style === 'pony') {
      return `<g>
        <path d="M114 262 C108 140 372 140 366 262 C348 220 326 194 296 182 C284 208 268 222 250 218 C234 236 216 236 202 220 C186 234 170 232 158 218 C142 234 128 244 114 262 Z" fill="url(#${id}-hairfront)"/>
        <path d="M114 258 C104 306 108 352 124 386 C138 354 128 306 140 250 Z" fill="url(#${id}-hairfront)"/>
        <path d="M348 244 C354 300 346 350 334 386 C320 352 330 300 326 254 Z" fill="url(#${id}-hairfront)"/>
        ${strand('M154 194 C194 166 250 158 290 172', 4, .32)}
        ${strand('M272 184 C288 178 304 180 318 188', 3, .24)}
      </g>`;
    }
    // short
    return `<g>
      <path d="M116 264 C108 138 372 138 366 264 C350 222 328 194 298 180 C286 208 270 224 252 220 C236 238 218 238 204 222 C190 236 176 236 166 220 C150 236 132 244 116 264 Z" fill="url(#${id}-hairfront)"/>
      <path d="M116 260 C106 300 110 344 126 378 C140 350 128 304 140 252 Z" fill="url(#${id}-hairfront)"/>
      <path d="M366 260 C376 300 372 344 356 378 C342 350 354 304 342 252 Z" fill="url(#${id}-hairfront)"/>
      ${strand('M154 194 C194 166 250 160 288 172', 4, .34)}
      ${strand('M270 184 C286 178 302 180 316 188', 3, .24)}
      <path d="M176 226 C206 198 244 186 278 194 C256 202 234 214 220 232 Z" fill="${hair.light}" opacity=".12"/>
    </g>`;
  }

  function body(cfg, id, kid) {
    const shirt = cfg.shirtData || cfg.shirt || SHIRT_COLORS[0];
    const extras = cfg.extras || [];
    const isMom = cfg.hairStyle === 'mom';
    const isDad = cfg.hairStyle === 'dad';
    const isSister = cfg.hairStyle === 'sister';
    let details = '';
    if (isSister) {
      details = `<path d="M192 482 Q240 530 288 482 Q240 510 192 482 Z" fill="#fff4ea" opacity=".9"/>
        <path d="M188 500 Q240 538 292 500" fill="none" stroke="${shirt.dark}" stroke-width="3" opacity=".55"/>
        <circle cx="240" cy="523" r="8" fill="#f4d3dc"/><circle cx="240" cy="523" r="3.5" fill="#c98595"/>`;
    } else if (isMom) {
      details = `<path d="M208 470 Q240 530 272 470 L284 478 Q246 556 196 478 Z" fill="#f3e7da"/>
        <path d="M194 478 L166 640 L202 640 L220 520 Z" fill="${shirt.light}" opacity=".42"/>
        <path d="M286 478 L314 640 L278 640 L260 520 Z" fill="${shirt.light}" opacity=".42"/>
        <path d="M202 486 L218 640 M278 486 L262 640" stroke="${shirt.dark}" stroke-width="3" opacity=".6"/>
        <circle cx="240" cy="520" r="5" fill="#e8ccb0"/>
        <path d="M240 525 v22" stroke="#e8ccb0" stroke-width="2"/>`;
    } else if (isDad) {
      details = `<path d="M198 470 Q240 510 282 470 Q240 492 198 470 Z" fill="${shirt.light}"/>
        <path d="M196 490 l10 34 M284 490 l-10 34" stroke="${shirt.dark}" stroke-width="3" opacity=".55"/>
        <path d="M199 476 Q240 506 281 476" fill="none" stroke="${shirt.dark}" stroke-width="4" opacity=".5"/>`;
    } else {
      details = `<path d="M186 474 Q214 506 240 506 Q266 506 294 474 L286 470 Q258 492 240 492 Q222 492 194 470 Z" fill="${shirt.light}" opacity=".85"/>
        <path d="M204 484 L204 526 M276 484 L276 526" stroke="${shirt.dark}" stroke-width="3.4" stroke-linecap="round" opacity=".6"/>
        <circle cx="204" cy="530" r="3.4" fill="${shirt.dark}"/><circle cx="276" cy="530" r="3.4" fill="${shirt.dark}"/>
        <path d="M160 560 q18 20 10 54" fill="none" stroke="${shirt.dark}" stroke-width="3" opacity=".35"/>
        <path d="M320 560 q-18 20 -10 54" fill="none" stroke="${shirt.dark}" stroke-width="3" opacity=".35"/>`;
    }
    const width = isSister ? 0.9 : 1;
    return `<g ${isSister ? 'transform="translate(240 640) scale(.9) translate(-240 -640)"' : ''}>
      <path d="M62 640 C70 552 112 496 176 474 L196 466 C204 486 224 498 240 498 C256 498 276 486 284 466 L304 474 C368 496 410 552 418 640 Z" fill="url(#${id}-shirt)"/>
      ${details}
    </g>`;
  }

  function extras(cfg, id, skin, eye) {
    const ex = cfg.extras || [];
    let out = '';
    if (ex.includes('glasses')) {
      const glass = 'rgba(255,255,255,.16)';
      out += `<g class="glasses" fill="${glass}" stroke="#5b4b45" stroke-width="3.6">
        <rect x="150" y="270" width="86" height="62" rx="26" fill="${glass}"/>
        <rect x="244" y="270" width="86" height="62" rx="26" fill="${glass}"/>
        <path d="M236 296 q4 -6 8 0" fill="none"/>
        <path d="M150 288 l-22 -8 M330 288 l22 -8" fill="none" stroke-width="3"/>
      </g>
      <path d="M160 278 q18 -10 34 0" fill="none" stroke="#fff" stroke-width="4" opacity=".5" stroke-linecap="round"/>`;
    }
    if (ex.includes('stubble')) {
      out += `<g fill="#6a5a52" opacity=".3">
        <circle cx="204" cy="402" r="2"/><circle cx="218" cy="410" r="1.8"/><circle cx="236" cy="414" r="1.7"/>
        <circle cx="254" cy="412" r="1.8"/><circle cx="270" cy="403" r="2"/><circle cx="278" cy="392" r="1.5"/>
      </g>`;
    }
    if (ex.includes('earrings')) {
      out += `<circle cx="147" cy="330" r="5" fill="#f3e6cf" stroke="#c9ad83" stroke-width="1.4"/><circle cx="333" cy="330" r="5" fill="#f3e6cf" stroke="#c9ad83" stroke-width="1.4"/>`;
    }
    if (ex.includes('necklace')) {
      out += `<path d="M216 476 Q240 500 264 476" fill="none" stroke="#d8c09a" stroke-width="2.2"/><circle cx="240" cy="494" r="4" fill="#e8d2ac"/>`;
    }
    if (ex.includes('lashes')) {
      out += `<g stroke="#2c2130" stroke-width="4" stroke-linecap="round">
        <path d="M160 290 l-8 -4 M157 300 l-9 1"/>
        <path d="M320 290 l8 -4 M323 300 l9 1"/>
      </g>`;
    }
    if (ex.includes('lips')) {
      out += `<path d="M228 375 Q240 369 252 375 Q240 390 228 375 Z" fill="#a9606b" opacity=".75"/>`;
    }
    if (ex.includes('freckles')) {
      out += `<g fill="#b97a5f" opacity=".55"><circle cx="176" cy="355" r="2"/><circle cx="187" cy="362" r="1.7"/><circle cx="167" cy="365" r="1.5"/><circle cx="304" cy="355" r="2"/><circle cx="293" cy="362" r="1.7"/><circle cx="313" cy="365" r="1.5"/></g>`;
    }
    return out;
  }

  function humanPortrait(cfg, exprName) {
    const id = uid();
    const skin = cfg.skinData || SKIN_TONES[cfg.skin ?? 1];
    const hair = cfg.hairData || cfg.hair || HAIR_COLORS[0];
    const eye = cfg.eyeData || cfg.eye || EYE_COLORS[0];
    const shirt = cfg.shirtData || cfg.shirt || SHIRT_COLORS[0];
    const style = cfg.hairStyle || 'short';
    const kid = (cfg.extras || []).includes('kid');
    const expr = EXPRESSIONS[exprName] || EXPRESSIONS.neutral;
    const hairlight = hair.light;
    const browTilt = expr.brow;
    return svg(480, 640, `<defs>
      <linearGradient id="${id}-skin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${skin.base}"/>
        <stop offset=".62" stop-color="${skin.base}"/>
        <stop offset="1" stop-color="${skin.shade}"/>
      </linearGradient>
      <linearGradient id="${id}-neck" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${skin.shade}"/><stop offset="1" stop-color="${skin.deep}"/>
      </linearGradient>
      <linearGradient id="${id}-shirt" x1="0" y1="0" x2=".25" y2="1">
        <stop offset="0" stop-color="${shirt.light}"/><stop offset=".35" stop-color="${shirt.base}"/><stop offset="1" stop-color="${shirt.dark}"/>
      </linearGradient>
      <linearGradient id="${id}-hairback" x1="0" y1="0" x2=".3" y2="1">
        <stop offset="0" stop-color="${hair.base}"/><stop offset="1" stop-color="${hair.dark}"/>
      </linearGradient>
      <linearGradient id="${id}-hairfront" x1="0" y1="0" x2=".2" y2="1">
        <stop offset="0" stop-color="${hair.light}"/><stop offset=".35" stop-color="${hair.base}"/><stop offset="1" stop-color="${hair.dark}"/>
      </linearGradient>
      <radialGradient id="${id}-iris" cx=".38" cy=".3" r=".85">
        <stop offset="0" stop-color="${eye.light}"/><stop offset=".55" stop-color="${eye.base}"/><stop offset="1" stop-color="${eye.dark}"/>
      </radialGradient>
      <radialGradient id="${id}-cheek" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#e98790" stop-opacity=".55"/><stop offset="1" stop-color="#e98790" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${id}-warm" cx=".5" cy=".1" r=".9">
        <stop offset="0" stop-color="#fff6e8" stop-opacity=".35"/><stop offset="1" stop-color="#fff6e8" stop-opacity="0"/>
      </radialGradient>
      <filter id="${id}-soft" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="9"/></filter>
    </defs>
    <g class="portrait-inner">
      <g transform="translate(0 8)">
        ${backHair(style, hair, kid, id)}
      </g>
      ${body(cfg, id, kid)}
      <path d="M205 396 L275 396 L275 470 C275 494 205 494 205 470 Z" fill="url(#${id}-neck)"/>
      <ellipse cx="145" cy="330" rx="18" ry="28" fill="${skin.shade}"/>
      <ellipse cx="335" cy="330" rx="18" ry="28" fill="${skin.shade}"/>
      <path d="M150 ${kid ? 260 : 248} C150 ${kid ? 176 : 162} 330 ${kid ? 176 : 162} 330 ${kid ? 260 : 248} L330 296 C330 374 288 428 240 428 C192 428 150 374 150 296 Z" fill="url(#${id}-skin)"/>
      <path d="M150 254 C176 228 304 228 330 254 C304 270 176 270 150 254 Z" fill="${skin.shade}" opacity=".5"/>
      <path d="M286 300 C300 330 298 366 278 396 C294 384 310 358 314 326 C312 314 300 304 286 300 Z" fill="${skin.shade}" opacity=".28"/>
      <ellipse cx="176" cy="356" rx="30" ry="17" fill="url(#${id}-cheek)"/>
      <ellipse cx="304" cy="356" rx="30" ry="17" fill="url(#${id}-cheek)"/>
      ${brows(expr)}
      <g transform="translate(240 300) scale(${cfg.mature ? 0.92 : 1} ${cfg.mature ? 0.84 : 1}) translate(-240 -300)">
        ${eyes(expr, eye, skin, id, (cfg.extras || []).includes('lashes'))}
      </g>
      <path d="M238 351 Q242 356 247 351" fill="none" stroke="${skin.deep}" stroke-width="2.6" stroke-linecap="round" opacity=".65"/>
      ${mouth(expr, '#8a4d56')}
      <path d="M146 300 C140 274 146 254 154 244" fill="none" stroke="${hair.dark}" stroke-width="3" opacity=".25"/>
      ${frontHair(style, hair, kid, id)}
      <path d="M136 266 C160 240 198 226 240 226" fill="none" stroke="${hair.shine}" stroke-width="2.6" opacity=".3" stroke-linecap="round"/>
      ${extras(cfg, id, skin, eye)}
      <rect x="0" y="0" width="480" height="640" fill="url(#${id}-warm)" pointer-events="none"/>
    </g>`, 'portrait-svg'); // end portrait
  }

  function fennecPortrait(opts = {}) {
    const id = uid();
    const expr = opts.expr || 'neutral';
    const happy = expr === 'happy';
    const sad = expr === 'sad';
    const asleep = expr === 'asleep';
    const collar = opts.collar ? `<g><path d="M178 350 Q240 380 302 350" fill="none" stroke="#4b6f8e" stroke-width="10"/><path d="M178 350 Q240 378 302 350" fill="none" stroke="#7fa8c9" stroke-width="6"/><circle cx="240" cy="374" r="10" fill="#e9cd82"/><circle cx="240" cy="374" r="4" fill="#b79346"/></g>` : '';
    const earL = sad ? 'rotate(18 168 200)' : '';
    const earR = sad ? 'rotate(-18 312 200)' : '';
    const eyes = asleep || happy
      ? `<g fill="none" stroke="#2a2026" stroke-linecap="round" stroke-width="7">
          <path d="M176 274 Q197 254 218 274"/><path d="M262 274 Q283 254 304 274"/>
        </g>`
      : `<g>
          <ellipse cx="197" cy="272" rx="21" ry="26" fill="#241b23"/>
          <ellipse cx="283" cy="272" rx="21" ry="26" fill="#241b23"/>
          <circle cx="190" cy="262" r="7" fill="#fff"/><circle cx="276" cy="262" r="7" fill="#fff"/>
          <circle cx="204" cy="282" r="3.4" fill="#fff" opacity=".8"/><circle cx="290" cy="282" r="3.4" fill="#fff" opacity=".8"/>
          ${sad ? '<path d="M170 292 Q197 306 220 290" fill="none" stroke="#5b4142" stroke-width="3" opacity=".5"/><path d="M260 290 Q283 306 310 292" fill="none" stroke="#5b4142" stroke-width="3" opacity=".5"/>' : '<circle cx="210" cy="270" r="2.4" fill="#fff" opacity=".65"/><circle cx="296" cy="270" r="2.4" fill="#fff" opacity=".65"/>'}
        </g>`;
    const muzzle = `<path d="M202 308 Q240 292 278 308 Q270 344 240 350 Q210 344 202 308 Z" fill="#fbf0dc"/>`;
    const nose = `<path d="M229 314 Q240 307 251 314 Q246 326 240 328 Q234 326 229 314 Z" fill="#4a3334"/>`;
    const mouth = happy
      ? `<path d="M226 336 Q240 352 254 336" fill="none" stroke="#4a3334" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M240 328 L240 338 M240 338 Q230 346 222 338 M240 338 Q250 346 258 338" fill="none" stroke="#4a3334" stroke-width="3.4" stroke-linecap="round"/>`;
    return svg(480, 500, `<defs>
      <linearGradient id="${id}-fur" x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color="#f6e3bd"/><stop offset=".55" stop-color="#e9c690"/><stop offset="1" stop-color="#d3a66d"/>
      </linearGradient>
      <linearGradient id="${id}-fur2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#eed3a4"/><stop offset="1" stop-color="#c89861"/>
      </linearGradient>
      <linearGradient id="${id}-ear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f8e9c8"/><stop offset="1" stop-color="#e2ba83"/>
      </linearGradient>
      <linearGradient id="${id}-inner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7c7bf"/><stop offset="1" stop-color="#e7a39f"/>
      </linearGradient>
      <filter id="${id}-soft"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <g class="fennec-inner">
      <ellipse cx="240" cy="470" rx="180" ry="24" fill="#3a2c35" opacity=".22" filter="url(#${id}-soft)"/>
      <path d="M306 414 C394 404 464 348 462 278 C461 238 438 214 414 226 C390 238 396 272 422 282 C442 290 454 274 450 256 C462 324 418 382 344 408 Z" fill="url(#${id}-fur2)"/>
      <path d="M452 262 C456 238 442 220 426 230 C436 242 440 252 438 266 Z" fill="#5c4238"/>
      <path d="M352 400 C404 380 444 338 452 290" fill="none" stroke="#f4dfbd" stroke-width="7" opacity=".35" stroke-linecap="round"/>
      <ellipse cx="240" cy="410" rx="120" ry="88" fill="url(#${id}-fur2)"/>
      <ellipse cx="240" cy="428" rx="86" ry="62" fill="#f6e4c5"/>
      <g transform="${earL}">
        <path d="M188 238 C160 150 130 58 118 34 C160 24 232 126 252 220 Z" fill="url(#${id}-ear)" stroke="#c99a63" stroke-width="2"/>
        <path d="M184 222 C162 152 142 90 134 64 C166 62 220 142 236 216 Z" fill="url(#${id}-inner)"/>
        <path d="M150 90 C146 132 158 180 176 210" fill="none" stroke="#fff3de" stroke-width="3" opacity=".4" stroke-linecap="round"/>
      </g>
      <g transform="${earR}">
        <path d="M292 238 C320 150 350 58 362 34 C320 24 248 126 228 220 Z" fill="url(#${id}-ear)" stroke="#c99a63" stroke-width="2"/>
        <path d="M296 222 C318 152 338 90 346 64 C314 62 260 142 244 216 Z" fill="url(#${id}-inner)"/>
        <path d="M330 90 C334 132 322 180 304 210" fill="none" stroke="#fff3de" stroke-width="3" opacity=".4" stroke-linecap="round"/>
      </g>
      <ellipse cx="240" cy="272" rx="112" ry="100" fill="url(#${id}-fur)"/>
      <path d="M144 258 C158 214 210 196 240 198 C270 196 322 214 336 258 C310 238 276 232 240 232 C204 232 170 238 144 258 Z" fill="#f9e9c9" opacity=".55"/>
      ${muzzle}
      ${eyes}
      ${nose}
      ${mouth}
      <g stroke="#8a6a52" stroke-width="2" opacity=".5" stroke-linecap="round">
        <path d="M190 330 L150 322 M190 338 L148 340"/><path d="M290 330 L330 322 M290 338 L332 340"/>
      </g>
      ${collar}
      <ellipse cx="184" cy="444" rx="34" ry="24" fill="#f2ddba"/>
      <ellipse cx="296" cy="444" rx="34" ry="24" fill="#f2ddba"/>
      <path d="M172 452 q12 10 24 0 M284 452 q12 10 24 0" fill="none" stroke="#b98b5c" stroke-width="2.5" opacity=".6"/>
      ${happy ? '<g fill="#f0a9a0" opacity=".55"><circle cx="154" cy="308" r="13"/><circle cx="326" cy="308" r="13"/></g>' : ''}
    </g>`, 'portrait-svg fennec-svg');
  }

  function portrait(character, opts = {}) {
    if (character === 'fennec') return fennecPortrait(opts);
    if (character === 'player') {
      const looks = opts.looks || {};
      const cfg = {
        skinData: SKIN_TONES[looks.skin ?? 1],
        hairData: HAIR_COLORS[looks.hair ?? 0],
        eyeData: EYE_COLORS[looks.eye ?? 0],
        shirtData: SHIRT_COLORS[looks.shirt ?? 0],
        hairStyle: looks.hairStyle || 'short',
        extras: [],
      };
      return humanPortrait(cfg, opts.expr || 'neutral');
    }
    const base = NPC[character];
    if (!base) return humanPortrait(NPC.player, opts.expr || 'neutral');
    return humanPortrait({ ...base }, opts.expr || base.defaultExpr || 'neutral');
  }

  /* ========================================================================
     ФОНЫ
     ======================================================================== */

  function bedroom(time = 'evening', withFen = false) {
    const id = uid();
    const night = time === 'night';
    const day = time === 'day';
    const wallTop = night ? '#3c3b53' : day ? '#f6ead8' : '#efd9c4';
    const wallBot = night ? '#2b2b40' : day ? '#eadac6' : '#e0c5ad';
    const floorA = night ? '#2a2433' : '#8a5f44';
    const floorB = night ? '#211c2a' : '#7a523b';
    const accent = night ? '#4b4665' : '#c98d6b';
    const skyTime = night ? 'night' : day ? 'day' : 'evening';
    const windowGlow = night ? '#ffe0a0' : day ? '#fff8e6' : '#ffd0a0';
    const lampGlow = night ? 0.95 : 0.35;
    return svg(1600, 900, `<defs>
      ${windowSky(skyTime, id)}
      <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wallTop}"/><stop offset="1" stop-color="${wallBot}"/></linearGradient>
      <linearGradient id="${id}-floor" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="${floorA}"/><stop offset="1" stop-color="${floorB}"/></linearGradient>
      <linearGradient id="${id}-blanket" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="${night ? '#3f6170' : '#5f8b8d'}"/><stop offset="1" stop-color="${night ? '#2c4652' : '#3d686d'}"/></linearGradient>
      <radialGradient id="${id}-lamp"><stop offset="0" stop-color="#ffd48a" stop-opacity="${lampGlow}"/><stop offset=".45" stop-color="#ffbd6c" stop-opacity="${lampGlow * 0.35}"/><stop offset="1" stop-color="#ffbd6c" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-wlight"><stop offset="0" stop-color="${windowGlow}" stop-opacity="${night ? .3 : .42}"/><stop offset="1" stop-color="${windowGlow}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}-curtain" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${night ? '#3a344e' : '#e4c9b6'}"/><stop offset=".5" stop-color="${night ? '#514a68' : '#f5e2d2'}"/><stop offset="1" stop-color="${night ? '#3a344e' : '#d8b8a3'}"/></linearGradient>
      <filter id="${id}-blur"><feGaussianBlur stdDeviation="16"/></filter>
      <filter id="${id}-blur2"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <rect width="1600" height="900" fill="url(#${id}-wall)"/>
    <rect x="0" y="690" width="1600" height="210" fill="url(#${id}-floor)"/>
    <g opacity="${night ? .35 : .25}" stroke="${night ? '#756490' : '#8d624c'}" stroke-width="2">
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${-100 + i * 230} 900 L${420 + i * 160} 690"/>`).join('')}
      <path d="M0 760 H1600 M0 830 H1600"/>
    </g>
    <rect x="0" y="670" width="1600" height="26" fill="${night ? '#1c1926' : '#b98d6d'}"/>
    <!-- окно -->
    <g>
      <rect x="936" y="96" width="486" height="472" rx="14" fill="${night ? '#1b2038' : '#f4e6d3'}" stroke="${night ? '#5c5876' : '#c9a98d'}" stroke-width="10"/>
      <rect x="958" y="118" width="442" height="410" fill="url(#${id}-sky)"/>
      <g>
        ${night ? starList(34, 442, 240, 12, '#fff4cf', 0.8, 2.1) : ''}
        ${night ? `<circle cx="1300" cy="198" r="44" fill="#fff3ce" opacity=".95"/><circle cx="1284" cy="186" r="10" fill="#efdcaf" opacity=".6"/><circle cx="1314" cy="214" r="7" fill="#efdcaf" opacity=".5"/>` : day ? `<circle cx="1280" cy="180" r="36" fill="#fff8df" opacity=".85"/>` : `<circle cx="1284" cy="216" r="38" fill="#ffdca0" opacity=".8"/>`}
        ${clouds(442, 180, night ? '#c8c3e0' : '#fff4e2', night ? .16 : .5, 4, 92)}
        <g fill="${night ? '#161c32' : '#8a7589'}" opacity="${night ? .9 : .55}">
          <rect x="958" y="420" width="70" height="108"/><rect x="1042" y="392" width="58" height="136"/><rect x="1114" y="440" width="84" height="88"/><rect x="1214" y="372" width="66" height="156"/><rect x="1294" y="414" width="106" height="114"/>
          <rect x="965" y="432" width="8" height="10" fill="${night ? '#ffd77f' : '#d8bca2'}"/><rect x="982" y="452" width="8" height="10" fill="${night ? '#ffd77f' : '#d8bca2'}"/><rect x="1052" y="410" width="8" height="10" fill="${night ? '#ffd77f' : '#d8bca2'}"/><rect x="1073" y="430" width="8" height="10" fill="${night ? '#ffd77f' : '#d8bca2'}"/><rect x="1225" y="392" width="8" height="10" fill="${night ? '#ffd77f' : '#d8bca2'}"/><rect x="1242" y="416" width="8" height="10" fill="${night ? '#ffd77f' : '#d8bca2'}"/>
        </g>
        <path d="M958 500 Q1080 462 1200 500 T1400 490 V528 H958 Z" fill="${night ? '#121828' : '#7d8f78'}" opacity=".85"/>
      </g>
      <path d="M1150 118 V528 M958 330 H1400" stroke="${night ? '#3b3a52' : '#f4e6d3'}" stroke-width="12"/>
      <rect x="926" y="552" width="506" height="20" rx="6" fill="${night ? '#56516e' : '#d7b99d'}"/>
      <g>
        <path d="M934 120 C900 210 906 380 942 548 L1008 548 C972 388 976 230 1000 120 Z" fill="url(#${id}-curtain)"/>
        <path d="M1440 120 C1474 210 1468 380 1432 548 L1366 548 C1402 388 1398 230 1374 120 Z" fill="url(#${id}-curtain)"/>
        <path d="M960 130 C944 260 948 420 968 530 M1414 130 C1430 260 1426 420 1406 530" stroke="${night ? '#69617f' : '#c7a48f'}" stroke-width="4" opacity=".45" fill="none"/>
      </g>
    </g>
    <ellipse cx="1240" cy="360" rx="420" ry="320" fill="url(#${id}-wlight)"/>
    <!-- постеры и полка -->
    <g>
      <rect x="250" y="146" width="220" height="230" rx="4" fill="${night ? '#252335' : '#f7eddc'}" stroke="${night ? '#514a68' : '#c9a98d'}" stroke-width="7"/>
      <rect x="264" y="160" width="192" height="202" fill="${night ? '#1b2a3f' : '#9cc1c6'}"/>
      <path d="M264 330 L322 246 L366 300 L406 232 L456 330 Z" fill="${night ? '#263d52' : '#5f8188'}"/>
      <circle cx="302" cy="204" r="20" fill="${night ? '#e6d29b' : '#f4d79a'}"/>
      <text x="284" y="352" font-family="Manrope, sans-serif" font-size="13" letter-spacing="3" fill="${night ? '#a99fc0' : '#6d7978'}">МОЙ ГОРОД</text>
      <rect x="520" y="178" width="146" height="118" rx="3" fill="${night ? '#2a2739' : '#fbf4e7'}" stroke="${night ? '#514a68' : '#c9a98d'}" stroke-width="6"/>
      <path d="M536 268 L572 226 L600 254 L626 220 L650 268 Z" fill="${night ? '#33405b' : '#b8896b'}" opacity=".8"/>
      <circle cx="632" cy="204" r="10" fill="${night ? '#e8d49b' : '#f0cf94'}"/>
      <rect x="742" y="318" width="180" height="12" rx="3" fill="${night ? '#5b4c46' : '#a77752'}"/>
      <rect x="760" y="282" width="16" height="36" fill="${night ? '#3e4c63' : '#6d8a8d'}"/><rect x="780" y="276" width="12" height="42" fill="${night ? '#6b4d61' : '#b36f78'}"/><rect x="796" y="288" width="18" height="30" fill="${night ? '#5d5741' : '#8d9a73'}"/><rect x="818" y="284" width="10" height="34" fill="${night ? '#4a516b' : '#6b7f9d'}"/>
      <path d="M872 316 c-16 -22 -4 -46 16 -34 c4 -20 30 -20 32 0 c18 -8 28 18 10 34 Z" fill="${night ? '#425c4d' : '#6d8f74'}"/>
      <rect x="868" y="316" width="46" height="30" rx="4" fill="${night ? '#4b3d3b' : '#b97a5c'}"/>
    </g>
    <!-- гирлянда -->
    <g>
      <path d="M90 96 C300 168 560 128 760 100 C980 70 1210 150 1420 88" fill="none" stroke="${night ? '#655d7f' : '#b59b86'}" stroke-width="3" opacity=".6"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
        const x = 120 + i * 116, y = 106 + Math.sin(i * 1.4) * 28 + (i > 8 ? -12 : 0);
        return `<circle cx="${x}" cy="${y.toFixed(0)}" r="7" fill="${night ? '#ffd98c' : '#e8c79a'}" opacity="${night ? .95 : .5}"/>
        <circle cx="${x}" cy="${y.toFixed(0)}" r="16" fill="#ffd98c" opacity="${night ? .14 : .05}"/>`;
      }).join('')}
    </g>
    <!-- кровать -->
    <g>
      <rect x="130" y="328" width="540" height="466" rx="10" fill="${night ? '#241f2c' : '#6b4a36'}"/>
      <rect x="150" y="352" width="500" height="400" rx="16" fill="${night ? '#2d283a' : '#d9b797'}"/>
      <rect x="164" y="384" width="472" height="120" rx="18" fill="${night ? '#393247' : '#f3e3cd'}"/>
      <rect x="196" y="402" width="180" height="86" rx="26" fill="${night ? '#4b4359' : '#fbf1e1'}"/>
      <rect x="408" y="402" width="180" height="86" rx="26" fill="${night ? '#443d52' : '#f6e8d5'}"/>
      <path d="M164 526 Q300 500 430 536 Q520 560 636 530 V724 Q450 760 164 724 Z" fill="url(#${id}-blanket)"/>
      <path d="M176 540 Q320 514 440 548 Q530 572 628 544" fill="none" stroke="${night ? '#5b7f8b' : '#8db3b0'}" stroke-width="7" opacity=".5"/>
      <path d="M170 700 Q360 730 632 694" fill="none" stroke="${night ? '#243b46' : '#2e555b'}" stroke-width="20" opacity=".4"/>
      <rect x="126" y="300" width="556" height="44" rx="12" fill="${night ? '#332b3d' : '#7a543c'}"/>
      <g transform="translate(548 498)">
        <ellipse cx="0" cy="26" rx="44" ry="26" fill="${night ? '#8a684e' : '#c08c63'}"/>
        <circle cx="0" cy="-6" r="34" fill="${night ? '#a17b5c' : '#d2a077'}"/>
        <circle cx="-24" cy="-34" r="11" fill="${night ? '#a17b5c' : '#d2a077'}"/><circle cx="24" cy="-34" r="11" fill="${night ? '#a17b5c' : '#d2a077'}"/>
        <circle cx="-12" cy="-10" r="3" fill="#3d2b2c"/><circle cx="12" cy="-10" r="3" fill="#3d2b2c"/>
        <path d="M-6 6 Q0 12 6 6" stroke="#3d2b2c" stroke-width="2.4" fill="none"/>
      </g>
    </g>
    <!-- стол -->
    <g>
      <rect x="950" y="590" width="526" height="24" rx="6" fill="${night ? '#4b3d3a' : '#a97752'}"/>
      <rect x="972" y="614" width="16" height="176" fill="${night ? '#3b312f' : '#8e6042'}"/>
      <rect x="1434" y="614" width="16" height="176" fill="${night ? '#3b312f' : '#8e6042'}"/>
      <rect x="1040" y="548" width="148" height="42" rx="4" fill="${night ? '#2b3447' : '#f3e5d0'}" transform="rotate(-2 1114 569)"/>
      <rect x="1066" y="520" width="106" height="32" rx="3" fill="${night ? '#3b465e' : '#fff7e8'}" transform="rotate(2 1119 536)"/>
      <path d="M1090 536 h52 M1094 546 h32" stroke="${night ? '#7d8ba8' : '#b8a58c'}" stroke-width="2" opacity=".6"/>
      <g>
        <rect x="1258" y="484" width="58" height="106" rx="5" fill="${night ? '#3b3a56' : '#6d7f91'}"/>
        <rect x="1266" y="492" width="42" height="90" rx="3" fill="${night ? '#7f94c2' : '#cfe0e6'}"/>
        <path d="M1262 590 h50 l10 12 h-70 Z" fill="${night ? '#2a2a40' : '#4f5c69'}"/>
        <circle cx="1287" cy="470" r="28" fill="url(#${id}-lamp)"/>
        <path d="M1287 476 v-12" stroke="${night ? '#6f5a50' : '#8e6a52'}" stroke-width="4"/>
        <path d="M1262 464 h50 l-8 -22 h-34 Z" fill="${night ? '#d8b68a' : '#e7c89f'}"/>
      </g>
      <g transform="translate(1392 548)">
        <rect x="0" y="0" width="48" height="64" rx="6" fill="${night ? '#3c4d43' : '#7d9274'}"/>
        <path d="M24 4 C4 -18 4 -30 24 -26 C44 -30 44 -18 24 4 Z" fill="${night ? '#55705a' : '#93aa7c'}"/>
        <path d="M24 2 v-20" stroke="${night ? '#394a3e' : '#657b5d'}" stroke-width="2"/>
      </g>
      <g>
        <rect x="924" y="650" width="126" height="18" rx="6" fill="${night ? '#453b3d' : '#8e6a52'}"/>
        <rect x="950" y="668" width="12" height="88" fill="${night ? '#3b3132' : '#6d4c39'}"/>
        <rect x="1014" y="668" width="12" height="88" fill="${night ? '#3b3132' : '#6d4c39'}"/>
        <rect x="936" y="608" width="104" height="44" rx="10" fill="${night ? '#3c3650' : '#8d6a5f'}"/>
        <rect x="930" y="640" width="116" height="22" rx="8" fill="${night ? '#4b425c' : '#9d7669'}"/>
      </g>
    </g>
    <!-- ковёр -->
    <g>
      <path d="M560 748 L1060 724 L1160 862 L500 884 Z" fill="${night ? '#443b51' : '#c98572'}" opacity=".9"/>
      <path d="M590 764 L1036 744 L1114 846 L548 864 Z" fill="${night ? '#51465f' : '#ddb09a'}"/>
      <g stroke="${night ? '#877597' : '#a8615a'}" stroke-width="8" opacity=".55">
        <path d="M620 780 L1050 762 M608 806 L1070 786 M598 832 L1090 812"/>
      </g>
    </g>
    <!-- коробка фенека -->
    ${withFen ? `<g transform="translate(700 690)">
      <rect x="0" y="38" width="150" height="70" rx="10" fill="${night ? '#4a3b42' : '#b9845f'}"/>
      <rect x="8" y="46" width="134" height="52" rx="8" fill="${night ? '#6e4f56' : '#d8a77d'}"/>
      <path d="M14 58 Q75 34 136 58 L136 96 L14 96 Z" fill="${night ? '#5d4a61' : '#d98b9a'}"/>
      <ellipse cx="76" cy="104" rx="54" ry="12" fill="${night ? '#2a2431' : '#8b5a44'}" opacity=".5"/>
      <ellipse cx="178" cy="100" rx="24" ry="9" fill="${night ? '#3e3d58' : '#88a5a8'}"/>
      <ellipse cx="178" cy="98" rx="16" ry="4" fill="${night ? '#7f8fae' : '#d9ecec'}" opacity=".7"/>
    </g>` : ''}
    <!-- свет и пыль -->
    <ellipse cx="1240" cy="420" rx="500" ry="420" fill="url(#${id}-wlight)" opacity=".7"/>
    <g opacity="${night ? .8 : .32}">
      ${starList(18, 600, 560, 33, night ? '#ffe6a8' : '#fff6df', 1.2, 3, 14).replace(/cx="([\d.]+)" cy="([\d.]+)"/g, (m, x, y) => `cx="${(+x + 950).toFixed(1)}" cy="${(+y + 80).toFixed(1)}"`)}
    </g>
    <rect width="1600" height="900" fill="${night ? '#0b1026' : '#3a1e0e'}" opacity="${night ? .26 : .05}"/>
  `, 'bg-svg');
  }

  function kitchen(time = 'evening') {
    const id = uid();
    const rain = time === 'rain';
    const morning = time === 'morning';
    const night = time === 'night';
    const skyTime = rain ? 'rain' : morning ? 'morning' : night ? 'night' : 'evening';
    const wall = rain ? '#6d5a58' : morning ? '#f4e5cf' : night ? '#33334a' : '#e7cdb4';
    const wall2 = rain ? '#5a4a4c' : morning ? '#ecd6b9' : night ? '#292a3f' : '#d9b898';
    const wood = rain ? '#7a5546' : morning ? '#b07d52' : night ? '#453a44' : '#9a6a4b';
    const counter = rain ? '#8b7868' : morning ? '#f7ead4' : night ? '#4a4a63' : '#e3cdb3';
    return svg(1600, 900, `<defs>
      ${windowSky(skyTime, id)}
      <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wall}"/><stop offset="1" stop-color="${wall2}"/></linearGradient>
      <linearGradient id="${id}-cab" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="${rain ? '#6e7f73' : morning ? '#8fa99a' : night ? '#3f4e55' : '#6f9187'}"/><stop offset="1" stop-color="${rain ? '#4d5d55' : morning ? '#6f8a7b' : night ? '#2b373c' : '#537068'}"/></linearGradient>
      <linearGradient id="${id}-wood" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="${wood}"/><stop offset="1" stop-color="${rain ? '#5d4037' : morning ? '#8e603c' : night ? '#2e2930' : '#7a4e36'}"/></linearGradient>
      <radialGradient id="${id}-lamp"><stop offset="0" stop-color="#ffd48a" stop-opacity="${night ? .95 : .7}"/><stop offset=".4" stop-color="#ffc477" stop-opacity=".28"/><stop offset="1" stop-color="#ffc477" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-window"><stop offset="0" stop-color="${morning ? '#fff5d9' : '#ffd9a3'}" stop-opacity=".42"/><stop offset="1" stop-color="#ffd9a3" stop-opacity="0"/></radialGradient>
      <filter id="${id}-blur"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <rect width="1600" height="900" fill="url(#${id}-wall)"/>
    <rect x="0" y="690" width="1600" height="60" fill="${rain ? '#4a3a38' : morning ? '#d7b78e' : night ? '#26222c' : '#b98b64'}"/>
    <rect x="0" y="742" width="1600" height="158" fill="${wood}" opacity=".75"/>
    <g opacity=".22" stroke="${rain ? '#2d2426' : '#6d452f'}" stroke-width="2">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M${i * 210} 900 L${i * 190 + 90} 742"/>`).join('')}
    </g>
    <!-- верхние шкафы -->
    <g>
      <rect x="110" y="86" width="450" height="230" rx="10" fill="url(#${id}-cab)"/>
      <rect x="130" y="104" width="190" height="192" rx="6" fill="${rain ? '#5c6d62' : morning ? '#7e998c' : night ? '#354349' : '#62857b'}"/>
      <rect x="350" y="104" width="190" height="192" rx="6" fill="${rain ? '#5c6d62' : morning ? '#7e998c' : night ? '#354349' : '#62857b'}"/>
      <circle cx="315" cy="200" r="6" fill="#d8c09a"/><circle cx="340" cy="200" r="6" fill="#d8c09a"/>
      <circle cx="535" cy="200" r="6" fill="#d8c09a"/><circle cx="360" cy="200" r="6" fill="#d8c09a"/>
      <rect x="620" y="120" width="300" height="196" rx="10" fill="url(#${id}-cab)"/>
      <rect x="640" y="138" width="120" height="160" rx="5" fill="${rain ? '#5c6d62' : morning ? '#7e998c' : night ? '#354349' : '#62857b'}"/>
      <rect x="780" y="138" width="120" height="160" rx="5" fill="${rain ? '#5c6d62' : morning ? '#7e998c' : night ? '#354349' : '#62857b'}"/>
      <circle cx="760" cy="220" r="6" fill="#d8c09a"/><circle cx="790" cy="220" r="6" fill="#d8c09a"/>
    </g>
    <!-- окно -->
    <g>
      <rect x="1000" y="110" width="340" height="320" rx="10" fill="${night ? '#1b2038' : '#f1e1cb'}" stroke="${night ? '#5a5772' : '#c9a98d'}" stroke-width="10"/>
      <rect x="1018" y="128" width="304" height="284" fill="url(#${id}-sky)"/>
      ${rain ? `<g stroke="#c9d3e0" stroke-width="2" opacity=".55">${Array.from({ length: 34 }, (_, i) => `<path d="M${1018 + (i * 47) % 304} ${132 + (i * 71) % 240} l-8 34"/>`).join('')}</g>` : ''}
      ${night ? starList(12, 304, 150, 5, '#fff0c7', .8, 1.8) : ''}
      <g fill="${rain ? '#46524c' : morning ? '#7b9b6f' : '#5b6b58'}" opacity="${night ? .55 : .8}">
        <ellipse cx="1100" cy="360" rx="100" ry="56"/><ellipse cx="1240" cy="356" rx="120" ry="64"/>
        <rect x="1090" y="330" width="12" height="80"/><rect x="1230" y="320" width="14" height="90"/>
      </g>
      <path d="M1180 128 V412 M1018 270 H1322" stroke="${night ? '#403d55' : '#f1e1cb'}" stroke-width="10"/>
      <rect x="988" y="428" width="364" height="18" rx="5" fill="${night ? '#504b62' : '#d7b99d'}"/>
      <g transform="translate(1320 372)">
        <rect x="0" y="0" width="34" height="42" rx="5" fill="#b96f78"/>
        <path d="M8 0 C6 -18 16 -24 17 0 C18 -24 28 -18 26 0 Z" fill="${rain ? '#5b7a5e' : '#7f9f73'}"/>
      </g>
      <ellipse cx="1170" cy="290" rx="250" ry="220" fill="url(#${id}-window)" opacity=".62"/>
    </g>
    <!-- холодильник -->
    <g>
      <rect x="120" y="330" width="300" height="380" rx="14" fill="${night ? '#5a5a70' : rain ? '#b9b5ae' : '#e9e3d8'}" stroke="${night ? '#3c3a50' : '#c9bba8'}" stroke-width="5"/>
      <path d="M120 470 H420" stroke="${night ? '#3c3a50' : '#c9bba8'}" stroke-width="5"/>
      <rect x="380" y="400" width="12" height="48" rx="6" fill="${night ? '#a4a0b5' : '#9e9385'}"/>
      <rect x="380" y="500" width="12" height="40" rx="6" fill="${night ? '#a4a0b5' : '#9e9385'}"/>
      <g>
        <rect x="160" y="366" width="58" height="70" rx="3" fill="#f6e7c9" transform="rotate(-3 189 401)"/>
        <path d="M168 390 h40 M168 402 h30 M168 414 h34" stroke="#b08d6a" stroke-width="3"/>
        <rect x="238" y="372" width="64" height="48" rx="4" fill="#f2d6c8" transform="rotate(4 270 396)"/>
        <circle cx="256" cy="390" r="8" fill="#a76a5e"/><path d="M252 410 q14 8 28 0" stroke="#a76a5e" stroke-width="3" fill="none"/>
        <circle cx="300" cy="364" r="17" fill="#83a1b2"/><circle cx="300" cy="364" r="9" fill="#f5ebd9"/>
        <rect x="160" y="500" width="70" height="54" rx="4" fill="#f6e7c9" transform="rotate(2 195 527)"/>
        <path d="M172 518 h44 M172 530 h34" stroke="#b08d6a" stroke-width="3"/>
        <rect x="260" y="506" width="76" height="42" rx="10" fill="#7e9a8c"/>
        <path d="M274 518 q14 -12 28 0" fill="none" stroke="#e7d8bd" stroke-width="3"/>
      </g>
    </g>
    <!-- нижние шкафы и плита -->
    <g>
      <rect x="440" y="500" width="1120" height="210" rx="8" fill="${night ? '#3b3a4a' : rain ? '#77645a' : morning ? '#c39466' : '#a97955'}"/>
      <rect x="440" y="486" width="1120" height="26" rx="6" fill="${counter}"/>
      <g stroke="${night ? '#2e2d3a' : '#7d5239'}" stroke-width="3" fill="none" opacity=".6">
        <path d="M620 520 V700 M800 520 V700 M980 520 V700 M1160 520 V700 M1340 520 V700"/>
      </g>
      <g fill="${night ? '#8c8a9f' : '#e3d3b8'}">
        <circle cx="530" cy="530" r="5"/><circle cx="530" cy="560" r="5"/><circle cx="710" cy="530" r="5"/><circle cx="890" cy="530" r="5"/><circle cx="1070" cy="530" r="5"/><circle cx="1250" cy="530" r="5"/><circle cx="1430" cy="530" r="5"/>
      </g>
      <rect x="676" y="472" width="252" height="36" rx="9" fill="${night ? '#2b2a36' : '#6b5f58'}" opacity=".55"/>
      <g>
        <circle cx="736" cy="492" r="16" fill="${night ? '#4d4a56' : '#6e6a64'}"/><circle cx="792" cy="492" r="16" fill="${night ? '#4d4a56' : '#6e6a64'}"/><circle cx="848" cy="492" r="16" fill="${night ? '#4d4a56' : '#6e6a64'}"/>
        <path d="M720 492 h32 M776 492 h32 M832 492 h32" stroke="${night ? '#181720' : '#3b3834'}" stroke-width="4"/>
      </g>
      <g transform="translate(1060 440)">
        <path d="M0 44 C-6 12 16 8 20 24 C22 6 46 10 44 34 L40 52 H4 Z" fill="${night ? '#8ea2b6' : '#cfd8d6'}"/>
        <path d="M10 38 h24" stroke="${night ? '#627487' : '#9ea9a8'}" stroke-width="3"/>
        <rect x="0" y="52" width="46" height="6" rx="3" fill="${night ? '#565b6a' : '#8e999a'}"/>
      </g>
      <g transform="translate(1160 470)">
        <ellipse cx="0" cy="0" rx="58" ry="16" fill="${night ? '#3e4252' : '#e8d7be'}"/>
        <path d="M-46 -2 Q0 20 46 -2 Q40 12 0 16 Q-40 12 -46 -2 Z" fill="${night ? '#565d70' : '#cbb69a'}"/>
        <circle cx="-18" cy="-6" r="10" fill="${night ? '#c98c4b' : '#e0a05a'}"/>
        <circle cx="16" cy="-8" r="11" fill="${night ? '#b84d45' : '#c9584e'}"/>
        <path d="M10 -18 q4 -8 10 -4" fill="none" stroke="${night ? '#64704f' : '#6b8a5b'}" stroke-width="3"/>
      </g>
    </g>
    <!-- стол -->
    <g>
      <ellipse cx="780" cy="752" rx="350" ry="104" fill="${night ? '#332c38' : rain ? '#5d443c' : morning ? '#c29366' : '#9b6c4c'}"/>
      <ellipse cx="780" cy="736" rx="350" ry="104" fill="${night ? '#484050' : rain ? '#76584b' : morning ? '#d8a977' : '#b48560'}"/>
      <ellipse cx="780" cy="732" rx="310" ry="86" fill="${night ? '#51495a' : rain ? '#82604f' : morning ? '#e8c293' : '#c39570'}" opacity=".65"/>
      <rect x="552" y="806" width="18" height="94" fill="${night ? '#2f2832' : '#76523b'}"/>
      <rect x="990" y="806" width="18" height="94" fill="${night ? '#2f2832' : '#76523b'}"/>
      <g>
        <ellipse cx="650" cy="724" rx="46" ry="15" fill="${night ? '#b7afa3' : '#f1e6d2'}"/>
        <path d="M620 722 q0 -42 30 -42 q30 0 30 42" fill="${night ? '#cfc7b9' : '#f8efdf'}"/>
        <path d="M628 722 q4 -22 12 -30" fill="none" stroke="${night ? '#8f887d' : '#d8c8b2'}" stroke-width="3"/>
        <ellipse cx="650" cy="686" rx="32" ry="7" fill="${night ? '#8f887d' : '#d8c8b2'}" opacity=".5"/>
      </g>
      <g>
        <ellipse cx="878" cy="736" rx="58" ry="18" fill="${night ? '#b7afa3' : '#f4e8d5'}"/>
        <path d="M840 734 q0 -34 38 -34 q38 0 38 34" fill="${night ? '#d3cabb' : '#fbf2e2'}"/>
        <circle cx="866" cy="716" r="12" fill="#d98b60"/><circle cx="886" cy="714" r="10" fill="#c96a58"/>
        <path d="M858 700 q6 -10 16 -2" fill="none" stroke="#6e8a5d" stroke-width="3"/>
        <path d="M852 706 q12 -10 24 -4" fill="none" stroke="#7a9c67" stroke-width="2.5"/>
      </g>
      <g>
        <path d="M1050 736 q-24 -20 -10 -34 q12 -12 22 4 q10 -16 24 -4 q14 14 -10 34 Z" fill="${night ? '#7c5b62' : '#d98b9a'}" opacity=".8"/>
        <path d="M1050 734 q-14 -10 -6 -18 q8 -8 14 4 q6 -12 16 -4 q8 8 -6 18 Z" fill="${night ? '#a57982' : '#f2b5c0'}" opacity=".7"/>
      </g>
      <g stroke="${night ? '#8e8796' : '#b99b7f'}" stroke-width="3" fill="none" opacity=".7">
        <path d="M944 770 q22 -8 44 0 M1000 780 q22 -6 40 0"/>
      </g>
    </g>
    <!-- стулья -->
    <g>
      <g transform="translate(500 748)">
        <rect x="-24" y="0" width="24" height="130" rx="5" fill="${night ? '#3b3039' : '#875b3f'}"/>
        <rect x="-96" y="-40" width="84" height="90" rx="10" fill="${night ? '#493b43' : '#a36e4a'}"/>
        <rect x="-24" y="70" width="90" height="14" rx="5" fill="${night ? '#3b3039' : '#875b3f'}"/>
        <rect x="52" y="70" width="12" height="66" fill="${night ? '#3b3039' : '#875b3f'}"/>
      </g>
      <g transform="translate(1110 756)">
        <rect x="0" y="0" width="24" height="130" rx="5" fill="${night ? '#3b3039' : '#875b3f'}"/>
        <rect x="10" y="-40" width="84" height="90" rx="10" fill="${night ? '#493b43' : '#a36e4a'}"/>
        <rect x="-66" y="70" width="90" height="14" rx="5" fill="${night ? '#3b3039' : '#875b3f'}"/>
        <rect x="-64" y="70" width="12" height="66" fill="${night ? '#3b3039' : '#875b3f'}"/>
      </g>
    </g>
    <!-- лампа -->
    <g>
      <path d="M780 0 V96" stroke="${night ? '#5f586a' : '#8b7460'}" stroke-width="4"/>
      <path d="M716 140 L844 140 L820 86 L740 86 Z" fill="${night ? '#e3c28d' : '#e7c89f'}"/>
      <path d="M716 140 h128" stroke="${night ? '#b89868' : '#c9a878'}" stroke-width="6"/>
      <ellipse cx="780" cy="250" rx="280" ry="190" fill="url(#${id}-lamp)" opacity="${night ? .8 : .55}"/>
      <rect x="100" y="314" width="820" height="16" fill="#3b2115" opacity=".13"/>
      <rect x="430" y="498" width="1140" height="16" fill="#4a2a14" opacity=".16"/>
      <g stroke="#8e6f5d" stroke-width="2" opacity=".13">
        <path d="M440 352 H980 M440 400 H980 M440 448 H980"/>
        <path d="M530 340 V486 M620 340 V486 M710 340 V486 M800 340 V486 M890 340 V486 M970 340 V486"/>
      </g>
    </g>
    <rect width="1600" height="900" fill="${rain ? '#1a1a2a' : night ? '#090d20' : '#3a1e0e'}" opacity="${rain ? .18 : night ? .28 : .04}"/>
  `, 'bg-svg');
  }

  function livingroom() {
    const id = uid();
    return svg(1600, 900, `<defs>
      ${windowSky('evening', id)}
      <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8cbb4"/><stop offset="1" stop-color="#d5ae92"/></linearGradient>
      <linearGradient id="${id}-floor" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#8a5d43"/><stop offset="1" stop-color="#6e4633"/></linearGradient>
      <linearGradient id="${id}-sofa" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#7f9a8b"/><stop offset="1" stop-color="#5d786c"/></linearGradient>
      <radialGradient id="${id}-tv"><stop offset="0" stop-color="#9fc7d8" stop-opacity=".55"/><stop offset="1" stop-color="#9fc7d8" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-lamp"><stop offset="0" stop-color="#ffd48a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd48a" stop-opacity="0"/></radialGradient>
      <filter id="${id}-soft"><feGaussianBlur stdDeviation="14"/></filter>
    </defs>
    <rect width="1600" height="900" fill="url(#${id}-wall)"/>
    <rect x="0" y="690" width="1600" height="210" fill="url(#${id}-floor)"/>
    <g opacity=".25" stroke="#6d452f" stroke-width="2">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M${i * 210} 900 L${i * 190 + 90} 690"/>`).join('')}
    </g>
    <rect x="0" y="672" width="1600" height="24" fill="#b98d6d"/>
    <g>
      <rect x="980" y="130" width="330" height="310" rx="10" fill="#f4e6d3" stroke="#c9a98d" stroke-width="9"/>
      <rect x="998" y="148" width="294" height="274" fill="url(#${id}-sky)"/>
      ${clouds(294, 180, '#fff1dd', .38, 17, 160)}
      <path d="M998 360 Q1080 320 1160 352 T1292 342 V422 H998 Z" fill="#5b6b58" opacity=".8"/>
      <path d="M1145 148 V422 M998 280 H1292" stroke="#f4e6d3" stroke-width="9"/>
      <rect x="968" y="430" width="354" height="18" rx="5" fill="#d7b99d"/>
      <g>
        <path d="M962 154 C934 240 940 380 970 466 L1016 466 C992 340 996 236 1014 154 Z" fill="#e4c9b6"/>
        <path d="M1308 154 C1336 240 1330 380 1300 466 L1254 466 C1278 340 1274 236 1256 154 Z" fill="#d8b8a3"/>
      </g>
    </g>
    <!-- диван -->
    <g>
      <rect x="150" y="480" width="640" height="240" rx="30" fill="url(#${id}-sofa)"/>
      <rect x="120" y="580" width="700" height="130" rx="34" fill="#6b8678"/>
      <rect x="190" y="520" width="260" height="120" rx="26" fill="#8fa99a"/>
      <rect x="480" y="520" width="260" height="120" rx="26" fill="#8fa99a"/>
      <rect x="182" y="560" width="558" height="96" rx="22" fill="#7d9a8a" opacity=".7"/>
      <rect x="140" y="700" width="20" height="54" fill="#4c3a2f"/><rect x="780" y="700" width="20" height="54" fill="#4c3a2f"/>
      <g>
        <rect x="220" y="540" width="86" height="72" rx="18" fill="#d98b9a" transform="rotate(-8 263 576)"/>
        <rect x="620" y="536" width="76" height="80" rx="18" fill="#e3c384" transform="rotate(7 658 576)"/>
      </g>
    </g>
    <!-- тв -->
    <g>
      <rect x="1030" y="548" width="360" height="210" rx="14" fill="#22202c"/>
      <rect x="1054" y="572" width="312" height="160" rx="6" fill="#7fa8bb"/>
      <rect x="1054" y="572" width="312" height="160" rx="6" fill="url(#${id}-tv)"/>
      <rect x="1180" y="758" width="60" height="24" fill="#33303c"/>
      <rect x="1120" y="780" width="180" height="16" rx="6" fill="#33303c"/>
      <ellipse cx="1210" cy="640" rx="260" ry="190" fill="url(#${id}-tv)"/>
    </g>
    <!-- журнальный стол и ковёр -->
    <g>
      <path d="M380 750 L1120 738 L1220 872 L320 884 Z" fill="#a86a5a" opacity=".75"/>
      <path d="M420 770 L1084 760 L1160 848 L370 858 Z" fill="#d9a086"/>
      <path d="M470 790 L1044 782" stroke="#8c4f48" stroke-width="10" opacity=".5"/>
      <rect x="660" y="660" width="290" height="26" rx="8" fill="#9a6b46"/>
      <rect x="684" y="686" width="18" height="92" fill="#7a4e36"/><rect x="908" y="686" width="18" height="92" fill="#7a4e36"/>
      <rect x="700" y="606" width="86" height="54" rx="5" fill="#e8d8bf"/>
      <rect x="806" y="632" width="54" height="28" rx="8" fill="#7d9a8a"/>
    </g>
    <!-- полка и фото -->
    <g>
      <rect x="230" y="160" width="560" height="16" rx="4" fill="#a77752"/>
      <rect x="260" y="106" width="50" height="54" fill="#5b628c"/><rect x="318" y="96" width="42" height="64" fill="#b45151"/><rect x="368" y="112" width="52" height="48" fill="#5a7a52"/>
      <rect x="470" y="120" width="120" height="40" rx="4" fill="#f6e7c9" transform="rotate(-2 530 140)"/>
      <rect x="640" y="116" width="72" height="44" rx="4" fill="#e3c384"/>
      <g transform="translate(780 100)">
        <rect x="0" y="0" width="44" height="60" rx="3" fill="#f4e6d3" stroke="#a77752" stroke-width="4"/>
        <circle cx="22" cy="22" r="9" fill="#d8a47e"/><circle cx="22" cy="48" r="15" fill="#7d9a8a"/>
      </g>
      <rect x="1150" y="200" width="140" height="110" rx="3" fill="#f4e6d3" stroke="#a77752" stroke-width="6"/>
      <circle cx="1196" cy="240" r="13" fill="#d8a47e"/><circle cx="1238" cy="232" r="11" fill="#c98d6b"/><path d="M1170 292 q40 -34 80 0 Z" fill="#7d9a8a"/>
    </g>
    <!-- торшер -->
    <g>
      <rect x="870" y="470" width="8" height="240" fill="#6d5139"/>
      <path d="M810 470 h128 l-26 -70 h-76 Z" fill="#e7c89f"/>
      <ellipse cx="874" cy="520" rx="180" ry="160" fill="url(#${id}-lamp)"/>
      <ellipse cx="874" cy="712" rx="54" ry="12" fill="#5d4735"/>
    </g>
    <rect width="1600" height="900" fill="#241328" opacity=".18"/>
  `, 'bg-svg');
  }

  function yard() {
    const id = uid();
    return svg(1600, 900, `<defs>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#23264f"/><stop offset=".38" stop-color="#6d5588"/><stop offset=".68" stop-color="#d97f83"/><stop offset="1" stop-color="#f4b077"/>
      </linearGradient>
      <radialGradient id="${id}-moon"><stop offset="0" stop-color="#fff4d0" stop-opacity=".85"/><stop offset="1" stop-color="#fff4d0" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-lamp"><stop offset="0" stop-color="#ffe2a2" stop-opacity=".95"/><stop offset=".4" stop-color="#ffcd7d" stop-opacity=".32"/><stop offset="1" stop-color="#ffcd7d" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c4759"/><stop offset="1" stop-color="#282631"/></linearGradient>
      <linearGradient id="${id}-bin" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#5b7a63"/><stop offset=".6" stop-color="#3f5b48"/><stop offset="1" stop-color="#2c4134"/></linearGradient>
      <linearGradient id="${id}-path" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#807687"/><stop offset="1" stop-color="#4a4551"/></linearGradient>
      <filter id="${id}-blur"><feGaussianBlur stdDeviation="7"/></filter>
      <filter id="${id}-blur2"><feGaussianBlur stdDeviation="2.5"/></filter>
    </defs>
    <rect width="1600" height="900" fill="url(#${id}-sky)"/>
    ${starList(50, 1600, 400, 99, '#fff0ce', .8, 2.1)}
    <circle cx="920" cy="168" r="86" fill="url(#${id}-moon)"/>
    <circle cx="920" cy="168" r="36" fill="#ffeec5" opacity=".94"/>
    <g class="cloud-drift" opacity=".14" fill="#f4d6cf"><ellipse cx="300" cy="300" rx="210" ry="14"/><ellipse cx="1330" cy="330" rx="190" ry="12"/></g>
    <!-- дома -->
    <g>
      <rect x="0" y="230" width="360" height="420" fill="#282a44"/>
      <rect x="390" y="180" width="300" height="470" fill="#23253d"/>
      <rect x="730" y="280" width="260" height="370" fill="#2b2c46"/>
      <rect x="1030" y="210" width="240" height="440" fill="#252740"/>
      <rect x="1310" y="260" width="290" height="390" fill="#2a2b45"/>
      <g fill="#ffd993" opacity=".7">
        ${Array.from({ length: 46 }, (_, i) => {
          const bx = [20, 410, 750, 1050, 1330][i % 5];
          const by = 250 + ((i * 61) % 340);
          return `<rect x="${bx + ((i * 37) % 180)}" y="${by}" width="12" height="16" rx="1" opacity="${(0.3 + (i % 4) * 0.18).toFixed(2)}"/>`;
        }).join('')}
      </g>
      <g fill="#1b1c30">
        <rect x="0" y="230" width="360" height="18"/><rect x="390" y="180" width="300" height="14"/><rect x="730" y="280" width="260" height="14"/><rect x="1030" y="210" width="240" height="16"/><rect x="1310" y="260" width="290" height="14"/>
      </g>
      <g stroke="#191a2b" stroke-width="3" opacity=".5">
        <path d="M110 232 V650 M220 232 V650 M470 182 V650 M570 182 V650 M800 282 V650 M900 282 V650 M1100 212 V650 M1200 212 V650 M1400 262 V650 M1500 262 V650"/>
      </g>
    </g>
    <!-- деревья -->
    <g>
      <g transform="translate(80 620)">
        <path d="M40 30 C20 0 44 -40 74 -26 C86 -64 140 -58 142 -18 C180 -24 194 20 168 34 Z" fill="#2c3b3a"/>
        <rect x="88" y="24" width="18" height="140" fill="#3a2d2d"/>
        <path d="M60 -20 C70 20 60 60 40 90 M120 -30 C110 10 126 52 148 76" stroke="#354846" stroke-width="10" fill="none" opacity=".7"/>
      </g>
      <g transform="translate(1290 600) scale(1.2)">
        <path d="M40 30 C20 0 44 -40 74 -26 C86 -64 140 -58 142 -18 C180 -24 194 20 168 34 Z" fill="#2a3938"/>
        <rect x="88" y="24" width="18" height="150" fill="#3a2d2d"/>
      </g>
      <g transform="translate(1480 650) scale(.8)">
        <path d="M40 30 C20 0 44 -40 74 -26 C86 -64 140 -58 142 -18 C180 -24 194 20 168 34 Z" fill="#263433"/>
        <rect x="88" y="24" width="18" height="150" fill="#3a2d2d"/>
      </g>
    </g>
    <!-- забор и площадка -->
    <g opacity=".9">
      <rect x="0" y="630" width="700" height="8" fill="#1f2630"/>
      <g stroke="#1f2630" stroke-width="7">
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => `<path d="M${i * 54} 590 V670"/>`).join('')}
      </g>
      <path d="M250 590 V520 M410 590 V520 M250 520 H410" stroke="#252b35" stroke-width="8" fill="none"/>
      <path d="M250 520 l-16 40 M410 520 l16 40" stroke="#252b35" stroke-width="5"/>
      <g transform="translate(760 560)" opacity=".7">
        <path d="M0 0 V100 M110 0 V100 M0 0 H110" stroke="#242a34" stroke-width="7" fill="none"/>
        <path d="M8 42 q-14 40 10 58 M102 42 q14 40 -10 58" stroke="#242a34" stroke-width="4" fill="none"/>
      </g>
    </g>
    <!-- земля -->
    <rect x="0" y="660" width="1600" height="240" fill="url(#${id}-ground)"/>
    <path d="M0 700 Q280 670 560 704 T1120 700 T1600 690 V900 H0 Z" fill="url(#${id}-path)" opacity=".75"/>
    <g opacity=".3" stroke="#9c8a94" stroke-width="2">
      <path d="M200 760 Q500 740 760 770 M1080 790 Q1300 776 1520 794 M340 830 Q700 810 1040 842"/>
    </g>
    <!-- баки -->
    <g>
      <g transform="translate(300 500)">
        <rect x="0" y="70" width="260" height="210" rx="10" fill="url(#${id}-bin)"/>
        <path d="M0 84 Q130 30 260 84 L260 110 Q130 66 0 110 Z" fill="#4e6b55"/>
        <path d="M22 70 Q130 36 238 70" fill="none" stroke="#719077" stroke-width="8"/>
        <path d="M40 106 V260 M116 100 V268 M192 104 V264 M240 108 V262" stroke="#2a3c30" stroke-width="4" opacity=".5"/>
        <rect x="86" y="140" width="92" height="26" rx="5" fill="#324a3b" opacity=".7"/>
        <circle cx="60" cy="280" r="10" fill="#1f1e26"/><circle cx="210" cy="280" r="10" fill="#1f1e26"/>
        <path d="M12 120 q22 40 4 80" stroke="#8aa08a" stroke-width="4" fill="none" opacity=".3"/>
      </g>
      <g transform="translate(560 570) scale(.78)">
        <rect x="0" y="70" width="240" height="200" rx="10" fill="#3a5b4a"/>
        <path d="M0 84 Q120 24 240 84 L240 106 Q120 56 0 106 Z" fill="#557459"/>
        <path d="M40 108 V260 M120 100 V266 M200 104 V264" stroke="#263a2f" stroke-width="4" opacity=".5"/>
        <circle cx="48" cy="270" r="9" fill="#1f1e26"/><circle cx="196" cy="270" r="9" fill="#1f1e26"/>
      </g>
      <!-- пакеты и коробка -->
      <g transform="translate(240 690)">
        <path d="M0 44 Q-10 4 26 4 Q62 4 54 44 Q70 74 40 80 Q18 84 8 72 Q-8 66 0 44 Z" fill="#3b3b4c"/>
        <path d="M16 10 q8 -18 18 0" fill="none" stroke="#2a2a38" stroke-width="4"/>
        <path d="M20 48 q12 6 22 0" stroke="#6d6d84" stroke-width="3" fill="none" opacity=".5"/>
      </g>
      <g transform="translate(680 700) scale(.8)">
        <path d="M0 36 L100 30 L108 74 L4 82 Z" fill="#9a724c"/>
        <path d="M0 36 L100 30 L96 10 L4 14 Z" fill="#c08f61"/>
        <path d="M4 14 L96 10" stroke="#8a5f3e" stroke-width="3"/>
        <path d="M40 34 L46 78 M66 30 L70 74" stroke="#7a5738" stroke-width="3" opacity=".5"/>
      </g>
      <g transform="translate(860 730)">
        <ellipse cx="0" cy="20" rx="60" ry="14" fill="#14141e" opacity=".5"/>
        <path d="M-30 10 Q-44 -14 -18 -8 Q-10 -30 6 -14 Q30 -24 28 4 Z" fill="#3b4d43"/>
      </g>
      <!-- лужа -->
      <ellipse cx="1130" cy="800" rx="220" ry="46" fill="#3a4a61" opacity=".55" filter="url(#${id}-blur2)"/>
      <ellipse cx="1130" cy="800" rx="150" ry="28" fill="#7b8da8" opacity=".25"/>
      <path d="M990 798 q40 -10 82 0 M1080 808 q46 -8 92 0" stroke="#c3d3e6" stroke-width="2" opacity=".4"/>
    </g>
    <!-- фонарь -->
    <g>
      <rect x="1190" y="300" width="12" height="430" fill="#252633"/>
      <path d="M1196 300 q0 -40 70 -40" stroke="#252633" stroke-width="12" fill="none"/>
      <g transform="translate(1258 250)">
        <path d="M-34 0 H34 L22 34 H-22 Z" fill="#3b3c4b"/>
        <rect x="-20" y="34" width="40" height="10" rx="3" fill="#ffdf9e"/>
        <circle cx="0" cy="46" r="60" fill="url(#${id}-lamp)"/>
        <ellipse cx="0" cy="66" rx="26" ry="8" fill="#ffe4a5" opacity=".8"/>
      </g>
      <ellipse cx="1260" cy="720" rx="170" ry="40" fill="#ffd48a" opacity=".12"/>
    </g>
    <!-- листья -->
    <g fill="#c9865a" opacity=".7">
      <path d="M440 380 q18 -16 32 -2 q-12 20 -32 2 Z" class="leaf-drift"/>
      <path d="M980 300 q16 -14 28 -2 q-10 18 -28 2 Z" class="leaf-drift" style="animation-delay:-3s"/>
      <path d="M1480 430 q16 -14 28 -2 q-10 18 -28 2 Z" class="leaf-drift" style="animation-delay:-6s"/>
      <path d="M120 420 q16 -14 28 -2 q-10 18 -28 2 Z" class="leaf-drift" style="animation-delay:-1.5s"/>
    </g>
    <!-- финальный градиент -->
    <rect width="1600" height="900" fill="#150e22" opacity=".12"/>
  `, 'bg-svg');
  }

  function classroom() {
    const id = uid();
    return svg(1600, 900, `<defs>
      ${windowSky('morning', id)}
      <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ece0cb"/><stop offset="1" stop-color="#d9c7ab"/></linearGradient>
      <linearGradient id="${id}-floor" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#b18760"/><stop offset="1" stop-color="#876345"/></linearGradient>
      <linearGradient id="${id}-board" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#3e5b4d"/><stop offset="1" stop-color="#2c4439"/></linearGradient>
      <linearGradient id="${id}-light" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".6"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></linearGradient>
      <filter id="${id}-blur"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <rect width="1600" height="900" fill="url(#${id}-wall)"/>
    <rect x="0" y="690" width="1600" height="210" fill="url(#${id}-floor)"/>
    <g opacity=".3" stroke="#6d452f" stroke-width="2">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M${i * 210} 900 L${i * 190 + 90} 690"/>`).join('')}
    </g>
    <rect x="0" y="664" width="1600" height="30" fill="#8e6a4c"/>
    <!-- окна слева -->
    <g>
      <rect x="70" y="100" width="310" height="430" rx="10" fill="#f4e6d3" stroke="#c9a98d" stroke-width="10"/>
      <rect x="88" y="118" width="274" height="394" fill="url(#${id}-sky)"/>
      ${clouds(274, 220, '#fff8ea', .55, 8, 180)}
      <path d="M88 390 Q150 330 214 374 T362 352 V512 H88 Z" fill="#7c9276" opacity=".8"/>
      <path d="M225 118 V512 M88 300 H362" stroke="#f4e6d3" stroke-width="10"/>
      <rect x="54" y="538" width="342" height="18" rx="5" fill="#d7b99d"/>
      <g>
        <path d="M58 126 C36 240 42 400 66 542 L104 542 C84 380 88 220 100 126 Z" fill="#e4c9b6"/>
        <path d="M382 126 C404 240 398 400 374 542 L336 542 C356 380 352 220 340 126 Z" fill="#d8b8a3"/>
      </g>
      <path d="M360 140 L900 660 L700 720 L230 160 Z" fill="url(#${id}-light)" opacity=".55"/>
    </g>
    <!-- доска -->
    <g>
      <rect x="600" y="130" width="800" height="420" rx="6" fill="#b58b62"/>
      <rect x="624" y="154" width="752" height="372" rx="3" fill="url(#${id}-board)"/>
      <g stroke="#e7ecd9" stroke-width="4" opacity=".55" fill="none" stroke-linecap="round">
        <path d="M680 210 q30 -18 58 0 t58 0 M680 246 q26 -12 50 0"/>
        <path d="M700 320 h150 M700 354 h110 M700 388 h172" opacity=".35"/>
        <path d="M1010 210 q28 -20 56 0 M1100 250 q20 -12 40 0" opacity=".25"/>
      </g>
      <rect x="1110" y="420" width="210" height="60" rx="4" fill="#e9e4d2" opacity=".16"/>
      <rect x="588" y="550" width="824" height="16" rx="4" fill="#8a6345"/>
      <g fill="#e9e4d2" opacity=".8"><rect x="650" y="558" width="18" height="8" rx="2"/><rect x="690" y="558" width="11" height="8" rx="2"/></g>
    </g>
    <!-- часы -->
    <g transform="translate(1440 190)">
      <circle r="54" fill="#f7eddc" stroke="#8a6345" stroke-width="8"/>
      <circle r="43" fill="none" stroke="#c9b18f" stroke-width="2"/>
      <path d="M0 0 L0 -30 M0 0 L20 10" stroke="#3b3030" stroke-width="5" stroke-linecap="round"/>
      <circle r="5" fill="#3b3030"/>
    </g>
    <!-- парты -->
    <g>
      ${[[360, 650, 1], [700, 620, .88], [1030, 600, .78], [1290, 585, .7], [220, 760, 1.18], [590, 760, 1.05], [960, 752, .94], [1270, 746, .86]].map(([x, y, s]) => `
        <g transform="translate(${x} ${y}) scale(${s})">
          <rect x="-110" y="-20" width="220" height="26" rx="6" fill="#b98a5e"/>
          <rect x="-110" y="6" width="220" height="12" rx="4" fill="#8e6440"/>
          <rect x="-98" y="18" width="12" height="110" fill="#7d5738"/>
          <rect x="86" y="18" width="12" height="110" fill="#7d5738"/>
          <rect x="-82" y="46" width="164" height="14" rx="4" fill="#8e6440"/>
          <rect x="-126" y="18" width="16" height="86" rx="4" fill="#6b4a33"/>
          <rect x="-118" y="20" width="70" height="10" rx="5" fill="#6b4a33" transform="rotate(-4 -83 25)"/>
          <rect x="-80" y="28" width="160" height="5" fill="#d9c9a9" opacity=".35"/>
        </g>`).join('')}
    </g>
    <ellipse cx="840" cy="760" rx="560" ry="120" fill="#fff4d6" opacity=".12" filter="url(#${id}-blur)"/>
    <rect width="1600" height="900" fill="#2a1c0e" opacity=".08"/>
  `, 'bg-svg');
  }

  function endingScene(mood = 'warm') {
    const id = uid();
    const palettes = {
      warm: ['#262754', '#8b638b', '#e9927e', '#ffd8a2'],
      amber: ['#283152', '#7d6f7f', '#d99a6a', '#ffe0ad'],
      cool: ['#1b2344', '#48577f', '#8b9ab7', '#d8e2ef'],
      cold: ['#1a1f33', '#374159', '#697287', '#b9c1cf'],
    };
    const c = palettes[mood] || palettes.warm;
    const withFen = mood === 'warm' || mood === 'amber';
    return svg(1600, 900, `<defs>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".5" stop-color="${c[1]}"/><stop offset=".78" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient>
      <radialGradient id="${id}-sun"><stop offset="0" stop-color="${c[3]}" stop-opacity=".95"/><stop offset="1" stop-color="${c[3]}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2835"/><stop offset="1" stop-color="#14131d"/></linearGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#${id}-sky)"/>
    ${starList(40, 1600, 420, 71, '#fff1d0', .7, 1.8)}
    <circle cx="1130" cy="530" r="200" fill="url(#${id}-sun)"/>
    <circle cx="1130" cy="530" r="46" fill="${c[3]}" opacity=".8"/>
    <g fill="#262437" opacity=".85">
      <rect x="0" y="540" width="260" height="180"/><rect x="270" y="500" width="190" height="220"/><rect x="470" y="566" width="140" height="154"/><rect x="620" y="520" width="230" height="200"/><rect x="870" y="560" width="120" height="160"/><rect x="1000" y="516" width="210" height="204"/><rect x="1230" y="548" width="150" height="172"/><rect x="1390" y="512" width="210" height="208"/>
    </g>
    <g fill="#ffdf9f" opacity=".35">
      ${Array.from({ length: 28 }, (_, i) => `<rect x="${20 + ((i * 83) % 1500)}" y="${560 + ((i * 37) % 130)}" width="8" height="11" rx="1"/>`).join('')}
    </g>
    <path d="M0 750 Q300 710 600 748 T1200 742 T1600 736 V900 H0 Z" fill="url(#${id}-ground)"/>
    <g fill="#14131d">
      <path d="M810 750 q-8 -60 12 -84 q8 -10 18 0 q4 8 4 20 l4 64 Z"/>
      <circle cx="840" cy="642" r="20"/>
      <path d="M836 662 q-24 34 -34 84 q26 -18 40 -50 l6 54 h18 l-2 -58 q4 8 14 18 q-8 -34 -26 -48 Z"/>
      ${withFen ? `<g transform="translate(900 706)"><path d="M0 40 q-10 -44 18 -44 q28 0 18 44 Z"/><path d="M-14 42 h64" stroke="#14131d" stroke-width="8"/><path d="M26 0 l-6 -34 q12 -6 18 0 l2 34 Z"/><path d="M14 0 l-14 -30 q-10 24 0 32 Z"/><circle cx="36" cy="19" r="14"/></g>` : ''}
    </g>
    <g opacity=".6" fill="#f5d9b0">
      <circle cx="300" cy="220" r="2"/><circle cx="680" cy="160" r="1.6"/><circle cx="1420" cy="280" r="2"/><circle cx="520" cy="380" r="1.4"/>
    </g>
  `, 'bg-svg ending-bg-svg');
  }

  function titleScene() {
    const id = uid();
    return svg(1600, 900, `<defs>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2=".2" y2="1">
        <stop offset="0" stop-color="#0b1028"/><stop offset=".35" stop-color="#242a55"/><stop offset=".64" stop-color="#6a4d78"/><stop offset=".84" stop-color="#d17d7c"/><stop offset="1" stop-color="#f4b277"/>
      </linearGradient>
      <radialGradient id="${id}-moon"><stop offset="0" stop-color="#fff7da" stop-opacity=".9"/><stop offset=".55" stop-color="#fff2c9" stop-opacity=".25"/><stop offset="1" stop-color="#fff2c9" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}-city" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1f39"/><stop offset="1" stop-color="#0e1020"/></linearGradient>
      <linearGradient id="${id}-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f1e2d"/><stop offset="1" stop-color="#0c0d16"/></linearGradient>
      <radialGradient id="${id}-glow"><stop offset="0" stop-color="#ffd287" stop-opacity=".5"/><stop offset="1" stop-color="#ffd287" stop-opacity="0"/></radialGradient>
      <filter id="${id}-blur"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <rect width="1600" height="900" fill="url(#${id}-sky)"/>
    ${starList(90, 1600, 520, 24, '#fff4d6', .5, 2.2)}
    <circle cx="1245" cy="200" r="230" fill="url(#${id}-moon)"/>
    <circle cx="1245" cy="200" r="88" fill="#fff3ce" opacity=".96"/>
    <circle cx="1215" cy="176" r="17" fill="#e8d6ac" opacity=".35"/>
    <circle cx="1272" cy="226" r="11" fill="#e8d6ac" opacity=".3"/>
    <g class="cloud-drift" fill="#f3d2c4" opacity=".18"><ellipse cx="300" cy="180" rx="260" ry="20"/><ellipse cx="900" cy="300" rx="200" ry="16"/><ellipse cx="1370" cy="360" rx="260" ry="18"/></g>
    <g fill="url(#${id}-city)">
      <rect x="0" y="440" width="180" height="300"/><rect x="200" y="500" width="140" height="240"/><rect x="360" y="420" width="180" height="320"/><rect x="560" y="480" width="120" height="260"/><rect x="700" y="400" width="220" height="340"/><rect x="940" y="460" width="160" height="280"/><rect x="1120" y="430" width="200" height="310"/><rect x="1340" y="470" width="260" height="270"/>
    </g>
    <g fill="#ffd88f" opacity=".55">
      ${Array.from({ length: 50 }, (_, i) => {
        const bx = [20, 220, 380, 580, 720, 960, 1140, 1360][i % 8];
        return `<rect x="${bx + ((i * 29) % 150)}" y="${470 + ((i * 47) % 230)}" width="9" height="13" rx="1" opacity="${(0.2 + (i % 5) * 0.13).toFixed(2)}"/>`;
      }).join('')}
    </g>
    <path d="M0 700 Q220 670 440 700 T900 702 T1360 690 T1600 700 V900 H0 Z" fill="url(#${id}-roof)"/>
    <path d="M0 700 H1600" stroke="#383450" stroke-width="4"/>
    <g opacity=".6">
      <path d="M60 760 h240 v-20 h-240 Z" fill="#242236"/><path d="M520 780 h180 v-16 h-180 Z" fill="#201f31"/>
      <path d="M1180 806 h300 v-24 h-300 Z" fill="#1d1c2c"/>
    </g>
    <!-- ограждение -->
    <g stroke="#2a2940" stroke-width="9" fill="none">
      <path d="M0 640 H1600"/><path d="M0 700 H1600"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => `<path d="M${60 + i * 130} 610 V710"/>`).join('')}
    </g>
    <ellipse cx="1110" cy="616" rx="300" ry="200" fill="url(#${id}-glow)" opacity=".75"/>
    <g fill="#0f0f18" stroke="#f0b07a" stroke-width="1.6" stroke-opacity=".28" stroke-linejoin="round">
      <!-- подросток со спины, на ограждении -->
      <g transform="translate(1040 488)">
        <path d="M-38 62 Q-46 38 -18 28 L18 28 Q46 38 38 62 L42 112 Q24 126 0 126 Q-24 126 -42 112 Z"/>
        <path d="M-34 48 Q-42 18 -28 2 Q-14 -10 0 -8 Q14 -10 28 2 Q42 18 34 48 Z"/>
        <circle cx="0" cy="-16" r="27"/>
        <path d="M-28 -20 Q-32 -56 0 -58 Q32 -56 28 -20 Q22 -38 0 -40 Q-22 -38 -28 -20 Z" fill="#0b0b13" stroke="none"/>
        <path d="M-38 68 Q-70 94 -72 138" fill="none" stroke="#0f0f18" stroke-width="17" stroke-linecap="round"/>
        <path d="M38 68 Q70 94 72 138" fill="none" stroke="#0f0f18" stroke-width="17" stroke-linecap="round"/>
        <path d="M-18 120 L-22 210 M18 120 L22 210" stroke="#0f0f18" stroke-width="18" stroke-linecap="round"/>
        <path d="M-16 116 H16" stroke="#0f0f18" stroke-width="8" stroke-linecap="round"/>
        <circle cx="-40" cy="86" r="9" fill="#0f0f18" stroke="none"/>
        <circle cx="40" cy="86" r="9" fill="#0f0f18" stroke="none"/>
      </g>
      <!-- фенёк -->
      <g transform="translate(1228 580)">
        <ellipse cx="0" cy="48" rx="44" ry="12" fill="#08080f" opacity=".55" stroke="none"/>
        <path d="M-34 48 Q-46 4 -16 0 Q12 0 22 44 Z"/>
        <path d="M-24 2 L-38 -50 Q-8 -40 0 -4 Z"/>
        <path d="M14 2 L32 -48 Q4 -38 -4 -4 Z"/>
        <circle cx="0" cy="18" r="29"/>
        <path d="M-27 12 Q-23 -8 0 -8 Q23 -8 27 12" fill="none" stroke="#2b2640" stroke-width="3" opacity=".8" stroke-opacity=".4"/>
        <path d="M28 32 Q66 26 70 0" stroke="#0f0f18" stroke-width="15" fill="none" stroke-linecap="round"/>
        <circle cx="12" cy="14" r="2.6" fill="#f5d79d" opacity=".85" stroke="none"/>
        <circle cx="16" cy="20" r="1.7" fill="#f5d79d" opacity=".65" stroke="none"/>
      </g>
    </g>
    <ellipse cx="880" cy="700" rx="360" ry="100" fill="url(#${id}-glow)"/>
    <rect width="1600" height="900" fill="#090b1c" opacity=".08"/>
  `, 'title-svg');
  }

  function titleSceneMobile() {
    const id = uid();
    return svg(900, 1600, `<defs>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#090e24"/><stop offset=".28" stop-color="#222752"/><stop offset=".48" stop-color="#604973"/><stop offset=".62" stop-color="#c8797e"/><stop offset=".72" stop-color="#f0aa72"/><stop offset=".8" stop-color="#392c4a"/><stop offset="1" stop-color="#0a0914"/>
      </linearGradient>
      <radialGradient id="${id}-moon"><stop offset="0" stop-color="#fff7da" stop-opacity=".95"/><stop offset=".55" stop-color="#fff2c9" stop-opacity=".28"/><stop offset="1" stop-color="#fff2c9" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-glow"><stop offset="0" stop-color="#ffd287" stop-opacity=".45"/><stop offset="1" stop-color="#ffd287" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}-city" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1c33"/><stop offset="1" stop-color="#0d0e1c"/></linearGradient>
    </defs>
    <rect width="900" height="1600" fill="url(#${id}-sky)"/>
    ${starList(90, 900, 760, 31, '#fff3d0', .6, 2.2)}
    <circle cx="690" cy="190" r="230" fill="url(#${id}-moon)"/>
    <circle cx="690" cy="190" r="86" fill="#fff3ce" opacity=".96"/>
    <circle cx="664" cy="168" r="17" fill="#e8d6ac" opacity=".3"/>
    <circle cx="714" cy="218" r="11" fill="#e8d6ac" opacity=".26"/>
    <g class="cloud-drift" fill="#f4d4c6" opacity=".12"><ellipse cx="170" cy="370" rx="220" ry="14"/><ellipse cx="760" cy="420" rx="190" ry="12"/></g>
    <g fill="url(#${id}-city)">
      <rect x="0" y="500" width="130" height="300"/><rect x="150" y="550" width="110" height="250"/><rect x="280" y="480" width="150" height="320"/><rect x="450" y="530" width="120" height="270"/><rect x="590" y="470" width="160" height="330"/><rect x="770" y="520" width="130" height="280"/>
    </g>
    <g fill="#ffd88f" opacity=".5">
      ${Array.from({ length: 36 }, (_, i) => {
        const bx = [18, 168, 298, 468, 608, 788][i % 6];
        return `<rect x="${bx + ((i * 29) % 110)}" y="${520 + ((i * 47) % 220)}" width="8" height="12" rx="1" opacity="${(0.22 + (i % 5) * 0.13).toFixed(2)}"/>`;
      }).join('')}
    </g>
    <path d="M0 760 Q220 724 450 758 T900 752 V1600 H0 Z" fill="#0e0d19"/>
    <path d="M0 760 H900" stroke="#37334c" stroke-width="3"/>
    <g stroke="#252337" stroke-width="7" fill="none">
      <path d="M0 700 H900"/><path d="M0 760 H900"/>
      <path d="M40 670 V770 M160 670 V770 M280 670 V770 M400 670 V770 M520 670 V770 M640 670 V770 M760 670 V770 M880 670 V770"/>
    </g>
    <ellipse cx="450" cy="690" rx="310" ry="190" fill="url(#${id}-glow)" opacity=".8"/>
    <g fill="#0f0f18" stroke="#f0b07a" stroke-width="1.6" stroke-opacity=".28" stroke-linejoin="round">
      <g transform="translate(360 504)">
        <path d="M-34 56 Q-42 34 -16 26 L16 26 Q42 34 34 56 L38 102 Q22 116 0 116 Q-22 116 -38 102 Z"/>
        <path d="M-30 38 Q-38 12 -24 0 Q-12 -10 0 -8 Q12 -10 24 0 Q38 12 30 38 Z"/>
        <circle cx="0" cy="-14" r="25"/>
        <path d="M-26 -18 Q-30 -50 0 -52 Q30 -50 26 -18 Q20 -34 0 -36 Q-20 -34 -26 -18 Z" fill="#0b0b13" stroke="none"/>
        <path d="M-34 62 Q-58 86 -60 126" fill="none" stroke="#0f0f18" stroke-width="15" stroke-linecap="round"/>
        <path d="M34 62 Q58 86 60 126" fill="none" stroke="#0f0f18" stroke-width="15" stroke-linecap="round"/>
        <path d="M-16 108 L-20 182 M16 108 L20 182" stroke="#0f0f18" stroke-width="16" stroke-linecap="round"/>
        <path d="M-14 104 H14" stroke="#0f0f18" stroke-width="7" stroke-linecap="round"/>
      </g>
      <g transform="translate(566 578)">
        <ellipse cx="0" cy="44" rx="42" ry="11" fill="#08080f" opacity=".55" stroke="none"/>
        <path d="M-31 44 Q-42 4 -14 0 Q12 0 20 40 Z"/>
        <path d="M-22 2 L-34 -48 Q-6 -38 0 -4 Z"/>
        <path d="M13 2 L30 -46 Q3 -36 -4 -4 Z"/>
        <circle cx="0" cy="17" r="27"/>
        <path d="M-25 11 Q-20 -8 0 -8 Q20 -8 25 11" fill="none" stroke="#2b2640" stroke-width="3" opacity=".8" stroke-opacity=".4"/>
        <path d="M26 30 Q62 24 64 0" stroke="#0f0f18" stroke-width="14" fill="none" stroke-linecap="round"/>
        <circle cx="11" cy="13" r="2.5" fill="#f5d79d" opacity=".85" stroke="none"/>
        <circle cx="15" cy="19" r="1.6" fill="#f5d79d" opacity=".65" stroke="none"/>
      </g>
    </g>
    <ellipse cx="450" cy="790" rx="390" ry="90" fill="url(#${id}-glow)" opacity=".35"/>
    <rect y="800" width="900" height="800" fill="#080711" opacity=".35"/>
  `, 'title-svg mobile-title-svg');
  }

  function background(layout) {
    if (!layout) return bedroom('evening', false);
    if (layout.startsWith('bedroom')) {
      const time = layout.includes('night') ? 'night' : layout.includes('day') ? 'day' : 'evening';
      return bedroom(time, layout.includes('_fen'));
    }
    if (layout === 'kitchen_mom') return kitchen('evening');
    if (layout === 'kitchen_family') return kitchen('morning');
    if (layout === 'kitchen_confession') return kitchen('rain');
    if (layout === 'livingroom') return livingroom();
    if (layout === 'yard') return yard();
    if (layout === 'classroom') return classroom();
    return bedroom('evening', false);
  }

  window.Art2D = {
    SKIN_TONES, HAIR_COLORS, EYE_COLORS, SHIRT_COLORS,
    portrait, background, titleScene, titleSceneMobile, endingScene,
  };
})();
