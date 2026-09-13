/* ============================================================================
 * VRIDHI AI — Login & Sign Up Voice Assistant (auth-voice.js)
 *
 * Provides:
 * 1. Speech synthesis for reading field titles & instructions aloud
 * 2. Voice input mic button on input fields for voice typing
 * ========================================================================= */

(function () {
  'use strict';

  function lang() {
    try {
      if (window.kmI18n && window.kmI18n.current) return window.kmI18n.current();
      return JSON.parse(localStorage.getItem('km.preferences.v1') || '{}').language || 'hi-IN';
    } catch (_) { return 'hi-IN'; }
  }

  function say(text, done) {
    if (!text) { if (done) done(); return; }
    try {
      if (!('speechSynthesis' in window)) { if (done) done(); return; }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang();
      u.rate = 0.92;
      let fired = false;
      const once = function () { if (fired) return; fired = true; if (done) done(); };
      u.onend = once;
      u.onerror = once;
      window.speechSynthesis.speak(u);
      setTimeout(once, Math.min(15000, 2000 + text.length * 60));
    } catch (_) { if (done) done(); }
  }

  function listenOnce(onText, onFail) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { if (onFail) onFail('nahi'); return null; }
    let rec;
    try { rec = new SR(); } catch (_) { if (onFail) onFail('nahi'); return null; }

    rec.lang = lang();
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    let gotResult = false;

    rec.onresult = (e) => {
      gotResult = true;
      const res = e.results && e.results[0] && e.results[0][0];
      const text = res ? String(res.transcript || '').trim() : '';
      if (text) {
        if (onText) onText(text);
      } else {
        if (onFail) onFail('khali');
      }
    };

    rec.onerror = () => { if (onFail) onFail('galti'); };
    rec.onend = () => {
      if (!gotResult && onFail) onFail('samapt');
    };

    try { rec.start(); } catch (_) { if (onFail) onFail('galti'); return null; }
    return rec;
  }

  function initAuthVoice() {
    const forms = document.querySelectorAll('#login-form, #signup-form');
    if (!forms.length) return;

    // Welcome speech
    const isSignup = !!document.getElementById('signup-form');
    const welcomeMsg = isSignup
      ? 'वृद्धि AI में नया खाता बनाएँ। अपना नाम, फोन नंबर और पासवर्ड बोलें या लिखें।'
      : 'वृद्धि AI में आपका स्वागत है। अपना ईमेल या फोन नंबर और पासवर्ड डालें।';

    // Speak welcome on page click/focus
    let spokeWelcome = false;
    const triggerWelcome = () => {
      if (spokeWelcome) return;
      spokeWelcome = true;
      say(welcomeMsg);
    };

    document.body.addEventListener('click', triggerWelcome, { once: true });

    forms.forEach(form => {
      const groups = form.querySelectorAll('.form-group');
      groups.forEach(group => {
        const input = group.querySelector('input');
        const label = group.querySelector('label');
        const wrapper = group.querySelector('.form-group__input-wrapper');

        // Do NOT add mic button to password fields or checkbox inputs
        if (!input || !wrapper || input.type === 'checkbox' || input.type === 'password') return;

        // Create Voice Mic Button
        const micBtn = document.createElement('button');
        micBtn.type = 'button';
        micBtn.className = 'auth-voice-mic-btn';
        micBtn.setAttribute('aria-label', 'Speak input');
        micBtn.innerHTML = `
          <svg class="mic-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          <span class="mic-pulse"></span>
        `;

        wrapper.appendChild(micBtn);

        // Click mic to speak
        micBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const labelText = label ? label.textContent.trim() : 'इनपुट';
          micBtn.classList.add('is-listening');

          say(`बोलिए, ${labelText} क्या है?`, () => {
            listenOnce(
              (text) => {
                micBtn.classList.remove('is-listening');
                let cleanText = text;
                if (input.type === 'tel') {
                  cleanText = text.replace(/[^0-9]/g, '');
                  if (!cleanText) cleanText = text;
                }
                input.value = cleanText;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                say(`${labelText} दर्ज कर दिया है: ${cleanText}`);
              },
              () => {
                micBtn.classList.remove('is-listening');
                say('आवाज़ सुनाई नहीं दी। दोबारा कोशिश करें या लिखकर भरें।');
              }
            );
          });
        });
      });
    });

    // Password Generator Widget logic
    initPasswordGenerator();
  }

  function generateStrongPassword() {
    const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowers = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '@#$!%*?&';
    const all = uppers + lowers + numbers + symbols;

    let pwd = '';
    pwd += uppers.charAt(Math.floor(Math.random() * uppers.length));
    pwd += lowers.charAt(Math.floor(Math.random() * lowers.length));
    pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));

    for (let i = 4; i < 14; i++) {
      pwd += all.charAt(Math.floor(Math.random() * all.length));
    }

    return pwd.split('').sort(() => 0.5 - Math.random()).join('');
  }

  function initPasswordGenerator() {
    const genBtn = document.getElementById('gen-pwd-btn');
    const genDisplay = document.getElementById('pwd-gen-display');
    const genCode = document.getElementById('gen-pwd-code');
    const copyBtn = document.getElementById('copy-pwd-btn');
    const tipMsg = document.getElementById('pwd-gen-tip');
    const targetPwdInput = document.getElementById('signup-password') || document.getElementById('login-password');

    if (!genBtn || !genCode) return;

    let currentGenPwd = '';

    const generateAndShow = () => {
      currentGenPwd = generateStrongPassword();
      genCode.textContent = currentGenPwd;
      if (genDisplay) genDisplay.style.display = 'flex';
      if (tipMsg) tipMsg.style.display = 'none';
    };

    genBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateAndShow();
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentGenPwd) generateAndShow();

        // 1. Copy to clipboard
        navigator.clipboard.writeText(currentGenPwd).catch(() => {});

        // 2. Auto fill into Password field
        if (targetPwdInput) {
          targetPwdInput.value = currentGenPwd;
          targetPwdInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 3. Show confirmation feedback
        if (tipMsg) {
          tipMsg.style.display = 'block';
          tipMsg.textContent = '✅ Password copied & filled into Password field!';
        }

        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Copied!
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          `;
        }, 2000);
      });
    }
  }



  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthVoice);
  } else {
    initAuthVoice();
  }
})();
