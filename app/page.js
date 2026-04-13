<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-sans); background: var(--color-background-tertiary); }

  .app { max-width: 480px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

  .header { text-align: center; margin-bottom: 2rem; padding-top: 0.5rem; }
  .header-icon { width: 48px; height: 48px; background: var(--color-background-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; font-size: 22px; }
  .header h1 { font-size: 22px; font-weight: 500; color: var(--color-text-primary); }
  .header p { font-size: 14px; color: var(--color-text-secondary); margin-top: 4px; }

  .section { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem; margin-bottom: 1rem; }
  .section-label { font-size: 11px; font-weight: 500; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.75rem; }

  .input-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .input-field input { width: 100%; padding: 10px 14px; font-size: 14px; background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); color: var(--color-text-primary); outline: none; transition: border-color 0.15s; }
  .input-field input:focus { border-color: var(--color-border-primary); }
  .input-field input::placeholder { color: var(--color-text-tertiary); }

  .btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .btn { padding: 10px; font-size: 14px; font-weight: 500; border-radius: var(--border-radius-md); border: 0.5px solid var(--color-border-secondary); cursor: pointer; transition: all 0.15s; background: transparent; color: var(--color-text-primary); }
  .btn:hover { background: var(--color-background-secondary); }
  .btn:active { transform: scale(0.98); }
  .btn-primary { background: var(--color-text-primary); color: var(--color-background-primary); border-color: var(--color-text-primary); }
  .btn-primary:hover { opacity: 0.88; background: var(--color-text-primary); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .upload-zone { border: 0.5px dashed var(--color-border-secondary); border-radius: var(--border-radius-md); padding: 1.25rem; text-align: center; cursor: pointer; transition: all 0.15s; background: var(--color-background-secondary); }
  .upload-zone:hover { border-color: var(--color-border-primary); background: var(--color-background-tertiary); }
  .upload-zone input { display: none; }
  .upload-icon { font-size: 20px; margin-bottom: 6px; }
  .upload-text { font-size: 13px; color: var(--color-text-secondary); }
  .upload-text strong { color: var(--color-text-primary); font-weight: 500; }
  .upload-done { font-size: 13px; color: var(--color-text-success); font-weight: 500; }

  .analyze-btn { width: 100%; padding: 12px; font-size: 15px; font-weight: 500; }

  .score-block { margin-bottom: 1.25rem; }
  .score-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .score-num { font-size: 32px; font-weight: 500; color: var(--color-text-primary); }
  .score-label { font-size: 13px; color: var(--color-text-secondary); }
  .progress { height: 6px; background: var(--color-background-secondary); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--color-text-success); border-radius: 3px; transition: width 0.8s ease; }

  .tag-group { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .tag { font-size: 12px; padding: 4px 10px; border-radius: var(--border-radius-md); border: 0.5px solid; }
  .tag-good { background: var(--color-background-success); color: var(--color-text-success); border-color: var(--color-border-success); }
  .tag-warn { background: var(--color-background-warning); color: var(--color-text-warning); border-color: var(--color-border-warning); }
  .sub-label { font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px; margin-top: 0.75rem; }

  .coach-card { border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); padding: 12px 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; background: var(--color-background-primary); }
  .coach-card:last-child { margin-bottom: 0; }
  .coach-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--color-background-info); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 500; color: var(--color-text-info); flex-shrink: 0; }
  .coach-info { flex: 1; min-width: 0; }
  .coach-name { font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
  .coach-meta { font-size: 12px; color: var(--color-text-secondary); margin-top: 2px; }
  .coach-badge { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: var(--border-radius-md); background: var(--color-background-info); color: var(--color-text-info); border: 0.5px solid var(--color-border-info); margin-top: 4px; }
  .coach-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
  .coach-rating { font-size: 13px; font-weight: 500; color: var(--color-text-primary); }
  .coach-rating span { color: var(--color-text-secondary); font-weight: 400; }
  .request-btn { font-size: 12px; padding: 5px 12px; }

  .toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--color-text-primary); color: var(--color-background-primary); padding: 10px 18px; border-radius: var(--border-radius-md); font-size: 13px; opacity: 0; transition: opacity 0.2s; pointer-events: none; white-space: nowrap; z-index: 100; }
  .toast.show { opacity: 1; }

  .step-dots { display: flex; justify-content: center; gap: 6px; margin-bottom: 1.5rem; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-border-secondary); transition: background 0.2s; }
  .dot.active { background: var(--color-text-primary); }

  .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>

