export function createPracticeView(timbres, scales) {
  const timbreOptions = timbres.map((t, i) => `<option value="${i}">${t}</option>`).join('');
  const scaleOptions = scales.map((s, i) => `<option value="${i}">${s.name}</option>`).join('');

  return `
    <div class="view practice-view">
      <div class="controls-panel">
        <div class="control-group">
          <label>Timbre Synth</label>
          <select id="timbre-select">${timbreOptions}</select>
        </div>
        <div class="control-group">
          <label>Treino de Escala</label>
          <select id="scale-select">${scaleOptions}</select>
        </div>
        <div class="control-group metronome-controls">
          <label>Metrônomo (<span id="bpm-display">120</span> BPM)</label>
          <input type="range" id="bpm-slider" min="60" max="200" value="120">
          <button id="toggle-metronome" class="btn">Ligar Metrônomo</button>
        </div>
      </div>

      <div class="visualizer-container">
        <div class="target-note-display">
          Nota Alvo: <strong id="target-note-name">-</strong>
        </div>
        <div class="pitch-visualizer">
          <div class="gauge">
            <div class="gauge-center"></div>
            <div class="needle" id="pitch-needle"></div>
          </div>
          <div class="cents-label">
            <span class="flat">-50 Cents (Subir)</span>
            <span class="sharp">+50 Cents (Descer)</span>
          </div>
        </div>
        <div class="detected-pitch-display">
          Detectado: <strong id="detected-note-name">-</strong> (<span id="cents-off">0</span>)
        </div>
      </div>

      <div class="action-panel">
         <button id="toggle-training" class="btn primary">Iniciar Treino</button>
         <button id="play-reference" class="btn secondary">Ouvir Referência</button>
      </div>
    </div>
  `;
}

export function createHistoryView(historyData) {
  if (!historyData || historyData.length === 0) {
    return `
      <div class="view history-view empty">
        <p>Nenhum treino registrado ainda. Inicie um treino na aba 'Prática'!</p>
      </div>
    `;
  }

  // Calculate stats
  const totalSessions = historyData.length;
  const avgAccuracy = Math.round(historyData.reduce((acc, curr) => acc + curr.accuracy, 0) / totalSessions);

  // Generate SVG Chart
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = 20;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  let points = '';
  if (totalSessions > 1) {
    const xStep = chartWidth / (totalSessions - 1);
    points = historyData.map((session, i) => {
      const x = padding + i * xStep;
      const y = svgHeight - padding - (session.accuracy / 100) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
  } else {
    // Flat line if only one data point
    points = `${padding},${svgHeight/2} ${svgWidth - padding},${svgHeight/2}`;
  }

  const svgChart = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="progress-chart">
      <!-- Grid lines -->
      <line x1="${padding}" y1="${padding}" x2="${svgWidth - padding}" y2="${padding}" stroke="#eee" />
      <line x1="${padding}" y1="${svgHeight/2}" x2="${svgWidth - padding}" y2="${svgHeight/2}" stroke="#eee" />
      <line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" stroke="#eee" />

      <!-- Data line -->
      <polyline fill="none" stroke="#007aff" stroke-width="3" points="${points}" />

      <!-- Data points -->
      ${historyData.map((session, i) => {
        const xStep = totalSessions > 1 ? chartWidth / (totalSessions - 1) : chartWidth / 2;
        const x = totalSessions > 1 ? padding + i * xStep : svgWidth / 2;
        const y = svgHeight - padding - (session.accuracy / 100) * chartHeight;
        return `<circle cx="${x}" cy="${y}" r="4" fill="#007aff" />
                <title>${new Date(session.date).toLocaleDateString()}: ${session.accuracy}%</title>`;
      }).join('')}
    </svg>
  `;

  // Generate list
  const listItems = historyData.reverse().map(session => {
    let detailsHtml = '';
    if (session.notesDetails && session.notesDetails.length > 0) {
      detailsHtml = '<ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 12px; color: #555;">' +
        session.notesDetails.map(n => `<li><strong>${n.note}</strong>: ${n.status} (${n.avgCents} cents)</li>`).join('') +
        '</ul>';
    }

    return `
      <div class="history-item">
        <div class="history-item-header">
          <span class="date">${new Date(session.date).toLocaleString()}</span>
          <span class="accuracy ${session.accuracy >= 80 ? 'good' : 'needs-work'}">${session.accuracy}%</span>
        </div>
        <div class="history-item-details">
          Escala: ${session.scaleName} | Desvio Médio: ${Math.round(session.avgCentsOff)} cents
          ${detailsHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="view history-view">
      <div class="dashboard">
        <div class="stat-card">
          <h4>Média de Acertos</h4>
          <div class="stat-value">${avgAccuracy}%</div>
        </div>
        <div class="stat-card">
          <h4>Sessões Concluídas</h4>
          <div class="stat-value">${totalSessions}</div>
        </div>
      </div>

      <div class="chart-container">
        <h3>Evolução de Afinação</h3>
        ${svgChart}
      </div>

      <div class="history-list-container">
        <h3>Relatórios Detalhados</h3>
        <div class="history-list">
          ${listItems}
        </div>
      </div>
    </div>
  `;
}
