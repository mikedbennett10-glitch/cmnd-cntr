import { useState, useEffect, useCallback, useRef } from "react";

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:        #1e1b18;
    --ink-mid:    #3a3530;
    --ink-soft:   #6e6560;
    --parch:      #f7f3ee;
    --parch-mid:  #eee9e1;
    --parch-dark: #ddd6cb;
    --gold:       #b8871e;
    --gold-light: #d4a83a;
    --gold-pale:  #f5e9cf;
    --red:        #b34040;
    --red-pale:   #f9eded;
    --green:      #3a7a5a;
    --green-pale: #e4f2eb;
    --teal:       #3a6e7a;
    --teal-pale:  #e0f0f3;
    --plum:       #6e4a7a;
    --plum-pale:  #f0eaf4;
    --slate:      #4a5e6e;
    --slate-pale: #e6edf2;
    --rule:       rgba(80,60,40,0.13);
    --shadow:     0 2px 14px rgba(20,16,12,0.08);
    --shadow-md:  0 4px 24px rgba(20,16,12,0.13);
    --radius:     8px;
    --radius-lg:  12px;
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--parch);
    color: var(--ink);
    font-family: 'Lexend', 'Plus Jakarta Sans', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.5;
    min-height: 100vh;
  }

  /* Subtle grain */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 999;
  }

  /* ── Layout ── */
  .app { display: grid; grid-template-columns: 290px 1fr 270px; grid-template-rows: auto 1fr; min-height: 100vh; }

  /* ── Header ── */
  .header {
    grid-column: 1 / -1;
    background: var(--ink);
    color: var(--parch);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid var(--gold);
    height: 58px;
    gap: 16px;
  }
  .header-left { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
  .header-title {
    font-family: 'Lexend', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: var(--parch);
  }
  .header-title span { color: var(--gold-light); }
  .header-nav { display: flex; gap: 8px; }
  .hnav-btn {
    font-family: 'Lexend', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    padding: 6px 14px;
    border-radius: 20px;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .hnav-btn-startup {
    background: var(--teal-pale);
    color: var(--teal);
    border-color: rgba(58,110,122,0.3);
  }
  .hnav-btn-startup:hover { background: var(--teal); color: white; border-color: var(--teal); }
  .hnav-btn-week {
    background: var(--plum-pale);
    color: var(--plum);
    border-color: rgba(110,74,122,0.3);
  }
  .hnav-btn-week:hover { background: var(--plum); color: white; border-color: var(--plum); }

  .header-right { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
  .clock {
    font-family: 'Lexend', sans-serif;
    font-size: 1.45rem;
    font-weight: 600;
    color: var(--gold-light);
    letter-spacing: 0.04em;
    min-width: 88px;
    text-align: right;
  }
  .date-label { font-size: 0.72rem; color: #8a8078; letter-spacing: 0.06em; text-align: right; font-weight: 300; }

  /* ── Columns ── */
  .col-left  { background: var(--parch-mid); border-right: 1px solid var(--rule); padding: 18px 16px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
  .col-center { padding: 22px 26px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
  .col-right { background: var(--parch-mid); border-left: 1px solid var(--rule); padding: 18px 16px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }

  /* ── Cards ── */
  .card { background: var(--parch); border: 1px solid var(--rule); border-radius: var(--radius-lg); padding: 14px 16px; box-shadow: var(--shadow); }
  .card-title {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin-bottom: 11px;
    display: flex;
    align-items: center;
    gap: 7px;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 8px;
  }
  .card-title .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .dot-gold  { background: var(--gold); }
  .dot-red   { background: var(--red); }
  .dot-teal  { background: var(--teal); }
  .dot-green { background: var(--green); }
  .dot-plum  { background: var(--plum); }
  .dot-slate { background: var(--slate); }
  .dot-soft  { background: var(--ink-soft); }

  /* ── The Three ── */
  .three-list { display: flex; flex-direction: column; gap: 11px; }
  .three-item { display: flex; align-items: center; gap: 10px; }
  .three-num { font-size: 1.2rem; font-weight: 700; color: var(--gold); line-height: 1; min-width: 18px; }
  .three-input {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 1.5px solid var(--rule);
    font-family: 'Lexend', sans-serif;
    font-size: 0.92rem;
    font-weight: 400;
    color: var(--ink);
    padding: 4px 2px;
    outline: none;
    transition: border-color 0.2s;
  }
  .three-input:focus { border-bottom-color: var(--gold-light); }
  .three-input::placeholder { color: var(--parch-dark); font-weight: 300; }
  .three-check {
    width: 17px; height: 17px;
    border: 2px solid var(--parch-dark);
    border-radius: 4px;
    cursor: pointer;
    flex-shrink: 0;
    appearance: none;
    background: transparent;
    transition: all 0.18s;
  }
  .three-check:checked { background: var(--green); border-color: var(--green); }

  /* ── Context / Time filters ── */
  .section-label { font-size: 0.66rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 6px; }
  .context-row { display: flex; flex-wrap: wrap; gap: 5px; }
  .ctx-btn {
    font-family: 'Lexend', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    padding: 4px 11px;
    border: 1.5px solid var(--rule);
    border-radius: 20px;
    background: transparent;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.16s;
  }
  .ctx-btn:hover { border-color: var(--gold-light); color: var(--gold); }
  .ctx-btn.active { background: var(--gold-pale); color: var(--gold); border-color: var(--gold-light); font-weight: 600; }

  .time-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
  .time-btn {
    font-family: 'Lexend', sans-serif;
    font-size: 0.68rem;
    font-weight: 400;
    padding: 3px 10px;
    border: 1.5px solid var(--parch-dark);
    border-radius: 20px;
    background: transparent;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.16s;
  }
  .time-btn:hover { border-color: var(--teal); color: var(--teal); }
  .time-btn.active { background: var(--teal-pale); color: var(--teal); border-color: var(--teal); font-weight: 600; }

  /* ── Task List ── */
  .task-list { display: flex; flex-direction: column; gap: 5px; }
  .task-item { display: flex; align-items: flex-start; gap: 8px; padding: 7px 9px; border-radius: var(--radius); border: 1px solid transparent; transition: all 0.15s; }
  .task-item:hover { background: var(--parch-mid); border-color: var(--rule); }
  .task-item.done { opacity: 0.4; }
  .task-cb { width: 15px; height: 15px; border: 2px solid var(--parch-dark); border-radius: 3px; flex-shrink: 0; appearance: none; background: transparent; cursor: pointer; margin-top: 3px; transition: all 0.15s; }
  .task-cb:checked { background: var(--green); border-color: var(--green); }
  .task-body { flex: 1; }
  .task-text { font-size: 0.88rem; color: var(--ink); font-weight: 400; }
  .task-item.done .task-text { text-decoration: line-through; }
  .task-meta { font-size: 0.7rem; color: var(--ink-soft); margin-top: 2px; display: flex; align-items: center; gap: 4px; }
  .task-tag { display: inline-block; font-size: 0.63rem; font-weight: 600; padding: 1px 7px; border-radius: 10px; letter-spacing: 0.05em; }
  .tag-work    { background: var(--slate-pale); color: var(--slate); }
  .tag-home    { background: #f5ebe0; color: #7a5020; }
  .tag-school  { background: var(--green-pale); color: var(--green); }
  .tag-project { background: var(--plum-pale); color: var(--plum); }

  /* ── Quick Capture ── */
  .capture-input {
    flex: 1;
    background: var(--parch);
    border: 1.5px solid var(--rule);
    border-radius: var(--radius);
    font-family: 'Lexend', sans-serif;
    font-size: 0.85rem;
    font-weight: 400;
    padding: 7px 10px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  .capture-input:focus { border-color: var(--gold-light); }
  .capture-input::placeholder { color: var(--parch-dark); font-weight: 300; }
  .capture-select {
    background: var(--parch-mid);
    border: 1.5px solid var(--rule);
    border-radius: var(--radius);
    font-family: 'Lexend', sans-serif;
    font-size: 0.78rem;
    color: var(--ink-soft);
    padding: 6px 7px;
    outline: none;
    cursor: pointer;
  }
  .btn {
    font-family: 'Lexend', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 7px 14px;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.18s;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .btn-primary { background: var(--gold-pale); color: var(--gold); border: 1.5px solid var(--gold-light); }
  .btn-primary:hover { background: var(--gold-light); color: white; }
  .btn-teal { background: var(--teal-pale); color: var(--teal); border: 1.5px solid rgba(58,110,122,0.3); }
  .btn-teal:hover { background: var(--teal); color: white; }
  .btn-slate { background: var(--slate-pale); color: var(--slate); border: 1.5px solid rgba(74,94,110,0.3); }
  .btn-slate:hover { background: var(--slate); color: white; }
  .btn-block { width: 100%; text-align: center; }
  .btn-sm { padding: 5px 10px; font-size: 0.7rem; }

  /* ── Calendar ── */
  .cal-tabs { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
  .cal-tab {
    font-family: 'Lexend', sans-serif;
    font-size: 0.68rem;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
    border: 1.5px solid var(--rule);
    background: transparent;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .cal-tab.active { background: var(--parch-mid); border-color: var(--ink-soft); color: var(--ink); font-weight: 600; }
  .cal-tab .cal-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .cal-add-input { background: var(--parch-mid); border: 1.5px solid var(--rule); border-radius: var(--radius); font-family: 'Lexend', sans-serif; font-size: 0.78rem; padding: 6px 9px; color: var(--ink); outline: none; width: 100%; margin-bottom: 6px; }
  .cal-add-input:focus { border-color: var(--gold-light); }
  .cal-add-input::placeholder { color: var(--parch-dark); }

  .cal-list { display: flex; flex-direction: column; gap: 5px; }
  .cal-item { display: flex; gap: 9px; align-items: flex-start; padding: 6px 8px; border-radius: var(--radius); border-left: 3px solid var(--gold-light); background: var(--parch); }
  .cal-item.past { opacity: 0.45; border-left-color: var(--parch-dark); }
  .cal-item.now  { border-left-color: var(--red); background: var(--red-pale); }
  .cal-time { font-size: 0.7rem; color: var(--ink-soft); font-variant-numeric: tabular-nums; min-width: 40px; padding-top: 2px; font-weight: 300; }
  .cal-name { font-size: 0.83rem; color: var(--ink); font-weight: 400; }
  .cal-now-badge { font-size: 0.6rem; font-weight: 700; background: var(--red); color: white; border-radius: 8px; padding: 1px 6px; letter-spacing: 0.07em; display: inline-block; margin-left: 5px; }
  .cal-cal-label { font-size: 0.62rem; color: var(--ink-soft); font-weight: 300; margin-top: 1px; }
  .cal-loading { font-size: 0.82rem; color: var(--ink-soft); font-weight: 300; font-style: italic; }

  /* ── Parking Lot ── */
  .park-list { display: flex; flex-direction: column; gap: 5px; }
  .park-item { display: flex; align-items: center; gap: 7px; font-size: 0.82rem; color: var(--ink-soft); padding: 5px 6px; border-radius: 6px; border: 1px solid transparent; }
  .park-item:hover { background: var(--parch); border-color: var(--rule); }
  .park-text { flex: 1; font-weight: 300; }
  .park-promote { background: var(--teal-pale); border: 1px solid rgba(58,110,122,0.2); border-radius: 4px; font-size: 0.62rem; font-weight: 600; font-family: 'Lexend', sans-serif; padding: 2px 7px; cursor: pointer; color: var(--teal); transition: all 0.15s; white-space: nowrap; }
  .park-promote:hover { background: var(--teal); color: white; }
  .park-del { background: transparent; border: none; color: var(--parch-dark); cursor: pointer; font-size: 1rem; line-height: 1; transition: color 0.15s; }
  .park-del:hover { color: var(--red); }

  /* ── Progress bar ── */
  .progress-bar { height: 3px; background: var(--parch-dark); border-radius: 2px; overflow: hidden; margin-top: 12px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--teal), var(--green)); border-radius: 2px; transition: width 0.4s ease; }

  /* ── Empty ── */
  .empty { font-size: 0.82rem; font-weight: 300; color: var(--parch-dark); text-align: center; padding: 12px 0; font-style: italic; }

  /* ── Weekly review card ── */
  .review-card { background: var(--ink); color: var(--parch); }
  .review-card .card-title { color: var(--gold-light); border-bottom-color: rgba(200,160,58,0.2); }

  /* ── Modal overlay ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(20,16,12,0.55);
    backdrop-filter: blur(3px);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadeIn 0.2s ease both;
  }
  .modal {
    background: var(--parch);
    border: 1px solid var(--rule);
    border-radius: 16px;
    box-shadow: var(--shadow-md);
    max-width: 580px;
    width: 100%;
    max-height: 88vh;
    overflow-y: auto;
    padding: 28px 30px;
    position: relative;
    animation: slideUp 0.25s ease both;
  }
  .modal-week { max-width: 700px; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .modal-close {
    position: absolute;
    top: 16px; right: 18px;
    background: var(--parch-mid);
    border: 1px solid var(--rule);
    border-radius: 50%;
    width: 30px; height: 30px;
    font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-soft);
    transition: all 0.15s;
    font-family: 'Lexend', sans-serif;
    line-height: 1;
  }
  .modal-close:hover { background: var(--red); color: white; border-color: var(--red); }
  .modal-title {
    font-family: 'Lexend', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 4px;
    letter-spacing: 0.01em;
  }
  .modal-subtitle { font-size: 0.82rem; font-weight: 300; color: var(--ink-soft); margin-bottom: 22px; font-style: italic; }
  .modal-section { margin-bottom: 20px; }
  .modal-section-title {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--rule);
  }

  /* Startup ritual steps */
  .ritual-steps { display: flex; flex-direction: column; gap: 10px; }
  .ritual-step { display: flex; gap: 12px; align-items: flex-start; padding: 11px 13px; border-radius: 10px; background: var(--parch-mid); border: 1px solid var(--rule); transition: all 0.15s; }
  .ritual-step.done-step { background: var(--green-pale); border-color: rgba(58,122,90,0.2); }
  .ritual-step-num { font-size: 0.72rem; font-weight: 700; color: var(--gold); min-width: 20px; padding-top: 1px; }
  .ritual-step-body { flex: 1; }
  .ritual-step-title { font-size: 0.88rem; font-weight: 600; color: var(--ink); }
  .ritual-step-desc { font-size: 0.77rem; font-weight: 300; color: var(--ink-soft); margin-top: 2px; line-height: 1.45; }
  .ritual-step-cb { width: 17px; height: 17px; border: 2px solid var(--parch-dark); border-radius: 4px; appearance: none; cursor: pointer; flex-shrink: 0; margin-top: 2px; transition: all 0.15s; }
  .ritual-step-cb:checked { background: var(--green); border-color: var(--green); }
  .ritual-note { background: var(--gold-pale); border: 1px solid rgba(184,135,30,0.25); border-radius: 8px; padding: 10px 13px; font-size: 0.8rem; color: var(--ink-mid); font-weight: 300; line-height: 1.55; margin-top: 16px; }
  .ritual-note strong { font-weight: 600; color: var(--gold); }

  /* Week ahead ── */
  .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
  .week-day { background: var(--parch-mid); border: 1px solid var(--rule); border-radius: 8px; padding: 10px 9px; min-height: 100px; }
  .week-day.today { background: var(--gold-pale); border-color: var(--gold-light); }
  .week-day-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 2px; }
  .week-day-date { font-size: 1.05rem; font-weight: 700; color: var(--ink); margin-bottom: 7px; }
  .week-day.today .week-day-date { color: var(--gold); }
  .week-event { font-size: 0.65rem; font-weight: 400; color: var(--ink-mid); background: white; border-left: 2px solid var(--gold-light); padding: 2px 5px; border-radius: 3px; margin-bottom: 3px; }
  .week-event.ev-red { border-left-color: var(--red); }
  .week-loading { font-style: italic; color: var(--ink-soft); font-size: 0.82rem; font-weight: 300; text-align: center; padding: 20px 0; }

  .review-questions { display: flex; flex-direction: column; gap: 12px; }
  .review-q { display: flex; gap: 10px; align-items: flex-start; }
  .review-q-num { font-size: 0.75rem; font-weight: 700; color: var(--plum); min-width: 18px; padding-top: 2px; }
  .review-q-text { font-size: 0.88rem; color: var(--ink); font-weight: 400; line-height: 1.4; }
  .review-q-sub { font-size: 0.75rem; font-weight: 300; color: var(--ink-soft); margin-top: 2px; }

  /* ── Scrollbars ── */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--parch-dark); border-radius: 3px; }

  /* ── Animations ── */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  .fadeIn { animation: fadeIn 0.3s ease both; }
`;

// ── Constants ──────────────────────────────────────────────────────────────────
const CONTEXTS  = ["All", "Work", "Home", "School", "Projects"];
const TIME_OPTS = ["Any", "5 min", "15 min", "30 min", "1 hr+"];
const TAGS      = ["Work", "Home", "School", "Projects"];
const TAG_CLASS = { Work: "tag-work", Home: "tag-home", School: "tag-school", Projects: "tag-project" };

const CAL_COLORS = ["#b8871e","#3a6e7a","#3a7a5a","#6e4a7a","#b34040","#4a5e6e","#7a6a3a"];

const STARTUP_STEPS = [
  { title: "Brain Dump (2 min)", desc: "Open Quick Capture. Write every floating thought until your head is clear. Don't organize yet." },
  { title: "Review The Three", desc: "Are yesterday's still valid? Clear done ones. Set today's three non-negotiables before anything else." },
  { title: "Scan your calendar", desc: "Note hard stops. Block time around fixed events. Mark the 'NOW' window you have to work in." },
  { title: "Check Open Loops", desc: "Filter by context + time. Pick 3–5 tasks that fit today's available windows." },
  { title: "Triage the Parking Lot", desc: "Anything urgent? Promote it. Kill anything that's been there 2+ weeks without movement." },
  { title: "Set your intention", desc: "One sentence: what does 'good enough' look like at 5pm today? Write it below." },
];

const REVIEW_QUESTIONS = [
  { q: "What got done this week?", sub: "Celebrate it. Even the small stuff counts." },
  { q: "What didn't get done — and why?", sub: "Was it a planning failure, an energy failure, or a priority shift?" },
  { q: "What zombie tasks are still alive?", sub: "If it's been in Open Loops 3+ weeks, park it, delete it, or do it now." },
  { q: "What did your calendar actually look like vs. planned?", sub: "Time blindness audit. Were you honest about how long things take?" },
  { q: "What are the three priorities for next week?", sub: "Not the full list — just the three that actually have to happen." },
  { q: "Any loops to close before the weekend?", sub: "Calls, emails, commitments. What's still open that someone else is waiting on?" },
];

const SEED_TASKS = [
  { id: 1, text: "Review Travis Messina pitch deck edits", tag: "Work", done: false, time: "30 min" },
  { id: 2, text: "Send Scenic City AI follow-up to Chattanooga prospect", tag: "Work", done: false, time: "15 min" },
  { id: 3, text: "Pull together Marin's Latin schedule for fall", tag: "School", done: false, time: "30 min" },
  { id: 4, text: "Cumberland Currents — confirm coach availability", tag: "Home", done: false, time: "15 min" },
  { id: 5, text: "SpacePlan: finish parametric input schema draft", tag: "Projects", done: false, time: "1 hr+" },
  { id: 6, text: "Review Isaac's YES program paperwork", tag: "School", done: false, time: "5 min" },
  { id: 7, text: "Water chickens + check on Snowball", tag: "Home", done: false, time: "5 min" },
  { id: 8, text: "Indivisible app: Supabase auth flow", tag: "Projects", done: false, time: "1 hr+" },
];

const SEED_PARKING = [
  "Research Chesterton Academy board structure",
  "Find Classical Conversations comparison for Marin next year",
  "Price out PRV replacement parts",
  "Logos reading list — add Pieper to curriculum doc",
];

const DEFAULT_CALENDARS = [
  { id: "primary", name: "Personal", color: CAL_COLORS[0], active: true },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const load = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const fmt12 = (iso) => {
  if (!iso) return "All day";
  const d = new Date(iso);
  let h = d.getHours(), m = d.getMinutes(), s = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")}${s}`;
};
const isNow  = (s, e) => { const n = Date.now(); return new Date(s) <= n && new Date(e) >= n; };
const isPast = (e) => new Date(e) < Date.now();

const getDayRange = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const start = new Date(d); start.setHours(0,0,0,0);
  const end   = new Date(d); end.setHours(23,59,59,999);
  return { start, end, date: d };
};

const DAY_ABBR = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [now, setNow]           = useState(new Date());
  const [three, setThree]       = useState(() => load("cc_three", [
    { text: "", done: false }, { text: "", done: false }, { text: "", done: false },
  ]));
  const [tasks, setTasks]       = useState(() => load("cc_tasks", SEED_TASKS));
  const [parking, setParking]   = useState(() => load("cc_parking", SEED_PARKING));
  const [ctx, setCtx]           = useState("All");
  const [timeFilter, setTimeFilter] = useState("Any");
  const [capture, setCapture]   = useState("");
  const [captureTag, setCaptureTag]   = useState("Work");
  const [captureTime, setCaptureTime] = useState("15 min");
  const [parkCapture, setParkCapture] = useState("");
  const [intention, setIntention]     = useState(() => load("cc_intention", ""));
  const captureRef = useRef(null);

  // Calendars
  const [calendars, setCalendars] = useState(() => load("cc_calendars", DEFAULT_CALENDARS));
  const [newCalName, setNewCalName] = useState("");
  const [calEvents, setCalEvents]   = useState({});   // calId -> events[]
  const [calStatus, setCalStatus]   = useState("idle");
  const [showCalAdd, setShowCalAdd] = useState(false);

  // Modals
  const [showStartup, setShowStartup] = useState(false);
  const [showWeek, setShowWeek]       = useState(false);
  const [startupChecks, setStartupChecks] = useState([false,false,false,false,false,false]);
  const [weekEvents, setWeekEvents]   = useState(null);
  const [weekStatus, setWeekStatus]   = useState("idle");

  // Clock
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 10000); return () => clearInterval(t); }, []);

  // Persist
  useEffect(() => save("cc_three",     three),     [three]);
  useEffect(() => save("cc_tasks",     tasks),     [tasks]);
  useEffect(() => save("cc_parking",   parking),   [parking]);
  useEffect(() => save("cc_intention", intention), [intention]);
  useEffect(() => save("cc_calendars", calendars), [calendars]);

  // ── Calendar fetch (today) ──────────────────────────────────────────────────
  const fetchCalendar = useCallback(async () => {
    const activeCals = calendars.filter(c => c.active);
    if (!activeCals.length) return;
    setCalStatus("loading");
    const today = new Date();
    const results = {};
    try {
      for (const cal of activeCals) {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: `You fetch Google Calendar events and return ONLY a JSON array — no preamble, no markdown fences. Each object: { "title": string, "start": ISO8601, "end": ISO8601, "allDay": boolean }. Return [] if no events. Today: ${today.toISOString()}.`,
            messages: [{ role: "user", content: `List all events for calendar "${cal.name}" on ${today.toDateString()}.` }],
            mcp_servers: [{ type: "url", url: "https://calendarmcp.googleapis.com/mcp/v1", name: "google-calendar" }],
          }),
        });
        const data = await response.json();
        const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "[]";
        const clean = text.replace(/```json|```/g, "").trim();
        results[cal.id] = JSON.parse(clean);
      }
      setCalEvents(results);
      setCalStatus("loaded");
    } catch (e) {
      console.error(e);
      setCalStatus("error");
    }
  }, [calendars]);

  useEffect(() => { fetchCalendar(); }, []);

  // ── Week-ahead fetch ────────────────────────────────────────────────────────
  const fetchWeek = useCallback(async () => {
    setWeekStatus("loading");
    const activeCals = calendars.filter(c => c.active);
    const days = Array.from({ length: 7 }, (_, i) => getDayRange(i));
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: `You fetch Google Calendar events for the next 7 days and return ONLY a JSON array — no markdown. Each object: { "title": string, "start": ISO8601, "end": ISO8601, "allDay": boolean, "calendarName": string }. Today: ${new Date().toISOString()}. Include all connected calendars.`,
          messages: [{ role: "user", content: `List all events from today (${days[0].date.toDateString()}) through ${days[6].date.toDateString()} across all calendars: ${activeCals.map(c=>c.name).join(", ")}.` }],
          mcp_servers: [{ type: "url", url: "https://calendarmcp.googleapis.com/mcp/v1", name: "google-calendar" }],
        }),
      });
      const data = await response.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      setWeekEvents(JSON.parse(clean));
      setWeekStatus("loaded");
    } catch (e) {
      console.error(e);
      setWeekStatus("error");
    }
  }, [calendars]);

  const openWeek = () => { setShowWeek(true); if (!weekEvents) fetchWeek(); };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const allTodayEvents = Object.entries(calEvents).flatMap(([calId, evs]) => {
    const cal = calendars.find(c => c.id === calId);
    return (evs || []).map(e => ({ ...e, calName: cal?.name, calColor: cal?.color }));
  }).sort((a, b) => new Date(a.start) - new Date(b.start));

  const filteredTasks = tasks.filter(t => {
    if (t.done) return false;
    if (ctx !== "All" && t.tag !== ctx) return false;
    if (timeFilter !== "Any" && t.time !== timeFilter) return false;
    return true;
  });
  const doneTasks    = tasks.filter(t => t.done);
  const threeProgress = three.filter(t => t.done && t.text).length;
  const threeTotal    = three.filter(t => t.text).length || 3;

  const fmtClock = (d) => { let h=d.getHours(), m=d.getMinutes(), s=h>=12?"PM":"AM"; h=h%12||12; return `${h}:${String(m).padStart(2,"0")} ${s}`; };
  const fmtDate  = (d) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // ── Actions ──────────────────────────────────────────────────────────────────
  const addTask = () => {
    if (!capture.trim()) return;
    setTasks(prev => [{ id: Date.now(), text: capture.trim(), tag: captureTag, done: false, time: captureTime }, ...prev]);
    setCapture(""); captureRef.current?.focus();
  };
  const addParking = () => {
    if (!parkCapture.trim()) return;
    setParking(prev => [parkCapture.trim(), ...prev]); setParkCapture("");
  };
  const promoteParking = (idx) => {
    setTasks(prev => [{ id: Date.now(), text: parking[idx], tag: "Work", done: false, time: "15 min" }, ...prev]);
    setParking(prev => prev.filter((_, i) => i !== idx));
  };
  const toggleTask  = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const toggleThree = (i)  => setThree(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  const setThreeText = (i, val) => setThree(prev => prev.map((t, idx) => idx === i ? { ...t, text: val } : t));

  const addCalendar = () => {
    if (!newCalName.trim()) return;
    const id = `cal_${Date.now()}`;
    const color = CAL_COLORS[calendars.length % CAL_COLORS.length];
    setCalendars(prev => [...prev, { id, name: newCalName.trim(), color, active: true }]);
    setNewCalName(""); setShowCalAdd(false);
  };
  const toggleCal = (id) => setCalendars(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  const removeCal = (id) => { setCalendars(prev => prev.filter(c => c.id !== id)); setCalEvents(prev => { const n={...prev}; delete n[id]; return n; }); };

  const toggleStartup = (i) => setStartupChecks(prev => prev.map((v,idx) => idx===i ? !v : v));
  const resetStartup  = () => setStartupChecks([false,false,false,false,false,false]);

  // Week day events lookup
  const weekEventsForDay = (dayDate) => {
    if (!weekEvents) return [];
    return weekEvents.filter(ev => {
      const evDate = new Date(ev.start);
      return evDate.toDateString() === dayDate.toDateString();
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* ══ HEADER ══ */}
        <header className="header">
          <div className="header-left">
            <div className="header-title">CMND&nbsp;<span>CNTR</span></div>
            <nav className="header-nav">
              <button className="hnav-btn hnav-btn-startup" onClick={() => setShowStartup(true)}>
                ☀ Daily Startup
              </button>
              <button className="hnav-btn hnav-btn-week" onClick={openWeek}>
                📅 Week Ahead
              </button>
            </nav>
          </div>
          <div className="header-right">
            <div>
              <div className="date-label">{fmtDate(now)}</div>
            </div>
            <div className="clock">{fmtClock(now)}</div>
          </div>
        </header>

        {/* ══ LEFT — Capture + Loops ══ */}
        <aside className="col-left">

          {/* Quick Capture */}
          <div className="card fadeIn">
            <div className="card-title"><span className="dot dot-gold" /> Quick Capture</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                ref={captureRef}
                className="capture-input"
                placeholder="What's on your mind…"
                value={capture}
                onChange={e => setCapture(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <select className="capture-select" value={captureTag} onChange={e => setCaptureTag(e.target.value)}>
                  {TAGS.map(t => <option key={t}>{t}</option>)}
                </select>
                <select className="capture-select" value={captureTime} onChange={e => setCaptureTime(e.target.value)}>
                  {["5 min","15 min","30 min","1 hr+"].map(t => <option key={t}>{t}</option>)}
                </select>
                <button className="btn btn-primary" onClick={addTask}>Add</button>
              </div>
            </div>
          </div>

          {/* Surface By */}
          <div className="card fadeIn" style={{ animationDelay: "0.05s" }}>
            <div className="card-title"><span className="dot dot-soft" /> Surface By</div>
            <div className="section-label">Context</div>
            <div className="context-row">
              {CONTEXTS.map(c => (
                <button key={c} className={`ctx-btn${ctx === c ? " active" : ""}`} onClick={() => setCtx(c)}>{c}</button>
              ))}
            </div>
            <div className="section-label" style={{ marginTop: 10 }}>Time Available</div>
            <div className="time-row">
              {TIME_OPTS.map(t => (
                <button key={t} className={`time-btn${timeFilter === t ? " active" : ""}`} onClick={() => setTimeFilter(t)}>{t}</button>
              ))}
            </div>
          </div>

          {/* Open Loops */}
          <div className="card fadeIn" style={{ animationDelay: "0.1s", flex: 1 }}>
            <div className="card-title">
              <span className="dot dot-slate" /> Open Loops
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 300, letterSpacing: 0 }}>{filteredTasks.length} showing</span>
            </div>
            {filteredTasks.length === 0
              ? <div className="empty">No loops match this filter.</div>
              : (
                <div className="task-list">
                  {filteredTasks.map(t => (
                    <div key={t.id} className={`task-item${t.done ? " done" : ""}`}>
                      <input type="checkbox" className="task-cb" checked={t.done} onChange={() => toggleTask(t.id)} />
                      <div className="task-body">
                        <div className="task-text">{t.text}</div>
                        <div className="task-meta">
                          <span className={`task-tag ${TAG_CLASS[t.tag]||""}`}>{t.tag}</span>
                          {t.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
            {doneTasks.length > 0 && (
              <div style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--ink-soft)", fontWeight: 300 }}>
                + {doneTasks.length} completed today
              </div>
            )}
          </div>
        </aside>

        {/* ══ CENTER — Command ══ */}
        <main className="col-center">

          {/* The Three */}
          <div className="card fadeIn">
            <div className="card-title"><span className="dot dot-gold" /> The Three — Today's Non-Negotiables</div>
            <div className="three-list">
              {three.map((t, i) => (
                <div key={i} className="three-item">
                  <span className="three-num">{i + 1}</span>
                  <input type="checkbox" className="three-check" checked={t.done} onChange={() => toggleThree(i)} disabled={!t.text} />
                  <input
                    className="three-input"
                    placeholder={`Priority ${i + 1}…`}
                    value={t.text}
                    onChange={e => setThreeText(i, e.target.value)}
                    style={t.done ? { textDecoration: "line-through", color: "var(--ink-soft)" } : {}}
                  />
                </div>
              ))}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(threeProgress / threeTotal) * 100}%` }} />
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--ink-soft)", fontWeight: 300, marginTop: 6, textAlign: "right" }}>
              {threeProgress} of {threeTotal} complete
            </div>
          </div>

          {/* Today's Rhythm */}
          <div className="card fadeIn" style={{ animationDelay: "0.06s" }}>
            <div className="card-title"><span className="dot dot-red" /> Today's Rhythm</div>

            {/* Calendar tabs */}
            <div className="cal-tabs">
              {calendars.map(cal => (
                <button
                  key={cal.id}
                  className={`cal-tab${cal.active ? " active" : ""}`}
                  onClick={() => toggleCal(cal.id)}
                >
                  <span className="cal-dot" style={{ background: cal.color }} />
                  {cal.name}
                  {calendars.length > 1 && (
                    <span
                      style={{ marginLeft: 3, fontSize: "0.6rem", opacity: 0.5, cursor: "pointer" }}
                      onClick={e => { e.stopPropagation(); removeCal(cal.id); }}
                    >✕</span>
                  )}
                </button>
              ))}
              <button className="cal-tab" onClick={() => setShowCalAdd(v => !v)} title="Add calendar">
                + Add
              </button>
            </div>

            {showCalAdd && (
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                <input
                  className="cal-add-input"
                  placeholder="Calendar name (e.g. Work, Family)…"
                  value={newCalName}
                  onChange={e => setNewCalName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addCalendar()}
                  autoFocus
                />
                <button className="btn btn-teal btn-sm" onClick={addCalendar}>Add</button>
              </div>
            )}

            {calStatus === "loading" && <div className="cal-loading">Consulting the calendars…</div>}
            {calStatus === "error"   && (
              <div>
                <div className="cal-loading" style={{ marginBottom: 8 }}>Could not reach calendar. Check connection.</div>
                <button className="btn btn-slate btn-block" onClick={fetchCalendar}>Retry</button>
              </div>
            )}
            {calStatus === "idle"   && <button className="btn btn-teal btn-block" onClick={fetchCalendar}>Load Today's Calendar</button>}
            {calStatus === "loaded" && allTodayEvents.length === 0 && (
              <div className="empty">No events today. Clear runway — guard it.</div>
            )}
            {calStatus === "loaded" && allTodayEvents.length > 0 && (
              <div className="cal-list">
                {allTodayEvents.map((ev, i) => {
                  const nowEv = isNow(ev.start, ev.end);
                  const past  = !nowEv && isPast(ev.end);
                  return (
                    <div key={i} className={`cal-item${nowEv ? " now" : past ? " past" : ""}`}
                      style={{ borderLeftColor: ev.calColor || "var(--gold-light)" }}>
                      <div className="cal-time">{ev.allDay ? "All day" : fmt12(ev.start)}</div>
                      <div>
                        <div className="cal-name">
                          {ev.title}
                          {nowEv && <span className="cal-now-badge">NOW</span>}
                        </div>
                        {ev.calName && <div className="cal-cal-label">{ev.calName}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: 10 }}>
              <button className="btn btn-slate btn-sm" onClick={fetchCalendar}>
                {calStatus === "loading" ? "Loading…" : "↻ Refresh"}
              </button>
            </div>
          </div>

          {/* Closed Today */}
          {doneTasks.length > 0 && (
            <div className="card fadeIn" style={{ animationDelay: "0.12s" }}>
              <div className="card-title"><span className="dot dot-green" /> Closed Today</div>
              <div className="task-list">
                {doneTasks.slice(0, 6).map(t => (
                  <div key={t.id} className="task-item done">
                    <input type="checkbox" className="task-cb" checked onChange={() => toggleTask(t.id)} />
                    <div className="task-body"><div className="task-text">{t.text}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* ══ RIGHT — Parking + Review ══ */}
        <aside className="col-right">

          {/* Parking Lot */}
          <div className="card fadeIn" style={{ flex: 1 }}>
            <div className="card-title"><span className="dot dot-soft" /> Parking Lot</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <input
                className="capture-input"
                placeholder="Stash something…"
                value={parkCapture}
                onChange={e => setParkCapture(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addParking()}
                style={{ fontSize: "0.82rem", padding: "5px 8px" }}
              />
              <button className="btn btn-primary btn-sm" onClick={addParking}>+</button>
            </div>
            {parking.length === 0
              ? <div className="empty">Lot's empty. Rare — enjoy it.</div>
              : (
                <div className="park-list">
                  {parking.map((p, i) => (
                    <div key={i} className="park-item">
                      <span className="park-text">{p}</span>
                      <button className="park-promote" onClick={() => promoteParking(i)}>→ Loop</button>
                      <button className="park-del" onClick={() => setParking(prev => prev.filter((_,idx) => idx !== i))}>×</button>
                    </div>
                  ))}
                </div>
              )
            }
          </div>

          {/* Weekly Review anchor */}
          <div className="card review-card fadeIn" style={{ animationDelay: "0.08s" }}>
            <div className="card-title"><span className="dot dot-plum" /> Weekly Review</div>
            <div style={{ fontSize: "0.78rem", color: "var(--parch-dark)", fontWeight: 300, lineHeight: 1.65 }}>
              Every Friday at 4 PM:<br/>
              1. Empty the Parking Lot<br/>
              2. Kill zombie tasks<br/>
              3. Set next week's Three<br/>
              4. Check calendar blockers
            </div>
            <button
              className="btn btn-teal btn-block"
              style={{ marginTop: 12, fontSize: "0.72rem" }}
              onClick={openWeek}
            >
              Open Week Ahead →
            </button>
          </div>

        </aside>
      </div>

      {/* ══ MODAL: Daily Startup ══ */}
      {showStartup && (
        <div className="modal-overlay" onClick={() => setShowStartup(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowStartup(false)}>✕</button>
            <div className="modal-title">☀ Daily Startup Ritual</div>
            <div className="modal-subtitle">Run this every morning before you open email. ~10 minutes.</div>

            <div className="modal-section">
              <div className="modal-section-title">The Six Steps</div>
              <div className="ritual-steps">
                {STARTUP_STEPS.map((s, i) => (
                  <div key={i} className={`ritual-step${startupChecks[i] ? " done-step" : ""}`}>
                    <div className="ritual-step-num">{i + 1}</div>
                    <div className="ritual-step-body">
                      <div className="ritual-step-title">{s.title}</div>
                      <div className="ritual-step-desc">{s.desc}</div>
                    </div>
                    <input type="checkbox" className="ritual-step-cb" checked={startupChecks[i]} onChange={() => toggleStartup(i)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Today's Intention</div>
              <input
                className="capture-input"
                placeholder="What does 'good enough' look like at 5pm today?"
                value={intention}
                onChange={e => setIntention(e.target.value)}
              />
            </div>

            <div className="ritual-note">
              <strong>ADHD note:</strong> The point is not to be perfect. The point is to get your brain off "ambient stress mode" and into "I know what I'm doing" mode. Even if you only do steps 1–3, you're ahead.
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <button className="btn btn-slate btn-sm" onClick={resetStartup}>Reset Checks</button>
              <button className="btn btn-primary" onClick={() => setShowStartup(false)}>Close & Begin</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: Week Ahead ══ */}
      {showWeek && (
        <div className="modal-overlay" onClick={() => setShowWeek(false)}>
          <div className="modal modal-week" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowWeek(false)}>✕</button>
            <div className="modal-title">📅 Week Ahead</div>
            <div className="modal-subtitle">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })} — 7-day view
            </div>

            {/* 7-day grid */}
            <div className="modal-section">
              <div className="modal-section-title">Calendar Overview</div>
              {weekStatus === "loading" && <div className="week-loading">Fetching the week from your calendars…</div>}
              {weekStatus === "error"   && (
                <div style={{ textAlign: "center" }}>
                  <div className="cal-loading" style={{ marginBottom: 8 }}>Could not load week. Check connection.</div>
                  <button className="btn btn-slate" onClick={fetchWeek}>Retry</button>
                </div>
              )}
              {(weekStatus === "loaded" || weekStatus === "idle") && (
                <div className="week-grid">
                  {Array.from({ length: 7 }, (_, i) => {
                    const { date } = getDayRange(i);
                    const isToday = i === 0;
                    const evs = weekEventsForDay(date);
                    return (
                      <div key={i} className={`week-day${isToday ? " today" : ""}`}>
                        <div className="week-day-label">{DAY_ABBR[date.getDay()]}</div>
                        <div className="week-day-date">{date.getDate()}</div>
                        {weekStatus === "idle" && <div style={{ fontSize:"0.62rem", color:"var(--parch-dark)", fontStyle:"italic" }}>—</div>}
                        {evs.map((ev, j) => (
                          <div key={j} className="week-event">
                            {ev.allDay ? "●" : fmt12(ev.start)} {ev.title}
                          </div>
                        ))}
                        {weekStatus === "loaded" && evs.length === 0 && (
                          <div style={{ fontSize: "0.62rem", color: "var(--parch-dark)", fontStyle: "italic" }}>clear</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {weekStatus === "idle" && (
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-teal btn-block" onClick={fetchWeek}>Load 7-Day Calendar</button>
                </div>
              )}
            </div>

            {/* Review questions */}
            <div className="modal-section">
              <div className="modal-section-title">Weekly Review Prompts</div>
              <div className="review-questions">
                {REVIEW_QUESTIONS.map((q, i) => (
                  <div key={i} className="review-q">
                    <div className="review-q-num">{i + 1}</div>
                    <div>
                      <div className="review-q-text">{q.q}</div>
                      <div className="review-q-sub">{q.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button className="btn btn-slate btn-sm" onClick={fetchWeek}>↻ Refresh Week</button>
              <button className="btn btn-primary" style={{ marginLeft: "auto" }} onClick={() => setShowWeek(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