<div class="app">
  <div class="header">
    <div class="header-icon">⚽</div>
    <h1>AI Football Coach</h1>
    <p>영상을 업로드하고 AI 분석을 받아보세요</p>
  </div>

  <div class="step-dots">
    <div class="dot active" id="dot1"></div>
    <div class="dot" id="dot2"></div>
    <div class="dot" id="dot3"></div>
  </div>

  <!-- 계정 섹션 -->
  <div class="section">
    <div class="section-label">계정</div>
    <div class="input-row">
      <div class="input-field">
        <input type="email" id="email" placeholder="이메일 주소" />
      </div>
      <div class="input-field">
        <input type="password" id="password" placeholder="비밀번호" />
      </div>
    </div>
    <div class="btn-row">
      <button class="btn" onclick="handleLogin()">로그인</button>
      <button class="btn btn-primary" onclick="handleSignup()">회원가입</button>
    </div>
  </div>

  <!-- 영상 업로드 섹션 -->
  <div class="section">
    <div class="section-label">영상 업로드</div>
    <label class="upload-zone">
      <input type="file" accept="video/*" onchange="handleFile(this)" />
      <div class="upload-icon">📹</div>
      <div class="upload-text" id="upload-text">
        <strong>클릭하여 영상 선택</strong><br>MP4, MOV, AVI 지원
      </div>
    </label>
  </div>

  <!-- AI 분석 버튼 -->
  <button class="btn btn-primary analyze-btn" id="analyze-btn" onclick="runAnalysis()">
    AI 분석 시작
  </button>

  <!-- 결과 섹션 (분석 후 표시) -->
  <div id="result-section" style="margin-top: 1rem; display: none;">
    <div class="section">
      <div class="section-label">분석 결과</div>
      <div class="score-block">
        <div class="score-row">
          <span class="score-num" id="score-num">82</span>
          <span class="score-label">종합 점수</span>
        </div>
        <div class="progress">
          <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
        </div>
      </div>
      <div class="sub-label">강점</div>
      <div class="tag-group" id="strengths"></div>
      <div class="sub-label">개선점</div>
      <div class="tag-group" id="improvements"></div>
    </div>

    <div class="section">
      <div class="section-label">추천 코치</div>
      <div id="coach-list"></div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
  const coaches = [
    { id: 1, name: "Carlos", initials: "CA", specialty: "dribbling", rating: 4.8 },
    { id: 2, name: "David",  initials: "DA", specialty: "speed",     rating: 4.6 },
    { id: 3, name: "Lee",    initials: "LE", specialty: "ball control", rating: 4.9 },
  ];
  const specialtyKo = {
    dribbling: "드리블",
    speed: "스피드",
    "ball control": "볼 컨트롤"
  };

  let analysisResult = null;

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }

  function setDot(n) {
    [1, 2, 3].forEach(i => {
      document.getElementById('dot' + i).classList.toggle('active', i <= n);
    });
  }

  function handleLogin() {
    const e = document.getElementById('email').value;
    if (!e) { showToast('이메일을 입력해주세요'); return; }
    showToast('로그인 성공!');
    setDot(2);
  }

  function handleSignup() {
    const e = document.getElementById('email').value;
    if (!e) { showToast('이메일을 입력해주세요'); return; }
    showToast('회원가입 완료!');
    setDot(2);
  }

  function handleFile(input) {
    if (!input.files[0]) return;
    const name = input.files[0].name;
    document.getElementById('upload-text').innerHTML =
      `<span class="upload-done">✓ ${name}</span>`;
    showToast('영상 업로드 완료');
  }

  async function runAnalysis() {
    const btn = document.getElementById('analyze-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>분석 중...';

    // 실제 환경에서는 fetch('/api/analyze', ...) 호출
    await new Promise(r => setTimeout(r, 1400));

    analysisResult = {
      score: 82,
      strengths: ["볼 컨트롤", "패스 정확도", "방향 전환"],
      improvements: ["드리블 속도", "왼발 활용", "스프린트"]
    };

    btn.disabled = false;
    btn.textContent = '다시 분석하기';
    setDot(3);
    renderResult();
  }

  function renderResult() {
    const r = analysisResult;
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('score-num').textContent = r.score;

    setTimeout(() => {
      document.getElementById('progress-fill').style.width = r.score + '%';
    }, 50);

    document.getElementById('strengths').innerHTML = r.strengths
      .map(s => `<span class="tag tag-good">${s}</span>`).join('');

    document.getElementById('improvements').innerHTML = r.improvements
      .map(s => `<span class="tag tag-warn">${s}</span>`).join('');

    const matched = matchCoaches(r);
    document.getElementById('coach-list').innerHTML = matched.map(c => `
      <div class="coach-card">
        <div class="coach-avatar">${c.initials}</div>
        <div class="coach-info">
          <div class="coach-name">${c.name}</div>
          <div class="coach-meta">${specialtyKo[c.specialty] || c.specialty} 전문</div>
          <span class="coach-badge">매칭 ${c.matchScore}점</span>
        </div>
        <div class="coach-right">
          <div class="coach-rating">⭐ ${c.rating}<span>/5.0</span></div>
          <button class="btn request-btn" onclick="requestCoach(${c.id})">요청하기</button>
        </div>
      </div>
    `).join('');

    document.getElementById('result-section')
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function matchCoaches(result) {
    return coaches
      .map(c => {
        let score = 0;
        if (result.improvements.join(" ").includes(c.specialty)) score += 50;
        score += Math.round(c.rating * 10);
        return { ...c, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 2);
  }

  function requestCoach(id) {
    const c = coaches.find(x => x.id === id);
    showToast(`${c.name} 코치에게 요청을 보냈습니다`);
    // 실제 환경: addDoc(collection(db, "coachRequests"), { ... })
  }
</script>
