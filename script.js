const state = {
  currentEpisode: "acsChestPain",
  scores: {
    safety: 50,
    clinical: 50,
    empathy: 50,
    protocol: 50,
  },
  stage: "handoff",
  conceptSeen: true,
  clinicalEntry: {
    handoffComplete: false,
    chartExposed: false,
    bedsideReleased: false,
  },
  monitorOn: false,
  ekgAttached: false,
  ecgWorkflowStarted: false,
  assessed: false,
  rapport: false,
  procedure: [],
  procedureOptions: [],
  procedureFeedback: {},
  askedQuestions: [],
  appliedRegularOrders: [],
  prnMedicationsGiven: [],
  postPrnReassessment: {
    pain: false,
    vitals: false,
    ecgReview: false,
  },
  medicationWorkflow: {
    selectedOrderId: null,
    prepared: false,
    doseVerified: false,
    syringeReady: false,
    verifiedDose: "",
  },
  sbarSelections: {},
  assessmentFindings: {},
  completedAssessments: {
    pain: false,
    vitals: false,
    consciousness: false,
    ecgReview: false,
    respiratory: false,
    perfusion: false,
    skin: false,
  },
  patientFindings: {},
  oxygenApplied: false,
  stabilized: false,
  outcome: null,
  patientVoice: "",
  lastVoiceKey: "",
  urgency: {
    level: "mild",
    score: 0,
    label: "낮음",
  },
  activeTool: null,
  dynamicLoop: {
    lastTickAt: 0,
    stabilizedTicks: 0,
    criticalTicks: 0,
    lowSpo2Ticks: 0,
    ignoredInstabilityTicks: 0,
  },
  elapsedMinutes: 0,
  emrOpened: false,
  emrTab: "summary",
  knownPatientInfo: {
    pain: false,
    breathing: false,
    cardiacRisk: false,
  },
  patientStatus: {
    pain: 5,
    anxiety: 56,
    breathing: 56,
    cooperation: 64,
  },
  logs: [],
  eventHistory: [],
  interventionBaseline: null,
  lastReassessmentSnapshot: null,
  followUpObservation: {
    active: false,
    interventions: {},
    lastCueMinute: -1,
    cues: {},
  },
  contextWindowType: null,
  contextWindowPosition: null,
  floatingCards: {
    focus: false,
    events: false,
    hint: false,
  },
  hudCluster: {
    collapsed: false,
    position: null,
  },
  wardWorkflow: null,
  gbsWorkflow: null,
  gbsAssessmentRecords: [],
  chargeFollowUp: null,
};

const clinicalHandoff = [
  { label: "현재 우려", text: "김현수 님, ACS 의심으로 CABG 평가 대기 중입니다. 20분 전부터 흉부 압박감과 식은땀이 있었다고 합니다." },
  { label: "증상 변화", text: "가슴 가운데가 묵직하고 왼쪽 어깨가 무겁다고 표현했습니다. 통증은 아직 남아 있는 상태입니다." },
  { label: "산소/활력", text: "마지막 확인 HR 108, SpO2 94%, BP 152/94로 경계선입니다. 호흡은 약간 가쁘지만 대화 가능합니다." },
  { label: "PRN", text: "Nitroglycerin 0.4 mg SL PRN, Morphine 2 mg IV PRN 처방이 있습니다. 투약 전 처방과 용량 확인 필요합니다." },
  { label: "모니터링", text: "Continuous EKG order가 있어 침상 모니터 연결과 파형 확인이 필요합니다. 통증 지속 시 SBAR 보고 준비하세요." },
];

const wardWorkflowHandoff = [
  { label: "601호", text: "새벽부터 BP가 borderline입니다. 102/64까지 내려갔다가 조금 회복됐어요." },
  { label: "소변량", text: "소변량이 전보다 줄었습니다. 보호자가 '평소보다 처진다'고 말했습니다." },
  { label: "현재 상태", text: "열은 뚜렷하지 않지만 맥박이 조금 빠르고 얼굴빛이 좋지 않습니다." },
  { label: "역할", text: "당신은 액팅 간호사입니다. 이상징후를 발견하면 차지에게 보고하고 bedside 행동을 지속해야 합니다." },
  { label: "주의", text: "차지가 의사 노티를 하는 동안에도 repeat BP, 산소, 모니터, IV 확인을 멈추면 안 됩니다." },
];

const gbsHandoff = [
  { label: "703호", text: "상행성 weakness로 GBS 의심되어 입원한 환자입니다. 발저림과 다리 힘 빠짐이 어제보다 위로 올라오는 느낌이라고 합니다." },
  { label: "호흡", text: "SpO₂는 96-97%로 괜찮아 보이지만 말이 짧아지고 얕게 숨쉬며 기침 힘이 약해졌다는 보호자 말이 있습니다." },
  { label: "연하", text: "침 삼키기가 불편하고 물 마실 때 사레가 들릴 뻔했습니다. drooling, dysphagia, weak cough를 직접 확인해야 합니다." },
  { label: "자율신경", text: "BP와 HR이 들쭉날쭉합니다. GBS dysautonomia 가능성을 염두에 두고 ECG와 BP를 계속 보세요." },
  { label: "핵심", text: "GBS는 산소화보다 환기 저하가 먼저 보일 수 있습니다. SpO₂ 정상에 속지 말고 VC, EtCO₂, PaCO₂, cough/swallow를 묶어 판단하세요." },
];

const patient = {
  name: "Kim Hyun-soo",
  age: 62,
  diagnosis: "Acute Coronary Syndrome (급성관상동맥증후군)",
  chiefComplaint: "Chest pain 및 diaphoresis",
  plannedSurgery: "CABG evaluation pending, 수술일 미정",
  pod: "POD#0, 수술 전 상태",
  weightKg: 72,
  vitals: {
    hr: 108,
    spo2: 94,
    bp: "152/94",
  },
  labs: [
    { name: "Troponin I", value: 0.08, unit: "ng/mL", normal: "<0.04", flag: "상승" },
    { name: "CK-MB", value: 6.2, unit: "ng/mL", normal: "0.0-5.0", flag: "상승" },
    { name: "K", value: 4.1, unit: "mEq/L", normal: "3.5-5.1", flag: "정상" },
    { name: "Hb", value: 13.4, unit: "g/dL", normal: "13.0-17.0", flag: "정상" },
    { name: "Cr", value: 0.9, unit: "mg/dL", normal: "0.7-1.3", flag: "정상" },
  ],
  regularOrders: [
    { id: "ns", label: "IV NS 80 mL/hr", required: true, correctDose: 80, unit: "mL/hr" },
    { id: "aspirin", label: "Aspirin 100 mg PO daily", required: true, correctDose: 100, unit: "mg" },
    { id: "ekg", label: "Continuous EKG monitoring", required: true },
  ],
  prnOrders: [
    { id: "nitro", label: "Nitroglycerin 0.4 mg SL PRN chest pain", correctDose: 0.4, unit: "mg", indication: "chest pain", route: "SL", routeLabel: "Sublingual", administration: "sublingual" },
    { id: "morphine", label: "Morphine 2 mg IV PRN pain", correctDose: 2, unit: "mg", indication: "severe pain", route: "IV", routeLabel: "IV slow push", administration: "ivSyringe" },
  ],
};

function gbsAbgaResults() {
  const gbs = state.gbsWorkflow || {};
  const vitals = typeof currentVitals === "function" ? currentVitals() : { spo2: 97 };
  const etco2 = Math.round(gbs.etco2 || 44);
  const paCo2 = Math.round(etco2 + 5);
  const paO2 = Math.round(Math.max(68, Math.min(108, (gbs.oxygenApplied || state.oxygenApplied ? 96 : 88) - Math.max(0, paCo2 - 45) * 0.45)));
  const pH = Math.max(7.22, Math.min(7.44, 7.40 - Math.max(0, paCo2 - 40) * 0.0075));
  const hco3 = Math.round(24 + Math.max(0, paCo2 - 45) * 0.12);
  const saO2 = Math.round(vitals.spo2 || 97);
  const rows = [
    { name: "pH", value: pH.toFixed(2), numeric: pH, unit: "", normal: "7.35-7.45", low: 7.35, high: 7.45 },
    { name: "PaCO₂", value: paCo2, numeric: paCo2, unit: "mmHg", normal: "35-45", low: 35, high: 45 },
    { name: "PaO₂", value: paO2, numeric: paO2, unit: "mmHg", normal: "80-100", low: 80, high: 100 },
    { name: "HCO₃⁻", value: hco3, numeric: hco3, unit: "mEq/L", normal: "22-26", low: 22, high: 26 },
    { name: "SaO₂", value: saO2, numeric: saO2, unit: "%", normal: "95-100", low: 95, high: 100 },
    { name: "Base excess", value: -1, numeric: -1, unit: "mEq/L", normal: "-2 to +2", low: -2, high: 2 },
    { name: "Lactate", value: "1.3", numeric: 1.3, unit: "mmol/L", normal: "0.5-2.0", low: 0.5, high: 2.0 },
  ];
  return rows.map((row) => ({
    ...row,
    status: row.numeric > row.high ? "high" : row.numeric < row.low ? "low" : "normal",
  }));
}

function currentPatientProfile() {
  if (state.currentEpisode === "gbsRespiratory") {
    const abga = gbsAbgaResults();
    const ph = abga.find((item) => item.name === "pH");
    const paCo2 = abga.find((item) => item.name === "PaCO₂");
    return {
      name: "Park Sung-min",
      age: 46,
      diagnosis: "GBS 의심 · ascending weakness",
      chiefComplaint: "다리 힘 빠짐, 손발 저림, 말 짧아짐, 약한 기침",
      plannedSurgery: "수술 계획 없음 · respiratory/ICU escalation 감시",
      pod: "신경계 병동 703호 · 입원 초기",
      weightKg: 72,
      labs: [
        { name: "ABGA", value: state.gbsWorkflow?.abgaChecked ? `pH ${ph.value} / PaCO₂ ${paCo2.value}` : "pending", unit: state.gbsWorkflow?.abgaChecked ? "mmHg" : "", flag: state.gbsWorkflow?.abgaChecked ? "High" : "Watch", normal: "pH 7.35-7.45 · PaCO₂ 35-45" },
        { name: "VC", value: Math.round(state.gbsWorkflow?.vc || 24), unit: "mL/kg", flag: "Trend", normal: "> 20 mL/kg" },
        { name: "EtCO₂", value: Math.round(state.gbsWorkflow?.etco2 || 44), unit: "mmHg", flag: "Watch", normal: "35-45" },
      ],
      regularOrders: [
        { id: "gbs-monitor", label: "Continuous ECG/NIBP/SpO₂ monitoring" },
        { id: "gbs-vc", label: "Vital capacity q1h and PRN deterioration" },
        { id: "gbs-npo", label: "NPO if dysphagia/aspiration risk" },
      ],
      prnOrders: [
        { id: "gbs-o2", label: "O₂ apply PRN desaturation or respiratory distress", indication: "호흡곤란/SpO₂ 저하" },
        { id: "gbs-suction", label: "Suction PRN secretion/weak cough", indication: "drooling, weak cough" },
      ],
    };
  }
  return patient;
}

const episodes = {
  acsChestPain: {
    id: "acsChestPain",
    title: "급성 흉통 환자 간호",
    patientName: "김현수",
    patientSummary: "62세 남성 · ACS 의심 · CABG 평가 대기",
    difficulty: "초급-중급",
    status: "available",
  },
  wardWorkflow: {
    id: "wardWorkflow",
    title: "급성 흉통 환자 간호 - 액팅 간호사 모드",
    patientName: "601호 환자",
    patientSummary: "급성 흉통 환자 · 액팅 간호사 역할 · 차지 협업",
    difficulty: "중급",
    status: "available",
  },
  gbsRespiratory: {
    id: "gbsRespiratory",
    title: "GBS 호흡근 악화 감지 - SpO₂ 함정",
    patientName: "박성민",
    patientSummary: "46세 남성 · GBS 의심 · SpO₂ 정상 속 CO₂ 저류 위험",
    difficulty: "중급-상급",
    status: "available",
  },
  cardiacArrest: {
    id: "cardiacArrest",
    title: "심정지 환자 대응",
    patientName: "준비 중",
    patientSummary: "Code Blue, CPR, 리듬 판독, 제세동/투약 흐름",
    difficulty: "상급",
    status: "comingSoon",
  },
};


const patientInteractionFindings = {
  symptomDialogue: {
    findingId: "patient-symptom-dialogue",
    log: "환자 반응: \"가슴 가운데가 계속 묵직해요. 왼쪽 어깨도 조금 무겁고, 식은땀이 났어요.\"",
    reveals: { pain: true, breathing: true },
    score: { clinical: 3, empathy: 3 },
    patient: { anxiety: -3, cooperation: 3 },
    finding: {
      key: "symptomDialogue",
      label: "증상 대화",
      value: "중앙 흉부 압박감, 왼쪽 어깨 불편감, 식은땀",
    },
  },
  breathingEffort: {
    findingId: "patient-breathing-effort",
    log: "신체 사정: 호흡은 약간 가쁘고 짧은 문장으로 대답하지만 accessory muscle use는 뚜렷하지 않다.",
    reveals: { breathing: true },
    assessment: "respiratory",
    score: { safety: 2, clinical: 3 },
    patient: { anxiety: -1 },
    finding: {
      key: "breathingEffort",
      label: "호흡 노력",
      value: "약간 가쁨, 짧은 문장 가능, 뚜렷한 보조근 사용 없음",
    },
  },
  skinPerfusion: {
    findingId: "patient-skin-perfusion",
    log: "신체 사정: 피부는 창백하고 축축하다. 말초 냉감이 있어 cardiac perfusion concern을 기록했다.",
    assessment: "skin",
    score: { safety: 2, clinical: 3 },
    patient: { anxiety: -1, cooperation: 1 },
    finding: {
      key: "skinPerfusion",
      label: "피부/식은땀",
      value: "창백하고 축축함, 식은땀 관찰",
    },
  },
  radialPulse: {
    findingId: "patient-radial-pulse",
    log: "신체 사정: radial pulse는 빠르고 규칙적이며 약간 강하게 촉지된다.",
    assessment: "perfusion",
    score: { safety: 2, clinical: 2 },
    patient: { cooperation: 1 },
    finding: {
      key: "radialPulse",
      label: "요골맥박",
      value: "빠르고 규칙적, 말초 맥박 촉지 가능",
    },
  },
  mentalStatus: {
    findingId: "patient-mental-status",
    log: "의식 상태 사정: 환자는 alert하며 이름, 장소, 상황을 이해하고 질문에 적절히 답한다.",
    assessment: "consciousness",
    score: { safety: 2, clinical: 2 },
    patient: { anxiety: -1, cooperation: 1 },
    finding: {
      key: "mentalStatus",
      label: "의식 상태",
      value: "Alert, oriented, 질문에 적절히 답함",
    },
  },
};

const procedureSteps = [
  {
    id: "handHygiene",
    label: "손위생",
    detail: "환자 접촉 전 손위생을 수행한다.",
  },
  {
    id: "identify",
    label: "환자 확인",
    detail: "이름과 등록번호로 환자를 다시 확인한다.",
  },
  {
    id: "explain",
    label: "목적 설명",
    detail: "EKG 모니터링 목적과 붙이는 위치를 설명한다.",
  },
  {
    id: "privacy",
    label: "프라이버시 보호",
    detail: "커튼을 치고 노출을 최소화한다.",
  },
  {
    id: "skinCheck",
    label: "피부 확인",
    detail: "전극 부착 부위 피부 상태와 땀, 로션 여부를 확인한다.",
  },
  {
    id: "attach",
    label: "전극 부착",
    detail: "정확한 위치에 전극을 부착한다.",
  },
  {
    id: "leadConnect",
    label: "리드 연결",
    detail: "리드를 연결하고 당김이나 탈락 위험을 확인한다.",
  },
  {
    id: "waveCheck",
    label: "파형 확인",
    detail: "모니터를 켜고 파형, HR, SpO₂, BP를 확인한다.",
  },
  {
    id: "document",
    label: "기록",
    detail: "시행 시간, 환자 반응, 모니터 수치를 기록한다.",
  },
];

const sbarOptions = {
  S: [
    { id: "s1", text: "62세 환자이며 PRN Nitroglycerin 투여 후에도 chest pain이 지속됩니다.", correct: true },
    { id: "s2", text: "환자가 불안해하며 휴식을 원합니다.", correct: false },
    { id: "s3", text: "EKG procedure를 문제 없이 완료했습니다.", correct: false },
  ],
  B: [
    { id: "b1", text: "Diagnosis는 Acute Coronary Syndrome (급성관상동맥증후군)이며 Troponin I 0.08 ng/mL입니다. Aspirin과 IV NS를 적용했습니다.", correct: true },
    { id: "b2", text: "환자는 CABG 후 POD#0이며 discharge teaching이 필요합니다.", correct: false },
    { id: "b3", text: "관련 lab abnormality는 없습니다.", correct: false },
  ],
  A: [
    { id: "a1", text: "HR가 계속 상승되어 있고 SpO₂는 borderline이며 PRN 후에도 chest pain이 5/10으로 지속됩니다.", correct: true },
    { id: "a2", text: "Medication 후 pain이 완전히 해소되었습니다.", correct: false },
    { id: "a3", text: "Monitor가 연결되어 있으므로 assessment는 보류합니다.", correct: false },
  ],
  R: [
    { id: "r1", text: "지속되는 chest pain에 대해 즉시 physician evaluation과 추가 orders를 요청합니다.", correct: true },
    { id: "r2", text: "내일 아침 routine follow-up을 요청합니다.", correct: false },
    { id: "r3", text: "Discharge medication reconciliation을 요청합니다.", correct: false },
  ],
};

function completedPostPrnReassessmentCount() {
  return Object.values(state.postPrnReassessment || {}).filter(Boolean).length;
}

function getClinicalTrajectory() {
  const vitals = currentVitals();
  const pain = Number(state.patientStatus.pain);
  const prnGiven = state.prnMedicationsGiven.length > 0;
  const reassessed = completedPostPrnReassessmentCount() >= 2;
  const regularComplete = typeof requiredRegularOrdersComplete === "function" ? requiredRegularOrdersComplete() : false;
  const unstableVitals = vitals.hr >= 128 || vitals.spo2 <= 90 || vitals.rr >= 30;
  const treatmentResponse = prnGiven && reassessed && pain <= 3.5 && vitals.hr <= 112 && vitals.spo2 >= 94;

  if (unstableVitals || pain >= 8) return "deteriorating";
  if (treatmentResponse) return "stabilizedAfterTreatment";
  if (prnGiven && reassessed && pain >= 4.5) return "persistentPainAfterTreatment";
  if (prnGiven && reassessed) return "partialResponseAfterTreatment";
  if (regularComplete && !prnGiven) return "regularOrdersComplete";
  return "incompleteOrWatchful";
}

function currentSbarClinicalSummary() {
  const vitals = currentVitals();
  const pain = Number(state.patientStatus.pain);
  const meds = state.prnMedicationsGiven.map((id) => {
    const order = patient.prnOrders.find((item) => item.id === id);
    return order ? order.label.split(" PRN")[0] : id;
  });
  const prnText = meds.length ? meds.join(", ") : "PRN 미투여";
  return { vitals, pain, prnText };
}

function buildSbarOptions() {
  const trajectory = getClinicalTrajectory();
  const { vitals, pain, prnText } = currentSbarClinicalSummary();
  const regularText = state.appliedRegularOrders.includes("aspirin") && state.appliedRegularOrders.includes("ekg")
    ? "Aspirin 적용 및 continuous EKG monitoring을 반영했습니다."
    : "정규 처방 적용 상태를 추가 확인해야 합니다.";

  const baseWrong = {
    S: [
      { id: "s-rest", text: "환자가 불안해하며 휴식을 원합니다.", correct: false },
      { id: "s-procedure-only", text: "EKG procedure를 문제 없이 완료했습니다.", correct: false },
    ],
    B: [
      { id: "b-post-op", text: "환자는 CABG 후 POD#0이며 discharge teaching이 필요합니다.", correct: false },
      { id: "b-normal-labs", text: "관련 lab abnormality는 없고 특별한 처방은 없습니다.", correct: false },
    ],
    A: [
      { id: "a-defer", text: "Monitor가 연결되어 있으므로 추가 assessment는 보류합니다.", correct: false },
      { id: "a-no-data", text: "현재 통증과 활력징후는 아직 확인하지 않았습니다.", correct: false },
    ],
    R: [
      { id: "r-routine", text: "내일 아침 routine follow-up을 요청합니다.", correct: false },
      { id: "r-discharge", text: "Discharge medication reconciliation을 요청합니다.", correct: false },
    ],
  };

  const profiles = {
    stabilizedAfterTreatment: {
      S: { id: "s-stable", text: "62세 ACS 의심 환자이며 " + prnText + " 후 chest pain이 " + pain + "/10으로 호전되었습니다.", correct: true },
      B: { id: "b-stable", text: "Diagnosis는 Acute Coronary Syndrome 의심이며 Troponin I 0.08 ng/mL입니다. " + regularText, correct: true },
      A: { id: "a-stable", text: "재사정상 HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%, BP " + vitals.bp + "로 안정화 추세이며 통증도 감소했습니다.", correct: true },
      R: { id: "r-stable", text: "현재 처치 유지, 지속 ECG monitoring, repeat ECG/troponin 계획과 추가 흉통 시 재보고 기준 확인을 요청합니다.", correct: true },
    },
    partialResponseAfterTreatment: {
      S: { id: "s-partial", text: "62세 ACS 의심 환자이며 " + prnText + " 후 chest pain은 줄었지만 " + pain + "/10으로 일부 남아 있습니다.", correct: true },
      B: { id: "b-partial", text: "ACS 의심으로 CABG 평가 대기 중이며 " + regularText + " PRN 후 재사정을 진행했습니다.", correct: true },
      A: { id: "a-partial", text: "HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%, BP " + vitals.bp + "입니다. 완전한 안정은 아니므로 지속 관찰과 추가 판단이 필요합니다.", correct: true },
      R: { id: "r-partial", text: "추가 처방 필요 여부, repeat ECG/troponin, 통증 재발 시 즉시 평가 기준을 확인 요청합니다.", correct: true },
    },
    persistentPainAfterTreatment: {
      S: { id: "s-persistent", text: "62세 ACS 의심 환자이며 " + prnText + " 후에도 chest pain이 " + pain + "/10으로 지속됩니다.", correct: true },
      B: { id: "b-persistent", text: "Diagnosis는 Acute Coronary Syndrome 의심이며 Troponin I 0.08 ng/mL입니다. " + regularText, correct: true },
      A: { id: "a-persistent", text: "HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%, BP " + vitals.bp + "이며 PRN 후에도 흉통과 ACS 우려가 남아 있습니다.", correct: true },
      R: { id: "r-persistent", text: "지속되는 chest pain에 대해 즉시 physician evaluation과 추가 orders를 요청합니다.", correct: true },
    },
    deteriorating: {
      S: { id: "s-deteriorating", text: "62세 ACS 의심 환자가 흉통/활력징후 악화 양상을 보이며 즉시 평가가 필요합니다.", correct: true },
      B: { id: "b-deteriorating", text: "ACS 의심, Troponin I 0.08 ng/mL, CABG 평가 대기 중입니다. " + regularText, correct: true },
      A: { id: "a-deteriorating", text: "현재 pain " + pain + "/10, HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%, BP " + vitals.bp + "로 불안정성이 높습니다.", correct: true },
      R: { id: "r-deteriorating", text: "즉시 bedside evaluation, ACS escalation, 추가 ECG/lab 및 처방을 요청합니다.", correct: true },
    },
    regularOrdersComplete: {
      S: { id: "s-regular", text: "62세 ACS 의심 환자이며 정규 처방 적용 후에도 chest pain 지속 여부를 평가 중입니다.", correct: true },
      B: { id: "b-regular", text: "ACS 의심으로 CABG 평가 대기 중이며 " + regularText + " PRN 처방은 필요 시 투여 가능합니다.", correct: true },
      A: { id: "a-regular", text: "현재 pain " + pain + "/10, HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%입니다. PRN 필요성 판단을 위한 재사정이 필요합니다.", correct: true },
      R: { id: "r-regular", text: "PRN 적용 기준, 추가 모니터링, 보고 기준을 확인 요청합니다.", correct: true },
    },
    incompleteOrWatchful: {
      S: { id: "s-incomplete", text: "62세 ACS 의심 환자에 대해 현재 침상 사정 자료를 수집 중입니다.", correct: true },
      B: { id: "b-incomplete", text: "ACS 의심과 PRN/정규 처방이 있으나 처치와 재사정 근거가 아직 완전하지 않습니다.", correct: true },
      A: { id: "a-incomplete", text: "현재 pain " + pain + "/10, HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%입니다. 보고 전 추가 사정이 필요합니다.", correct: true },
      R: { id: "r-incomplete", text: "우선 활력징후, ECG, 통증 재사정 후 필요한 처방/보고 기준을 다시 확인하겠습니다.", correct: true },
    },
  };

  const profile = profiles[trajectory] || profiles.incompleteOrWatchful;
  return {
    S: [profile.S, ...baseWrong.S],
    B: [profile.B, ...baseWrong.B],
    A: [profile.A, ...baseWrong.A],
    R: [profile.R, ...baseWrong.R],
  };
}

function normalizeSbarSelections(options = buildSbarOptions()) {
  Object.keys(state.sbarSelections || {}).forEach((component) => {
    if (!options[component]?.some((option) => option.id === state.sbarSelections[component])) {
      delete state.sbarSelections[component];
    }
  });
}

function sbarOutcomeForTrajectory(trajectory = getClinicalTrajectory()) {
  const { vitals, pain } = currentSbarClinicalSummary();
  if (trajectory === "stabilizedAfterTreatment") {
    return {
      type: "stabilized",
      reason: "처치와 재사정 후 통증과 활력징후가 안정화되었습니다.",
      details: ["통증 " + pain + "/10", "HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%", "지속 모니터링 계획 확인"],
    };
  }

  if (trajectory === "deteriorating") {
    return {
      type: "stabilized",
      reason: "악화 양상을 근거로 즉시 SBAR escalation을 완료했습니다.",
      details: ["긴급 bedside evaluation 요청", "ACS escalation", "현재 HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%"],
    };
  }

  if (trajectory === "persistentPainAfterTreatment" || trajectory === "partialResponseAfterTreatment") {
    return {
      type: "stabilized",
      reason: "PRN 후 남은 증상에 대해 현재 자료를 근거로 추가 평가를 요청했습니다.",
      details: ["PRN 후 재사정 완료", "통증 " + pain + "/10", "추가 orders/evaluation 요청"],
    };
  }

  return {
    type: "stabilized",
    reason: "SBAR로 현재 상태와 추가 확인 계획을 전달했습니다.",
    details: ["현재 HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%", "추가 사정/모니터링 계획"],
  };
}

function allPostPrnReassessmentsComplete() {
  ensurePostPrnReassessment();
  return Object.values(state.postPrnReassessment).every(Boolean);
}

function tryResolveStableTreatmentOutcome() {
  if (state.outcome || state.stage !== "persistentSymptoms") return false;
  if (!state.prnMedicationsGiven.length || !allPostPrnReassessmentsComplete()) return false;
  if (getClinicalTrajectory() !== "stabilizedAfterTreatment") return false;

  const outcome = sbarOutcomeForTrajectory("stabilizedAfterTreatment");
  setPatientOutcome(outcome.type, outcome.reason, ["SBAR 불필요: 처치 후 재사정에서 안정화 확인", ...outcome.details]);
  return true;
}

const historyQuestions = [
  {
    id: "onset",
    label: "언제부터 불편감이 시작됐는지 묻는다",
    response: "“한 20분 전부터요. 처음엔 답답한 정도였는데 아직 계속 남아 있어요.”",
    required: true,
    score: { safety: 3, clinical: 5, empathy: 2 },
    patient: { anxiety: -3, cooperation: 3 },
  },
  {
    id: "locationQuality",
    label: "어디가 어떤 느낌으로 아픈지 묻는다",
    response: "“가슴 가운데가 묵직하게 눌리는 느낌이에요. 콕콕 찌르는 건 아니고요.”",
    required: true,
    score: { safety: 3, clinical: 5, empathy: 2 },
    patient: { anxiety: -3, cooperation: 3 },
  },
  {
    id: "nrs",
    label: "통증을 0-10점으로 표현하게 한다",
    response: "“지금은 6점 정도 되는 것 같아요.”",
    required: true,
    score: { clinical: 4, protocol: 2 },
    patient: { anxiety: -2 },
    reveals: { pain: true },
  },
  {
    id: "associated",
    label: "식은땀, 숨참, 어지러움, 오심 여부를 묻는다",
    response: "“식은땀이 조금 났고, 숨은 아주 조금 찬 느낌이에요. 토할 것 같진 않아요.”",
    required: true,
    score: { safety: 4, clinical: 5 },
    patient: { anxiety: -2 },
    reveals: { breathing: true },
  },
  {
    id: "radiation",
    label: "통증이 어깨, 턱, 등, 팔로 퍼지는지 묻는다",
    response: "“왼쪽 어깨 쪽이 살짝 무거운 느낌은 있어요.”",
    required: true,
    score: { safety: 4, clinical: 5 },
    patient: { anxiety: -2 },
  },
  {
    id: "historyMeds",
    label: "심장질환 과거력과 복용약을 확인한다",
    response: "“고혈압 약은 먹고 있고, 예전에 협심증 검사를 받은 적이 있어요.”",
    required: true,
    score: { clinical: 5, protocol: 2 },
    patient: { cooperation: 2 },
    reveals: { cardiacRisk: true },
  },
  {
    id: "trigger",
    label: "움직임, 식사, 자세 변화와 관련이 있는지 묻는다",
    response: "“누워 있어도 계속 묵직해요. 자세 바꾼다고 좋아지진 않네요.”",
    required: false,
    score: { clinical: 3 },
    patient: { cooperation: 1 },
  },
  {
    id: "allergy",
    label: "약물 알레르기가 있는지 확인한다",
    response: "“특별한 약 알레르기는 없어요.”",
    required: false,
    score: { safety: 2, clinical: 2 },
    patient: { cooperation: 1 },
  },
  {
    id: "familyFirst",
    label: "보호자에게 먼저 자세히 물어봐도 되는지 묻는다",
    response: "환자는 대답할 수 있는 상태다. 보호자 정보보다 환자의 직접 호소가 우선이다.",
    required: false,
    score: { clinical: -2, empathy: -3 },
    patient: { anxiety: 4, cooperation: -4 },
    tone: "warning",
  },
  {
    id: "reassureOnly",
    label: "괜찮을 거라고 안심시키고 질문을 줄인다",
    response: "환자는 잠깐 고개를 끄덕이지만, 중요한 흉통 정보가 아직 부족하다.",
    required: false,
    score: { safety: -3, clinical: -4, empathy: 1 },
    patient: { pain: 1, anxiety: 3 },
    tone: "warning",
  },
];

const scenes = {
  handoff: {
    title: "간호 인계",
    text: "야간 근무 인계를 받는 중입니다. 환자 우려점, 최근 증상 변화, 산소/활력징후, PRN과 모니터링 정보를 먼저 정리합니다.",
    entry: true,
    actions: [],
  },
  chartReview: {
    title: "차트 확인",
    text: "인계 직후 EMR을 열어 진단, 검사, 처방, PRN 상태를 빠르게 확인합니다. 차트를 닫으면 침상에서 환자를 직접 인계받습니다.",
    entry: true,
    actions: [],
  },
  concept: {
    title: "개념 학습: 급성 chest pain workflow",
    text:
      "이번 챕터는 chest pain 환자 상황을 다룬다. 병실에 들어가기 전 patient data, assessment priority, lab values, doctor orders, PRN medication, SBAR escalation 기준을 확인한다.",
    concept: true,
    actions: [
      {
        label: "시뮬레이션 시작",
        next: "intro",
        primary: true,
        score: {},
        effect: () => {
          state.conceptSeen = true;
        },
      },
    ],
  },
  intro: {
    title: "병실 입실",
    text:
      "1인실 병동 night shift가 시작됐다. Kim Hyun-soo 환자는 chest pain과 diaphoresis를 호소한다. 환자는 불안해 보이지만 질문에 답할 수 있는 상태다.",
    actions: [
      {
        label: "자기소개를 하고 환자 확인을 수행한다",
        next: "rapport",
        score: { safety: 6, empathy: 8, protocol: 6 },
        patient: { anxiety: -8, cooperation: 8 },
        log: "사정 전 환자 확인을 완료했습니다.",
        tone: "good",
      },
      {
        label: "설명 없이 바로 ECG electrode를 부착한다",
        next: "earlyEkg",
        score: { safety: -4, empathy: -8, protocol: -8 },
        patient: { pain: 1, anxiety: 12, cooperation: -10 },
        log: "설명 없이 처치를 시작해 환자 불안이 증가했습니다.",
        tone: "warning",
      },
      {
        label: "환자와 대화하기 전에 침상 모니터부터 켠다",
        next: "monitorFirst",
        score: { empathy: -4, protocol: -5 },
        patient: { pain: 1, anxiety: 6, cooperation: -4 },
        log: "환자 확인과 설명보다 모니터 조작을 먼저 우선했습니다.",
        tone: "warning",
      },
      {
        label: "환자에게 기다리라고 하고 차트를 확인하러 나간다",
        next: "earlyChart",
        score: { safety: -3, empathy: -5, protocol: -2 },
        patient: { pain: 1, anxiety: 7, breathing: 4 },
        log: "차트 확인으로 흉통 직접 사정이 지연되었습니다.",
        tone: "warning",
      },
      {
        label: "침상 안정만 설명하고 병실을 나간다",
        next: "badEnd",
        score: { safety: -12, clinical: -10, empathy: -4, protocol: -7 },
        patient: { pain: 1, anxiety: 14, breathing: 8, cooperation: -10 },
        log: "Chest pain을 사정 없이 방치했습니다.",
        tone: "bad",
      },
    ],
  },
  earlyChart: {
    title: "환자보다 차트",
    text:
      "차트 확인은 필요하지만 환자는 지금 불편감을 호소하고 있다. 첫 접촉에서는 환자 확인과 현재 증상 사정이 우선이다.",
    actions: [
      {
        label: "병실로 돌아가 인사, 본인 확인, 현재 증상 사정을 한다",
        next: "rapport",
        score: { safety: 4, empathy: 5, protocol: 4 },
        patient: { anxiety: -5, cooperation: 5 },
        log: "환자에게 돌아가 첫 접촉 절차를 바로잡았다.",
        tone: "good",
      },
      {
        label: "의무기록을 더 읽고 나서 천천히 들어간다",
        next: "badEnd",
        score: { safety: -10, clinical: -6, empathy: -5 },
        patient: { pain: 1, anxiety: 10, breathing: 6 },
        log: "현재 증상 확인이 지연됐다.",
        tone: "bad",
      },
      {
        label: "콜벨을 누르면 오겠다고 안내하고 다른 업무를 본다",
        next: "badEnd",
        score: { safety: -14, empathy: -8, protocol: -8 },
        patient: { pain: 1, anxiety: 13, breathing: 8, cooperation: -12 },
        log: "흉부 불편감 환자의 직접 사정이 누락됐다.",
        tone: "bad",
      },
    ],
  },
  rapport: {
    title: "첫 대화",
    text:
      "“김현수 님, 저는 오늘 담당 간호사 박용민입니다. 가슴 답답함은 지금도 있으세요?” 환자는 조금 안심한 듯 고개를 끄덕인다.",
    actions: [
      {
        label: "흉통 문진을 구조적으로 시작한다",
        next: "historyTaking",
        score: { safety: 3, clinical: 3, empathy: 3 },
        patient: { anxiety: -7, cooperation: 7 },
        log: "환자에게 현재 흉부 불편감을 자세히 묻겠다고 설명했다.",
        tone: "good",
        effect: () => {
          state.rapport = true;
          state.askedQuestions = [];
        },
      },
      {
        label: "과거력과 복용약부터 묻고 현재 증상 문진으로 이어간다",
        next: "historyTaking",
        score: { clinical: 4, empathy: 2 },
        patient: { anxiety: -2, cooperation: 2 },
        log: "과거력과 복용약을 먼저 확인했다. 현재 증상 문진이 이어져야 한다.",
        tone: "warning",
        effect: () => {
          state.rapport = true;
          state.askedQuestions = ["historyMeds"];
          state.knownPatientInfo.cardiacRisk = true;
        },
      },
      {
        label: "괜찮을 거라고 말하고 바로 모니터를 연결한다",
        next: "monitorPrep",
        score: { clinical: -6, empathy: 2, protocol: -3 },
        patient: { pain: 1, anxiety: 3, cooperation: -3 },
        log: "안심시키려 했지만 증상 사정이 부족했다.",
        tone: "warning",
        effect: () => {
          state.rapport = true;
        },
      },
      {
        label: "보호자에게만 증상을 묻고 환자 대답은 생략한다",
        next: "badEnd",
        score: { safety: -8, clinical: -8, empathy: -10, protocol: -5 },
        patient: { anxiety: 11, cooperation: -14 },
        log: "의식 있는 환자의 직접 호소를 확인하지 않았다.",
        tone: "bad",
      },
    ],
  },
  historyTaking: {
    title: "흉통 문진",
    text:
      "환자에게 필요한 질문을 골라 정보를 모은다. 흉통 환자는 시작 시점, 위치와 양상, 통증 강도, 동반 증상, 방사통, 과거력과 복용약 확인이 중요하다.",
    history: true,
  },
  earlyEkg: {
    title: "설명 없는 처치",
    text:
      "환자가 몸을 움찔한다. “이거 왜 붙이는 거예요?” 기본 처치라도 목적 설명과 동의가 먼저 필요하다.",
    actions: [
      {
        label: "사과하고 본인 확인, 목적 설명을 다시 한다",
        next: "historyTaking",
        score: { safety: 4, empathy: 6, protocol: 5 },
        patient: { anxiety: -8, cooperation: 8 },
        log: "처치 전 설명을 보완하고 환자 동의를 얻었다.",
        tone: "good",
        effect: () => {
          state.rapport = true;
          state.askedQuestions = [];
        },
      },
      {
        label: "시간이 없으니 그대로 진행한다",
        next: "badEnd",
        score: { safety: -12, empathy: -14, protocol: -16 },
        patient: { pain: 1, anxiety: 16, cooperation: -18 },
        log: "환자 불안이 커지고 협조가 떨어졌다.",
        tone: "bad",
      },
    ],
  },
  monitorFirst: {
    title: "장비 우선",
    text:
      "모니터는 켜졌지만 아직 환자에게 설명하지 않았다. 장비보다 먼저 사람을 만나야 한다.",
    actions: [
      {
        label: "환자에게 설명하고 본인 확인을 한다",
        next: "historyTaking",
        score: { safety: 5, empathy: 6, protocol: 6 },
        patient: { anxiety: -5, cooperation: 6 },
        log: "모니터링 목적을 설명하고 본인 확인을 완료했다.",
        tone: "good",
        effect: () => {
          state.monitorOn = true;
          state.rapport = true;
          state.askedQuestions = [];
        },
      },
      {
        label: "수치만 보고 기록한다",
        next: "badEnd",
        score: { safety: -10, clinical: -8, empathy: -8, protocol: -7 },
        patient: { pain: 1, anxiety: 12, cooperation: -12 },
        log: "환자 상태보다 숫자 기록에 치우쳤다.",
        tone: "bad",
      },
    ],
  },
  assessment: {
    title: "기초 사정",
    text:
      "환자는 “20분 전부터 가슴이 묵직하고 식은땀이 조금 났어요”라고 말한다. 이제 기본 활력징후 확인과 모니터링 준비가 필요하다.",
    actions: [
      {
        label: "활력징후를 확인한다",
        next: "vitals",
        score: { safety: 6, clinical: 8, protocol: 4 },
        patient: { anxiety: -3, cooperation: 3 },
        log: "혈압, 맥박, 산소포화도, 의식 상태를 확인했다.",
        tone: "good",
      },
      {
        label: "통증이 심한지 다시 묻고 의사 호출부터 한다",
        next: "callTooSoon",
        score: { safety: 2, clinical: -2 },
        patient: { anxiety: 2 },
        log: "보고가 필요할 수 있으나 기본 데이터가 아직 부족하다.",
        tone: "warning",
      },
      {
        label: "산소포화도 확인 전 산소를 5L/min으로 적용한다",
        next: "badEnd",
        score: { safety: -8, clinical: -9, protocol: -7 },
        patient: { pain: 1, anxiety: 8, cooperation: -8 },
        log: "객관적 사정과 처방 확인 없이 산소를 적용했다.",
        tone: "bad",
      },
      {
        label: "환자에게 가만히 있으라고 하고 EKG만 준비한다",
        next: "monitorPrep",
        score: { clinical: -4, empathy: -5, protocol: -3 },
        patient: { pain: 1, anxiety: 5, cooperation: -5 },
        log: "EKG 준비는 필요하지만 활력징후 확인이 지연됐다.",
        tone: "warning",
      },
      {
        label: "의식 상태와 호흡 양상을 먼저 훑고 활력징후를 잰다",
        next: "vitals",
        score: { safety: 7, clinical: 7, protocol: 5 },
        patient: { anxiety: -4, cooperation: 4 },
        log: "의식, 호흡 양상, 활력징후를 함께 확인했다.",
        tone: "good",
      },
    ],
  },
  callTooSoon: {
    title: "보고 전 정보",
    text:
      "의사에게 연락하려면 지금 상태를 간결하게 전달해야 한다. 활력징후와 모니터링 여부가 있어야 보고가 선명해진다.",
    actions: [
      {
        label: "활력징후를 먼저 확인한다",
        next: "vitals",
        score: { clinical: 6, protocol: 4 },
        patient: { anxiety: -2 },
        log: "보고 전 필요한 객관적 자료를 모으기로 했다.",
        tone: "good",
      },
    ],
  },
  vitals: {
    title: "활력징후",
    text:
      "HR 108, SpO₂ 94%, BP 152/94. 환자는 답답함이 남아 있다고 말한다. 지속 감시를 위해 EKG 부착과 모니터 설정이 필요하다.",
    actions: [
      {
        label: "침상 모니터를 클릭해 ECG workflow를 시작한다",
        next: "vitals",
        score: {},
        log: "ECG 모니터링은 침상 모니터에서 직접 시작합니다. 왼쪽 3D 병실의 침상 모니터를 클릭하세요.",
        tone: "warning",
      },
      {
        label: "현재 수치와 증상을 정리해 담당의에게 먼저 보고한다",
        next: "callTooSoon",
        score: { safety: 3, clinical: 2, protocol: -2 },
        patient: { anxiety: 2 },
        log: "보고 판단은 좋지만 EKG 모니터링 자료가 아직 부족하다.",
        tone: "warning",
      },
      {
        label: "환자에게 통증이 참을 만한지 묻고 30분 뒤 재측정한다",
        next: "badEnd",
        score: { safety: -13, clinical: -8, empathy: -2, protocol: -6 },
        patient: { pain: 1, anxiety: 12, breathing: 8 },
        log: "흉부 불편감 지속 환자의 모니터링과 보고가 지연됐다.",
        tone: "bad",
      },
      {
        label: "환자에게 움직이지 말라고만 말한다",
        next: "badEnd",
        score: { safety: -8, empathy: -8, protocol: -10 },
        patient: { pain: 1, anxiety: 10, cooperation: -10 },
        log: "필요한 처치 설명 없이 지시만 했다.",
        tone: "bad",
      },
    ],
  },
  monitorPrep: {
    title: "모니터링 준비",
    text:
      "환자는 협조적이지만 증상 사정이 얕다. 그래도 지금은 모니터링을 준비하며 빠진 질문을 보완할 수 있다.",
    actions: [
      {
        label: "환자 사정을 보완한 뒤 침상 모니터를 클릭한다",
        next: "monitorPrep",
        score: { clinical: 2, empathy: 1 },
        patient: { anxiety: -2, cooperation: 2 },
        log: "증상 사정을 보완했다. ECG 시작은 침상 모니터에서 직접 수행한다.",
        tone: "good",
        effect: () => {
          state.assessed = true;
        },
      },
    ],
  },
  ekgProcedure: {
    title: "침상 ECG 모니터링 절차",
    text:
      "침상 모니터에서 ECG 모니터링 필요성을 판단하고 절차를 시작했습니다. 이제 lead 부착, placement 확인, monitor activation 순서를 실제 술기처럼 수행한다.",
    procedure: true,
  },
  monitoring: {
    title: "EKG 후 임상 판단",
    text:
      "ECG monitoring이 적용되었지만 chest pain은 남아 있습니다. 아직 SBAR를 바로 사용할 수 없다. 먼저 doctor orders를 확인하고 적절한 정규 처방를 적용해야 한다.",
    actions: [
      {
        label: "정규 처방을 확인하고 적용한다",
        next: "regularOrders",
        score: { clinical: 4, protocol: 4 },
        patient: {  },
        log: "Escalation 전 정규 처방를 확인했습니다.",
        tone: "good",
      },
      {
        label: "Active orders 적용 전 physician에게 즉시 연락한다",
        next: "regularOrders",
        score: { safety: 1, clinical: -2, protocol: -3 },
        patient: { anxiety: 2 },
        log: "Escalation을 고려했지만 unstable 상태가 아니라면 active 정규 처방를 먼저 적용해야 합니다.",
        tone: "warning",
      },
      {
        label: "ECG 연결만 기록하고 30분 뒤 재사정한다",
        next: "badEnd",
        score: { safety: -12, clinical: -9, protocol: -6 },
        patient: { pain: 1, anxiety: 10, breathing: 8 },
        log: "Care delay로 persistent chest pain이 악화됐다.",
        tone: "bad",
      },
    ],
  },
  regularOrders: {
    title: "정규 처방 적용",
    text:
      "처방된 baseline interventions를 적용한다. Lab values와 symptoms는 myocardial injury 가능성을 시사하므로 ordered antiplatelet과 monitoring intervention을 건너뛰면 안 된다.",
    orders: "regular",
  },
  prnDecision: {
    title: "PRN medication 판단",
    text:
      "정규 처방은 적용되었지만 chest pain이 6/10으로 지속됩니다. 적절한 PRN medication을 선택하고 투여 전 정확한 dose를 입력합니다.",
    medication: "prn",
  },
  persistentSymptoms: {
    title: "PRN 후 증상 지속",
    text:
      "PRN medication 후 chest pain은 일부만 감소했다. SBAR escalation 전 침상에서 pain, vital signs, ECG waveform을 재사정해 현재 데이터를 다시 확보해야 한다.",
    reassessment: true,
    actions: [
      {
        label: "재사정 결과로 SBAR를 구성하고 physician에게 연락한다",
        next: "sbarBuild",
        score: { safety: 4, clinical: 4, protocol: 4 },
        patient: { anxiety: -1 },
        log: "PRN 후 persistent symptoms로 SBAR escalation 조건이 충족됐다.",
        tone: "good",
      },
      {
        label: "재사정이나 처방 확인 없이 Nitroglycerin을 반복 투여한다",
        next: "badEnd",
        score: { safety: -10, clinical: -8, protocol: -8 },
        patient: { pain: 2, anxiety: 10, breathing: 8 },
        log: "Reassessment와 order verification 없이 medication을 반복하려 했다.",
        tone: "bad",
      },
    ],
  },
  sbarBuild: {
    title: "SBAR 구성",
    text:
      "각 SBAR 항목에서 하나씩 선택한다. 이 simulator는 SBAR 문장을 자동 생성하지 않으므로 clinical data를 바탕으로 직접 구성해야 한다.",
    sbar: true,
  },
  postSbarBedside: {
    title: "차지 노티 중 bedside 지속",
    text:
      "차지 간호사가 담당의에게 노티하는 중입니다. 보고가 끝이 아닙니다. 액팅 간호사는 환자 곁에서 통증, BP, SpO₂, ECG 변화를 계속 확인해야 합니다.",
    actions: [
      {
        label: "repeat BP와 HR/SpO₂를 다시 확인한다",
        next: "postSbarBedside",
        score: { safety: 5, clinical: 5, protocol: 3 },
        log: "차지 노티 중: repeat BP, HR, SpO₂를 재확인했습니다.",
        tone: "good",
        effect: () => chargeFollowUpAction("vitals"),
      },
      {
        label: "환자 통증과 호흡 양상을 재사정한다",
        next: "postSbarBedside",
        score: { safety: 4, clinical: 5, empathy: 3 },
        log: "차지 노티 중: pain과 호흡 양상을 환자에게 다시 확인했습니다.",
        tone: "good",
        effect: () => chargeFollowUpAction("pain"),
      },
      {
        label: "ECG/SpO₂ 파형을 계속 관찰한다",
        next: "postSbarBedside",
        score: { safety: 4, clinical: 4 },
        log: "차지 노티 중: ECG와 SpO₂ 파형 변화가 있는지 계속 관찰했습니다.",
        tone: "good",
        effect: () => chargeFollowUpAction("monitor"),
      },
      {
        label: "산소 적용 상태와 라인 위치를 확인한다",
        next: "postSbarBedside",
        score: { safety: 3, clinical: 3 },
        log: "차지 노티 중: 산소 적용 상태와 환자 라인을 정리했습니다.",
        tone: "good",
        effect: () => chargeFollowUpAction("oxygen"),
      },
      {
        label: "차지에게 최신 bedside update를 전달한다",
        next: "postSbarBedside",
        score: { safety: 3, clinical: 4, protocol: 4 },
        log: "차지에게 노티 중 최신 환자 상태를 업데이트했습니다.",
        tone: "good",
        effect: () => chargeFollowUpAction("updateCharge"),
      },
      {
        label: "차지가 노티 중이니 결과만 기다린다",
        next: "postSbarBedside",
        score: { safety: -7, clinical: -6, protocol: -4 },
        log: "차지 노티 중 bedside 재사정이 멈췄습니다.",
        tone: "warning",
        effect: () => chargeFollowUpAction("waited"),
      },
    ],
  },
  wardIntro: {
    title: "601호 병실 입실",
    text:
      "당신은 병동 신규 액팅 간호사입니다. 이미 bedside monitor가 켜져 있고 HR 상승, BP borderline/downtrend, SpO₂ 하락, 약간 처진 반응이 보입니다. 모니터와 환자 상태를 근거로 차지에게 보고할 준비를 하세요.",
    actions: [
      {
        label: "모니터 수치와 파형을 보며 repeat BP를 확인한다",
        next: "wardDeterioration",
        score: { safety: 6, clinical: 6, protocol: 3 },
        log: "모니터 기반 사정: HR, SpO₂ 파형, BP downtrend를 보고 repeat BP를 확인했습니다.",
        tone: "good",
        effect: () => wardAction("repeatBp"),
      },
      {
        label: "환자 확인 후 의식, 피부, 말초순환을 빠르게 훑는다",
        next: "wardDeterioration",
        score: { safety: 5, clinical: 5, empathy: 4 },
        log: "액팅 사정: 처짐, 창백함, 말초순환과 호흡 양상을 확인했습니다.",
        tone: "good",
        effect: () => wardAction("mentalCheck"),
      },
      {
        label: "차지 간호사를 호출하고 모니터 변화 추세를 보고한다",
        next: "wardChargeNotify",
        score: { safety: 6, clinical: 6, protocol: 5 },
        log: "차지 호출: 이미 연결된 모니터의 HR 상승, BP 저하, SpO₂ 하락 추세를 묶어 보고했습니다.",
        tone: "good",
        effect: () => wardAction("chargeCalled"),
      },
      {
        label: "인계 내용만 믿고 병실 밖 업무를 먼저 본다",
        next: "wardDeterioration",
        score: { safety: -8, clinical: -6 },
        log: "subtle warning이 있었지만 bedside baseline 확인이 지연되었습니다.",
        tone: "warning",
        effect: () => wardAction("leftBedside"),
      },
    ],
  },
  wardBaseline: {
    title: "Baseline 사정",
    text:
      "환자는 대답은 하지만 약간 느리고 얼굴이 창백합니다. 보호자는 '아침보다 더 처지는 것 같다'고 말합니다. 모니터는 이미 켜져 있으므로 수치 변화와 환자 반응을 함께 보고하세요.",
    actions: [
      {
        label: "repeat BP와 SpO₂를 측정한다",
        next: "wardDeterioration",
        score: { safety: 6, clinical: 6, protocol: 3 },
        log: "repeat BP/SpO₂ 측정: borderline hypotension과 산소화 저하 가능성을 추적하기 시작했습니다.",
        tone: "good",
        effect: () => wardAction("repeatBp"),
      },
      {
        label: "모니터 HR/SpO₂ 파형과 BP 추이를 다시 읽는다",
        next: "wardDeterioration",
        score: { safety: 5, clinical: 5 },
        log: "모니터 재확인: HR 상승, SpO₂ 파형, BP 추이를 차지 보고 근거로 정리했습니다.",
        tone: "good",
        effect: () => wardAction("monitor"),
      },
      {
        label: "차지에게 바로 전화만 하고 병실을 떠난다",
        next: "wardChargeNotify",
        score: { safety: -4, clinical: 1, protocol: 2 },
        log: "차지 호출은 좋지만 bedside 관찰 없이 병실을 떠났습니다.",
        tone: "warning",
        effect: () => {
          wardAction("chargeCalled");
          wardAction("leftBedside");
        },
      },
    ],
  },
  wardDeterioration: {
    title: "점진적 악화",
    text:
      "모니터상 HR은 더 빨라지고 BP는 낮아지는 추세입니다. SpO₂ pleth도 약해지고 환자 말수가 줄었습니다. 차지를 부르면서도 bedside 중재를 계속해야 합니다.",
    actions: [
      {
        label: "차지 간호사를 호출하고 현재 변화 추세를 보고한다",
        next: "wardChargeNotify",
        score: { safety: 6, clinical: 6, protocol: 5 },
        log: "차지 호출: BP 감소, HR 증가, 처짐과 소변량 감소를 묶어 보고했습니다.",
        tone: "good",
        effect: () => wardAction("chargeCalled"),
      },
      {
        label: "산소를 적용하고 SpO₂/pleth 반응을 본다",
        next: "wardDeterioration",
        score: { safety: 5, clinical: 4 },
        log: "bedside 중재: 산소를 적용하고 SpO₂ 반응을 추적합니다.",
        tone: "good",
        effect: () => wardAction("oxygen"),
      },
      {
        label: "ECG/SpO₂ 파형과 BP downtrend를 다시 읽는다",
        next: "wardDeterioration",
        score: { safety: 4, clinical: 5 },
        log: "모니터 재확인: ECG, SpO₂ pleth, BP downtrend를 차지 보고 근거로 정리했습니다.",
        tone: "good",
        effect: () => wardAction("monitor"),
      },
      {
        label: "IV line patency를 확인하고 수액 라인을 준비한다",
        next: "wardDeterioration",
        score: { safety: 5, clinical: 5, protocol: 3 },
        log: "bedside 중재: IV 라인과 수액 연결 가능성을 확인했습니다.",
        tone: "good",
        effect: () => wardAction("ivCheck"),
      },
      {
        label: "보호자에게 기다리라고 하고 다른 콜벨을 먼저 처리한다",
        next: "wardDeterioration",
        score: { safety: -8, clinical: -6, empathy: -3 },
        log: "bedside 이탈: 불안정 추세에서 환자 곁을 비웠습니다.",
        tone: "warning",
        effect: () => wardAction("leftBedside"),
      },
    ],
  },
  wardChargeNotify: {
    title: "차지 노티 중",
    text:
      "차지 간호사가 병실에 도착해 상황을 듣고 의사 노티를 시작합니다. 이제 핵심은 '차지가 전화하는 동안 액팅 간호사가 무엇을 계속하는가'입니다.",
    actions: [
      {
        label: "차지 지시대로 repeat BP를 다시 측정한다",
        next: "wardChargeNotify",
        score: { safety: 5, clinical: 5, protocol: 3 },
        log: "노티 중 행동: repeat BP를 재측정해 shock progression 여부를 계속 확인했습니다.",
        tone: "good",
        effect: () => wardAction("repeatBp"),
      },
      {
        label: "산소 적용 상태와 SpO₂ 파형을 재확인한다",
        next: "wardChargeNotify",
        score: { safety: 4, clinical: 4 },
        log: "노티 중 행동: 산소 적용과 SpO₂ 파형/수치를 재확인했습니다.",
        tone: "good",
        effect: () => wardAction("oxygen"),
      },
      {
        label: "IV 라인을 열 수 있게 준비하고 차지에게 알린다",
        next: "wardChargeNotify",
        score: { safety: 5, clinical: 4, protocol: 3 },
        log: "노티 중 행동: IV patency와 수액 준비 상태를 차지에게 공유했습니다.",
        tone: "good",
        effect: () => wardAction("ivCheck"),
      },
      {
        label: "의식 변화와 피부/말초순환을 재사정한다",
        next: "wardChargeNotify",
        score: { safety: 5, clinical: 5, empathy: 2 },
        log: "노티 중 행동: mental change, 피부색, 말초순환을 반복 사정했습니다.",
        tone: "good",
        effect: () => wardAction("mentalCheck"),
      },
      {
        label: "차지에게 최신 BP/SpO₂/의식 변화를 업데이트한다",
        next: "wardChargeNotify",
        score: { safety: 4, clinical: 5, protocol: 4 },
        log: "노티 중 업데이트: 차지에게 최신 BP, SpO₂, 의식 변화와 수행한 중재를 전달했습니다.",
        tone: "good",
        effect: () => wardAction("updateCharge"),
      },
      {
        label: "차지가 전화 중이니 기다리며 아무것도 하지 않는다",
        next: "wardChargeNotify",
        score: { safety: -8, clinical: -8, protocol: -4 },
        log: "노티 중 공백: 의사 연락을 기다리는 동안 bedside 재사정이 멈췄습니다.",
        tone: "warning",
        effect: () => wardAction("waited"),
      },
    ],
  },
  wardGoodEnd: {
    title: "액팅 workflow 평가",
    text:
      "이상징후 발견, 차지 보고, 노티 중 bedside 재사정과 중재가 이어져 환자 악화 속도를 줄였습니다.",
    actions: [
      {
        label: "처음 화면으로 돌아가기",
        next: "wardIntro",
        reset: true,
      },
    ],
  },
  wardBadEnd: {
    title: "액팅 workflow 평가",
    text:
      "차지 호출 또는 bedside 지속 행동이 지연되어 환자 악화가 진행되었습니다. 신규 간호사 역할에서는 '보고 후에도 환자 곁에서 계속 할 일'이 중요합니다.",
    actions: [
      {
        label: "다시 시도",
        next: "wardIntro",
        reset: true,
      },
    ],
  },
  gbsIntro: {
    title: "GBS SpO₂ 함정",
    text:
      "환자는 다리 힘이 빠지고 손발 저림이 올라오는 느낌을 말합니다. SpO₂는 아직 정상처럼 보여도 말이 짧고 기침 힘이 약합니다. VC, EtCO₂, cough/swallow, reflex를 먼저 확인하세요.",
    actions: [
      {
        label: "bedside spirometry로 VC를 측정해 호흡근 reserve를 확인한다",
        next: "gbsDeterioration",
        score: { safety: 6, clinical: 6, protocol: 3 },
        log: "VC 측정: SpO₂가 안심하기 좋은 수치여도 bedside spirometry로 호흡근 reserve를 직접 확인합니다.",
        tone: "good",
        effect: () => gbsAction("vc"),
      },
      {
        label: "모니터에서 EtCO₂ 수치와 capnogram을 읽어 CO₂ 저류를 확인한다",
        next: "gbsDeterioration",
        score: { safety: 5, clinical: 6 },
        log: "모니터 확인: EtCO₂와 capnogram으로 SpO₂에 가려진 CO₂ 저류 경향을 먼저 확인합니다.",
        tone: "good",
        effect: () => gbsAction("monitor"),
      },
      {
        label: "짧은 문장, weak cough, drooling/dysphagia를 환자에게 직접 확인한다",
        next: "gbsDeterioration",
        score: { safety: 5, clinical: 5, empathy: 3 },
        log: "Bulbar 사정: 한 문장이 짧아지고 기침이 약한지, 침 삼킴이 불편한지 bedside에서 직접 확인합니다.",
        tone: "good",
        effect: () => gbsAction("coughSwallow"),
      },
      {
        label: "SpO₂가 96%로 유지되므로 motor strength만 확인하고 호흡은 더 지켜본다",
        next: "gbsDeterioration",
        score: { safety: -8, clinical: -7 },
        log: "SpO₂에 안도해 호흡근 사정이 미루어졌습니다. GBS에서 SpO₂는 호흡근 저하보다 늦게 떨어집니다. VC와 EtCO₂ 확인이 우선입니다.",
        tone: "warning",
        effect: () => gbsAction("waited"),
      },
    ],
  },
  gbsDeterioration: {
    title: "산소화는 괜찮아 보여도 환기가 무너지는 중",
    text:
      "환자의 한 문장이 짧아지고 얕은 호흡이 보입니다. SpO₂만 보면 안심하기 쉽지만 VC는 떨어지고 EtCO₂는 오르는 흐름입니다.",
    actions: [
      {
        label: "침상 머리를 올리고 PO를 보류해 aspiration precaution을 즉시 적용한다",
        next: "gbsDeterioration",
        score: { safety: 6, clinical: 5, protocol: 4 },
        log: "Aspiration precaution: GBS bulbar weakness에서 흡인 예방이 호흡 중재보다 먼저입니다. HOB 30-45도 상승, PO 보류.",
        tone: "good",
        effect: () => gbsAction("aspiration"),
      },
      {
        label: "EMR 검사 결과에서 ABGA PaCO₂를 확인해 hypoventilation 근거를 확보한다",
        next: "gbsDeterioration",
        score: { clinical: 5, protocol: 4 },
        log: "ABGA 확인: EtCO₂ 상승과 함께 PaCO₂ 수치로 ventilation failure 근거를 확보합니다.",
        tone: "good",
        effect: () => gbsAction("abga"),
      },
      {
        label: "VC 하락 · EtCO₂ 상승 · weak cough/dysphagia를 묶어 차지에게 보고하고 ICU escalation을 시작한다",
        next: "gbsEscalationNotify",
        score: { safety: 7, clinical: 6, protocol: 5 },
        log: "차지 호출: SpO₂ 정상에 가려진 VC 하락, EtCO₂ 상승, bulbar weakness를 근거로 ICU escalation을 요청합니다.",
        tone: "good",
        effect: () => gbsAction("chargeCalled"),
      },
      {
        label: "SpO₂가 아직 유지되므로 산소만 적용하고 상황을 더 지켜본다",
        next: "gbsDeterioration",
        score: { safety: -5, clinical: -7 },
        log: "산소 적용 후 관찰을 선택했습니다. 산소는 산소화를 보조할 뿐이며 CO₂ 저류를 마스킹할 수 있습니다. 환기 저하 근거(VC/EtCO₂)와 escalation 판단이 필요합니다.",
        tone: "warning",
        effect: () => { gbsAction("oxygen"); gbsAction("waited"); },
      },
    ],
  },
  gbsEscalationNotify: {
    title: "차지/ICU 노티 중",
    text:
      "차지가 의사와 ICU escalation을 진행 중입니다. 그동안 bedside에서 VC, EtCO₂, cough/swallow, aspiration risk, ECG/BP fluctuation을 계속 업데이트해야 합니다.",
    actions: [
      {
        label: "Wall suction 압력과 airway cart를 bedside에 준비한다",
        next: "gbsEscalationNotify",
        score: { safety: 5, clinical: 4, protocol: 4 },
        log: "Suction 준비: 차지 노티 중에도 weak cough와 drooling 악화에 대비해 suction과 airway cart를 먼저 준비합니다.",
        tone: "good",
        effect: () => gbsAction("suction"),
      },
      {
        label: "VC를 재측정하고 최신 수치를 차지에게 업데이트한다",
        next: "gbsEscalationNotify",
        score: { safety: 5, clinical: 6, protocol: 4 },
        log: "노티 중 업데이트: 최신 VC와 EtCO₂ 수치 변화를 차지에게 전달해 ICU 팀이 정확한 상태를 파악하도록 합니다.",
        tone: "good",
        effect: () => { gbsAction("vc"); gbsAction("updateCharge"); },
      },
      {
        label: "모니터에서 SpO₂/ECG/BP fluctuation을 다시 읽어 dysautonomia 변화를 확인한다",
        next: "gbsEscalationNotify",
        score: { safety: 4, clinical: 5 },
        log: "노티 중 모니터링: ECG, SpO₂, BP 변동폭을 다시 읽어 GBS dysautonomia 진행 여부를 확인합니다.",
        tone: "good",
        effect: () => gbsAction("monitor"),
      },
      {
        label: "차지가 전화 중이니 이제 다 됐다고 생각하고 결과를 기다린다",
        next: "gbsEscalationNotify",
        score: { safety: -8, clinical: -8, protocol: -5 },
        log: "노티 중 bedside 공백: 차지가 연락하는 동안 bedside 관찰이 멈췄습니다. 간호사의 역할은 노티가 끝날 때까지 VC/EtCO₂/suction/dysautonomia를 계속 추적하는 것입니다.",
        tone: "warning",
        effect: () => gbsAction("waited"),
      },
    ],
  },
  gbsGoodEnd: {
    title: "GBS respiratory escalation 평가",
    text:
      "SpO₂ 정상이라는 함정에 속지 않고 respiratory muscle failure 전조와 bulbar/autonomic 위험을 조기에 묶어 ICU escalation이 진행되었습니다.",
    actions: [
      {
        label: "다시 시도",
        next: "gbsIntro",
        reset: true,
      },
    ],
  },
  gbsBadEnd: {
    title: "GBS respiratory escalation 평가",
    text:
      "SpO₂가 정상처럼 보이는 동안 호흡근 악화와 aspiration/dysautonomia warning이 늦게 인지되었습니다. GBS에서는 산소화보다 환기 저하를 먼저 의심해야 합니다.",
    actions: [
      {
        label: "다시 시도",
        next: "gbsIntro",
        reset: true,
      },
    ],
  },
  goodEnd: {
    title: "근무 평가",
    text:
      "환자 확인, 대화, 기초 사정, EKG 부착, 모니터 확인, 보고까지 이어졌다. 첫 프로토타입의 핵심 루프를 완료했다.",
    actions: [
      {
        label: "처음부터 다시 플레이",
        next: "intro",
        reset: true,
      },
    ],
  },
  badEnd: {
    title: "근무 평가",
    text:
      "중요한 간호 순서가 빠지면서 환자 신뢰와 안전이 흔들렸다. 다시 시도해서 대화, 확인, 사정, 처치, 보고의 순서를 만들어보자.",
    actions: [
      {
        label: "다시 도전",
        next: "intro",
        reset: true,
      },
    ],
  },
};

const scoreEl = document.querySelector("#score");
const safetyScoreEl = document.querySelector("#safety-score");
const clinicalScoreEl = document.querySelector("#clinical-score");
const empathyScoreEl = document.querySelector("#empathy-score");
const protocolScoreEl = document.querySelector("#protocol-score");
const sceneTitleEl = document.querySelector("#scene-title");
const sceneTextEl = document.querySelector("#scene-text");
const scenarioLabelEl = document.querySelector("#scenario-label");
const emrTitleEl = document.querySelector("#emr-title");
const actionsEl = document.querySelector("#actions");
const interactionMenuEl = document.querySelector("#interaction-menu");
const patientConversationEl = document.querySelector("#patient-conversation");
const ecgProcedureOverlayEl = document.querySelector("#ecg-procedure-overlay");
const notificationLayerEl = document.querySelector("#notification-layer");
const interactionHintEl = document.querySelector("#interaction-hint");
const physicianContactEl = document.querySelector("#physician-contact");
const logEl = document.querySelector("#log");
const patientDetailsEl = document.querySelector("#patient-details");
const labListEl = document.querySelector("#lab-list");
const regularOrderListEl = document.querySelector("#regular-order-list");
const prnOrderListEl = document.querySelector("#prn-order-list");
const evaluationEl = document.querySelector("#evaluation");
const evaluationBodyEl = document.querySelector("#evaluation-body");
const hrEl = document.querySelector("#hr");
const spo2El = document.querySelector("#spo2");
const bpEl = document.querySelector("#bp");
const monitorEl = document.querySelector("#monitor");
const monitorStatusEl = document.querySelector("#monitor-status");
const painStatusEl = document.querySelector("#pain-status");
const anxietyStatusEl = document.querySelector("#anxiety-status");
const breathingStatusEl = document.querySelector("#breathing-status");
const cooperationStatusEl = document.querySelector("#cooperation-status");
const riskStatusEl = document.querySelector("#risk-status");
const patientEl = document.querySelector(".patient");
const emrModalEl = document.querySelector("#emr-modal");
const emrContentEl = document.querySelector("#emr-content");
const emrCloseEl = document.querySelector("#emr-close");
const emrTabButtons = document.querySelectorAll("[data-emr-tab]");
const toolToolbarEl = document.querySelector("#tool-toolbar");
const hudVisibilityToggleEl = document.querySelector("#hud-visibility-toggle");
const hudClusterEl = document.querySelector("#hud-cluster");
const hudClusterBodyEl = document.querySelector("#hud-cluster-body");
const hudClusterToggleEl = document.querySelector("#hud-cluster-toggle");
const hudClusterDragHandleEl = document.querySelector("#hud-cluster-drag-handle");
const focusCardEl = document.querySelector("#focus-card");
const eventsCardEl = document.querySelector("#events-card");
const floatingCardToggleButtons = document.querySelectorAll("[data-floating-card-toggle]");
const toolButtons = document.querySelectorAll("[data-tool]");
const contextWindowEl = document.querySelector("#context-window");
const contextWindowKickerEl = document.querySelector("#context-window-kicker");
const contextWindowTitleEl = document.querySelector("#context-window-title");
const contextWindowSubtitleEl = document.querySelector("#context-window-subtitle");
const contextWindowBodyEl = document.querySelector("#context-window-body");
const contextWindowCloseEl = document.querySelector("#context-window-close");
const titleScreenEl = document.querySelector("#title-screen");
const titleStartEl = document.querySelector("#title-start");
const titleEpisodeSelectEl = document.querySelector("#title-episode-select");
const titleOptionsEl = document.querySelector("#title-options");
const titleOptionsPanelEl = document.querySelector("#title-options-panel");
const episodeLobbyEl = document.querySelector("#episode-lobby");
const episodeStartEl = document.querySelector("#episode-start");
const episodeStartAcsEl = document.querySelector("#episode-start-acs");
const episodeStartWardEl = document.querySelector("#episode-start-ward");
const episodeStartGbsEl = document.querySelector("#episode-start-gbs");
const episodeBackHomeEl = document.querySelector("#episode-back-home");
const simulationHomeEl = document.querySelector("#simulation-home");
let contextWindowDrag = null;
let hudClusterDrag = null;
const handoffOverlayEl = document.querySelector("#handoff-overlay");
const handoffContentEl = document.querySelector("#handoff-content");
const handoffContinueEl = document.querySelector("#handoff-continue");

function clampHudClusterPosition(left, top) {
  const rect = hudClusterEl?.getBoundingClientRect();
  const width = rect?.width || 300;
  const height = rect?.height || 260;

  return {
    left: clamp(left, 8, Math.max(8, window.innerWidth - width - 8)),
    top: clamp(top, 8, Math.max(8, window.innerHeight - height - 8)),
  };
}

function applyHudClusterPosition() {
  if (!hudClusterEl) return;
  const position = state.hudCluster?.position;

  if (!position) {
    hudClusterEl.style.left = "";
    hudClusterEl.style.top = "";
    hudClusterEl.style.right = "";
    hudClusterEl.style.bottom = "";
    return;
  }

  hudClusterEl.style.left = position.left + "px";
  hudClusterEl.style.top = position.top + "px";
  hudClusterEl.style.right = "auto";
  hudClusterEl.style.bottom = "auto";
}

function updateHudClusterVisibility() {
  const collapsed = Boolean(state.hudCluster?.collapsed);
  hudClusterEl?.classList.toggle("cluster-collapsed", collapsed);
  applyHudClusterPosition();

  if (hudClusterBodyEl) hudClusterBodyEl.hidden = collapsed;
  if (hudClusterToggleEl) {
    hudClusterToggleEl.textContent = collapsed ? "Open" : "Min";
    hudClusterToggleEl.setAttribute("aria-expanded", String(!collapsed));
    hudClusterToggleEl.setAttribute("aria-label", collapsed ? "HUD 클러스터 펼치기" : "HUD 클러스터 접기");
  }
  if (hudVisibilityToggleEl) {
    hudVisibilityToggleEl.setAttribute("aria-pressed", String(collapsed));
    hudVisibilityToggleEl.setAttribute("aria-label", collapsed ? "HUD 클러스터 펼치기" : "HUD 클러스터 접기");
    hudVisibilityToggleEl.querySelector("span").textContent = collapsed ? "OPEN" : "HUD";
  }
}

function toggleHudCluster() {
  state.hudCluster = {
    ...(state.hudCluster || {}),
    collapsed: !state.hudCluster?.collapsed,
  };
  updateHudClusterVisibility();
}

function beginHudClusterDrag(event) {
  if (!hudClusterEl || event.target.closest("button")) return;

  const rect = hudClusterEl.getBoundingClientRect();
  hudClusterDrag = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  };
  hudClusterEl.classList.add("dragging");
  event.preventDefault();
}

function moveHudClusterDrag(event) {
  if (!hudClusterDrag || !hudClusterEl) return;
  state.hudCluster = {
    ...(state.hudCluster || {}),
    position: clampHudClusterPosition(
      event.clientX - hudClusterDrag.offsetX,
      event.clientY - hudClusterDrag.offsetY,
    ),
  };
  applyHudClusterPosition();
}

function endHudClusterDrag() {
  hudClusterDrag = null;
  hudClusterEl?.classList.remove("dragging");
}

function allFloatingCardsCollapsed() {
  return Object.values(state.floatingCards || {}).every(Boolean);
}

function updateFloatingCardVisibility() {
  const cards = state.floatingCards || {};
  const allCollapsed = allFloatingCardsCollapsed();

  focusCardEl?.classList.toggle("is-collapsed", Boolean(cards.focus));
  eventsCardEl?.classList.toggle("is-collapsed", Boolean(cards.events));
  interactionHintEl?.classList.toggle("is-collapsed", Boolean(cards.hint));
  document.body.classList.toggle("clinical-cards-compact", allCollapsed);

  floatingCardToggleButtons.forEach((button) => {
    const card = button.dataset.floatingCardToggle;
    const collapsed = Boolean(cards[card]);
    button.setAttribute("aria-expanded", String(!collapsed));
    button.textContent = collapsed ? "Open" : "Min";
    if (card === "hint") {
      button.textContent = collapsed ? "Hint" : "Hide";
      button.setAttribute("aria-label", collapsed ? "침상 힌트 보이기" : "침상 힌트 접기");
    }
  });
}

function setFloatingCardCollapsed(card, collapsed) {
  state.floatingCards = { ...state.floatingCards, [card]: collapsed };
  updateFloatingCardVisibility();
  updateHudClusterVisibility();
}

function toggleFloatingCard(card) {
  setFloatingCardCollapsed(card, !state.floatingCards?.[card]);
}

function toggleAllFloatingCards() {
  const nextCollapsed = !allFloatingCardsCollapsed();
  state.floatingCards = { focus: nextCollapsed, events: nextCollapsed, hint: nextCollapsed };
  updateFloatingCardVisibility();
}


function applyContextWindowPosition() {
  if (!contextWindowEl) return;

  const position = state.contextWindowPosition;
  if (!position) {
    contextWindowEl.style.left = "";
    contextWindowEl.style.top = "";
    contextWindowEl.style.right = "";
    contextWindowEl.style.bottom = "";
    return;
  }

  contextWindowEl.style.left = position.left + "px";
  contextWindowEl.style.top = position.top + "px";
  contextWindowEl.style.right = "auto";
  contextWindowEl.style.bottom = "auto";
}

function openContextWindow(type, title, subtitle, contentNode, kicker = "Clinical task") {
  if (!contextWindowEl || !contextWindowBodyEl) return;

  if (state.contextWindowType !== type) state.contextWindowPosition = null;
  state.contextWindowType = type;
  contextWindowKickerEl.textContent = kicker;
  contextWindowTitleEl.textContent = title;
  contextWindowSubtitleEl.textContent = subtitle || "";
  contextWindowBodyEl.innerHTML = "";
  if (contentNode) contextWindowBodyEl.append(contentNode);
  applyContextWindowPosition();
  contextWindowEl.hidden = false;
}

function closeContextWindow() {
  if (!contextWindowEl || !contextWindowBodyEl) return;

  contextWindowEl.hidden = true;
  contextWindowBodyEl.innerHTML = "";
  state.contextWindowType = null;
}

function clampContextWindowPosition(left, top) {
  const roomRect = document.querySelector(".room")?.getBoundingClientRect();
  const rect = contextWindowEl?.getBoundingClientRect();
  const width = rect?.width || 360;
  const height = rect?.height || 320;
  const maxLeft = (roomRect?.width || window.innerWidth) - width - 10;
  const maxTop = (roomRect?.height || window.innerHeight) - height - 10;

  return {
    left: clamp(left, 10, Math.max(10, maxLeft)),
    top: clamp(top, 10, Math.max(10, maxTop)),
  };
}

function beginContextWindowDrag(event) {
  if (!contextWindowEl || event.target.closest("button")) return;

  const roomRect = document.querySelector(".room")?.getBoundingClientRect();
  const rect = contextWindowEl.getBoundingClientRect();
  contextWindowDrag = {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    roomLeft: roomRect?.left || 0,
    roomTop: roomRect?.top || 0,
  };
  contextWindowEl.classList.add("dragging");
  event.preventDefault();
}

function moveContextWindowDrag(event) {
  if (!contextWindowDrag || !contextWindowEl) return;

  const next = clampContextWindowPosition(
    event.clientX - contextWindowDrag.roomLeft - contextWindowDrag.offsetX,
    event.clientY - contextWindowDrag.roomTop - contextWindowDrag.offsetY,
  );
  state.contextWindowPosition = next;
  applyContextWindowPosition();
}

function endContextWindowDrag() {
  contextWindowDrag = null;
  contextWindowEl?.classList.remove("dragging");
}

function renderMedicationContextWindow() {
  openContextWindow(
    "medication",
    "투약 카트",
    "PRN 약물 route를 선택하고, SL 설하 투여와 IV 주사기 투여를 구분해 진행합니다.",
    createMedicationPanel(),
    "Medication preparation",
  );
}

function renderOrderContextWindow() {
  openContextWindow(
    "orders",
    "정규 처방 적용",
    "EMR에서 확인한 active orders를 필요한 순서대로 적용합니다.",
    createOrderPanel(),
    "Orders",
  );
}

function renderSbarContextWindow() {
  if (markAssessmentFinding("charge-nurse-sbar-briefing")) {
    addLog("차지 간호사 도착: SBAR를 들은 뒤 담당의에게 노티하고, 당신은 bedside 재사정을 계속합니다.", "good");
  }

  openContextWindow(
    "sbar",
    "차지 간호사 SBAR 보고",
    "차지에게 확보한 사정, 처치, 재사정 근거를 짧게 보고합니다. 차지는 담당의 노티를 진행합니다.",
    createSbarBuilder(),
    "Charge nurse",
  );
}

function renderReassessmentContextWindow() {
  const wrapper = document.createElement("div");
  wrapper.className = "context-task-stack";
  wrapper.append(createReassessmentStatus());

  const button = document.createElement("button");
  button.type = "button";
  button.className = "primary contextual-command";
  button.textContent = "재사정 근거로 SBAR 보고 준비";
  button.addEventListener("click", () => beginSbarFromCommunicationDevice());
  wrapper.append(button);

  openContextWindow(
    "reassessment",
    "PRN 후 재사정",
    "환자와 모니터를 다시 확인한 뒤 SBAR 보고로 넘어갑니다.",
    wrapper,
    "Reassessment",
  );
}

function refreshActiveContextWindow() {
  if (!state.contextWindowType || !contextWindowEl || contextWindowEl.hidden) return;

  const validStage = {
    medication: "prnDecision",
    orders: "regularOrders",
    sbar: "sbarBuild",
    reassessment: "persistentSymptoms",
  }[state.contextWindowType];

  if (validStage && state.stage !== validStage) {
    closeContextWindow();
    return;
  }

  if (state.contextWindowType === "medication") renderMedicationContextWindow();
  if (state.contextWindowType === "orders") renderOrderContextWindow();
  if (state.contextWindowType === "sbar") renderSbarContextWindow();
  if (state.contextWindowType === "reassessment") renderReassessmentContextWindow();
}

function entryFlowActive() {
  return state.stage === "handoff" || state.stage === "chartReview";
}

function renderHandoffOverlay() {
  if (!handoffOverlayEl || !handoffContentEl) return;

  const isVisible = state.stage === "handoff" && !state.clinicalEntry?.handoffComplete;
  handoffOverlayEl.hidden = !isVisible;

  if (!isVisible) return;

  const handoffItems = isGbsEpisode() ? gbsHandoff : isWardWorkflowEpisode() ? wardWorkflowHandoff : clinicalHandoff;
  handoffContentEl.innerHTML = "<ul>" + handoffItems.map((item) =>
    "<li><span>" + item.label + "</span><strong>" + item.text + "</strong></li>"
  ).join("") + "</ul>";
}

function continueFromHandoff() {
  state.clinicalEntry.handoffComplete = true;
  state.clinicalEntry.chartExposed = true;
  if (isWardWorkflowEpisode()) {
    state.clinicalEntry.bedsideReleased = true;
    state.stage = "wardIntro";
    addLog("인계 완료: 601호 subtle warning을 확인하고 병실로 이동합니다.", "good");
    render();
    return;
  }
  if (isGbsEpisode()) {
    state.clinicalEntry.bedsideReleased = true;
    state.stage = "gbsIntro";
    addLog("인계 완료: GBS 환자의 호흡근 위험과 연하/자율신경 warning을 확인하고 병실로 이동합니다.", "good");
    render();
    return;
  }
  state.stage = "chartReview";
  addLog("인계 완료: 현재 우려점, PRN, 지속 ECG 모니터링 필요성을 확인했습니다.", "good");
  render();
  openEmr("summary");
}

function releaseBedsideFromEntry() {
  if (state.stage !== "chartReview" || state.clinicalEntry?.bedsideReleased) return;

  state.clinicalEntry.bedsideReleased = true;
  state.stage = isWardWorkflowEpisode() ? "wardIntro" : "intro";
  addLog("차트 확인 후 침상 인계를 시작합니다. 환자에게 직접 접근할 수 있습니다.", "good");
  render();
}

function notificationSeverity(text, tone = "") {
  if (tone === "good") return "success";
  if (tone === "bad") return "critical";
  if (tone === "warning") return "warning";
  if (text.includes("critical") || text.includes("위급") || text.includes("ALARM")) return "critical";
  if (text.includes("Priority alert") || text.includes("decreasing") || text.includes("deterior")) return "warning";
  return "info";
}

function notificationIcon(severity) {
  return {
    success: "✓",
    warning: "⚠",
    critical: "⚠",
    info: "i",
  }[severity] || "i";
}

function recordEventHistory(text, severity) {
  state.eventHistory.unshift({
    text,
    severity,
    minute: state.elapsedMinutes,
  });
  state.eventHistory = state.eventHistory.slice(0, 24);
}

function showClinicalNotification(text, severity) {
  if (!notificationLayerEl) return;

  const notice = document.createElement("div");
  const icon = document.createElement("span");
  const message = document.createElement("strong");
  notice.className = "clinical-notification " + severity;
  icon.textContent = notificationIcon(severity);
  message.textContent = text;
  notice.append(icon, message);
  notificationLayerEl.prepend(notice);

  const notices = Array.from(notificationLayerEl.querySelectorAll(".clinical-notification"));
  notices.slice(4).forEach((item) => item.remove());

  window.setTimeout(() => {
    notice.classList.add("leaving");
  }, 2800);

  window.setTimeout(() => {
    notice.remove();
  }, 3600);
}

function addLog(text, tone = "") {
  const severity = notificationSeverity(text, tone);
  state.logs.unshift({ text, tone, severity });
  state.logs = state.logs.slice(0, 8);
  recordEventHistory(text, severity);
  showClinicalNotification(text, severity);
}

function renderClinicalData() {
  if (!patientDetailsEl || !labListEl || !regularOrderListEl || !prnOrderListEl) return;
  const profile = currentPatientProfile();

  patientDetailsEl.innerHTML = `
    <dt>Name</dt><dd>${profile.name}</dd>
    <dt>Age</dt><dd>${profile.age}</dd>
    <dt>Diagnosis</dt><dd>${profile.diagnosis}</dd>
    <dt>CC</dt><dd>${profile.chiefComplaint}</dd>
    <dt>계획</dt><dd>${profile.plannedSurgery}</dd>
    <dt>상태</dt><dd>${profile.pod}</dd>
  `;

  labListEl.innerHTML = profile.labs
    .map((lab) => `<li><strong>${lab.name}</strong> ${lab.value} ${lab.unit} <span>${lab.flag} · 정상범위 ${lab.normal}</span></li>`)
    .join("");

  regularOrderListEl.innerHTML = profile.regularOrders
    .map((order) => `<li class="${state.appliedRegularOrders.includes(order.id) ? "done" : ""}">${order.label}</li>`)
    .join("");

  prnOrderListEl.innerHTML = profile.prnOrders
    .map((order) => `<li class="${state.prnMedicationsGiven.includes(order.id) ? "done" : ""}">${order.label}</li>`)
    .join("");
}

function resetGame() {
  state.currentEpisode = "acsChestPain";
  state.scores = {
    safety: 50,
    clinical: 50,
    empathy: 50,
    protocol: 50,
  };
  state.stage = "handoff";
  state.clinicalEntry = {
    handoffComplete: false,
    chartExposed: false,
    bedsideReleased: false,
  };
  state.monitorOn = false;
  state.ekgAttached = false;
  state.ecgWorkflowStarted = false;
  state.assessed = false;
  state.rapport = false;
  state.procedure = [];
  state.procedureOptions = shuffleProcedureOptions();
  state.procedureFeedback = {};
  state.askedQuestions = [];
  state.appliedRegularOrders = [];
  state.prnMedicationsGiven = [];
  state.postPrnReassessment = {
    pain: false,
    vitals: false,
    ecgReview: false,
  };
  state.medicationWorkflow = {
    selectedOrderId: null,
    prepared: false,
    doseVerified: false,
    syringeReady: false,
    verifiedDose: "",
  };
  state.sbarSelections = {};
  state.assessmentFindings = {};
  state.completedAssessments = {
    pain: false,
    vitals: false,
    consciousness: false,
    ecgReview: false,
    respiratory: false,
    perfusion: false,
    skin: false,
  };
  state.patientFindings = {};
  state.oxygenApplied = false;
  state.stabilized = false;
  state.outcome = null;
  state.patientVoice = "";
  state.lastVoiceKey = "";
  state.urgency = {
    level: "mild",
    score: 0,
    label: "낮음",
  };
  state.activeTool = null;
  state.dynamicLoop = {
    lastTickAt: Date.now(),
    stabilizedTicks: 0,
    criticalTicks: 0,
    lowSpo2Ticks: 0,
    ignoredInstabilityTicks: 0,
  };
  state.elapsedMinutes = 0;
  state.emrOpened = false;
  state.emrTab = "summary";
  state.knownPatientInfo = {
    pain: false,
    breathing: false,
    cardiacRisk: false,
  };
  state.patientStatus = {
    pain: 5,
    anxiety: 56,
    breathing: 56,
    cooperation: 64,
  };
  state.logs = [];
  state.eventHistory = [];
  state.interventionBaseline = null;
  state.lastReassessmentSnapshot = null;
  state.followUpObservation = {
    active: false,
    interventions: {},
    lastCueMinute: -1,
    cues: {},
  };
  state.contextWindowType = null;
  state.contextWindowPosition = null;
  state.floatingCards = {
    focus: false,
    events: false,
    hint: false,
  };
  state.hudCluster = {
    collapsed: false,
    position: null,
  };
  state.wardWorkflow = null;
  state.gbsWorkflow = null;
  state.gbsAssessmentRecords = [];
  state.chargeFollowUp = null;
  closeContextWindow();
  addLog("야간 근무 인계가 시작되었습니다. 환자 상태와 처방을 확인한 뒤 침상으로 들어갑니다.");
}

function setupWardWorkflowEpisode() {
  state.currentEpisode = "wardWorkflow";
  state.stage = "handoff";
  state.clinicalEntry = {
    handoffComplete: false,
    chartExposed: false,
    bedsideReleased: false,
  };
  state.monitorOn = true;
  state.ekgAttached = true;
  state.oxygenApplied = false;
  state.patientStatus = {
    pain: 1,
    anxiety: 52,
    breathing: 58,
    cooperation: 62,
  };
  state.knownPatientInfo = {
    pain: true,
    breathing: true,
    cardiacRisk: false,
  };
  state.wardWorkflow = createWardWorkflowState();
  state.wardWorkflow.monitorAttached = true;
  state.wardObjectScoreMarks = {};
  state.chargeFollowUp = null;
  state.logs = [];
  state.eventHistory = [];
  state.outcome = null;
  state.elapsedMinutes = 0;
  addLog("급성 흉통 액팅 모드 시작: 601호 bedside monitor가 이미 연결되어 있습니다. 파형과 환자 상태를 근거로 차지에게 보고하세요.", "good");
}

function setupGbsEpisode() {
  state.currentEpisode = "gbsRespiratory";
  state.stage = "handoff";
  state.clinicalEntry = {
    handoffComplete: false,
    chartExposed: false,
    bedsideReleased: false,
  };
  state.monitorOn = true;
  state.ekgAttached = true;
  state.oxygenApplied = false;
  state.patientStatus = {
    pain: 1,
    anxiety: 54,
    breathing: 58,
    cooperation: 66,
  };
  state.knownPatientInfo = {
    pain: true,
    breathing: true,
    cardiacRisk: false,
  };
  state.gbsWorkflow = createGbsWorkflowState();
  state.gbsAssessmentRecords = [];
  state.wardWorkflow = null;
  state.chargeFollowUp = null;
  state.logs = [];
  state.eventHistory = [];
  state.outcome = null;
  state.elapsedMinutes = 0;
  state.wardObjectScoreMarks = {};
  addLog("GBS 에피소드 시작: SpO₂는 아직 괜찮아 보입니다. 하지만 짧은 문장, weak cough, dysphagia, VC 하락, EtCO₂ 상승이 핵심 cue입니다.", "good");
}

function openEpisodeLobby() {
  titleScreenEl.hidden = true;
  episodeLobbyEl.hidden = false;
  document.body.classList.remove("title-active");
  document.body.classList.add("lobby-active");
  titleOptionsPanelEl.hidden = true;
}

function returnToTitleScreen() {
  closeEmr();
  closeContextWindow();
  closeEcgProcedureOverlay();
  closePatientConversation();
  closeClinicalInteractionMenu();
  if (physicianContactEl) physicianContactEl.hidden = true;
  titleScreenEl.hidden = false;
  episodeLobbyEl.hidden = true;
  document.body.classList.add("title-active");
  document.body.classList.remove("lobby-active");
  titleOptionsPanelEl.hidden = true;
}

function toggleTitleOptions() {
  titleOptionsPanelEl.hidden = !titleOptionsPanelEl.hidden;
}

function startEpisode(episodeId = "acsChestPain") {
  const episode = episodes[episodeId];

  if (!episode || episode.status !== "available") {
    showClinicalNotification("아직 준비 중인 에피소드입니다.", "warning");
    return;
  }

  resetGame();
  if (episodeId === "wardWorkflow") setupWardWorkflowEpisode();
  if (episodeId === "gbsRespiratory") setupGbsEpisode();
  titleScreenEl.hidden = true;
  episodeLobbyEl.hidden = true;
  document.body.classList.remove("title-active");
  document.body.classList.remove("lobby-active");
  closeEmr();
  render();
  if (episodeId === "acsChestPain") showBeginnerOnboardingHints();
}

function shuffleProcedureOptions() {
  const shuffled = [...procedureSteps];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  if (shuffled[0]?.id === procedureSteps[0].id) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
}

function averageScore() {
  const values = Object.values(state.scores);
  return Math.round(values.reduce((total, score) => total + score, 0) / values.length);
}

function applyScore(scoreChange) {
  if (!scoreChange) return;

  if (typeof scoreChange === "number") {
    Object.keys(state.scores).forEach((key) => {
      state.scores[key] = clampScore(state.scores[key] + scoreChange);
    });
    return;
  }

  Object.entries(scoreChange).forEach(([key, value]) => {
    state.scores[key] = clampScore(state.scores[key] + value);
  });
}

function applyConnectedPhysiology(sourceImpact = {}) {
  const status = state.patientStatus;
  const painStress = Math.max(0, status.pain - 5);
  const anxietyStress = Math.max(0, status.anxiety - 62) / 20;
  const oxygenRelief = state.oxygenApplied ? 1 : 0;
  const prnRelief = state.prnMedicationsGiven.length > 0 ? 1 : 0;

  if ((sourceImpact.pain ?? 0) > 0) {
    status.anxiety = clamp(status.anxiety + Math.min(4, sourceImpact.pain * 1.4), 0, 100);
    status.breathing = clamp(status.breathing + Math.min(3, sourceImpact.pain * 0.9), 0, 100);
  }

  if ((sourceImpact.anxiety ?? 0) > 0) {
    status.breathing = clamp(status.breathing + Math.min(3, sourceImpact.anxiety * 0.25), 0, 100);
  }

  if ((sourceImpact.breathing ?? 0) > 0) {
    status.anxiety = clamp(status.anxiety + Math.min(3, sourceImpact.breathing * 0.18), 0, 100);
  }

  if (painStress > 0 && !prnRelief) {
    status.anxiety = clamp(status.anxiety + painStress * 0.08, 0, 100);
  }

  if (anxietyStress > 0 && !oxygenRelief) {
    status.breathing = clamp(status.breathing + anxietyStress * 0.08, 0, 100);
  }

  if (oxygenRelief) {
    status.breathing = clamp(status.breathing - 0.28, 0, 100);
    status.anxiety = clamp(status.anxiety - 0.12, 0, 100);
  }

  if (prnRelief && status.pain < 6.5) {
    status.anxiety = clamp(status.anxiety - 0.18, 0, 100);
    status.breathing = clamp(status.breathing - 0.08, 0, 100);
  }
}

function applyPatientImpact(impact) {
  if (!impact) return;

  Object.entries(impact).forEach(([key, value]) => {
    const max = key === "pain" ? 10 : 100;
    state.patientStatus[key] = clamp(state.patientStatus[key] + value, 0, max);
  });

  applyConnectedPhysiology(impact);
  updatePatientVoice();
}

function markAssessmentFinding(findingId) {
  if (state.assessmentFindings[findingId]) return false;
  state.assessmentFindings[findingId] = true;
  return true;
}


function markAssessmentComplete(assessmentId) {
  if (!state.completedAssessments) {
    state.completedAssessments = {
      pain: false,
      vitals: false,
      consciousness: false,
      ecgReview: false,
      respiratory: false,
      perfusion: false,
      skin: false,
    };
  }

  if (!assessmentId || state.completedAssessments[assessmentId]) return false;
  state.completedAssessments[assessmentId] = true;
  return true;
}

function recordEmrNursingNote(label, value, interpretation = "", type = "assessment") {
  if (isGbsEpisode()) {
    recordGbsAssessment(type, label, value, interpretation);
    return;
  }

  if (!state.patientFindings) state.patientFindings = {};
  const key = "note-" + label.toLowerCase().replace(/[^a-z0-9가-힣]+/gi, "-").replace(/^-|-$/g, "") + "-" + state.elapsedMinutes;
  state.patientFindings[key] = {
    label,
    value: interpretation ? value + " · " + interpretation : value,
  };
}

function isAssessmentComplete(assessmentId) {
  return Boolean(assessmentId && state.completedAssessments?.[assessmentId]);
}

function syncCompletedAssessments() {
  if (!state.completedAssessments) markAssessmentComplete(null);

  if (state.knownPatientInfo.pain) state.completedAssessments.pain = true;

  const vitalsCompletedStages = [
    "vitals",
    "ekgProcedure",
    "monitoring",
    "regularOrders",
    "prnDecision",
    "persistentSymptoms",
    "sbarBuild",
    "postSbarBedside",
    "wardIntro",
    "wardBaseline",
    "wardDeterioration",
    "wardChargeNotify",
    "gbsIntro",
    "gbsDeterioration",
    "gbsEscalationNotify",
    "goodEnd",
  ];

  if (vitalsCompletedStages.includes(state.stage) || state.monitorOn) {
    state.completedAssessments.vitals = true;
  }

}


function clampScore(value) {
  return clamp(value, 0, 100);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createWardWorkflowState() {
  return {
    perfusion: 61,
    oxygenation: 92,
    consciousness: 72,
    urineOutput: 32,
    shockRisk: 32,
    bedsidePresence: true,
    repeatBpCount: 0,
    oxygenApplied: false,
    monitorAttached: false,
    ivChecked: false,
    mentalChecks: 0,
    chargeCalled: false,
    chargeAtBedside: false,
    notifyingDoctor: false,
    notificationTicks: 0,
    waitedTicks: 0,
    leftBedsideTicks: 0,
    updatedCharge: false,
    lastInstruction: "",
  };
}

function isWardWorkflowEpisode() {
  return state.currentEpisode === "wardWorkflow";
}

function createGbsWorkflowState() {
  return {
    respiratoryStrength: 74,
    bulbarFunction: 67,
    autonomicStability: 72,
    weaknessLevel: 42,
    reflexLoss: 44,
    vc: 24,
    etco2: 44,
    abgaChecked: false,
    vcChecked: false,
    coughSwallowChecked: false,
    reflexChecked: false,
    motorChecked: false,
    monitorReviewed: false,
    aspirationPrecaution: false,
    suctionReady: false,
    oxygenApplied: false,
    headOfBedRaised: false,
    chargeCalled: false,
    chargeAtBedside: false,
    icuEscalated: false,
    updatedCharge: false,
    waitedTicks: 0,
    leftBedsideTicks: 0,
    notificationTicks: 0,
    bedsidePresence: true,
  };
}

function isGbsEpisode() {
  return state.currentEpisode === "gbsRespiratory";
}

function recordGbsAssessment(type, label, value, interpretation = "") {
  if (!state.gbsAssessmentRecords) state.gbsAssessmentRecords = [];
  state.gbsAssessmentRecords.unshift({
    minute: state.elapsedMinutes,
    type,
    label,
    value,
    interpretation,
  });
  state.gbsAssessmentRecords = state.gbsAssessmentRecords.slice(0, 12);
  if (state.emrOpened && state.emrTab === "notes") renderEmr();
}

function gbsReadyActions() {
  const gbs = state.gbsWorkflow || {};
  return {
    motor: Boolean(gbs.motorChecked),
    reflex: Boolean(gbs.reflexChecked),
    coughSwallow: Boolean(gbs.coughSwallowChecked),
    vc: Boolean(gbs.vcChecked),
    etco2: Boolean(gbs.monitorReviewed),
    abga: Boolean(gbs.abgaChecked),
    aspiration: Boolean(gbs.aspirationPrecaution),
    suction: Boolean(gbs.suctionReady),
    oxygen: Boolean(gbs.oxygenApplied || state.oxygenApplied),
    charge: Boolean(gbs.chargeCalled),
    updateCharge: Boolean(gbs.updatedCharge),
    bedside: gbs.bedsidePresence && gbs.leftBedsideTicks === 0,
  };
}

function wardWorkflowReadyActions() {
  const ward = state.wardWorkflow || {};
  return {
    repeatBp: ward.repeatBpCount >= 2,
    oxygen: ward.oxygenApplied,
    monitor: ward.monitorAttached || state.monitorOn,
    iv: ward.ivChecked,
    charge: ward.chargeCalled,
    mental: ward.mentalChecks >= 1,
    updateCharge: Boolean(ward.updatedCharge),
    bedside: ward.bedsidePresence && ward.leftBedsideTicks === 0,
  };
}

function wardInstruction() {
  const ward = state.wardWorkflow || createWardWorkflowState();
  const vitals = currentVitals();
  const [systolic = 0] = String(vitals.bp).split("/").map(Number);

  if (vitals.spo2 <= 92 && !ward.oxygenApplied) return "차지: 산소 먼저 주세요. 저는 의사 노티할게요.";
  if (systolic < 94 && ward.repeatBpCount < 2) return "차지: 혈압 다시 재고 IV 라인 확인해주세요.";
  if (!ward.ivChecked) return "차지: 수액 열 수 있게 IV patency 먼저 봐주세요.";
  if (ward.mentalChecks < 2) return "차지: 의식 변화 계속 봐주세요. 보호자는 잠깐 뒤로 물려주세요.";
  return "차지: 좋아요. 저는 의사 노티 중이니 bedside에서 BP, SpO₂, mental 계속 봐주세요.";
}

function wardBedsideFollowUpComplete(actions = wardWorkflowReadyActions()) {
  return actions.charge &&
    actions.repeatBp &&
    actions.oxygen &&
    actions.monitor &&
    actions.iv &&
    actions.mental &&
    actions.updateCharge &&
    actions.bedside;
}

function refreshBedsidePhysiologyDisplay() {
  updateClinicalUrgency();
  renderVitals();
  renderPatientStatus();
  renderLogs();
  if (state.contextWindowType) refreshActiveContextWindow();
  window.update3D?.(state, state.monitorOn ? currentVitals() : null);
  if (!ecgProcedureOverlayEl?.hidden) renderEcgMonitoringOverlay("review");
}

function wardAction(action) {
  if (!state.wardWorkflow) state.wardWorkflow = createWardWorkflowState();
  const ward = state.wardWorkflow;
  ward.bedsidePresence = action !== "leftBedside";

  if (action === "mentalCheck") {
    ward.mentalChecks += 1;
    ward.consciousness = clamp(ward.consciousness + 4, 0, 100);
    ward.shockRisk = clamp(ward.shockRisk - 2, 0, 100);
    state.patientStatus.cooperation = clamp(state.patientStatus.cooperation + 2, 0, 100);
  }

  if (action === "repeatBp") {
    ward.repeatBpCount += 1;
    ward.perfusion = clamp(ward.perfusion + 4, 0, 100);
    ward.shockRisk = clamp(ward.shockRisk - 3, 0, 100);
  }

  if (action === "monitor") {
    ward.monitorAttached = true;
    state.monitorOn = true;
    state.ekgAttached = true;
    ward.shockRisk = clamp(ward.shockRisk - 2, 0, 100);
  }

  if (action === "oxygen") {
    ward.oxygenApplied = true;
    state.oxygenApplied = true;
    state.monitorOn = true;
    state.ekgAttached = true;
    ward.oxygenation = clamp(ward.oxygenation + 7, 0, 100);
    ward.shockRisk = clamp(ward.shockRisk - 4, 0, 100);
    state.patientStatus.breathing = clamp(state.patientStatus.breathing - 5, 0, 100);
    state.patientStatus.anxiety = clamp(state.patientStatus.anxiety - 3, 0, 100);
  }

  if (action === "ivCheck") {
    ward.ivChecked = true;
    ward.perfusion = clamp(ward.perfusion + 6, 0, 100);
    ward.shockRisk = clamp(ward.shockRisk - 5, 0, 100);
  }

  if (action === "chargeCalled") {
    ward.chargeCalled = true;
    ward.chargeAtBedside = true;
    ward.notifyingDoctor = true;
    ward.lastInstruction = wardInstruction();
    addLog(ward.lastInstruction, "good");
  }

  if (action === "leftBedside") {
    ward.leftBedsideTicks += 1;
    ward.bedsidePresence = false;
    ward.shockRisk = clamp(ward.shockRisk + 10, 0, 100);
    ward.oxygenation = clamp(ward.oxygenation - 3, 0, 100);
    ward.perfusion = clamp(ward.perfusion - 4, 0, 100);
  }

  if (action === "waited") {
    ward.waitedTicks += 1;
    ward.shockRisk = clamp(ward.shockRisk + 8, 0, 100);
    ward.oxygenation = clamp(ward.oxygenation - 2, 0, 100);
    ward.consciousness = clamp(ward.consciousness - 3, 0, 100);
  }

  if (action === "updateCharge") {
    ward.updatedCharge = true;
    ward.shockRisk = clamp(ward.shockRisk - 2, 0, 100);
    ward.lastInstruction = "차지: 업데이트 확인했어요. 그 상태 그대로 보고할게요. 환자 곁에서 계속 BP와 SpO₂ 봐주세요.";
    addLog(ward.lastInstruction, "good");
  }

  if (action !== "updateCharge") ward.lastInstruction = ward.chargeCalled ? wardInstruction() : ward.lastInstruction;
  refreshBedsidePhysiologyDisplay();

  if (ward.notifyingDoctor && wardBedsideFollowUpComplete()) {
    setWardOutcome("stabilized", "차지 노티 중 repeat BP, 산소, 모니터, IV 확인, mental reassessment와 최신 상태 업데이트를 이어갔습니다.", [
      "차지 호출 후 bedside 역할 유지",
      "repeat BP/SpO₂/mental 재사정 수행",
      "IV와 산소 준비 완료",
      "최신 상태를 차지에게 업데이트",
    ]);
  }
}

function ensureChargeFollowUp() {
  if (!state.chargeFollowUp) {
    state.chargeFollowUp = {
      active: false,
      pain: false,
      vitals: false,
      monitor: false,
      oxygen: false,
      updateCharge: false,
      waited: 0,
    };
  }

  return state.chargeFollowUp;
}

function chargeFollowUpReadyCount() {
  const followUp = ensureChargeFollowUp();
  return ["pain", "vitals", "monitor", "oxygen", "updateCharge"].filter((key) => followUp[key]).length;
}

function chargeFollowUpAction(action) {
  const followUp = ensureChargeFollowUp();
  followUp.active = true;

  if (action === "waited") {
    followUp.waited += 1;
    applyPatientImpact({ anxiety: 4, breathing: 3 });
    if (isWardWorkflowEpisode() && state.wardWorkflow) {
      state.wardWorkflow.shockRisk = clamp(state.wardWorkflow.shockRisk + 8, 0, 100);
      state.wardWorkflow.oxygenation = clamp(state.wardWorkflow.oxygenation - 2, 0, 100);
    }
    refreshBedsidePhysiologyDisplay();
    if (followUp.waited >= 2) {
      setPatientOutcome("deteriorated", "차지 노티 중 bedside 재사정이 지연되었습니다.", [
        "노티 중 repeat BP/SpO₂ 확인 지연",
        "환자 곁에서 지속 관찰 부족",
      ]);
    }
    return;
  }

  followUp[action] = true;

  if (action === "vitals") {
    markAssessmentComplete("vitals");
    addPostPrnReassessmentLog("vitals");
    if (isWardWorkflowEpisode() && state.wardWorkflow) wardAction("repeatBp");
  }

  if (action === "pain") {
    markAssessmentComplete("pain");
    addPostPrnReassessmentLog("pain");
    if (isWardWorkflowEpisode() && state.wardWorkflow) wardAction("mentalCheck");
  }

  if (action === "monitor") {
    markAssessmentComplete("ecgReview");
    addPostPrnReassessmentLog("ecgReview");
    state.monitorOn = true;
    state.ekgAttached = true;
    if (isWardWorkflowEpisode() && state.wardWorkflow) wardAction("monitor");
  }

  if (action === "oxygen") {
    state.oxygenApplied = true;
    state.monitorOn = true;
    state.ekgAttached = true;
    beginFollowUpObservation("oxygen", "Low-flow oxygen");
    applyPatientImpact({ breathing: -4, anxiety: -2 });
    if (isWardWorkflowEpisode() && state.wardWorkflow) wardAction("oxygen");
  }

  if (action === "updateCharge" && isWardWorkflowEpisode() && state.wardWorkflow) {
    state.wardWorkflow.shockRisk = clamp(state.wardWorkflow.shockRisk - 2, 0, 100);
  }

  refreshBedsidePhysiologyDisplay();

  if (chargeFollowUpReadyCount() >= 4) {
    const outcome = sbarOutcomeForTrajectory(getClinicalTrajectory());
    setPatientOutcome(outcome.type, "차지 노티 중 bedside 재사정과 최신 상태 업데이트를 이어갔습니다.", [
      "차지 SBAR 후 bedside follow-up 수행",
      ...outcome.details,
    ]);
  }
}

function choose(action) {
  if (action.reset) {
    if (isGbsEpisode()) {
      setupGbsEpisode();
      state.stage = "gbsIntro";
      render();
      return;
    }
    if (isWardWorkflowEpisode()) {
      setupWardWorkflowEpisode();
      state.stage = "wardIntro";
      render();
      return;
    }
    resetGame();
    render();
    return;
  }

  applyScore(action.score);
  applyPatientImpact(action.patient);

  if (action.log) {
    addLog(action.log, action.tone);
  }

  if (action.effect) {
    action.effect();
  }

  if (state.outcome) return;

  state.stage = action.next;
  render();
}



const assessmentLabels = {
  pain: "Pain assessment",
  vitals: "Vital signs",
  consciousness: "Consciousness assessment",
  ecgReview: "ECG review",
  history: "Patient history",
  respiratory: "Respiratory assessment",
  perfusion: "Peripheral perfusion",
  skin: "Skin assessment",
};

const postPrnReassessmentLabels = {
  pain: "PRN 후 통증 재사정",
  vitals: "PRN 후 활력징후 재사정",
  ecgReview: "PRN 후 ECG 확인",
};

function ensurePostPrnReassessment() {
  if (!state.postPrnReassessment) {
    state.postPrnReassessment = {
      pain: false,
      vitals: false,
      ecgReview: false,
    };
  }
}

function recordPostPrnReassessment(key) {
  ensurePostPrnReassessment();

  if (state.stage !== "persistentSymptoms" || state.prnMedicationsGiven.length === 0 || !key) return false;
  if (state.postPrnReassessment[key]) return false;

  state.postPrnReassessment[key] = true;
  applyScore({ safety: 1, clinical: 1, protocol: 1 });
  return true;
}

function missingPostPrnReassessmentLabels() {
  ensurePostPrnReassessment();
  if (state.prnMedicationsGiven.length === 0) return [];

  return Object.entries(postPrnReassessmentLabels)
    .filter(([key]) => !state.postPrnReassessment[key])
    .map(([, label]) => label);
}

function ensureFollowUpObservation() {
  if (!state.followUpObservation) {
    state.followUpObservation = {
      active: false,
      interventions: {},
      lastCueMinute: -1,
      cues: {},
    };
  }
  if (!state.followUpObservation.interventions) state.followUpObservation.interventions = {};
  if (!state.followUpObservation.cues) state.followUpObservation.cues = {};
  return state.followUpObservation;
}

function beginFollowUpObservation(type, label) {
  const followUp = ensureFollowUpObservation();
  followUp.active = true;
  followUp.interventions[type] = {
    label,
    startedMinute: state.elapsedMinutes,
    lastObservedMinute: state.elapsedMinutes,
  };
  followUp.lastCueMinute = Math.max(-1, state.elapsedMinutes - 1);
}

function minutesSinceFollowUp(type) {
  const intervention = ensureFollowUpObservation().interventions[type];
  if (!intervention) return null;
  return Math.max(0, state.elapsedMinutes - intervention.startedMinute);
}

function hasFollowUpIntervention(type) {
  return Boolean(ensureFollowUpObservation().interventions[type]);
}

function patientConditionSnapshot() {
  const vitals = currentVitals();
  const [systolic = 0, diastolic = 0] = String(vitals.bp).split("/").map(Number);

  return {
    pain: Number(state.patientStatus.pain),
    anxiety: Number(state.patientStatus.anxiety),
    breathing: Number(state.patientStatus.breathing),
    hr: Number(vitals.hr),
    spo2: Number(vitals.spo2),
    rr: Number(vitals.rr),
    systolic,
    diastolic,
  };
}

function formatValueChange(label, before, after, unit = "") {
  if (!Number.isFinite(before) || !Number.isFinite(after)) return label + " 확인됨";
  return label + " " + Math.round(before) + unit + "→" + Math.round(after) + unit;
}

function trendWord(delta, lowerIsBetter = true, threshold = 1) {
  if (Math.abs(delta) < threshold) return "큰 변화 없음";
  const improved = lowerIsBetter ? delta < 0 : delta > 0;
  return improved ? "개선" : "악화";
}

function patientSubjectiveResponse(snapshot = patientConditionSnapshot()) {
  const baseline = state.interventionBaseline;

  if (snapshot.spo2 <= 90 || snapshot.breathing >= 82) return "환자는 짧은 문장으로 답하며 숨이 차다고 말한다.";
  if (snapshot.pain >= 8) return "환자는 가슴이 다시 세게 눌리는 느낌이라고 표현한다.";
  if (baseline && snapshot.pain <= baseline.pain - 2 && snapshot.spo2 >= baseline.spo2) return "환자는 약 투여 후 가슴 압박감이 덜하고 숨도 조금 편하다고 말한다.";
  if (baseline && snapshot.pain < baseline.pain && snapshot.pain >= 5) return "환자는 조금 덜하지만 묵직함은 아직 남아 있다고 말한다.";
  if (baseline && snapshot.spo2 > baseline.spo2 && snapshot.breathing < baseline.breathing) return "환자는 산소 적용 후 숨쉬기가 한결 편하다고 말한다.";
  if (snapshot.anxiety <= 48) return "환자는 표정이 누그러지고 대답이 조금 차분해졌다.";
  if (snapshot.anxiety >= 82) return "환자는 계속 불안해하며 지금 상태가 위험한지 묻는다.";
  return "환자는 아직 답답함이 남아 있지만 질문에는 협조적으로 답한다.";
}

function reassessmentChangeSummary(key) {
  const current = patientConditionSnapshot();
  const baseline = state.interventionBaseline || state.lastReassessmentSnapshot || current;
  const parts = [];

  if (key === "pain") {
    parts.push(formatValueChange("통증", baseline.pain, current.pain, "/10"));
    parts.push("통증 추세 " + trendWord(current.pain - baseline.pain, true, 0.6));
  }

  if (key === "vitals") {
    parts.push(formatValueChange("HR", baseline.hr, current.hr));
    parts.push(formatValueChange("SpO₂", baseline.spo2, current.spo2, "%"));
    parts.push(formatValueChange("SBP", baseline.systolic, current.systolic));
    parts.push("산소화 " + trendWord(current.spo2 - baseline.spo2, false, 1));
  }

  if (key === "ecgReview") {
    parts.push("ECG strip은 지속 모니터 중이며 HR " + current.hr + ", SpO₂ " + current.spo2 + "%와 함께 해석했다");
    parts.push(state.urgency?.level === "severe" || state.urgency?.level === "critical" ? "불안정 추세가 남아 보고 필요성이 높다" : "즉각적인 악화 신호는 줄었지만 관찰이 필요하다");
  }

  if (key !== "ecgReview") {
    parts.push("호흡 " + breathingLabel(current.breathing));
  }

  parts.push(patientSubjectiveResponse(current));
  state.lastReassessmentSnapshot = current;
  return parts.join(" · ");
}

function addPostPrnReassessmentLog(key) {
  ensurePostPrnReassessment();
  if (state.stage !== "persistentSymptoms" || state.prnMedicationsGiven.length === 0 || !key) return;

  const firstReassessment = !state.postPrnReassessment[key];
  if (firstReassessment) {
    recordPostPrnReassessment(key);
    addLog("PRN 후 재사정: " + postPrnReassessmentLabels[key] + " - " + reassessmentChangeSummary(key), "good");
    tryResolveStableTreatmentOutcome();
    return;
  }

  applyScore({ clinical: 1 });
  addLog("추적 재사정: " + postPrnReassessmentLabels[key] + " - " + reassessmentChangeSummary(key), "good");
  tryResolveStableTreatmentOutcome();
}

function addPostPrnRequiredLog(missing) {
  addLog("PRN 후 재사정 필요: " + missing.join(", ") + " 필요.", "warning");
}

function patientHistoryReviewed() {
  return requiredHistoryQuestions().every((question) => state.askedQuestions.includes(question.id));
}

function missingAssessmentLabels(requirements = []) {
  return requirements
    .filter((requirement) => (requirement === "history" ? !patientHistoryReviewed() : !isAssessmentComplete(requirement)))
    .map((requirement) => assessmentLabels[requirement] || requirement);
}

function actionGateFor(target, actionId) {
  if (target === "patient" && actionId === "applyOxygen") {
    return { requirements: ["vitals"] };
  }

  if (target === "medication" && (actionId === "prepareNitro" || actionId === "prepareMorphine")) {
    return { requirements: ["pain"] };
  }

  return { requirements: [] };
}

function lockedActionInfo(target, actionId) {
  const gate = actionGateFor(target, actionId);
  const missing = missingAssessmentLabels(gate.requirements);
  return {
    locked: missing.length > 0,
    missing,
  };
}

function addAssessmentRequiredLog(missing, actionLabel = "수행") {
  addLog(`사정 필요: ${actionLabel} 전 ${missing.join(", ")} 필요.`, "warning");
}

function actionRequiresVitals(action) {
  return action?.label?.includes("산소");
}

function guardedChoose(action) {
  if (actionRequiresVitals(action) && !isAssessmentComplete("vitals")) {
    addAssessmentRequiredLog([assessmentLabels.vitals], action.label);
    render();
    return false;
  }

  if (action?.next === "sbarBuild") {
    const missingAssessments = missingAssessmentLabels(["vitals", "history"]);

    if (missingAssessments.length > 0) {
      addAssessmentRequiredLog(missingAssessments, action.label);
      render();
      return false;
    }

    const missingReassessment = missingPostPrnReassessmentLabels();

    if (missingReassessment.length > 0) {
      addPostPrnRequiredLog(missingReassessment);
      render();
      return false;
    }
  }

  choose(action);
  return true;
}


const bedsideTools = {
  stethoscope: {
    label: "청진기",
    validTargets: ["patient"],
    hint: "환자 흉부에 사용해 호흡음을 사정합니다.",
  },
  pulseOx: {
    label: "Pulse Ox",
    validTargets: ["patient"],
    hint: "환자 손에 사용해 SpO₂와 pulse를 확인합니다.",
  },
  oxygenMask: {
    label: "O2 마스크",
    validTargets: ["patient", "wallOxygen"],
    hint: "환자 얼굴 또는 벽 산소 아웃렛에 적용해 산소화를 돕습니다.",
  },
  syringe: {
    label: "주사기",
    validTargets: ["medication", "patient"],
    hint: "IV medication 준비와 IV 투여에만 사용합니다. Nitroglycerin 설하 투여에는 사용하지 않습니다.",
  },
};

function renderToolSelection() {
  toolButtons.forEach((button) => {
    const active = button.dataset.tool === state.activeTool;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function selectTool(toolId) {
  state.activeTool = state.activeTool === toolId ? null : toolId;
  renderToolSelection();
  closeClinicalInteractionMenu();

  const tool = bedsideTools[state.activeTool];
  addLog(tool ? `도구 선택: ${tool.label}. ${tool.hint}` : "도구 선택을 해제했습니다.");
  renderLogs();
}

function clearActiveTool() {
  state.activeTool = null;
  renderToolSelection();
}

function invalidToolTarget(tool, target) {
  addLog(`사용할 수 없는 대상입니다: 이 도구는 해당 위치에 적용할 수 없습니다.`, "warning");
  renderLogs();
}

function useStethoscopeOnPatient() {
  handlePatientAssessmentFinding("breathingEffort");
  addLog("청진 사정: 호흡 " + breathingLabel(state.patientStatus.breathing) + ", RR " + currentVitals().rr + "/min. " + patientSubjectiveResponse(), "good");
  renderLogs();
  clearActiveTool();
}

function usePulseOxOnPatient() {
  const vitals = currentVitals();
  const firstUse = markAssessmentFinding(`pulse-ox-${state.stage}`);

  if (completeVitalsAssessment(`Pulse Ox 확인 완료. SpO₂ ${vitals.spo2}%, 맥박 ${vitals.hr}`, firstUse ? { safety: 2, clinical: 2 } : {})) {
    clearActiveTool();
    return;
  }

  markAssessmentComplete("vitals");
  addPostPrnReassessmentLog("vitals");
  revealPatientInfo({ breathing: true });
  applyScore(firstUse ? { safety: 2, clinical: 2 } : {});
  addLog(`Pulse Ox 확인 완료. SpO₂ ${vitals.spo2}%, 맥박 ${vitals.hr}.`, firstUse ? "good" : "warning");
  render();
  clearActiveTool();
}

function useOxygenMaskOnPatient() {
  if (isWardWorkflowEpisode() && state.wardWorkflow) {
    performWardObjectAction("wardOxygen");
    clearActiveTool();
    return;
  }
  if (isGbsEpisode() && state.gbsWorkflow) {
    gbsAction("oxygen");
    applyScore({ safety: 2, clinical: 1 });
    clearActiveTool();
    return;
  }

  const missing = missingAssessmentLabels(["vitals"]);

  if (missing.length > 0) {
    addAssessmentRequiredLog(missing, "Oxygen Mask");
    renderLogs();
    return;
  }

  applyOxygenIntervention();
  clearActiveTool();
}

function selectedMedicationOrder() {
  return patient.prnOrders.find((order) => order.id === state.medicationWorkflow?.selectedOrderId) || null;
}

function medicationRouteProfile(order) {
  if (!order) return null;
  if (order.administration === "ivSyringe") {
    return {
      route: "IV",
      label: "IV syringe administration",
      prepLabel: "Syringe preparation",
      prepDetail: "주사기 도구로 IV push 약물을 준비",
      administrationDetail: "주사기 도구를 환자에게 적용",
      reassessment: "투여 후 pain, RR, SpO2, sedation을 재사정",
      requiresSyringe: true,
    };
  }

  return {
    route: "SL",
    label: "Sublingual bedside administration",
    prepLabel: "Route check",
    prepDetail: "설하 투여: 주사기 불필요",
    administrationDetail: "환자에게 설하 tablet/spray로 직접 투여",
    reassessment: "투여 후 pain, BP, HR, SpO2를 재사정",
    requiresSyringe: false,
  };
}

function medicationRequiresSyringe(order) {
  return Boolean(medicationRouteProfile(order)?.requiresSyringe);
}

function resetMedicationWorkflow(keepSelection = false) {
  const selectedOrderId = keepSelection ? state.medicationWorkflow?.selectedOrderId || null : null;
  state.medicationWorkflow = {
    selectedOrderId,
    prepared: false,
    doseVerified: false,
    syringeReady: false,
    verifiedDose: "",
  };
}

function prepareMedicationOrder(orderId) {
  const order = patient.prnOrders.find((item) => item.id === orderId);

  if (!order) return false;

  if (state.stage !== "prnDecision") {
    addLog(order.label + ": PRN 투여는 정규 처방 적용과 재사정 후 판단합니다.", "warning");
    render();
    return false;
  }

  if (state.prnMedicationsGiven.includes(order.id)) {
    addLog("이미 투여된 medication입니다: " + order.label, "warning");
    render();
    return false;
  }

  state.medicationWorkflow = {
    selectedOrderId: order.id,
    prepared: true,
    doseVerified: false,
    syringeReady: false,
    verifiedDose: "",
  };
  const firstPrep = markAssessmentFinding("med-prep-" + order.id);
  applyScore(firstPrep ? { safety: 1, protocol: 1 } : {});
  addLog("투약 카트: " + order.label + "를 꺼내 " + medicationRouteProfile(order).label + " 경로를 확인했습니다.", firstPrep ? "good" : "warning");
  render();
  return true;
}

function verifyMedicationDose(doseValue) {
  const order = selectedMedicationOrder();

  if (!order || !state.medicationWorkflow?.prepared) {
    addLog("투약 확인 전 PRN medication을 먼저 준비하세요.", "warning");
    render();
    return false;
  }

  const dose = Number(doseValue);

  if (!Number.isFinite(dose)) {
    addLog(order.label + " 투여 전 dose 입력이 필요합니다.", "warning");
    render();
    return false;
  }

  if (Math.abs(dose - order.correctDose) > 0.001) {
    addLog("잘못된 dose: " + dose + " " + order.unit + ". 투약을 진행할 수 없습니다.", "bad");
    applyScore({ safety: -6, clinical: -4, protocol: -6 });
    applyPatientImpact({ pain: 2, anxiety: 5 });
    render();
    return false;
  }

  const firstCheck = markAssessmentFinding("med-verify-" + order.id);
  state.medicationWorkflow.doseVerified = true;
  state.medicationWorkflow.verifiedDose = String(dose);
  applyScore(firstCheck ? { safety: 3, protocol: 2 } : {});
  addLog("투약 확인 완료: " + order.label + ", dose " + dose + " " + order.unit + ", route " + medicationRouteProfile(order).route + ", allergy, 처방, indication을 확인했습니다.", firstCheck ? "good" : "warning");
  render();
  return true;
}

function useSyringeOnMedicationCart() {
  const order = selectedMedicationOrder();

  if (!order || !state.medicationWorkflow?.prepared) {
    addLog("주사기 준비 전 투약 카트에서 IV PRN medication을 먼저 선택하세요.", "warning");
    renderLogs();
    clearActiveTool();
    return;
  }

  if (!medicationRequiresSyringe(order)) {
    addLog(order.label + ": " + medicationRouteProfile(order).label + " 경로입니다. 주사기 준비 없이 투약 카트 창에서 설하 투여를 진행하세요.", "warning");
    renderLogs();
    clearActiveTool();
    return;
  }

  if (!state.medicationWorkflow.doseVerified) {
    addLog("IV 주사기 준비 전 dose와 투약 5원칙을 확인하세요.", "warning");
    renderLogs();
    clearActiveTool();
    return;
  }

  state.medicationWorkflow.syringeReady = true;
  addLog("IV 주사기 준비 완료: " + order.label + " " + state.medicationWorkflow.verifiedDose + " " + order.unit + ". 이제 주사기 도구를 환자에게 적용해 IV 투여하세요.", "good");
  render();
  clearActiveTool();
}

function administerPreparedNitroSublingual() {
  const order = selectedMedicationOrder();

  if (!order || !state.medicationWorkflow?.prepared) {
    addLog("설하 투여할 PRN medication이 선택되지 않았습니다. 투약 카트에서 Nitroglycerin을 먼저 선택하세요.", "warning");
    render();
    return false;
  }

  if (medicationRequiresSyringe(order)) {
    addLog(order.label + ": IV medication입니다. dose 확인 후 주사기 도구로 준비하고 환자에게 투여하세요.", "warning");
    render();
    return false;
  }

  if (!state.medicationWorkflow.doseVerified) {
    addLog("설하 투여 전 dose, BP, indication, contraindication을 확인하세요.", "warning");
    render();
    return false;
  }

  const missingAssessments = missingAssessmentLabels(["pain"]);

  if (missingAssessments.length > 0) {
    addAssessmentRequiredLog(missingAssessments, order.label);
    render();
    return false;
  }

  if (state.prnMedicationsGiven.includes(order.id)) {
    addLog("이미 투여된 medication입니다: " + order.label, "warning");
    render();
    return false;
  }

  administerPrnMedication(order, state.medicationWorkflow.verifiedDose);
  addLog("설하 투여 완료: 혀 밑 tablet/spray 투여 후 BP, pain, HR 변화를 재사정하세요.", "good");
  renderLogs();
  return true;
}

function administerPreparedMedicationAtBedside() {
  const order = selectedMedicationOrder();

  if (!order || !state.medicationWorkflow?.prepared) {
    addLog("환자에게 투여할 준비된 medication이 없습니다. 투약 카트에서 먼저 준비하세요.", "warning");
    renderLogs();
    clearActiveTool();
    return;
  }

  if (!medicationRequiresSyringe(order)) {
    addLog(order.label + ": 설하 medication입니다. 주사기 도구가 아니라 투약 카트 창의 설하 투여 버튼으로 투여하세요.", "warning");
    renderLogs();
    clearActiveTool();
    return;
  }

  if (!state.medicationWorkflow.doseVerified || !state.medicationWorkflow.syringeReady) {
    addLog("IV 환자 투여 전 dose verification과 syringe preparation이 필요합니다.", "warning");
    renderLogs();
    clearActiveTool();
    return;
  }

  const missingAssessments = missingAssessmentLabels(["pain"]);

  if (missingAssessments.length > 0) {
    addAssessmentRequiredLog(missingAssessments, order.label);
    render();
    clearActiveTool();
    return;
  }

  if (state.prnMedicationsGiven.includes(order.id)) {
    addLog("이미 투여된 medication입니다: " + order.label, "warning");
    renderLogs();
    clearActiveTool();
    return;
  }

  administerPrnMedication(order, state.medicationWorkflow.verifiedDose);
  addLog("IV 투여 후 관찰: 통증, RR, SpO2, sedation, ECG waveform을 재사정하세요.", "good");
  renderLogs();
  clearActiveTool();
}

function sbarReadinessSummary() {
  const items = [
    { key: "history", label: "흉통 문진", done: patientHistoryReviewed() },
    { key: "vitals", label: "활력징후", done: isAssessmentComplete("vitals") || state.monitorOn },
    { key: "monitor", label: "ECG/모니터 확인", done: isAssessmentComplete("ecgReview") || state.ekgAttached || state.monitorOn },
    { key: "findings", label: "환자 사정 소견", done: patientFindingsList().length >= 2 || state.knownPatientInfo.pain || state.knownPatientInfo.breathing },
    {
      key: "interventions",
      label: "중재 시도",
      done: state.oxygenApplied || state.prnMedicationsGiven.length > 0 || state.appliedRegularOrders.length > 0,
    },
    {
      key: "urgency",
      label: "보고 필요성",
      done: ["moderate", "severe", "critical"].includes(state.urgency?.level) || state.stage === "persistentSymptoms" || state.prnMedicationsGiven.length > 0,
    },
  ];
  const completed = items.filter((item) => item.done).length;
  const score = Math.round((completed / items.length) * 100);
  const escalationNeeded = items.find((item) => item.key === "urgency")?.done || false;
  const strength = score >= 80 ? "강함" : score >= 50 ? "보완 필요" : "부족";
  return { items, completed, total: items.length, score, escalationNeeded, strength };
}

function closePhysicianContact() {
  if (!physicianContactEl) return;
  physicianContactEl.hidden = true;
  physicianContactEl.innerHTML = "";
}

function beginSbarFromCommunicationDevice() {
  closePhysicianContact();
  const readiness = sbarReadinessSummary();
  if (!readiness.escalationNeeded) {
    addLog("차지 호출: 즉시 노티할 근거가 약합니다. 사정과 모니터링 자료를 보완하세요.", "warning");
  } else if (readiness.score < 80) {
    addLog("차지 호출: SBAR 보고를 시작하지만 일부 임상 자료가 부족합니다.", "warning");
  } else {
    addLog("차지 호출: SBAR 보고 준비가 충분합니다. 차지가 담당의 노티를 준비합니다.", "good");
  }
  state.stage = "sbarBuild";
  render();
}

function openPhysicianContact() {
  if (!physicianContactEl) return;
  syncCompletedAssessments();
  updateClinicalUrgency();
  const readiness = sbarReadinessSummary();
  const urgencyText = state.urgency?.label || "낮음";
  const list = readiness.items
    .map((item) => {
      const status = item.done ? "확보" : "부족";
      const className = item.done ? "done" : "missing";
      return "<li class=\"" + className + "\"><span>" + status + "</span>" + item.label + "</li>";
    })
    .join("");
  physicianContactEl.hidden = false;
  physicianContactEl.innerHTML =
    "<section class=\"physician-contact-card " + (readiness.escalationNeeded ? "ready" : "not-ready") + "\">" +
    "<header><span>차지 간호사</span><button type=\"button\" data-contact-close aria-label=\"차지 간호사 창 닫기\">닫기</button></header>" +
    "<strong>" + (readiness.escalationNeeded ? "차지가 bedside로 와서 보고를 받습니다" : "차지: 보고 전 근거를 조금 더 모아주세요") + "</strong>" +
    "<p>현재 urgency: " + urgencyText + ". 차지에게 전달할 SBAR 준비도는 " + readiness.strength + " (" + readiness.completed + "/" + readiness.total + ")입니다. 차지는 보고를 듣고 담당의 노티를 진행합니다.</p>" +
    "<ul>" + list + "</ul>" +
    "<div class=\"physician-contact-actions\"><button type=\"button\" class=\"primary\" data-contact-sbar>차지에게 SBAR 보고</button><button type=\"button\" data-contact-close>침상 사정 계속</button></div>" +
    "</section>";
  physicianContactEl.querySelectorAll("[data-contact-close]").forEach((button) => {
    button.addEventListener("click", closePhysicianContact);
  });
  physicianContactEl.querySelector("[data-contact-sbar]")?.addEventListener("click", beginSbarFromCommunicationDevice);
  addLog("차지 간호사 호출: SBAR 보고 준비도를 확인했습니다.", readiness.escalationNeeded ? "good" : "warning");
}
function handleToolTarget(toolId, target) {
  const tool = bedsideTools[toolId];
  if (!tool) return false;

  if (!tool.validTargets.includes(target)) {
    invalidToolTarget(tool, target);
    return true;
  }

  if (toolId === "stethoscope") useStethoscopeOnPatient();
  if (toolId === "pulseOx") usePulseOxOnPatient();
  if (toolId === "oxygenMask" && (target === "patient" || target === "wallOxygen")) useOxygenMaskOnPatient();
  if (toolId === "syringe" && target === "medication") useSyringeOnMedicationCart();
  if (toolId === "syringe" && target === "patient") administerPreparedMedicationAtBedside();

  return true;
}

function handleClinicalTargetClick(target) {
  if (entryFlowActive()) {
    addLog("인계와 차트 확인을 마친 뒤 침상 상호작용을 시작합니다.", "warning");
    return true;
  }

  if (state.activeTool) {
    handleToolTarget(state.activeTool, target);
    return true;
  }

  if (!state.activeTool && target === "emr") {
    openEmr(isGbsEpisode() ? "notes" : "summary");
    return true;
  }

  if (!state.activeTool && target === "monitor") {
    if (!state.monitorOn && !state.ekgAttached) {
      if (isGbsEpisode() || isWardWorkflowEpisode()) {
        state.monitorOn = true;
        state.ekgAttached = true;
      } else {
        startBedsideEcgWorkflow("침상 모니터 클릭");
        return true;
      }
    }
    renderEcgMonitoringOverlay("review");
    return true;
  }

  if (isGbsEpisode() && ["patient", "monitor", "iv", "charge", "communication", "wallOxygen", "wallSuction", "emr", "chart"].includes(target)) {
    return false;
  }

  if (isWardWorkflowEpisode() && ["patient", "monitor", "iv", "charge", "communication", "wallOxygen"].includes(target)) {
    return false;
  }

  if (!state.activeTool && target === "medication" && state.stage === "prnDecision") {
    renderMedicationContextWindow();
    return true;
  }

  if (!state.activeTool && target === "communication") {
    openPhysicianContact();
    return true;
  }

  return false;
}

toolButtons.forEach((button) => {
  button.addEventListener("click", () => selectTool(button.dataset.tool));
});

window.handleClinicalTargetClick = handleClinicalTargetClick;

const clinicalInteractionMenus = {
  patient: {
    title: "환자",
    role: "대화, 통증 사정, 호흡/순환 상태를 직접 확인합니다.",
    actions: [
      { id: "history", label: "흉통 문진", mode: "conversation" },
      { id: "symptomDialogue", label: "현재 증상 묻기" },
      { id: "reassure", label: "안심시키고 호흡 코칭" },
      { id: "applyOxygen", label: "저유량 산소 적용" },
      { id: "pain", label: "통증 사정", assessment: "pain" },
      { id: "breathingEffort", label: "호흡 노력 사정", assessment: "respiratory" },
      { id: "skinPerfusion", label: "피부와 식은땀 확인", assessment: "skin" },
      { id: "radialPulse", label: "요골맥박 촉지", assessment: "perfusion" },
      { id: "vitals", label: "활력징후 확인", assessment: "vitals" },
      { id: "consciousness", label: "의식 상태 사정", assessment: "consciousness" },
    ],
  },
  monitor: {
    title: "침상 모니터",
    role: "ECG waveform, rhythm, HR, SpO2, BP 변화를 관찰합니다.",
    actions: [
      { id: "startEcgWorkflow", label: "ECG 모니터링 켜기" },
      { id: "expandEcg", label: "ECG strip 관찰", assessment: "ecgReview" },
      { id: "checkVitals", label: "모니터 활력징후 확인", assessment: "vitals" },
      { id: "analyzeWaveform", label: "리듬/파형 해석", assessment: "ecgReview" },
    ],
  },
  medication: {
    title: "투약 카트",
    role: "PRN 약물 route 확인, SL 투여, IV 주사기 준비를 구분합니다.",
    actions: [
      { id: "prepareNitro", label: "Nitroglycerin 꺼내기" },
      { id: "prepareMorphine", label: "Morphine 꺼내기" },
      { id: "verifyMedication", label: "5원칙/dose 확인" },
    ],
  },
  emr: {
    title: "EMR",
    role: "진단, 검사, 처방, 투약 기록을 확인합니다.",
    actions: [
      { id: "openSummary", label: "환자 요약 열기" },
      { id: "openLabs", label: "검사 결과 확인" },
      { id: "openRegularMedication", label: "정규 약물 투여" },
      { id: "openPrnMedication", label: "PRN 약물 투여" },
      { id: "openOrders", label: "전체 처방 보기" },
      { id: "openMeds", label: "투약기록 확인" },
      { id: "openNotes", label: "간호기록 확인" },
    ],
  },
  chart: {
    title: "차트",
    role: "처방과 검사 근거를 빠르게 확인합니다.",
    actions: [
      { id: "regularMedication", label: "정규 약물 투여" },
      { id: "prnMedication", label: "PRN 약물 투여" },
      { id: "reviewOrders", label: "전체 처방 보기" },
      { id: "reviewLabs", label: "검사 확인" },
    ],
  },
  iv: {
    title: "IV 라인",
    role: "수액 연결 가능성, 막힘/부종, line patency를 bedside에서 확인합니다.",
    actions: [
      { id: "wardIvCheck", label: "IV patency 확인하고 수액 라인 준비" },
    ],
  },
  charge: {
    title: "차지 간호사",
    role: "차지에게 상황을 보고하고, 의사 노티 중 최신 bedside 상태를 업데이트합니다.",
    actions: [
      { id: "wardCallCharge", label: "HR/BP/SpO₂ 추세를 묶어 보고" },
      { id: "wardUpdateCharge", label: "최신 BP/SpO₂/의식 변화 업데이트" },
    ],
  },
  communication: {
    title: "연락 장비",
    role: "차지 간호사를 부르거나 SBAR 보고를 시작합니다.",
    actions: [
      { id: "wardCallCharge", label: "차지 호출" },
      { id: "openSbar", label: "차지 SBAR 보고" },
    ],
  },
};

const wardClinicalInteractionMenus = {
  patient: {
    title: "환자 bedside 사정",
    role: "환자의 반응, 의식, 피부/말초순환, 산소 적용 반응을 직접 확인합니다.",
    actions: [
      { id: "wardMentalCheck", label: "의식 변화와 피부/말초순환 재사정" },
      { id: "wardOxygen", label: "산소 적용하고 SpO₂ 반응 확인" },
    ],
  },
  monitor: {
    title: "침상 모니터",
    role: "이미 연결된 bedside monitor의 HR, NIBP, SpO₂ pleth와 ECG 파형을 근거로 판단합니다.",
    actions: [
      { id: "wardRepeatBp", label: "repeat BP 측정" },
      { id: "wardMonitor", label: "ECG/SpO₂ 파형과 BP downtrend 읽기" },
      { id: "expandEcg", label: "모니터 화면 확대 관찰" },
    ],
  },
  iv: clinicalInteractionMenus.iv,
  wallOxygen: {
    title: "Wall O₂",
    role: "벽 산소 flowmeter와 라인을 확인하고 SpO₂ 반응을 봅니다.",
    actions: [
      { id: "wardOxygen", label: "벽 산소 연결 후 산소 적용" },
    ],
  },
  charge: clinicalInteractionMenus.charge,
  communication: clinicalInteractionMenus.communication,
  emr: clinicalInteractionMenus.emr,
  chart: clinicalInteractionMenus.chart,
};

const gbsClinicalInteractionMenus = {
  patient: {
    title: "GBS 환자 bedside 사정",
    role: "상행성 weakness 다음에 호흡근/연하 단서가 따라오는지 확인합니다. 짧은 문장, shallow breathing, drooling을 놓치지 마세요.",
    actions: [
      { id: "gbsMotor", label: "상하지 motor strength와 weakness progression 확인" },
      { id: "gbsReflex", label: "DTR/reflex 감소 확인" },
      { id: "gbsCoughSwallow", label: "weak cough, drooling, dysphagia 확인" },
      { id: "gbsVc", label: "bedside spirometry로 vital capacity 측정" },
      { id: "gbsAspiration", label: "aspiration precaution 적용" },
    ],
  },
  monitor: {
    title: "GBS 침상 모니터",
    role: "실제 모니터에서 SpO₂, ECG, NIBP, EtCO₂ 숫자와 capnogram을 확인합니다. PaCO₂는 EMR 검사 결과에서 확인하세요.",
    actions: [
      { id: "expandEcg", label: "모니터 화면 확대해서 파형/수치 보기" },
      { id: "gbsMonitor", label: "EtCO₂ 수치와 capnogram 기록" },
      { id: "gbsMonitor", label: "SpO₂/ECG/BP fluctuation 기록" },
    ],
  },
  emr: {
    title: "EMR 검사 결과",
    role: "ABGA/PaCO₂는 모니터가 아니라 검사 결과에서 확인합니다.",
    actions: [
      { id: "openLabs", label: "검사 탭 열기" },
      { id: "gbsAbga", label: "ABGA PaCO₂ 결과 확인/기록" },
      { id: "openNotes", label: "GBS 사정 기록 확인" },
    ],
  },
  iv: {
    title: "Airway 준비",
    role: "GBS bulbar weakness에서는 aspiration 예방과 suction 준비가 중요합니다.",
    actions: [
      { id: "gbsSuction", label: "suction 준비와 airway cart 확인" },
    ],
  },
  wallOxygen: {
    title: "Wall O₂",
    role: "벽 산소 flowmeter와 라인을 확인하고 필요한 산소를 적용합니다.",
    actions: [
      { id: "gbsWallOxygen", label: "벽 산소 flowmeter 연결 후 O₂ 적용" },
    ],
  },
  wallSuction: {
    title: "Wall suction",
    role: "흡인 압력, canister, suction catheter를 bedside에 준비합니다.",
    actions: [
      { id: "gbsSuction", label: "wall suction 압력과 canister 준비" },
    ],
  },
  charge: {
    title: "차지 간호사",
    role: "GBS respiratory failure 전조를 묶어 ICU escalation을 보고합니다.",
    actions: [
      { id: "gbsCallCharge", label: "GBS 호흡근 악화 근거로 차지 호출" },
      { id: "gbsUpdateCharge", label: "최신 VC/EtCO₂/cough-swallow 상태 업데이트" },
    ],
  },
  communication: {
    title: "연락 장비",
    role: "차지에게 보고하고 ICU/담당의 escalation을 시작합니다.",
    actions: [
      { id: "gbsCallCharge", label: "차지 호출" },
      { id: "gbsUpdateCharge", label: "최신 상태 업데이트" },
    ],
  },
  emr: clinicalInteractionMenus.emr,
  chart: clinicalInteractionMenus.chart,
};

function clinicalMenuForTarget(target) {
  if (isGbsEpisode() && gbsClinicalInteractionMenus[target]) return gbsClinicalInteractionMenus[target];
  if (isWardWorkflowEpisode() && wardClinicalInteractionMenus[target]) return wardClinicalInteractionMenus[target];
  return clinicalInteractionMenus[target];
}

function wardInteractionStatus(actionId) {
  const ward = state.wardWorkflow || {};
  const status = {
    wardMentalCheck: ward.mentalChecks >= 1,
    wardOxygen: Boolean(ward.oxygenApplied),
    wardRepeatBp: ward.repeatBpCount >= 2,
    wardMonitor: Boolean(ward.monitorAttached),
    wardIvCheck: Boolean(ward.ivChecked),
    wardCallCharge: Boolean(ward.chargeCalled),
    wardUpdateCharge: Boolean(ward.updatedCharge),
  };
  return Boolean(status[actionId]);
}

function gbsInteractionStatus(actionId) {
  const gbs = state.gbsWorkflow || {};
  const status = {
    gbsMotor: Boolean(gbs.motorChecked),
    gbsReflex: Boolean(gbs.reflexChecked),
    gbsCoughSwallow: Boolean(gbs.coughSwallowChecked),
    gbsAspiration: Boolean(gbs.aspirationPrecaution),
    gbsVc: Boolean(gbs.vcChecked),
    gbsMonitor: Boolean(gbs.monitorReviewed),
    gbsAbga: Boolean(gbs.abgaChecked),
    gbsSuction: Boolean(gbs.suctionReady),
    gbsWallOxygen: Boolean(gbs.oxygenApplied),
    gbsCallCharge: Boolean(gbs.chargeCalled),
    gbsUpdateCharge: Boolean(gbs.updatedCharge),
  };
  return Boolean(status[actionId]);
}

function performGbsObjectAction(actionId) {
  const actionById = {
    gbsMotor: "motor",
    gbsReflex: "reflex",
    gbsCoughSwallow: "coughSwallow",
    gbsAspiration: "aspiration",
    gbsVc: "vc",
    gbsMonitor: "monitor",
    gbsAbga: "abga",
    gbsSuction: "suction",
    gbsWallOxygen: "oxygen",
    gbsCallCharge: "chargeCalled",
    gbsUpdateCharge: "updateCharge",
  };
  const gbsActionId = actionById[actionId];
  if (!gbsActionId) return false;

  if (!state.wardObjectScoreMarks) state.wardObjectScoreMarks = {};
  const scoreKey = state.stage + ":" + actionId;
  const scoreById = {
    gbsMotor: { clinical: 4, safety: 2 },
    gbsReflex: { clinical: 4 },
    gbsCoughSwallow: { safety: 5, clinical: 5, empathy: 2 },
    gbsAspiration: { safety: 5, protocol: 3 },
    gbsVc: { safety: 6, clinical: 6, protocol: 3 },
    gbsMonitor: { safety: 4, clinical: 5 },
    gbsAbga: { clinical: 5, protocol: 4 },
    gbsSuction: { safety: 5, protocol: 4 },
    gbsWallOxygen: { safety: 3, clinical: 2 },
    gbsCallCharge: { safety: 6, clinical: 6, protocol: 5 },
    gbsUpdateCharge: { safety: 4, clinical: 5, protocol: 4 },
  };
  if (!state.wardObjectScoreMarks[scoreKey]) {
    applyScore(scoreById[actionId]);
    state.wardObjectScoreMarks[scoreKey] = true;
  }

  const logById = {
    gbsMotor: "신경 사정: 상행성 weakness를 확인했습니다. 이제 호흡근 침범 단서를 찾아야 합니다.",
    gbsReflex: "신경 사정: DTR/reflex 감소를 확인했습니다.",
    gbsCoughSwallow: "bulbar 사정: 짧은 문장, weak cough, drooling/dysphagia 위험을 확인했습니다.",
    gbsAspiration: "airway 중재: aspiration precaution을 적용했습니다.",
    gbsVc: "호흡근 사정: vital capacity를 측정했습니다.",
    gbsMonitor: "모니터 해석: SpO₂는 정상처럼 보이지만 EtCO₂ 상승과 BP/HR fluctuation을 확인했습니다.",
    gbsAbga: "검사 준비: ABGA로 PaCO₂ 상승 여부를 확인합니다.",
    gbsSuction: "airway 준비: suction과 airway cart를 준비했습니다.",
    gbsWallOxygen: "벽 산소: flowmeter를 연결하고 산소 적용을 시작했습니다.",
    gbsCallCharge: "차지 호출: GBS respiratory failure 전조를 묶어 보고했습니다.",
    gbsUpdateCharge: "차지 업데이트: 최신 VC/EtCO₂/cough-swallow 변화를 전달했습니다.",
  };
  if (!["gbsMotor", "gbsReflex", "gbsCoughSwallow", "gbsAspiration", "gbsVc", "gbsMonitor", "gbsAbga", "gbsSuction"].includes(actionId)) {
    addLog(logById[actionId], "good");
  }
  gbsAction(gbsActionId);

  if (gbsActionId === "chargeCalled") {
    state.stage = "gbsEscalationNotify";
  } else if (["gbsIntro"].includes(state.stage)) {
    state.stage = "gbsDeterioration";
  }

  render();
  return true;
}

function performWardObjectAction(actionId) {
  const actionById = {
    wardMentalCheck: "mentalCheck",
    wardOxygen: "oxygen",
    wardRepeatBp: "repeatBp",
    wardMonitor: "monitor",
    wardIvCheck: "ivCheck",
    wardCallCharge: "chargeCalled",
    wardUpdateCharge: "updateCharge",
  };
  const wardActionId = actionById[actionId];
  if (!wardActionId) return false;

  if (!state.wardObjectScoreMarks) state.wardObjectScoreMarks = {};
  const scoreKey = state.stage + ":" + actionId;
  const wardScoreById = {
    wardMentalCheck: { safety: 4, clinical: 5, empathy: 2 },
    wardOxygen: { safety: 5, clinical: 4 },
    wardRepeatBp: { safety: 5, clinical: 5, protocol: 2 },
    wardMonitor: { safety: 3, clinical: 5 },
    wardIvCheck: { safety: 5, clinical: 4, protocol: 3 },
    wardCallCharge: { safety: 6, clinical: 6, protocol: 5 },
    wardUpdateCharge: { safety: 4, clinical: 5, protocol: 4 },
  };
  if (!state.wardObjectScoreMarks[scoreKey]) {
    applyScore(wardScoreById[actionId]);
    state.wardObjectScoreMarks[scoreKey] = true;
  }

  const wardObjectLogById = {
    wardMentalCheck: "bedside 사정: 의식 변화와 피부/말초순환을 직접 재확인했습니다.",
    wardOxygen: "bedside 중재: O2 마스크를 적용하고 SpO₂/pleth 반응을 확인했습니다.",
    wardRepeatBp: "모니터 기반 사정: repeat BP를 측정해 BP downtrend를 확인했습니다.",
    wardMonitor: "모니터 해석: ECG, SpO₂ pleth, NIBP 추세를 다시 읽었습니다.",
    wardIvCheck: "IV 확인: line patency와 수액 연결 가능성을 확인했습니다.",
    wardCallCharge: "차지 호출: HR/BP/SpO₂ 추세와 처진 반응을 묶어 보고했습니다.",
    wardUpdateCharge: "차지 업데이트: 최신 BP, SpO₂, 의식 변화를 차지에게 다시 전달했습니다.",
  };
  addLog(wardObjectLogById[actionId], "good");

  wardAction(wardActionId);

  if (wardActionId === "chargeCalled") {
    state.stage = "wardChargeNotify";
  } else if (["wardIntro", "wardBaseline"].includes(state.stage)) {
    state.stage = "wardDeterioration";
  }

  render();
  return true;
}


function chooseSceneAction(actionIndex) {
  const scene = scenes[state.stage];
  const action = scene?.actions?.[actionIndex];

  if (!action) return false;

  return guardedChoose(action);
}

function openClinicalInteractionMenu(target, point = {}) {
  syncCompletedAssessments();

  const menu = clinicalMenuForTarget(target);

  if (!interactionMenuEl || !menu) return;

  interactionMenuEl.innerHTML = "";
  interactionMenuEl.hidden = false;
  interactionMenuEl.dataset.target = target;
  interactionMenuEl.dataset.clickX = typeof point.x === "number" ? String(point.x) : "";
  interactionMenuEl.dataset.clickY = typeof point.y === "number" ? String(point.y) : "";

  const title = document.createElement("strong");
  title.textContent = menu.title;
  interactionMenuEl.append(title);

  if (menu.role) {
    const role = document.createElement("p");
    role.className = "interaction-role";
    role.textContent = menu.role;
    interactionMenuEl.append(role);
  }

  menu.actions.forEach((item) => {
    const button = document.createElement("button");
    const completed = item.id.startsWith("gbs") ? gbsInteractionStatus(item.id) : item.id.startsWith("ward") ? wardInteractionStatus(item.id) : isAssessmentComplete(item.assessment);
    const lock = lockedActionInfo(target, item.id);
    const statusText = lock.locked ? "사정 필요" : completed ? "완료" : "대기";
    button.type = "button";
    button.className = [
      "interaction-action",
      item.mode === "conversation" ? "conversation" : "",
      item.assessment ? (completed ? "done" : "pending") : "",
      lock.locked ? "locked" : "",
    ].filter(Boolean).join(" ");
    const historyProgress = item.id === "history" ? answeredRequiredCount() + "/" + requiredHistoryQuestions().length : "";
    const actionStatus = item.id === "history"
      ? (patientHistoryReviewed() ? "완료" : state.stage === "historyTaking" ? "진행" : "대화")
      : item.id.startsWith("gbs") || item.id.startsWith("ward") || item.assessment || lock.locked ? statusText : "선택";
    button.innerHTML = `
      <span>${actionStatus}</span>
      <strong>${item.label}</strong>
      ${item.id === "history" ? `<small>환자에게 직접 질문합니다. 핵심 문진 ${historyProgress}</small>` : ""}
      ${lock.locked ? `<small>부족: ${lock.missing.join(", ")}</small>` : ""}
    `;
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (lock.locked) {
        addAssessmentRequiredLog(lock.missing, item.label);
        closeClinicalInteractionMenu();
        render();
        return;
      }

      closeClinicalInteractionMenu();
      handleClinicalMenuAction(target, item.id);
    });
    interactionMenuEl.append(button);
  });

  const roomRect = document.querySelector(".room")?.getBoundingClientRect();
  const menuWidth = 230;
  const x = roomRect ? point.x - roomRect.left : 18;
  const y = roomRect ? point.y - roomRect.top : 18;
  const left = clamp(x + 12, 12, Math.max(12, (roomRect?.width ?? 260) - menuWidth - 12));
  const top = clamp(y + 12, 12, Math.max(12, (roomRect?.height ?? 260) - 212));

  interactionMenuEl.style.left = `${left}px`;
  interactionMenuEl.style.top = `${top}px`;
}

function positionInteractionMenu(point = {}, width = 230) {
  const roomRect = document.querySelector(".room")?.getBoundingClientRect();
  const x = roomRect && typeof point.x === "number" ? point.x - roomRect.left : 18;
  const y = roomRect && typeof point.y === "number" ? point.y - roomRect.top : 18;
  const left = clamp(x + 12, 12, Math.max(12, (roomRect?.width ?? 260) - width - 12));
  const top = clamp(y + 12, 12, Math.max(12, (roomRect?.height ?? 260) - 212));

  interactionMenuEl.style.left = left + "px";
  interactionMenuEl.style.top = top + "px";
}

function positionPatientConversation(point = {}) {
  if (!patientConversationEl) return;

  const roomRect = document.querySelector(".room")?.getBoundingClientRect();
  const width = 360;
  const fallbackX = (roomRect?.width ?? width) * 0.52;
  const fallbackY = (roomRect?.height ?? 520) * 0.24;
  const x = roomRect && typeof point.x === "number" ? point.x - roomRect.left : fallbackX;
  const y = roomRect && typeof point.y === "number" ? point.y - roomRect.top : fallbackY;
  const left = clamp(x + 16, 12, Math.max(12, (roomRect?.width ?? 420) - width - 12));
  const top = clamp(y - 24, 12, Math.max(12, (roomRect?.height ?? 620) - 520));

  patientConversationEl.style.left = left + "px";
  patientConversationEl.style.top = top + "px";
}

function openPatientHistoryConversation(point = {}) {
  if (!patientConversationEl) return;

  closeClinicalInteractionMenu();
  patientConversationEl.innerHTML = "";
  patientConversationEl.hidden = false;
  patientConversationEl.dataset.target = "patient-history";

  const header = document.createElement("div");
  header.className = "patient-conversation-header";
  header.innerHTML = "<span>침상 대화</span><strong>흉통 문진</strong>";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "patient-conversation-close";
  closeButton.setAttribute("aria-label", "대화 닫기");
  closeButton.textContent = "닫기";
  closeButton.addEventListener("click", closePatientConversation);
  header.append(closeButton);
  patientConversationEl.append(header);

  const requiredTotal = requiredHistoryQuestions().length;
  const requiredAnswered = answeredRequiredCount();
  const status = document.createElement("div");
  status.className = "interaction-status";
  status.textContent = "핵심 문진 " + requiredAnswered + "/" + requiredTotal;
  patientConversationEl.append(status);

  const list = document.createElement("div");
  list.className = "patient-conversation-list";

  historyQuestions.forEach((question) => {
    const button = document.createElement("button");
    const isAsked = state.askedQuestions.includes(question.id);
    button.type = "button";
    button.className = [
      "interaction-action",
      "history-conversation-action",
      question.required ? "required" : "",
      isAsked ? "done" : "",
    ].filter(Boolean).join(" ");
    button.innerHTML =
      "<span>" + (isAsked ? "완료" : question.required ? "필수" : "선택") + "</span>" +
      "<strong>" + question.label + "</strong>" +
      (isAsked ? "<small>" + question.response + "</small>" : "");
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      askHistoryQuestion(question);
      if (state.stage === "historyTaking") openPatientHistoryConversation(point);
    });
    list.append(button);
  });
  patientConversationEl.append(list);

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.className = "interaction-action history-complete-action primary";
  completeButton.innerHTML = "<span>정리</span><strong>문진 정리하고 활력징후 확인</strong>";
  completeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    completeHistoryTaking();
    if (state.stage === "historyTaking") openPatientHistoryConversation(point);
    else closePatientConversation();
  });
  patientConversationEl.append(completeButton);

  positionPatientConversation(point);
}


function currentInteractionPoint() {
  const x = Number(interactionMenuEl?.dataset.clickX);
  const y = Number(interactionMenuEl?.dataset.clickY);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : {};
}

function closeClinicalInteractionMenu() {
  if (!interactionMenuEl) return;
  interactionMenuEl.hidden = true;
  interactionMenuEl.innerHTML = "";
}

function closePatientConversation() {
  if (!patientConversationEl) return;
  patientConversationEl.hidden = true;
  patientConversationEl.innerHTML = "";
}

function closeEcgProcedureOverlay() {
  if (!ecgProcedureOverlayEl) return;
  ecgProcedureOverlayEl.hidden = true;
  ecgProcedureOverlayEl.innerHTML = "";
}

function handleClinicalMenuAction(target, actionId) {
  if (isGbsEpisode() && actionId.startsWith("gbs")) {
    performGbsObjectAction(actionId);
    return;
  }

  if (isWardWorkflowEpisode() && actionId.startsWith("ward")) {
    performWardObjectAction(actionId);
    return;
  }

  if (target === "communication") {
    if (actionId === "openSbar") beginSbarFromCommunicationDevice();
    return;
  }

  const lock = lockedActionInfo(target, actionId);

  if (lock.locked) {
    const menu = clinicalInteractionMenus[target];
    const action = menu?.actions?.find((item) => item.id === actionId);
    addAssessmentRequiredLog(lock.missing, action?.label || "수행");
    render();
    return;
  }

  if (target === "patient") {
    handlePatientMenuAction(actionId);
    return;
  }

  if (target === "monitor") {
    handleMonitorMenuAction(actionId);
    return;
  }

  if (target === "medication") {
    handleMedicationMenuAction(actionId);
    return;
  }

  if (target === "chart") {
    handleChartMenuAction(actionId);
    return;
  }

  if (target === "emr") {
    handleEmrMenuAction(actionId);
  }
}

function handleEmrMenuAction(actionId) {
  const tabByAction = {
    openSummary: "summary",
    openLabs: "labs",
    openOrders: "orders",
    openRegularMedication: "orders",
    openPrnMedication: "meds",
    openMeds: "meds",
    openNotes: "notes",
  };

  const tab = tabByAction[actionId] || "summary";
  openEmr(tab);

  if (actionId === "openRegularMedication") openRegularMedicationWorkflow("EMR 정규 약물 투여");
  if (actionId === "openPrnMedication") openPrnMedicationWorkflow("EMR PRN 약물 투여");
}

function openEmr(tab = "summary") {
  if (!emrModalEl) return;

  const firstOpen = !state.emrOpened;
  state.emrOpened = true;
  state.emrTab = tab;

  if (firstOpen) {
    addLog(state.stage === "chartReview"
      ? "EMR 자동 노출: 인계 직후 환자 요약, 검사, 처방, PRN 정보를 확인합니다."
      : "EMR 열림: 병실 노트북에서 환자 요약, 검사, 처방 정보를 확인했습니다.", "good");
  }

  renderEmr();

  // Float panel mode: GBS episode always uses float (no chart-review stage in GBS)
  const useFloat = isGbsEpisode();
  if (useFloat) {
    if (firstOpen) {
      // Reset drag position to CSS default on each new episode session
      emrModalEl.style.left = "";
      emrModalEl.style.top = "";
    }
    emrModalEl.classList.add("emr-float");
    document.body.classList.add("emr-float-open");
    document.body.classList.remove("emr-open");
  } else {
    emrModalEl.classList.remove("emr-float");
    document.body.classList.remove("emr-float-open");
    document.body.classList.add("emr-open");
  }

  emrModalEl.hidden = false;
}

function closeEmr() {
  if (!emrModalEl) return;
  emrModalEl.hidden = true;
  emrModalEl.classList.remove("emr-float");
  document.body.classList.remove("emr-open", "emr-float-open");
  releaseBedsideFromEntry();
}

function setEmrTab(tab) {
  state.emrTab = tab;
  renderEmr();
}

function emrKnownValue(isKnown, knownText, hiddenText = "미확인") {
  return isKnown ? knownText : hiddenText;
}

function renderEmr() {
  if (!emrContentEl) return;

  const vitals = currentVitals();
  const tab = state.emrTab || "summary";
  const profile = currentPatientProfile();
  if (emrTitleEl) emrTitleEl.textContent = profile.name;

  emrTabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.emrTab === tab);
  });

  const summaryMarkup = `
    <section class="emr-grid">
      <article class="emr-card">
          <h3>Patient</h3>
          <dl>
          <dt>Name</dt><dd>${profile.name}</dd>
          <dt>Age</dt><dd>${profile.age}</dd>
          <dt>Diagnosis</dt><dd>${profile.diagnosis}</dd>
          <dt>주호소</dt><dd>${profile.chiefComplaint}</dd>
          <dt>계획</dt><dd>${profile.plannedSurgery}</dd>
          <dt>상태</dt><dd>${profile.pod}</dd>
        </dl>
      </article>
      <article class="emr-card">
        <h3>현재 사정</h3>
        <dl>
          <dt>통증</dt><dd>${emrKnownValue(state.knownPatientInfo.pain, `${state.patientStatus.pain}/10`)}</dd>
          <dt>호흡</dt><dd>${emrKnownValue(state.knownPatientInfo.breathing, breathingLabel(state.patientStatus.breathing))}</dd>
          <dt>심혈관 위험요인</dt><dd>${emrKnownValue(state.knownPatientInfo.cardiacRisk, "고혈압 약 복용, 협심증 검사력")}</dd>
          <dt>협조도</dt><dd>${Math.round(state.patientStatus.cooperation)}</dd>
          <dt>환자 반응</dt><dd>${state.patientVoice || "아직 직접 반응을 확인하지 않았습니다."}</dd>
          <dt>임상 우선도</dt><dd>${state.urgency.label} · ${state.urgency.drivers?.join(", ") || "안정"}</dd>
        </dl>
      </article>
      <article class="emr-card">
        <h3>환자 사정 소견</h3>
        ${
          patientFindingsList().length
            ? `<dl>${patientFindingsList().map((finding) => `<dt>${finding.label}</dt><dd>${finding.value}</dd>`).join("")}</dl>`
            : `<p class="emr-empty">환자 직접 사정 전입니다. 침상 환자를 클릭해 증상 대화와 physical assessment를 수행하세요.</p>`
        }
      </article>
      <article class="emr-card">
        <h3>Vitals</h3>
        <dl>
          <dt>HR</dt><dd>${state.monitorOn ? vitals.hr : "--"}</dd>
          <dt>SpO₂</dt><dd>${state.monitorOn ? `${vitals.spo2}%` : "--"}</dd>
          <dt>BP</dt><dd>${state.monitorOn ? vitals.bp : "--"}</dd>
          <dt>모니터</dt><dd>${state.monitorOn ? "실시간" : "대기"}</dd>
        </dl>
      </article>
    </section>
  `;

  const abgaResults = isGbsEpisode() ? gbsAbgaResults() : [];
  const abgaMarkup = isGbsEpisode() ? `
    <article class="emr-card abga-card">
      <div class="abga-card-header">
        <div>
          <h3>ABGA 검사 결과</h3>
          <p>동맥혈가스분석 결과지 형식입니다. 정상범위보다 낮으면 파란색, 높으면 빨간색으로 표시됩니다.</p>
        </div>
        <span class="abga-time">${state.gbsWorkflow?.abgaChecked ? `T+${state.elapsedMinutes} min 확인` : "검사결과 대기"}</span>
      </div>
      <table class="abga-table">
        <thead>
          <tr>
            <th>검사항목</th>
            <th>결과</th>
            <th>단위</th>
            <th>참고치</th>
            <th>판정</th>
          </tr>
        </thead>
        <tbody>
          ${abgaResults.map((item) => `
            <tr class="${item.status}">
              <td><strong>${item.name}</strong></td>
              <td class="abga-value">${item.value}</td>
              <td>${item.unit || "-"}</td>
              <td>${item.normal}</td>
              <td><span class="abga-flag">${item.status === "high" ? "높음" : item.status === "low" ? "낮음" : "정상"}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="abga-legend">
        <span class="abga-legend-low">낮음</span>
        <span class="abga-legend-normal">정상</span>
        <span class="abga-legend-high">높음</span>
      </div>
      <div class="emr-action-row">
        <button type="button" data-emr-action="gbsAbgaRecord">ABGA 결과 간호기록에 반영</button>
      </div>
    </article>
  ` : "";

  const labsMarkup = `
    <section class="emr-table-wrap">
      <table class="emr-table">
        <thead><tr><th>Lab</th><th>Result</th><th>Normal</th><th>Flag</th></tr></thead>
        <tbody>
          ${profile.labs.map((lab) => `<tr class="${lab.flag === "High" ? "alert" : ""}"><td>${lab.name}</td><td>${lab.value} ${lab.unit}</td><td>${lab.normal}</td><td>${lab.flag}</td></tr>`).join("")}
        </tbody>
      </table>
    </section>
    ${abgaMarkup}
  `;

  const ordersMarkup = `
    <section class="emr-grid">
      <article class="emr-card">
        <h3>정규 처방</h3>
        <ul class="emr-list">
          ${profile.regularOrders.map((order) => `<li class="${state.appliedRegularOrders.includes(order.id) ? "done" : ""}">${order.label}</li>`).join("")}
        </ul>
        <div class="emr-action-row">
          <button type="button" data-emr-action="regularMedication">정규 약물 투여 열기</button>
        </div>
      </article>
      <article class="emr-card">
        <h3>PRN 처방</h3>
        <ul class="emr-list">
          ${profile.prnOrders.map((order) => `<li class="${state.prnMedicationsGiven.includes(order.id) ? "done" : ""}">${order.label}<span>적응증: ${order.indication}</span></li>`).join("")}
        </ul>
        <div class="emr-action-row">
          <button type="button" data-emr-action="prnMedication">PRN 약물 투여 열기</button>
        </div>
      </article>
    </section>
  `;

  const medsMarkup = `
    <section class="emr-grid">
      <article class="emr-card">
        <h3>투약 정보</h3>
        <dl>
          <dt>체중</dt><dd>${profile.weightKg} kg</dd>
          <dt>알레르기</dt><dd>${state.askedQuestions.includes("allergy") ? "특이 약물 알레르기 없음" : "미확인"}</dd>
          <dt>통증 상태</dt><dd>${emrKnownValue(state.knownPatientInfo.pain, `${state.patientStatus.pain}/10`)}</dd>
          <dt>호흡 상태</dt><dd>${emrKnownValue(state.knownPatientInfo.breathing, breathingLabel(state.patientStatus.breathing))}</dd>
          <dt>피부 소견</dt><dd>${state.patientFindings.skinPerfusion?.value || "미확인"}</dd>
          <dt>맥박 소견</dt><dd>${state.patientFindings.radialPulse?.value || "미확인"}</dd>
        </dl>
      </article>
      <article class="emr-card">
        <h3>정규 투약/중재</h3>
        <ul class="emr-list">
          ${profile.regularOrders.map((order) => `<li class="${state.appliedRegularOrders.includes(order.id) ? "done" : ""}">${order.label}<span>${state.appliedRegularOrders.includes(order.id) ? "적용 완료" : "미적용"}</span></li>`).join("")}
        </ul>
        <div class="emr-action-row">
          <button type="button" data-emr-action="regularMedication">정규 약물 투여 열기</button>
        </div>
      </article>
      <article class="emr-card">
        <h3>PRN 투약</h3>
        <ul class="emr-list">
          ${profile.prnOrders.map((order) => `<li class="${state.prnMedicationsGiven.includes(order.id) ? "done" : ""}">${order.label}<span>${state.prnMedicationsGiven.includes(order.id) ? "투여 완료" : `적응증: ${order.indication}`}</span></li>`).join("")}
        </ul>
        <div class="emr-action-row">
          <button type="button" data-emr-action="prnMedication">PRN 약물 투여 열기</button>
        </div>
      </article>
    </section>
  `;

  const gbs = state.gbsWorkflow || {};
  const gbsRecords = state.gbsAssessmentRecords || [];
  const nonGbsAssessmentRecords = !isGbsEpisode()
    ? patientFindingsList().map((item, index) => ({
        minute: state.elapsedMinutes,
        label: item.label || "사정 기록",
        value: item.value || "",
        interpretation: index === 0 ? "환자 사정/수치 확인 결과가 EMR nursing note에 누적됩니다." : "",
      }))
    : [];
  const gbsAssessmentMarkup = isGbsEpisode() ? `
      <article class="emr-card emr-notes neuro-assessment-note">
        <h3>GBS 신경/호흡 사정 기록</h3>
        <dl>
          <dt>GCS</dt><dd>E4 V5 M6 · 대화 가능하나 말이 짧아짐</dd>
          <dt>Motor</dt><dd>${gbs.motorChecked ? "BLE 4-/5, ankle dorsiflexion 약화" : "미기록"}</dd>
          <dt>DTR</dt><dd>${gbs.reflexChecked ? "Patellar/ankle reflex 양측 감소" : "미기록"}</dd>
          <dt>Cough/Swallow</dt><dd>${gbs.coughSwallowChecked ? "Weak cough, drooling/dysphagia 위험" : "미기록"}</dd>
          <dt>VC / EtCO₂</dt><dd>${Math.round(gbs.vc || 0)} mL/kg · ${Math.round(gbs.etco2 || 0)} mmHg</dd>
          <dt>Head-up</dt><dd>${gbs.headOfBedRaised ? "침상 머리 30-45도 상승, PO 보류" : "미적용"}</dd>
          <dt>Suction</dt><dd>${gbs.suctionReady ? "Wall suction/canister/airway cart bedside 준비" : "미준비"}</dd>
        </dl>
        <ul class="emr-list neuro-record-list">
          ${gbsRecords.length ? gbsRecords.map((item) => `
            <li>
              <strong>T+${item.minute} min · ${item.label}</strong>
              <span>${item.value}</span>
              ${item.interpretation ? `<small>${item.interpretation}</small>` : ""}
            </li>
          `).join("") : "<li>아직 GBS neuro/respiratory 사정 기록이 없습니다.</li>"}
        </ul>
      </article>
  ` : "";
  const generalAssessmentMarkup = !isGbsEpisode() ? `
      <article class="emr-card emr-notes neuro-assessment-note">
        <h3>간호 사정/수치 기록</h3>
        <ul class="emr-list neuro-record-list">
          ${nonGbsAssessmentRecords.length ? nonGbsAssessmentRecords.map((item) => `
            <li>
              <strong>T+${item.minute} min · ${item.label}</strong>
              <span>${item.value}</span>
              ${item.interpretation ? `<small>${item.interpretation}</small>` : ""}
            </li>
          `).join("") : "<li>아직 기록된 사정/수치 결과가 없습니다.</li>"}
        </ul>
      </article>
  ` : "";

  const notesMarkup = `
    <section class="emr-grid emr-notes-grid">
      ${gbsAssessmentMarkup}
      ${generalAssessmentMarkup}
      <article class="emr-card emr-notes">
        <h3>간호기록</h3>
        <ul class="emr-list">
          ${state.logs.length ? state.logs.map((item) => `<li class="${item.tone || ""}">${item.text}</li>`).join("") : "<li>기록 없음</li>"}
        </ul>
      </article>
      <article class="emr-card emr-notes">
        <h3>임상 이벤트 기록</h3>
        <ul class="emr-list event-history-list">
          ${state.eventHistory.length ? state.eventHistory.map((item) => `<li class="${item.severity || "info"}"><strong>T+${item.minute} min</strong>${item.text}</li>`).join("") : "<li>기록 없음</li>"}
        </ul>
      </article>
    </section>
  `;

  emrContentEl.innerHTML = {
    summary: summaryMarkup,
    labs: labsMarkup,
    orders: ordersMarkup,
    meds: medsMarkup,
    notes: notesMarkup,
  }[tab] || summaryMarkup;
}

contextWindowEl?.querySelector("header")?.addEventListener("pointerdown", beginContextWindowDrag);
document.addEventListener("pointermove", moveContextWindowDrag);
document.addEventListener("pointerup", endContextWindowDrag);
contextWindowCloseEl?.addEventListener("click", closeContextWindow);
handoffContinueEl?.addEventListener("click", continueFromHandoff);
emrCloseEl?.addEventListener("click", closeEmr);
emrTabButtons.forEach((button) => {
  button.addEventListener("click", () => setEmrTab(button.dataset.emrTab));
});

// EMR float panel drag-to-move
(function () {
  const dragHandle = document.getElementById("emr-drag-handle");
  if (!dragHandle || !emrModalEl) return;
  let active = false;
  let ox = 0, oy = 0;
  dragHandle.addEventListener("pointerdown", (e) => {
    if (!emrModalEl.classList.contains("emr-float")) return;
    active = true;
    const r = emrModalEl.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    dragHandle.style.cursor = "grabbing";
    dragHandle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  dragHandle.addEventListener("pointermove", (e) => {
    if (!active) return;
    const x = Math.max(0, Math.min(window.innerWidth - 430, e.clientX - ox));
    const y = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - oy));
    emrModalEl.style.left = x + "px";
    emrModalEl.style.top  = y + "px";
  });
  dragHandle.addEventListener("pointerup", () => {
    active = false;
    dragHandle.style.cursor = "grab";
  });
}());
emrContentEl?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-emr-action]");
  if (!button) return;

  const action = button.dataset.emrAction;
  if (action === "regularMedication") openRegularMedicationWorkflow("EMR 정규 약물 투여");
  if (action === "prnMedication") openPrnMedicationWorkflow("EMR PRN 약물 투여");
  if (action === "gbsAbgaRecord") {
    gbsAction("abga");
    renderEmr();
    render();
  }
});



function isPatientLoopActive() {
  return !entryFlowActive() && !state.outcome && !["goodEnd", "badEnd", "wardGoodEnd", "wardBadEnd", "gbsGoodEnd", "gbsBadEnd"].includes(state.stage);
}

function hasActiveClinicalIntervention() {
  return Boolean(
    state.oxygenApplied ||
      state.prnMedicationsGiven.length > 0 ||
      state.appliedRegularOrders.includes("aspirin") ||
      state.appliedRegularOrders.includes("ekg"),
  );
}


function calculateClinicalUrgency() {
  if (isGbsEpisode()) {
    const vitals = currentVitals();
    const gbs = state.gbsWorkflow || createGbsWorkflowState();
    const [systolic = 0] = String(vitals.bp).split("/").map(Number);
    let score = 0;
    const drivers = [];

    if (gbs.vc <= 18) {
      score += 4;
      drivers.push("low VC");
    } else if (gbs.vc <= 22) {
      score += 2;
      drivers.push("falling VC");
    }

    if (gbs.etco2 >= 46) {
      score += 4;
      drivers.push("rising EtCO₂");
    } else if (gbs.etco2 >= 42) {
      score += 2;
      drivers.push("EtCO₂ watch");
    }

    if (vitals.rr >= 30) {
      score += 3;
      drivers.push("tachypnea");
    } else if (vitals.rr >= 24) {
      score += 1;
      drivers.push("RR rising");
    }

    if (gbs.bulbarFunction <= 52) {
      score += 3;
      drivers.push("dysphagia/aspiration risk");
    } else if (gbs.bulbarFunction <= 62) {
      score += 1;
      drivers.push("weak cough/swallow");
    }

    if (gbs.autonomicStability <= 45 || systolic < 90 || vitals.hr <= 50 || vitals.hr >= 125) {
      score += 3;
      drivers.push("dysautonomia");
    } else if (gbs.autonomicStability <= 58) {
      score += 1;
      drivers.push("BP/HR fluctuation");
    }

    const level = score >= 9 ? "critical" : score >= 6 ? "severe" : score >= 3 ? "moderate" : "mild";
    const label = { mild: "낮음", moderate: "주의", severe: "높음", critical: "위급" }[level];
    return { level, score, label, drivers, vitals };
  }

  if (isWardWorkflowEpisode()) {
    const vitals = currentVitals();
    const ward = state.wardWorkflow || createWardWorkflowState();
    const [systolic = 0] = String(vitals.bp).split("/").map(Number);
    let score = 0;
    const drivers = [];

    if (systolic < 90) {
      score += 4;
      drivers.push("hypotension");
    } else if (systolic < 100) {
      score += 2;
      drivers.push("borderline BP");
    }

    if (vitals.hr >= 128) {
      score += 3;
      drivers.push("marked tachycardia");
    } else if (vitals.hr >= 112) {
      score += 2;
      drivers.push("rising HR");
    }

    if (vitals.spo2 <= 90) {
      score += 4;
      drivers.push("critical SpO₂");
    } else if (vitals.spo2 <= 93) {
      score += 2;
      drivers.push("falling SpO₂");
    }

    if (ward.consciousness <= 62) {
      score += 3;
      drivers.push("mental change");
    } else if (ward.consciousness <= 72) {
      score += 1;
      drivers.push("drowsy");
    }

    if (ward.urineOutput <= 30) {
      score += 2;
      drivers.push("low urine output");
    }

    const level = score >= 8 ? "critical" : score >= 6 ? "severe" : score >= 3 ? "moderate" : "mild";
    const label = {
      mild: "낮음",
      moderate: "주의",
      severe: "높음",
      critical: "위급",
    }[level];

    return { level, score, label, drivers, vitals };
  }

  const vitals = currentVitals();
  let score = 0;
  const drivers = [];

  if (vitals.spo2 <= 90) {
    score += 4;
    drivers.push("critical SpO₂");
  } else if (vitals.spo2 <= 92) {
    score += 3;
    drivers.push("low SpO₂");
  } else if (vitals.spo2 <= 94) {
    score += 1;
    drivers.push("borderline SpO₂");
  }

  if (vitals.hr >= 128) {
    score += 3;
    drivers.push("marked tachycardia");
  } else if (vitals.hr >= 120) {
    score += 2;
    drivers.push("tachycardia");
  }

  if (state.patientStatus.pain >= 8) {
    score += 3;
    drivers.push("severe pain");
  } else if (state.patientStatus.pain >= 6.5) {
    score += 2;
    drivers.push("ongoing chest pain");
  } else if (state.patientStatus.pain >= 5.5) {
    score += 1;
    drivers.push("chest discomfort");
  }

  if (state.patientStatus.anxiety >= 90) {
    score += 2;
    drivers.push("severe anxiety");
  } else if (state.patientStatus.anxiety >= 78) {
    score += 1;
    drivers.push("rising anxiety");
  }

  const level = score >= 8 ? "critical" : score >= 6 ? "severe" : score >= 3 ? "moderate" : "mild";
  const label = {
    mild: "낮음",
    moderate: "주의",
    severe: "높음",
    critical: "위급",
  }[level];

  return { level, score, label, drivers, vitals };
}

function urgencyMultiplier(level) {
  return {
    mild: 1,
    moderate: 1.2,
    severe: 1.45,
    critical: 2,
  }[level] || 1;
}

function untreatedCriticalProblem(urgency) {
  return urgency.level === "severe" || urgency.level === "critical";
}

function updateClinicalUrgency(options = {}) {
  const previousLevel = state.urgency?.level;
  const urgency = calculateClinicalUrgency();
  state.urgency = urgency;

  if (options.log && previousLevel && previousLevel !== urgency.level && urgency.level !== "mild") {
    addLog("환자 상태가 악화되고 있습니다: " + urgency.label + " (" + urgency.drivers.join(", ") + ")", urgency.level === "critical" ? "bad" : "warning");
  }

  return urgency;
}

function keyClinicalActionsStatus() {
  const reassessmentComplete = !state.prnMedicationsGiven.length || Object.values(state.postPrnReassessment || {}).every(Boolean);
  return {
    history: patientHistoryReviewed(),
    vitals: isAssessmentComplete("vitals") || state.monitorOn,
    ecg: state.ekgAttached || state.monitorOn,
    orders: state.appliedRegularOrders.includes("aspirin") && state.appliedRegularOrders.includes("ekg"),
    intervention: state.prnMedicationsGiven.length > 0 || state.oxygenApplied || state.appliedRegularOrders.includes("aspirin"),
    reassessment: reassessmentComplete,
    sbar: state.stage === "goodEnd" || Object.keys(state.sbarSelections || {}).length >= 4,
  };
}

function completedKeyClinicalActionCount(actions = keyClinicalActionsStatus()) {
  return Object.values(actions).filter(Boolean).length;
}

function setPatientOutcome(type, reason, details = []) {
  if (state.outcome) return;

  const urgency = state.urgency || calculateClinicalUrgency();
  const vitals = currentVitals();
  state.outcome = {
    type,
    reason,
    details,
    minute: state.elapsedMinutes,
    vitals,
    urgency,
    actions: keyClinicalActionsStatus(),
  };
  state.stabilized = type === "stabilized";
  state.stage = type === "stabilized" ? "goodEnd" : "badEnd";
  addLog(type === "stabilized" ? "결과: 환자가 안정화되었습니다." : "결과: 환자가 악화되었습니다.", type === "stabilized" ? "good" : "bad");
  render();
}

function followUpObservationReady() {
  const interventions = ensureFollowUpObservation().interventions;
  const entries = Object.entries(interventions);
  if (!entries.length) return true;

  return entries.every(([type, intervention]) => {
    const minutes = Math.max(0, state.elapsedMinutes - intervention.startedMinute);
    return minutes >= (type === "nitro" ? 7 : 4);
  });
}

function stabilizationOutcomeStatus(status = patientStabilizationStatus(), urgency = state.urgency || calculateClinicalUrgency()) {
  const actions = keyClinicalActionsStatus();
  const actionCount = completedKeyClinicalActionCount(actions);
  const painImproved = state.patientStatus.pain <= 4;
  const oxygenStable = status.vitals.spo2 >= 94;
  const hrStable = status.vitals.hr <= 118;
  const urgencyReduced = urgency.level === "mild" || urgency.level === "moderate";
  const followUpReady = followUpObservationReady();
  const keyActionsReady = actions.history && actions.vitals && actions.ecg && actions.orders && actions.intervention && actions.reassessment && followUpReady;

  return {
    ready: painImproved && oxygenStable && hrStable && urgencyReduced && keyActionsReady,
    actions,
    actionCount,
    details: [
      painImproved ? "통증이 안정 범위로 감소" : "통증 추가 관리 필요",
      oxygenStable ? "SpO₂ 안정" : "산소화 불안정",
      hrStable ? "HR 안정" : "빈맥 지속",
      urgencyReduced ? "임상 우선도 감소" : "높은 urgency 지속",
      keyActionsReady ? "핵심 사정/ECG/처방/중재/재사정과 추적 관찰 완료" : followUpReady ? "핵심 임상 행동 미완료" : "중재 후 추적 관찰 시간 부족",
    ],
  };
}

function deteriorationOutcomeStatus(urgency = state.urgency || calculateClinicalUrgency(), status = patientStabilizationStatus()) {
  const actions = keyClinicalActionsStatus();
  const noMeaningfulIntervention = !actions.ecg && !actions.intervention;
  const severePainIgnored = state.patientStatus.pain >= 8 && state.elapsedMinutes >= 10 && noMeaningfulIntervention;
  const criticalPersistent = state.dynamicLoop.criticalTicks >= 3;
  const lowSpo2Persistent = state.dynamicLoop.lowSpo2Ticks >= 3;
  const ignoredInstability = state.dynamicLoop.ignoredInstabilityTicks >= 4;

  return {
    failed: criticalPersistent || lowSpo2Persistent || severePainIgnored || ignoredInstability,
    details: [
      criticalPersistent ? "위급 urgency가 지속됨" : "",
      lowSpo2Persistent ? "SpO₂ 90% 이하가 지속됨" : "",
      severePainIgnored ? "중증 흉통과 불안정성이 중재 없이 방치됨" : "",
      ignoredInstability ? "중증 불안정 상태에서 핵심 중재가 지연됨" : "",
    ].filter(Boolean),
    vitals: status.vitals,
    urgency,
  };
}

function patientStabilizationStatus() {
  const vitals = currentVitals();
  return {
    stable:
      state.patientStatus.pain <= 3 &&
      vitals.spo2 >= 95 &&
      vitals.hr <= 115 &&
      state.patientStatus.anxiety <= 45,
    vitals,
  };
}

function selectPatientVoice(status) {
  const vitals = currentVitals();
  const urgency = state.urgency || calculateClinicalUrgency();
  const baseline = state.interventionBaseline;
  const rules = [
    {
      key: "criticalRespiratory",
      when: () => urgency.level === "critical" && vitals.spo2 <= 90,
      lines: [
        "숨이... 너무 차요...",
        "말하기가 힘들어요. 숨이 너무 가빠요.",
      ],
      tone: "bad",
    },
    {
      key: "severeDistress",
      when: () => state.elapsedMinutes >= 4 && urgency.level === "severe" && state.patientStatus.pain >= 7.5,
      lines: [
        "숨쉬기 힘들어요. 가슴도 계속 아파요.",
        "점점 더 불안하고 답답해요.",
      ],
      tone: "warning",
    },
    {
      key: "morphineSedationWatch",
      when: () => hasFollowUpIntervention("morphine") && (vitals.rr <= 12 || state.patientStatus.breathing <= 42),
      lines: [
        "Pain is better, but I feel sleepy and my breathing feels slower.",
        "My chest hurts less, but I feel drowsy.",
      ],
      tone: "warning",
    },
    {
      key: "nitroDelayedDiscomfort",
      when: () => hasFollowUpIntervention("nitro") && minutesSinceFollowUp("nitro") >= 7 && state.patientStatus.pain >= 5.2,
      lines: [
        "It improved earlier, but the pressure is coming back a little.",
        "It is not completely gone. The tight feeling is still there.",
      ],
      tone: "warning",
    },
    {
      key: "oxygenGradualRelief",
      when: () => hasFollowUpIntervention("oxygen") && minutesSinceFollowUp("oxygen") >= 2 && vitals.spo2 >= 94,
      lines: [
        "The oxygen is slowly making it easier to breathe.",
        "The shortness of breath is easing gradually.",
      ],
      tone: "good",
    },
    {
      key: "postInterventionClearImprovement",
      when: () => baseline && state.prnMedicationsGiven.length > 0 && state.patientStatus.pain <= baseline.pain - 2 && vitals.spo2 >= baseline.spo2,
      lines: [
        "약 들어가고 가슴 누르는 느낌이 확실히 덜해졌어요.",
        "아까보다 숨도 덜 차고 통증도 조금 내려갔어요.",
      ],
      tone: "good",
    },
    {
      key: "postOxygenImprovement",
      when: () => baseline && state.oxygenApplied && vitals.spo2 > baseline.spo2 && state.patientStatus.breathing < baseline.breathing,
      lines: [
        "산소 하니까 숨쉬기가 조금 편해졌어요.",
        "말할 때 숨찬 느낌이 아까보다 덜해요.",
      ],
      tone: "good",
    },
    {
      key: "persistentAfterIntervention",
      when: () => baseline && state.prnMedicationsGiven.length > 0 && state.patientStatus.pain >= 5.5,
      lines: [
        "조금 덜하긴 한데 아직 가슴이 묵직해요.",
        "통증이 완전히 가시진 않았어요. 아직 답답합니다.",
      ],
      tone: "warning",
    },
    {
      key: "returningDiscomfort",
      when: () => baseline && state.patientStatus.pain > baseline.pain + 0.5,
      lines: [
        "다시 묵직하게 올라오는 느낌이 있어요.",
        "아까보다 가슴 답답함이 다시 심해지는 것 같아요.",
      ],
      tone: "warning",
    },
    {
      key: "moderateDistress",
      when: () => urgency.level === "moderate",
      lines: [
        "조금 답답해요. 숨이 편하진 않아요.",
        "아직 가슴이 묵직하고 불안해요.",
      ],
      tone: "warning",
    },
    {
      key: "stabilized",
      when: () => status.stable,
      lines: [
        "숨쉬기 조금 편해졌어요. 가슴도 아까보다 덜해요.",
        "이제 조금 안정되는 것 같아요.",
      ],
      tone: "good",
    },
    {
      key: "severePain",
      when: () => state.elapsedMinutes >= 3 && state.patientStatus.pain >= 7.5,
      lines: [
        "가슴이 계속 아파요. 묵직하게 눌리는 느낌이에요.",
        "통증이 아직 꽤 남아 있어요.",
      ],
      tone: "warning",
    },
    {
      key: "lowSpo2",
      when: () => vitals.spo2 <= 92,
      lines: [
        "숨이 조금 더 찬 것 같아요.",
        "말하면 숨이 조금 가빠요.",
      ],
      tone: "warning",
    },
    {
      key: "anxious",
      when: () => state.patientStatus.anxiety >= 82,
      lines: [
        "이거 심각한 건가요? 좀 불안해요.",
        "계속 이렇게 아프니까 무서워요.",
      ],
      tone: "warning",
    },
    {
      key: "improving",
      when: () => state.oxygenApplied || state.prnMedicationsGiven.length > 0,
      lines: [
        "조금 나아지는 것 같기도 해요.",
        "숨쉬기는 아까보다 조금 편해요.",
      ],
      tone: "good",
    },
  ];

  return rules.find((rule) => rule.when()) || {
    key: "watching",
    lines: ["아직 답답함은 남아 있어요."],
    tone: "",
  };
}

function updatePatientVoice(options = {}) {
  const status = patientStabilizationStatus();
  updateClinicalUrgency();
  const voice = selectPatientVoice(status);
  const line = voice.lines[Math.floor(Math.random() * voice.lines.length)];
  state.patientVoice = line;

  if (options.log && voice.key !== state.lastVoiceKey) {
    addLog(`환자 반응: "${line}"`, voice.tone);
    state.lastVoiceKey = voice.key;
  }
}

function followUpPhysiologyDrift() {
  const drift = { pain: 0, anxiety: 0, breathing: 0 };
  const nitroMinutes = minutesSinceFollowUp("nitro");
  const morphineMinutes = minutesSinceFollowUp("morphine");
  const oxygenMinutes = minutesSinceFollowUp("oxygen");

  if (nitroMinutes !== null) {
    if (nitroMinutes <= 3) {
      drift.pain -= 0.12;
      drift.anxiety -= 0.08;
      drift.breathing -= 0.02;
    } else if (nitroMinutes >= 6 && !hasFollowUpIntervention("morphine")) {
      drift.pain += 0.22;
      drift.anxiety += 0.06;
    }
  }

  if (morphineMinutes !== null) {
    if (morphineMinutes <= 6) {
      drift.pain -= 0.18;
      drift.anxiety -= 0.16;
      drift.breathing -= 0.16;
    } else {
      drift.anxiety -= 0.06;
      drift.breathing -= 0.08;
    }
  }

  if (oxygenMinutes !== null) {
    if (oxygenMinutes <= 5) {
      drift.anxiety -= 0.18;
      drift.breathing -= 0.46;
    } else {
      drift.anxiety -= 0.06;
      drift.breathing -= 0.12;
    }
  }

  return drift;
}

function addImpactValues(base, extra) {
  return {
    pain: (base.pain || 0) + (extra.pain || 0),
    anxiety: (base.anxiety || 0) + (extra.anxiety || 0),
    breathing: (base.breathing || 0) + (extra.breathing || 0),
  };
}

function followUpCueDue(key, minuteGap = 2) {
  const followUp = ensureFollowUpObservation();
  if (followUp.cues[key]) return false;
  if (state.elapsedMinutes - followUp.lastCueMinute < minuteGap) return false;
  followUp.cues[key] = true;
  followUp.lastCueMinute = state.elapsedMinutes;
  return true;
}

function updateFollowUpObservationCues() {
  const followUp = ensureFollowUpObservation();
  if (!followUp.active || state.outcome) return;

  const vitals = currentVitals();
  const nitroMinutes = minutesSinceFollowUp("nitro");
  const morphineMinutes = minutesSinceFollowUp("morphine");
  const oxygenMinutes = minutesSinceFollowUp("oxygen");

  if (nitroMinutes !== null && nitroMinutes >= 2 && followUpCueDue("nitro-bp-response")) {
    addLog("추적 관찰: Nitroglycerin 후 BP와 chest pain 변화를 다시 볼 시점입니다. 현재 BP " + vitals.bp + ", HR " + vitals.hr + ".", "good");
  }

  if (nitroMinutes !== null && nitroMinutes >= 7 && state.patientStatus.pain >= 5.2 && followUpCueDue("nitro-returning-discomfort")) {
    addLog("추적 관찰: 설하 Nitroglycerin 효과 뒤 흉부 묵직함이 다시 남는 양상입니다. 반복 사정과 보고 근거가 필요합니다.", "warning");
  }

  if (morphineMinutes !== null && morphineMinutes >= 2 && followUpCueDue("morphine-respiratory-check")) {
    addLog("추적 관찰: Morphine 후 통증은 낮아지지만 RR " + vitals.rr + "/min, SpO2 " + vitals.spo2 + "%로 호흡과 진정도를 계속 봐야 합니다.", Number(vitals.rr) <= 12 ? "warning" : "good");
  }

  if (morphineMinutes !== null && (Number(vitals.rr) <= 12 || state.patientStatus.breathing <= 42) && followUpCueDue("morphine-sedation-risk", 1)) {
    addLog("추적 관찰: Morphine 후 호흡수가 낮아지는 경향입니다. sedation과 호흡 억제를 즉시 재확인하세요.", "warning");
  }

  if (oxygenMinutes !== null && oxygenMinutes >= 2 && followUpCueDue("oxygen-gradual-response")) {
    addLog("추적 관찰: 산소 적용 후 SpO2 " + vitals.spo2 + "%로 서서히 반응 중입니다. 호흡 노력과 불안을 함께 관찰하세요.", "good");
  }
}

function tickPatientState() {
  if (!isPatientLoopActive()) return;

  if (isWardWorkflowEpisode()) {
    tickWardWorkflowState();
    return;
  }
  if (isGbsEpisode()) {
    tickGbsState();
    return;
  }

  const urgency = updateClinicalUrgency({ log: true });
  const interventionActive = hasActiveClinicalIntervention();
  const earlyDeteriorationRamp = interventionActive ? 1 : clamp((state.elapsedMinutes + 1) / 8, 0.45, 1);
  const pressure = untreatedCriticalProblem(urgency) && !interventionActive ? urgencyMultiplier(urgency.level) : 1;
  const painLoad = Math.max(0, state.patientStatus.pain - 5);
  const anxietyLoad = Math.max(0, state.patientStatus.anxiety - 62) / 20;
  const oxygenationLoad = Math.max(0, state.patientStatus.breathing - 58) / 22;
  const medicationRelief = state.prnMedicationsGiven.length > 0 ? 1 : 0;
  const oxygenRelief = state.oxygenApplied ? 1 : 0;
  const drift = interventionActive
    ? {
        pain: medicationRelief ? -0.16 : 0.02 + painLoad * 0.01,
        anxiety: (oxygenRelief || medicationRelief ? -0.42 : 0.1) + painLoad * 0.015,
        breathing: (oxygenRelief ? -0.92 : -0.04 * medicationRelief) + anxietyLoad * 0.04,
      }
    : {
        pain: (0.07 + oxygenationLoad * 0.015) * pressure * earlyDeteriorationRamp,
        anxiety: (0.24 + painLoad * 0.045 + oxygenationLoad * 0.08) * pressure * earlyDeteriorationRamp,
        breathing: (0.14 + anxietyLoad * 0.06 + painLoad * 0.025) * pressure * earlyDeteriorationRamp,
      };

  applyPatientImpact(addImpactValues(drift, followUpPhysiologyDrift()));
  state.elapsedMinutes += 1;
  updateFollowUpObservationCues();

  const status = patientStabilizationStatus();
  const stabilization = stabilizationOutcomeStatus(status, urgency);
  const deterioration = deteriorationOutcomeStatus(urgency, status);

  state.dynamicLoop.stabilizedTicks = stabilization.ready ? state.dynamicLoop.stabilizedTicks + 1 : 0;
  state.dynamicLoop.criticalTicks = urgency.level === "critical" ? state.dynamicLoop.criticalTicks + 1 : 0;
  state.dynamicLoop.lowSpo2Ticks = status.vitals.spo2 <= 90 ? state.dynamicLoop.lowSpo2Ticks + 1 : 0;
  state.dynamicLoop.ignoredInstabilityTicks = urgency.level === "severe" && !hasActiveClinicalIntervention() ? state.dynamicLoop.ignoredInstabilityTicks + 1 : 0;
  updatePatientVoice({ log: true });

  if (deterioration.failed) {
    setPatientOutcome("deteriorated", "중증 불안정 상태가 지속되었습니다.", deterioration.details);
    return;
  }

  if (state.dynamicLoop.stabilizedTicks >= 2) {
    setPatientOutcome("stabilized", "통증, 산소화, 심박수와 urgency가 안정화되었습니다.", stabilization.details);
    return;
  }

  renderVitals();
  renderPatientStatus();
  renderLogs();
  if (state.emrOpened) renderEmr();
  window.update3D?.(state, state.monitorOn ? currentVitals() : null);
}

function tickWardWorkflowState() {
  if (!state.wardWorkflow) state.wardWorkflow = createWardWorkflowState();
  const ward = state.wardWorkflow;
  const inActiveWardStage = ["wardBaseline", "wardDeterioration", "wardChargeNotify"].includes(state.stage);
  if (!inActiveWardStage) return;

  const noBedsideAction = ward.notifyingDoctor && ward.repeatBpCount < 2 && !ward.oxygenApplied && !ward.ivChecked;
  const bedsidePenalty = ward.bedsidePresence ? 0 : 7;
  const notifyPenalty = ward.notifyingDoctor && noBedsideAction ? 3 : 0;
  const monitorRelief = ward.monitorAttached ? 1.4 : 0;
  const oxygenRelief = ward.oxygenApplied ? 1.8 : 0;
  const ivRelief = ward.ivChecked ? 1.6 : 0;
  const netShock = 2.8 + bedsidePenalty + notifyPenalty - monitorRelief - oxygenRelief - ivRelief;

  ward.shockRisk = clamp(ward.shockRisk + netShock, 0, 100);
  ward.perfusion = clamp(ward.perfusion - 1.6 - ward.shockRisk / 75 + ivRelief * 0.35, 0, 100);
  ward.oxygenation = clamp(ward.oxygenation - 0.9 - ward.shockRisk / 95 + oxygenRelief * 0.55, 0, 100);
  ward.consciousness = clamp(ward.consciousness - 0.8 - ward.shockRisk / 110 + ward.mentalChecks * 0.08, 0, 100);
  ward.urineOutput = clamp(ward.urineOutput - 0.6 - ward.shockRisk / 130, 0, 100);
  ward.notificationTicks += ward.notifyingDoctor ? 1 : 0;
  state.elapsedMinutes += 1;

  const urgency = updateClinicalUrgency({ log: true });
  const actions = wardWorkflowReadyActions();
  const vitals = currentVitals();
  const [systolic = 0] = String(vitals.bp).split("/").map(Number);
  const bedsideFollowUpComplete = wardBedsideFollowUpComplete(actions);

  if (ward.notifyingDoctor && ward.notificationTicks % 2 === 1) {
    addLog(wardInstruction(), urgency.level === "critical" ? "warning" : "good");
  }

  if (ward.notificationTicks >= 2 && (urgency.level === "critical" || systolic < 82 || vitals.spo2 <= 86 || ward.consciousness <= 48)) {
    setWardOutcome("deteriorated", "차지 노티 전후 bedside 대응이 늦어 shock progression이 진행되었습니다.", [
      "SBP " + vitals.bp,
      "SpO₂ " + vitals.spo2 + "%",
      "의식 저하와 소변량 감소 지속",
    ]);
    return;
  }

  if (ward.notifyingDoctor && ward.notificationTicks >= 4 && bedsideFollowUpComplete && urgency.level !== "severe") {
    setWardOutcome("stabilized", "차지 노티 중 repeat BP, 산소, 모니터, IV 확인과 mental reassessment가 이어져 환자가 안정화 추세입니다.", [
      "차지 호출 후 bedside 역할 유지",
      "repeat BP/SpO₂/mental 재사정 수행",
      "IV와 산소 준비 완료",
      "최신 상태를 차지에게 업데이트",
    ]);
    return;
  }

  renderVitals();
  renderPatientStatus();
  renderLogs();
  window.update3D?.(state, state.monitorOn ? currentVitals() : null);
}

function gbsStabilizationReady(actions = gbsReadyActions()) {
  return actions.motor &&
    actions.reflex &&
    actions.coughSwallow &&
    actions.vc &&
    actions.etco2 &&
    actions.abga &&
    actions.aspiration &&
    actions.suction &&
    actions.charge &&
    actions.updateCharge &&
    actions.bedside;
}

function gbsInstruction() {
  const gbs = state.gbsWorkflow || createGbsWorkflowState();
  if (!gbs.vcChecked) return "차지: SpO₂가 괜찮아 보여도 GBS는 VC가 먼저 떨어질 수 있어요. VC 먼저 확인해주세요. 저는 담당의와 ICU 노티 준비할게요.";
  if (!gbs.monitorReviewed) return "차지: SpO₂ 숫자만 보지 말고 EtCO₂ 상승과 ECG/BP fluctuation을 같이 봐주세요.";
  if (!gbs.coughSwallowChecked || !gbs.aspirationPrecaution) return "차지: 짧은 문장, weak cough, drooling, dysphagia 확인하고 aspiration precaution 잡아주세요.";
  if (!gbs.abgaChecked) return "차지: ABGA 준비해서 PaCO₂ 상승 여부 확인해주세요.";
  return "차지: 좋아요. SpO₂ 정상 속 환기 저하 근거를 잡았습니다. ICU escalation 보고 중이니 VC, EtCO₂, cough/swallow 변화를 계속 업데이트해주세요.";
}

function gbsAction(action) {
  if (!state.gbsWorkflow) state.gbsWorkflow = createGbsWorkflowState();
  const gbs = state.gbsWorkflow;
  gbs.bedsidePresence = action !== "leftBedside";

  if (action === "motor") {
    gbs.motorChecked = true;
    gbs.weaknessLevel = clamp(gbs.weaknessLevel + 2, 0, 100);
    addLog("상하지 근력 사정: 양측 하지 4-/5, 발목 dorsiflexion 약화. 상행성 weakness가 확인됐습니다. 위험 포인트는 다음 단계인 호흡근 침범입니다.", "good");
    recordGbsAssessment("neuro", "Motor strength", "BLE 4-/5, ankle dorsiflexion 약화, grip 4+/5", "상행성 weakness progression 추적 필요");
    openEmr("notes");
  }
  if (action === "reflex") {
    gbs.reflexChecked = true;
    gbs.reflexLoss = clamp(gbs.reflexLoss + 4, 0, 100);
    addLog("DTR 사정: patellar/ankle reflex가 양측에서 감소했습니다. GBS의 말초신경 침범 근거가 강해졌습니다.", "good");
    recordGbsAssessment("neuro", "DTR/reflex", "Patellar/ankle reflex 양측 감소", "말초신경 탈수초성 변화와 일치");
    openEmr("notes");
  }
  if (action === "coughSwallow") {
    gbs.coughSwallowChecked = true;
    gbs.bulbarFunction = clamp(gbs.bulbarFunction - 2, 0, 100);
    addLog("Bulbar 사정: 한 문장이 짧고 기침이 약합니다. 침 삼킴이 느리고 물 삼킬 때 사레 위험이 있습니다. SpO₂보다 먼저 보이는 호흡근/연하 cue입니다.", "warning");
    recordGbsAssessment("airway", "Cough/Swallow", "Short sentence, weak cough, drooling, dysphagia risk", "bulbar weakness 가능성. 흡인 예방과 suction 준비 필요");
    openEmr("notes");
  }
  if (action === "vc") {
    gbs.vcChecked = true;
    gbs.vc = clamp(gbs.vc - 0.4, 12, 32);
    addLog("Vital capacity 측정: VC " + Math.round(gbs.vc) + " mL/kg. SpO₂가 괜찮아 보여도 호흡근 reserve가 줄어드는 근거입니다.", "good");
    recordGbsAssessment("respiratory", "Vital capacity", Math.round(gbs.vc) + " mL/kg", "SpO₂보다 먼저 보이는 호흡근 reserve 지표");
    openEmr("notes");
  }
  if (action === "monitor") {
    gbs.monitorReviewed = true;
    state.monitorOn = true;
    state.ekgAttached = true;
    addLog("모니터 확인: SpO₂ " + currentVitals().spo2 + "%로 안심하기 쉬운 수치지만 EtCO₂ " + Math.round(gbs.etco2) + " mmHg입니다. 산소화보다 환기 저하를 먼저 의심해야 합니다.", "warning");
    recordGbsAssessment("monitor", "SpO₂/EtCO₂/ECG/BP", "SpO₂ " + currentVitals().spo2 + "%, EtCO₂ " + Math.round(gbs.etco2) + " mmHg, BP/HR fluctuation 관찰", "oxygenation은 보존되어도 ventilation failure가 먼저 진행될 수 있음");
    openEmr("notes");
  }
  if (action === "abga") {
    gbs.abgaChecked = true;
    gbs.etco2 = clamp(gbs.etco2 + 0.4, 34, 58);
    addLog("EMR 검사 확인: ABGA에서 PaCO₂ " + Math.round(gbs.etco2 + 5) + " mmHg로 상승 경향을 확인했습니다. EtCO₂ 상승과 같은 방향입니다.", "good");
    recordGbsAssessment("lab", "ABGA/PaCO₂", "PaCO₂ " + Math.round(gbs.etco2 + 5) + " mmHg", "모니터 EtCO₂와 함께 hypoventilation/CO₂ retention 근거");
    openEmr("labs");
  }
  if (action === "aspiration") {
    gbs.aspirationPrecaution = true;
    gbs.headOfBedRaised = true;
    gbs.bulbarFunction = clamp(gbs.bulbarFunction + 3, 0, 100);
    addLog("Aspiration precaution: 침상 머리를 올리고 PO 보류, 삼킴/침 분비를 관찰합니다.", "good");
    recordGbsAssessment("airway", "Aspiration precaution", "HOB 30-45도 상승, PO 보류, 침 분비 관찰", "머리 올림이 3D 침상과 EMR에 반영됨");
    openEmr("notes");
  }
  if (action === "suction") {
    gbs.suctionReady = true;
    gbs.bulbarFunction = clamp(gbs.bulbarFunction + 2, 0, 100);
    addLog("Suction 준비: weak cough와 drooling에 대비해 suction과 airway cart를 bedside에 준비했습니다.", "good");
    recordGbsAssessment("airway", "Wall suction", "흡인 압력 확인, canister/catheter/airway cart 준비", "weak cough와 drooling 악화 대비");
    openEmr("notes");
  }
  if (action === "oxygen") {
    gbs.oxygenApplied = true;
    state.oxygenApplied = true;
    addLog("Wall O₂ 적용: 산소 라인을 연결했습니다. SpO₂는 좋아 보일 수 있지만 CO₂ 저류와 호흡근 약화는 그대로 진행될 수 있어 VC/EtCO₂를 계속 봅니다.", "warning");
    recordGbsAssessment("respiratory", "Wall O₂", "Flowmeter 연결 후 O₂ 적용", "산소는 산소화 보조이며 환기/호흡근 평가를 대체하지 않음");
    openEmr("notes");
  }
  if (action === "chargeCalled") {
    gbs.chargeCalled = true;
    gbs.chargeAtBedside = true;
    gbs.icuEscalated = true;
    addLog(gbsInstruction(), "good");
    recordGbsAssessment("communication", "Charge call", "SpO₂ 정상 속 VC 하락, EtCO₂ 상승, weak cough/dysphagia를 묶어 보고", "차지 bedside 도착 및 ICU/담당의 escalation 시작");
    openEmr("notes");
  }
  if (action === "updateCharge") {
    gbs.updatedCharge = true;
    addLog("차지 업데이트: SpO₂ 정상에 가려진 최신 VC " + Math.round(gbs.vc) + " mL/kg, EtCO₂ " + Math.round(gbs.etco2) + ", cough/swallow 변화를 전달했습니다.", "good");
    recordGbsAssessment("communication", "Charge update", "VC " + Math.round(gbs.vc) + " mL/kg, EtCO₂ " + Math.round(gbs.etco2) + " mmHg, cough/swallow 상태 전달", "ICU escalation 중 최신 bedside 정보 공유");
    openEmr("notes");
  }
  if (action === "waited") {
    gbs.waitedTicks += 1;
    gbs.respiratoryStrength = clamp(gbs.respiratoryStrength - 7, 0, 100);
    gbs.bulbarFunction = clamp(gbs.bulbarFunction - 5, 0, 100);
    gbs.etco2 = clamp(gbs.etco2 + 4, 34, 60);
  }
  if (action === "leftBedside") {
    gbs.leftBedsideTicks += 1;
    gbs.bedsidePresence = false;
    gbs.respiratoryStrength = clamp(gbs.respiratoryStrength - 9, 0, 100);
    gbs.autonomicStability = clamp(gbs.autonomicStability - 8, 0, 100);
  }

  refreshBedsidePhysiologyDisplay();

  if (gbs.chargeCalled && gbsStabilizationReady()) {
    setGbsOutcome("stabilized", "SpO₂만 보지 않고 VC, EtCO₂, ABGA, cough/swallow, dysautonomia를 묶어 조기 ICU escalation을 진행했습니다.", [
      "VC/EtCO₂/ABGA로 호흡근 악화 확인",
      "cough/swallow 확인과 aspiration precaution",
      "ECG/BP fluctuation monitoring",
      "차지에게 최신 상태 업데이트",
    ]);
  }
}

function tickGbsState() {
  if (!state.gbsWorkflow) state.gbsWorkflow = createGbsWorkflowState();
  const gbs = state.gbsWorkflow;
  const inActiveGbsStage = ["gbsIntro", "gbsDeterioration", "gbsEscalationNotify"].includes(state.stage);
  if (!inActiveGbsStage) return;

  const monitorRelief = gbs.monitorReviewed ? 0.24 : 0;
  const airwayRelief = (gbs.aspirationPrecaution ? 0.2 : 0) + (gbs.suctionReady ? 0.16 : 0);
  const escalationRelief = gbs.chargeCalled ? 0.28 : 0;
  gbs.respiratoryStrength = clamp(gbs.respiratoryStrength - 0.54 + monitorRelief + airwayRelief + escalationRelief, 0, 100);
  gbs.bulbarFunction = clamp(gbs.bulbarFunction - 0.42 + airwayRelief, 0, 100);
  gbs.autonomicStability = clamp(gbs.autonomicStability - 0.36 + monitorRelief * 0.25, 0, 100);
  gbs.weaknessLevel = clamp(gbs.weaknessLevel + 0.34, 0, 100);
  gbs.vc = clamp(gbs.vc - 0.12 - Math.max(0, 62 - gbs.respiratoryStrength) / 95, 10, 32);
  gbs.etco2 = clamp(gbs.etco2 + 0.22 + Math.max(0, 62 - gbs.respiratoryStrength) / 82, 34, 60);
  gbs.notificationTicks += gbs.chargeCalled ? 1 : 0;
  state.elapsedMinutes += 1;

  const urgency = updateClinicalUrgency({ log: true });
  const actions = gbsReadyActions();
  if (gbs.chargeCalled && gbs.notificationTicks % 2 === 1) addLog(gbsInstruction(), urgency.level === "critical" ? "warning" : "good");

  if (urgency.level === "critical" && state.elapsedMinutes >= 13 && (!gbs.chargeCalled || gbs.waitedTicks >= 2 || gbs.vc <= 12 || gbs.etco2 >= 56)) {
    setGbsOutcome("deteriorated", "SpO₂ 정상에 가려진 GBS 호흡근 악화가 늦게 인지되어 impending respiratory failure로 진행했습니다.", [
      "VC " + Math.round(gbs.vc) + " mL/kg",
      "EtCO₂ " + Math.round(gbs.etco2),
      "weak cough/swallow와 dysautonomia 지속",
    ]);
    return;
  }

  if (gbs.chargeCalled && gbs.notificationTicks >= 3 && gbsStabilizationReady(actions) && urgency.level !== "critical") {
    setGbsOutcome("stabilized", "SpO₂가 유지되는 동안 VC/EtCO₂/cough-swallow 단서를 조기에 묶어 보고하고 ICU escalation 준비가 진행되었습니다.", [
      "VC/EtCO₂/ABGA 추적",
      "aspiration precaution과 suction 준비",
      "ECG/BP fluctuation monitoring",
      "차지/의사 노티 중 bedside 지속",
    ]);
    return;
  }

  renderVitals();
  renderPatientStatus();
  renderLogs();
  window.update3D?.(state, state.monitorOn ? currentVitals() : null);
}

function setGbsOutcome(type, reason, details = []) {
  if (state.outcome) return;
  const urgency = state.urgency || calculateClinicalUrgency();
  const vitals = currentVitals();
  state.outcome = {
    type,
    reason,
    details,
    minute: state.elapsedMinutes,
    vitals,
    urgency,
    actions: gbsReadyActions(),
  };
  state.stabilized = type === "stabilized";
  state.stage = type === "stabilized" ? "gbsGoodEnd" : "gbsBadEnd";
  addLog(type === "stabilized" ? "결과: GBS respiratory risk를 조기에 escalation했습니다." : "결과: GBS 호흡부전 전조 인지가 지연되었습니다.", type === "stabilized" ? "good" : "bad");
  render();
}

function setWardOutcome(type, reason, details = []) {
  if (state.outcome) return;

  const urgency = state.urgency || calculateClinicalUrgency();
  const vitals = currentVitals();
  state.outcome = {
    type,
    reason,
    details,
    minute: state.elapsedMinutes,
    vitals,
    urgency,
    actions: wardWorkflowReadyActions(),
  };
  state.stabilized = type === "stabilized";
  state.stage = type === "stabilized" ? "wardGoodEnd" : "wardBadEnd";
  addLog(type === "stabilized" ? "결과: 액팅 workflow가 안정화에 기여했습니다." : "결과: 병동 workflow 공백으로 환자가 악화되었습니다.", type === "stabilized" ? "good" : "bad");
  render();
}

function startPatientStateLoop() {
  if (window.patientStateLoopId) return;
  state.dynamicLoop.lastTickAt = Date.now();
  window.patientStateLoopId = window.setInterval(tickPatientState, 5000);
}

function applyOxygenIntervention() {
  if (state.oxygenApplied) {
    addLog("산소요법: 이미 저유량 산소가 적용되어 있습니다.", "warning");
    render();
    return;
  }

  state.interventionBaseline = patientConditionSnapshot();
  state.lastReassessmentSnapshot = null;
  state.oxygenApplied = true;
  beginFollowUpObservation("oxygen", "Low-flow oxygen");
  markAssessmentComplete("vitals");
  addPostPrnReassessmentLog("vitals");
  applyScore({ safety: 2, clinical: 2, protocol: 1 });
  applyPatientImpact({ breathing: -12, anxiety: -4 });
  updatePatientVoice({ log: true });
  addLog("산소요법 시작: SpO₂와 호흡 양상을 확인한 뒤 저유량 산소를 적용했습니다.", "good");
  render();
}

function reassurePatient() {
  const firstReassurance = markAssessmentFinding(`reassurance-${state.stage}`);
  applyScore(firstReassurance ? { empathy: 3, safety: 1 } : {});
  applyPatientImpact(firstReassurance ? { anxiety: -8, cooperation: 3 } : { anxiety: -2 });
  addLog("환자 안정화 중재: 현재 처치 계획을 설명하고 천천히 호흡하도록 코칭했습니다.", firstReassurance ? "good" : "warning");
  render();
}

function recordPatientFinding(finding) {
  if (!finding?.key) return;
  state.patientFindings[finding.key] = {
    label: finding.label,
    value: finding.value,
  };
}

function handlePatientAssessmentFinding(findingKey) {
  const config = patientInteractionFindings[findingKey];
  if (!config) return false;

  if (config.assessment) markAssessmentComplete(config.assessment);
  revealPatientInfo(config.reveals);
  recordPatientFinding(config.finding);

  const firstFinding = markAssessmentFinding(config.findingId);
  applyScore(firstFinding ? config.score : {});
  applyPatientImpact(firstFinding ? config.patient : {});
  addLog(config.log, firstFinding ? "good" : "warning");
  recordEmrNursingNote(config.finding.label, config.finding.value, "bedside 직접 사정으로 기록됨", config.assessment || "assessment");
  render();
  return true;
}

function patientFindingsList() {
  return Object.values(state.patientFindings || {});
}

function handlePatientMenuAction(actionId) {
  if (actionId === "reassure") {
    reassurePatient();
    return;
  }

  if (actionId === "applyOxygen") {
    applyOxygenIntervention();
    return;
  }

  if (actionId === "symptomDialogue") {
    if (state.stage === "historyTaking") {
      const nextRequiredQuestion = requiredHistoryQuestions().find((question) => !state.askedQuestions.includes(question.id));

      if (nextRequiredQuestion) {
        askHistoryQuestion(nextRequiredQuestion);
        return;
      }
    }

    handlePatientAssessmentFinding("symptomDialogue");
    return;
  }

  if (actionId === "breathingEffort" || actionId === "skinPerfusion" || actionId === "radialPulse") {
    handlePatientAssessmentFinding(actionId);
    return;
  }

  if (actionId === "pain") {
    const nrsQuestion = historyQuestions.find((question) => question.id === "nrs");

    if (state.stage === "historyTaking" && nrsQuestion) {
      markAssessmentComplete("pain");
      addPostPrnReassessmentLog("pain");
      askHistoryQuestion(nrsQuestion);
      return;
    }

    markAssessmentComplete("pain");
      addPostPrnReassessmentLog("pain");
    const firstAssessment = markAssessmentFinding(`pain-${state.stage}`);
    revealPatientInfo({ pain: true });
    applyScore(firstAssessment ? { clinical: 3, empathy: 1 } : {});
    applyPatientImpact(firstAssessment ? { anxiety: -1, cooperation: 1 } : {});
    addLog("통증 사정: NRS " + state.patientStatus.pain + "/10, 불안 " + Math.round(state.patientStatus.anxiety) + ". " + patientSubjectiveResponse(), firstAssessment ? "good" : "warning");
    recordEmrNursingNote("통증 사정", "NRS " + state.patientStatus.pain + "/10, 불안 " + Math.round(state.patientStatus.anxiety), patientSubjectiveResponse(), "pain");
    render();
    return;
  }

  if (actionId === "vitals") {
    const firstAssessment = markAssessmentFinding(`vitals-${state.stage}`);

    if (completeVitalsAssessment("활력징후 사정 완료", firstAssessment ? { safety: 2, clinical: 2, protocol: 1 } : {})) {
      return;
    }

    markAssessmentComplete("vitals");
    addPostPrnReassessmentLog("vitals");
    revealPatientInfo({ breathing: true });
    applyScore(firstAssessment ? { safety: 2, clinical: 2, protocol: 1 } : {});
    {
      const vitals = currentVitals();
      addLog("활력징후 사정: HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%, BP " + vitals.bp + ", 호흡 " + breathingLabel(state.patientStatus.breathing) + ". " + patientSubjectiveResponse(), firstAssessment ? "good" : "warning");
      recordEmrNursingNote("활력징후", "HR " + vitals.hr + ", SpO₂ " + vitals.spo2 + "%, BP " + vitals.bp, "호흡 " + breathingLabel(state.patientStatus.breathing), "vitals");
    }
    render();
    return;
  }

  if (actionId === "history") {
    const hasMissingHistory = !patientHistoryReviewed();

    if (state.stage === "intro") {
      const introduced = chooseSceneAction(0);
      const started = introduced && state.stage === "rapport" ? chooseSceneAction(0) : false;
      if (started && state.stage === "historyTaking") openPatientHistoryConversation(currentInteractionPoint());
      return;
    }

    if (state.stage === "rapport") {
      const started = chooseSceneAction(0);
      if (started && state.stage === "historyTaking") openPatientHistoryConversation(currentInteractionPoint());
      return;
    }

    if (state.stage === "historyTaking") {
      openPatientHistoryConversation(currentInteractionPoint());
      return;
    }

    if (hasMissingHistory && !state.outcome) {
      addLog("흉통 문진 보완: 아직 확인하지 않은 핵심 질문을 다시 엽니다.", "good");
      openPatientHistoryConversation(currentInteractionPoint());
      return;
    }

    addLog("흉통 문진: 문진 정보는 이미 수집되었거나 현재 단계에서는 진행 선택지로 이어집니다.", "warning");
    render();
    return;
  }

  if (actionId === "consciousness") {
    handlePatientAssessmentFinding("mentalStatus");
  }
}

function hasMinimumAssessmentForEcg() {
  return Boolean(
    patientHistoryReviewed() ||
      state.assessed ||
      state.knownPatientInfo.pain ||
      state.knownPatientInfo.breathing ||
      isAssessmentComplete("pain") ||
      isAssessmentComplete("vitals"),
  );
}

function startBedsideEcgWorkflow(source = "침상 모니터") {
  if (state.stage === "concept") {
    addLog("ECG 모니터링: 먼저 시뮬레이션을 시작하세요.", "warning");
    render();
    return;
  }

  if (state.ekgAttached || state.monitorOn) {
    addLog("ECG 모니터링: 이미 지속 모니터링이 활성화되어 있습니다. 모니터 수치와 파형을 확인하세요.", "warning");
    renderEcgMonitoringOverlay("ongoing");
    return;
  }

  if (!hasMinimumAssessmentForEcg()) {
    addLog("ECG 모니터링: 적용 전 환자의 현재 흉통 또는 기본 상태를 먼저 확인하세요.", "warning");
    applyScore({ empathy: -1, protocol: -1 });
    render();
    return;
  }

  state.ecgWorkflowStarted = true;
  state.ekgAttached = true;
  state.monitorOn = true;
  state.procedure = [];
  state.procedureFeedback = {};
  applyScore({ safety: 2, clinical: 2, protocol: 2 });
  addLog("ECG 모니터링 시작: " + source + " - 지속 흉통과 활력징후를 근거로 bedside waveform monitoring을 시작했습니다.", "good");
  state.stage = "monitoring";
  render();
  renderEcgMonitoringOverlay("started");
}

function monitorClinicalInterpretation() {
  const vitals = currentVitals();
  const urgency = state.urgency || calculateClinicalUrgency();
  const pain = state.patientStatus.pain;
  const anxiety = state.patientStatus.anxiety;
  const breathing = state.patientStatus.breathing;
  const rhythm = vitals.hr >= 128
    ? "Marked sinus tachycardia"
    : vitals.hr >= 116
      ? "Sinus tachycardia"
      : "Sinus rhythm";
  const observations = [rhythm];

  if (vitals.spo2 <= 90) observations.push("SpO2 critical");
  else if (vitals.spo2 <= 92) observations.push("SpO2 low");
  else if (state.oxygenApplied && vitals.spo2 >= 94) observations.push("SpO2 improving");
  else observations.push("SpO2 borderline");

  if (vitals.rr >= 28) observations.push("RR elevated");
  else if (vitals.rr >= 22) observations.push("RR watch");

  if (pain >= 6 && vitals.hr >= 112) observations.push("Persistent chest pain pattern");
  if (state.prnMedicationsGiven.includes("morphine") && pain <= 5 && vitals.hr <= 118) observations.push("Analgesic response");
  if (anxiety >= 82 || breathing >= 76) observations.push("Respiratory artifact risk");
  if (urgency.level === "critical" || urgency.level === "severe") observations.push("Alarm priority");

  return { rhythm, observations, urgencyLabel: urgency.label, urgencyLevel: urgency.level, vitals };
}

function plethWaveShape(phase) {
  if (phase < 0.08) return phase / 0.08;
  if (phase < 0.18) return 1 - ((phase - 0.08) / 0.1) * 0.18;
  if (phase < 0.32) return 0.82 - ((phase - 0.18) / 0.14) * 0.3;
  if (phase < 0.4) return 0.52 - Math.sin(((phase - 0.32) / 0.08) * Math.PI) * 0.16;
  if (phase < 0.54) return 0.44 + Math.sin(((phase - 0.4) / 0.14) * Math.PI) * 0.12;
  return Math.max(0, 0.44 * (1 - (phase - 0.54) / 0.46));
}

function createPlethSvgPoints(vitals, width = 520, height = 72) {
  const spo2 = Number(vitals?.spo2 || 98);
  const rr = Number(vitals?.rr || 20);
  const perfusionLoss = clamp((94 - spo2) / 10, 0, 0.65);
  const baseline = height * 0.68;
  const amplitude = 26 * (1 - perfusionLoss * 0.45);
  const beatWidth = clamp(82 - (Number(vitals?.hr || 108) - 95) * 0.16, 62, 88);
  const breathingEffort = clamp((rr - 18) / 16 + Math.max(0, 94 - spo2) / 9, 0, 1);
  const points = [];

  for (let x = 0; x <= width; x += 5) {
    const phase = ((x % beatWidth) + beatWidth) % beatWidth / beatWidth;
    const shape = plethWaveShape(phase);
    const respiratoryVariation = Math.sin(x * 0.018) * (2.1 + breathingEffort * 1.4);
    const artifact = Math.sin(x * 0.31) * perfusionLoss * 3.2;
    const y = baseline - shape * amplitude + respiratoryVariation + artifact;
    points.push(`${x.toFixed(0)},${clamp(y, 8, height - 8).toFixed(1)}`);
  }

  return points.join(" ");
}

function renderEcgMonitoringOverlay(mode = "review") {
  if (!ecgProcedureOverlayEl) return;

  const interpretation = monitorClinicalInterpretation();
  const vitals = interpretation.vitals;
  ecgProcedureOverlayEl.innerHTML = "";
  ecgProcedureOverlayEl.hidden = false;

  const spo2Class = vitals.spo2 <= 90 ? "critical" : vitals.spo2 <= 92 ? "warning" : "stable";
  const hrClass = vitals.hr >= 128 ? "critical" : vitals.hr >= 116 ? "warning" : "stable";
  const rrClass = vitals.rr >= 30 ? "critical" : vitals.rr >= 24 ? "warning" : "stable";
  const urgencyClass = interpretation.urgencyLevel === "critical" || interpretation.urgencyLevel === "severe" ? "critical" : interpretation.urgencyLevel === "moderate" ? "warning" : "stable";
  const plethPoints = createPlethSvgPoints(vitals);
  const shell = document.createElement("div");
  shell.className = "ecg-monitoring-shell monitor-focused";
  const gbs = isGbsEpisode() ? (state.gbsWorkflow || createGbsWorkflowState()) : null;
  const neuroMetrics = gbs
    ? "<div class=\"device-neuro-strip\">" +
        "<span>EtCO₂ <strong>" + Math.round(gbs.etco2) + "</strong> mmHg</span>" +
        "<span>SpO₂ <strong>" + vitals.spo2 + "</strong>%</span>" +
        "<span>NIBP <strong>" + vitals.bp + "</strong></span>" +
        "<span>Cough/Swallow <strong>" + (gbs.bulbarFunction <= 62 ? "WEAK" : "WATCH") + "</strong></span>" +
      "</div>"
    : "";
  shell.innerHTML =
    "<div class=\"bedside-device-bezel\">" +
      "<div class=\"device-monitor-screen\">" +
        "<div class=\"device-monitor-header\"><span>KHSIM INTELLIVUE</span><strong>" + (mode === "started" ? "MONITORING ACTIVE" : "BEDSIDE MONITOR") + "</strong><small>" + (gbs ? "II  SpO₂  CO₂  NIBP" : "II  x1.0  NIBP AUTO") + "</small></div>" +
        "<div class=\"device-monitor-grid\">" +
          "<section class=\"device-wave-stack\" aria-label=\"bedside monitor waveforms\">" +
            "<div class=\"device-wave-row ecg\"><span>ECG II</span><svg viewBox=\"0 0 520 86\" role=\"img\" aria-label=\"ECG waveform\"><polyline points=\"0,47 42,47 54,40 64,47 82,47 94,16 104,70 118,47 166,47 178,39 190,47 236,47 248,18 260,68 276,47 326,47 338,39 350,47 398,47 410,17 422,70 438,47 486,47 498,39 520,47\" /></svg></div>" +
            "<div class=\"device-wave-row pleth\"><span>SpO2 PLETH</span><svg viewBox=\"0 0 520 72\" role=\"img\" aria-label=\"SpO2 pleth waveform\"><polyline points=\"" + plethPoints + "\" /></svg></div>" +
            "<div class=\"device-wave-row " + (gbs ? "co2" : "resp") + "\"><span>" + (gbs ? "CO₂" : "RESP") + "</span><svg viewBox=\"0 0 520 64\" role=\"img\" aria-label=\"" + (gbs ? "capnogram waveform" : "respiratory waveform") + "\"><polyline points=\"" + (gbs ? "0,52 34,52 52,18 160,16 178,52 224,52 242,19 350,17 368,52 414,52 432,20 520,18" : "0,42 28,40 58,35 88,27 118,22 148,25 178,34 208,42 238,44 268,41 298,35 328,27 358,22 388,25 418,34 448,42 478,44 520,41") + "\" /></svg></div>" +
          "</section>" +
          "<dl class=\"device-vital-bank\" aria-label=\"monitor vital signs\">" +
            "<div class=\"hr " + hrClass + "\"><dt>HR</dt><dd>" + vitals.hr + "<small>bpm</small></dd></div>" +
            "<div class=\"spo2 " + spo2Class + "\"><dt>SpO2</dt><dd>" + vitals.spo2 + "<small>%</small></dd></div>" +
            (gbs ? "<div class=\"rr " + rrClass + "\"><dt>EtCO2</dt><dd>" + Math.round(gbs.etco2) + "<small>mmHg</small></dd></div>" : "<div class=\"rr " + rrClass + "\"><dt>RR</dt><dd>" + vitals.rr + "<small>/min</small></dd></div>") +
            "<div class=\"bp\"><dt>NIBP</dt><dd>" + vitals.bp + "<small>mmHg</small></dd></div>" +
          "</dl>" +
        "</div>" +
        neuroMetrics +
        "<div class=\"device-observation-strip\"><span class=\"" + urgencyClass + "\">URG " + interpretation.urgencyLabel + "</span>" + interpretation.observations.map((note) => "<span>" + note + "</span>").join("") + "</div>" +
      "</div>" +
    "</div>";

  const actions = document.createElement("div");
  actions.className = "ecg-monitoring-actions";

  const rhythm = document.createElement("button");
  rhythm.type = "button";
  rhythm.className = "primary";
  rhythm.textContent = gbs ? "EtCO₂/capnogram 기록" : "리듬/파형 해석";
  rhythm.addEventListener("click", () => {
    closeEcgProcedureOverlay();
    if (gbs) {
      gbsAction("monitor");
      render();
    } else handleMonitorMenuAction("analyzeWaveform");
  });

  const vitalsButton = document.createElement("button");
  vitalsButton.type = "button";
  vitalsButton.textContent = gbs ? "SpO₂/ECG/BP 기록" : "모니터 활력 확인";
  vitalsButton.addEventListener("click", () => {
    closeEcgProcedureOverlay();
    if (gbs) {
      gbsAction("monitor");
      render();
    } else handleMonitorMenuAction("checkVitals");
  });

  const abgaButton = document.createElement("button");
  abgaButton.type = "button";
  abgaButton.textContent = "EMR에서 PaCO₂ 확인";
  abgaButton.addEventListener("click", () => {
    closeEcgProcedureOverlay();
    openEmr("labs");
  });

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "병실 보기";
  close.addEventListener("click", closeEcgProcedureOverlay);

  if (gbs) actions.append(rhythm, vitalsButton, abgaButton, close);
  else actions.append(rhythm, vitalsButton, close);
  shell.append(actions);
  ecgProcedureOverlayEl.append(shell);
}

function handleMonitorMenuAction(actionId) {
  if (actionId === "startEcgWorkflow") {
    startBedsideEcgWorkflow("침상 모니터");
    return;
  }

  if (actionId === "expandEcg") {
    if (!state.monitorOn && !state.ekgAttached) {
      addLog("ECG 확대 확인: 아직 ECG 모니터링이 활성화되지 않았습니다. 침상 모니터를 먼저 시작하세요.", "warning");
      render();
      return;
    }

    markAssessmentComplete("ecgReview");
    addPostPrnReassessmentLog("ecgReview");
    const firstReview = markAssessmentFinding("ecg-expanded");
    applyScore(firstReview ? { clinical: 2, protocol: 1 } : {});
    {
      const interpretation = monitorClinicalInterpretation();
      addLog("ECG 해석: " + interpretation.observations.join(" / "), firstReview ? "good" : "warning");
      recordEmrNursingNote("모니터 확대 확인", interpretation.observations.join(" / "), "bedside monitor 화면에서 확인", "monitor");
    }
    if (isGbsEpisode() && state.gbsWorkflow) {
      addLog("모니터 확대: 침상 모니터에서 SpO₂, ECG, NIBP, EtCO₂ 숫자와 capnogram을 확인합니다. VC는 bedside spirometry, PaCO₂는 EMR ABGA로 확인하세요.", "good");
    }
    render();
    renderEcgMonitoringOverlay("review");
    return;
  }

  if (actionId === "checkVitals") {
    const vitals = currentVitals();
    const firstReview = markAssessmentFinding(`monitor-vitals-${state.stage}`);

    if (completeVitalsAssessment(`모니터 활력징후 확인: HR ${vitals.hr}, SpO₂ ${vitals.spo2}%, BP ${vitals.bp}`, firstReview ? { safety: 2, clinical: 2 } : {})) {
      return;
    }

    if (!state.monitorOn) {
      addLog("모니터 활력징후 확인: 아직 대기 상태입니다. 환자에게 설명하고 ECG 모니터를 연결하세요.", "warning");
      render();
      return;
    }

    markAssessmentComplete("vitals");
    addPostPrnReassessmentLog("vitals");
    applyScore(firstReview ? { safety: 2, clinical: 2 } : {});
    addLog(`모니터 활력징후 확인: HR ${vitals.hr}, SpO₂ ${vitals.spo2}%, BP ${vitals.bp}.`, firstReview ? "good" : "warning");
    recordEmrNursingNote("모니터 활력징후", `HR ${vitals.hr}, SpO₂ ${vitals.spo2}%, BP ${vitals.bp}`, "침상 모니터에서 확인", "monitor");
    render();
    return;
  }

  if (actionId === "analyzeWaveform") {
    if (state.stage === "vitals" && !state.ekgAttached) {
      startBedsideEcgWorkflow("침상 모니터 파형 조작");
      return;
    }

    if (!state.ekgAttached) {
      addLog("ECG 파형 분석: 침상 모니터링을 먼저 활성화해야 파형 해석이 가능합니다.", "warning");
      render();
      return;
    }

    markAssessmentComplete("ecgReview");
    addPostPrnReassessmentLog("ecgReview");
    const firstReview = markAssessmentFinding("waveform-analysis");
    applyScore(firstReview ? { clinical: 3, safety: 1 } : {});
    {
      const interpretation = monitorClinicalInterpretation();
      addLog("ECG 파형 분석: " + interpretation.observations.join(" / "), firstReview ? "good" : "warning");
      recordEmrNursingNote("ECG 파형 분석", interpretation.observations.join(" / "), "침상 모니터에서 확인", "monitor");
    }
    render();
  }
}

function handleMedicationMenuAction(actionId) {
  if (state.stage === "prnDecision") {
    renderMedicationContextWindow();
  }


  if (actionId === "verifyMedication") {
    const order = selectedMedicationOrder();

    if (!order) {
      addLog("투약 확인: 먼저 투약 카트에서 PRN medication을 선택하고 준비하세요.", "warning");
      render();
      return;
    }

    verifyMedicationDose(order.correctDose);
    return;
  }

  if (actionId === "prepareNitro") {
    prepareMedicationOrder("nitro");
    return;
  }

  if (actionId === "prepareMorphine") {
    prepareMedicationOrder("morphine");
  }
}

function handleChartMenuAction(actionId) {
  if (actionId === "regularMedication") {
    openEmr("orders");
    openRegularMedicationWorkflow("차트 정규 약물 투여");
    return;
  }

  if (actionId === "prnMedication") {
    openEmr("meds");
    openPrnMedicationWorkflow("차트 PRN 약물 투여");
    return;
  }

  if (actionId === "reviewOrders" && state.stage === "monitoring") {
    openEmr("orders");
    addLog("전체 처방 보기: 정규 약물과 PRN 처방을 확인했습니다. 정규 투여가 필요하면 '정규 약물 투여'를 선택하세요.", "good");
    return;
  }

  if (actionId === "reviewOrders") {
    openEmr("orders");
    return;
  }

  if (actionId === "reviewLabs") {
    const firstReview = markAssessmentFinding("lab-review");
    revealPatientInfo({ cardiacRisk: true });
    applyScore(firstReview ? { clinical: 2 } : {});
    addLog("검사 확인 완료: Troponin I와 CK-MB 상승을 확인해 ACS 가능성을 다시 고려했습니다.", firstReview ? "good" : "warning");
    openEmr("labs");
  }
}

document.addEventListener("click", (event) => {
  if (interactionMenuEl && !interactionMenuEl.hidden && !interactionMenuEl.contains(event.target)) {
    closeClinicalInteractionMenu();
  }

  if (patientConversationEl && !patientConversationEl.hidden && !patientConversationEl.contains(event.target)) {
    closePatientConversation();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeClinicalInteractionMenu();
    closePatientConversation();
    closeEcgProcedureOverlay();
    closePhysicianContact();
    closeEmr();
    closeContextWindow();
  }
});

window.openClinicalInteractionMenu = openClinicalInteractionMenu;

function askHistoryQuestion(question) {
  if (state.askedQuestions.includes(question.id)) {
    addLog(`이미 확인한 문진: ${question.label}`, "warning");
    render();
    return;
  }

  state.askedQuestions.push(question.id);
  revealPatientInfo(question.reveals);
  applyScore(question.score);
  applyPatientImpact(question.patient);
  addLog(`${question.label} → ${question.response}`, question.tone || "good");
  recordEmrNursingNote(question.label, question.response, "환자 문진 응답", "history");
  render();
}

function revealPatientInfo(reveals) {
  if (!reveals) return;

  Object.entries(reveals).forEach(([key, value]) => {
    state.knownPatientInfo[key] = value;
  });
}

function completeHistoryTaking() {
  const missing = requiredHistoryQuestions().filter((question) => !state.askedQuestions.includes(question.id));

  if (missing.length > 0) {
    addLog(`문진 부족: ${missing.map((question) => question.label).join(", ")}`, "warning");
    applyScore({ safety: -2, clinical: -3 });
    applyPatientImpact({ anxiety: 3 });
    render();
    return;
  }

  state.assessed = true;
  applyScore({ safety: 5, clinical: 5, protocol: 3 });
  addLog("핵심 흉통 문진을 완료했습니다. 이제 침상에서 활력징후와 객관적 사정을 확인하세요.", "good");
  state.stage = "assessment";
  render();
}

function completeVitalsAssessment(source = "침상 활력징후 확인", scoreChange = { safety: 2, clinical: 2, protocol: 1 }) {
  markAssessmentComplete("vitals");
  addPostPrnReassessmentLog("vitals");
  revealPatientInfo({ breathing: true });
  applyScore(scoreChange);

  if (state.stage === "assessment" || state.stage === "callTooSoon") {
    applyPatientImpact({ anxiety: -2, cooperation: 2 });
    addLog(source + ": 활력징후 자료가 확보되었습니다. 지속 흉통이 있어 침상 모니터에서 ECG 모니터링을 판단하세요.", "good");
    state.stage = "vitals";
    render();
    return true;
  }

  return false;
}

function beginRegularOrdersFromReview(source = "처방 확인") {
  if (state.stage !== "monitoring") return false;

  applyScore({ clinical: 4, protocol: 4 });
  addLog(source + ": ECG 적용 후 active 정규 처방을 확인했습니다. 필요한 처방을 적용하세요.", "good");
  state.stage = "regularOrders";
  closeEmr();
  render();
  renderOrderContextWindow();
  return true;
}

function openRegularMedicationWorkflow(source = "정규 약물 투여") {
  if (state.stage === "monitoring") {
    return beginRegularOrdersFromReview(source);
  }

  if (state.stage === "regularOrders") {
    addLog(source + ": 정규 약물 투여 창을 다시 열었습니다.", "good");
    closeEmr();
    render();
    renderOrderContextWindow();
    return true;
  }

  if (state.appliedRegularOrders.length > 0 && requiredRegularOrdersComplete()) {
    addLog(source + ": 필수 정규 약물은 이미 적용되었습니다. 통증 지속 시 PRN 약물 투여를 판단하세요.", "warning");
    render();
    return false;
  }

  addLog(source + ": ECG 모니터링과 active order 확인 후 정규 약물 투여를 시작할 수 있습니다.", "warning");
  render();
  return false;
}

function openPrnMedicationWorkflow(source = "PRN 약물 투여") {
  if (state.stage === "prnDecision") {
    addLog(source + ": PRN order를 route별로 선택하고 dose를 확인하세요.", "good");
    renderMedicationContextWindow();
    render();
    return true;
  }

  if (!requiredRegularOrdersComplete()) {
    addLog(source + ": PRN은 정규 약물/중재 적용 후 지속 증상을 근거로 판단합니다. 먼저 정규 약물 투여를 완료하세요.", "warning");
    if (state.stage === "monitoring" || state.stage === "regularOrders") renderOrderContextWindow();
    render();
    return false;
  }

  addLog(source + ": PRN 투여 전 통증, 활력징후, ECG 등 현재 증상을 다시 확인하세요.", "warning");
  render();
  return false;
}

function requiredHistoryQuestions() {
  return historyQuestions.filter((question) => question.required);
}

function answeredRequiredCount() {
  return requiredHistoryQuestions().filter((question) => state.askedQuestions.includes(question.id)).length;
}

function allRequiredRegularOrdersApplied() {
  return patient.regularOrders.every((order) => !order.required || state.appliedRegularOrders.includes(order.id));
}

function applyRegularOrder(order, doseValue) {
  if (state.appliedRegularOrders.includes(order.id)) {
    addLog(`이미 적용된 처방입니다: ${order.label}`, "warning");
    render();
    return;
  }

  if (typeof order.correctDose === "number") {
    const dose = Number(doseValue);

    if (!Number.isFinite(dose)) {
      addLog(`${order.label} 적용 전 dose/rate 입력이 필요합니다.`, "warning");
      render();
      return;
    }

    if (Math.abs(dose - order.correctDose) > 0.001) {
      addLog(`잘못된 dose/rate: ${dose} ${order.unit}. 처방을 적용할 수 없습니다.`, "bad");
      applyScore({ safety: -5, clinical: -3, protocol: -5 });
      applyPatientImpact({ pain: 2, anxiety: 4 });
      render();
      return;
    }
  }

  state.appliedRegularOrders.push(order.id);
  applyScore({ safety: 3, clinical: 3, protocol: 3 });
  addLog(`정규 처방 적용 완료: ${order.label}`, "good");

  if (order.id === "ns") applyPatientImpact({ anxiety: -1 });
  if (order.id === "aspirin") applyPatientImpact({ pain: -1 });
  if (order.id === "ekg") state.monitorOn = true;

  if (state.stage === "regularOrders" && allRequiredRegularOrdersApplied()) {
    addLog("필수 정규 처방이 모두 적용되었습니다. Chest pain 지속 여부를 바탕으로 PRN medication을 판단하세요.", "good");
    state.stage = "prnDecision";
  }

  render();
}

function completeRegularOrders() {
  const missing = patient.regularOrders.filter((order) => order.required && !state.appliedRegularOrders.includes(order.id));

  if (missing.length > 0) {
    addLog(`정규 처방 미완료: ${missing.map((order) => order.label).join(", ")}`, "warning");
    applyScore({ safety: -3, clinical: -3, protocol: -4 });
    applyPatientImpact({ pain: 1, anxiety: 3 });
    render();
    return;
  }

  addLog("정규 처방을 완료했습니다. Chest pain이 지속되어 PRN medication을 평가합니다.", "good");
  state.stage = "prnDecision";
  render();
}

function administerPrnMedication(order, doseValue) {
  const missingAssessments = missingAssessmentLabels(["pain"]);

  if (missingAssessments.length > 0) {
    addAssessmentRequiredLog(missingAssessments, order.label);
    render();
    return;
  }

  const dose = Number(doseValue);

  if (!Number.isFinite(dose)) {
    addLog(`${order.label} 투여 전 dose 입력이 필요합니다.`, "warning");
    render();
    return;
  }

  if (Math.abs(dose - order.correctDose) > 0.001) {
    addLog(`잘못된 dose: ${dose} ${order.unit}. 투약을 진행할 수 없습니다.`, "bad");
    applyScore({ safety: -6, clinical: -4, protocol: -6 });
    applyPatientImpact({ pain: 2, anxiety: 5 });
    render();
    return;
  }

  if (state.prnMedicationsGiven.includes(order.id)) {
    addLog(`이미 투여된 medication입니다: ${order.label}`, "warning");
    render();
    return;
  }

  state.interventionBaseline = patientConditionSnapshot();
  state.lastReassessmentSnapshot = null;
  state.prnMedicationsGiven.push(order.id);
  state.postPrnReassessment = {
    pain: false,
    vitals: false,
    ecgReview: false,
  };
  applyScore({ safety: 5, clinical: 5, protocol: 5 });
  applyPatientImpact(order.id === "nitro" ? { pain: -3, anxiety: -3, breathing: -1 } : { pain: -4, anxiety: -5, breathing: -2 });
  addLog(`투약 완료: ${order.label}, dose ${dose} ${order.unit}`, "good");
  state.elapsedMinutes += 5;
  beginFollowUpObservation(order.id, order.label);
  state.stage = "persistentSymptoms";
  resetMedicationWorkflow();
  closeContextWindow();
  render();
}

function selectSbar(component, optionId) {
  state.sbarSelections[component] = optionId;
  render();
}

function submitSbar() {
  const missingAssessments = missingAssessmentLabels(["vitals", "history"]);

  if (missingAssessments.length > 0) {
    addAssessmentRequiredLog(missingAssessments, "SBAR 보고");
    render();
    return;
  }

  const missingReassessment = missingPostPrnReassessmentLabels();

  if (missingReassessment.length > 0) {
    addPostPrnRequiredLog(missingReassessment);
    render();
    return;
  }

  const dynamicSbarOptions = buildSbarOptions();
  normalizeSbarSelections(dynamicSbarOptions);
  const components = Object.keys(dynamicSbarOptions);
  const incomplete = components.filter((component) => !state.sbarSelections[component]);

  if (incomplete.length > 0) {
    addLog(`SBAR 미완성: ${incomplete.join(", ")}`, "warning");
    render();
    return;
  }

  const incorrect = components.filter((component) => {
    const selected = dynamicSbarOptions[component].find((option) => option.id === state.sbarSelections[component]);
    return !selected?.correct;
  });

  if (incorrect.length > 0) {
    addLog(`수정이 필요한 SBAR 항목: ${incorrect.join(", ")}`, "bad");
    applyScore({ safety: -6, clinical: -6, protocol: -5 });
    applyPatientImpact({ anxiety: 6 });
    render();
    return;
  }

  const readiness = sbarReadinessSummary();

  if (readiness.score >= 80) {
    addLog("SBAR 보고 품질 우수: 사정, 모니터링, 중재 근거가 명확합니다.", "good");
    applyScore({ safety: 10, clinical: 10, protocol: 8 });
    applyPatientImpact({ anxiety: -7, cooperation: 5 });
  } else if (readiness.score >= 50) {
    addLog("SBAR 보고 완료: 핵심 내용은 전달했지만 일부 임상 근거 보완이 필요합니다.", "warning");
    applyScore({ safety: 5, clinical: 5, protocol: 4 });
    applyPatientImpact({ anxiety: -4, cooperation: 3 });
  } else {
    addLog("SBAR 보고 품질 낮음: 사정 자료가 부족해 의사소통 근거가 약합니다.", "bad");
    applyScore({ safety: -4, clinical: -4, protocol: -3 });
    applyPatientImpact({ anxiety: 3 });
  }
  closeContextWindow();
  addLog("차지 간호사: SBAR 확인했습니다. 제가 담당의에게 노티할게요. 그동안 환자 곁에서 pain, BP, SpO₂와 ECG 변화를 계속 봐주세요.", "good");
  state.chargeFollowUp = {
    active: true,
    pain: false,
    vitals: false,
    monitor: false,
    oxygen: state.oxygenApplied,
    updateCharge: false,
    waited: 0,
  };
  state.stage = "postSbarBedside";
  render();
}

function chooseProcedureStep(step) {
  state.procedureFeedback = {};

  if (state.procedure.includes(step.id)) {
    state.procedure = state.procedure.filter((stepId) => stepId !== step.id);
    addLog(`선택 취소: ${step.label}`, "warning");
    render();
    return;
  }

  if (state.procedure.length >= procedureSteps.length) {
    addLog("이미 모든 절차를 선택했습니다. 수정하려면 항목을 다시 눌러 취소하세요.", "warning");
    render();
    return;
  }

  state.procedure.push(step.id);
  addLog(`${state.procedure.length}번으로 선택: ${step.label}`);
  render();
}

function performCurrentEcgStep() {
  const nextStep = procedureSteps[state.procedure.length];

  if (!nextStep) {
    submitProcedure();
    return;
  }

  state.procedureFeedback = {};
  state.procedure.push(nextStep.id);
  addLog("ECG 절차 수행: " + nextStep.label + " - " + nextStep.detail, "good");
  render();
}

function renderEcgProcedureOverlay() {
  if (!ecgProcedureOverlayEl || state.stage !== "ekgProcedure") return;

  ecgProcedureOverlayEl.innerHTML = "";
  ecgProcedureOverlayEl.hidden = false;

  const shell = document.createElement("div");
  shell.className = "ecg-procedure-shell";

  const header = document.createElement("div");
  header.className = "ecg-procedure-header";
  header.innerHTML =
    "<span>침상 모니터 설정</span>" +
    "<strong>ECG Lead Placement Workflow</strong>" +
    "<small>환자 설명, lead placement, monitor activation을 침상 순서대로 수행하세요.</small>";
  shell.append(header);

  const completedCount = state.procedure.length;
  const nextStep = procedureSteps[completedCount];
  const progress = document.createElement("div");
  progress.className = "ecg-procedure-progress";
  progress.innerHTML = "<strong>" + completedCount + " / " + procedureSteps.length + " 완료</strong><span>다음 bedside action을 수행하면 절차가 진행됩니다.</span>";
  shell.append(progress);

  if (nextStep) {
    const current = document.createElement("div");
    current.className = "ecg-current-step";
    current.innerHTML =
      "<span>현재 수행</span>" +
      "<strong>" + nextStep.label + "</strong>" +
      "<p>" + nextStep.detail + "</p>";
    shell.append(current);
  }

  const list = document.createElement("div");
  list.className = "ecg-procedure-list";

  procedureSteps.forEach((step, index) => {
    const isDone = state.procedure.includes(step.id);
    const isCurrent = index === completedCount;
    const feedback = state.procedureFeedback[step.id];
    const row = document.createElement("div");
    row.className = [
      "ecg-procedure-row",
      isDone ? "done" : "",
      isCurrent ? "current" : "",
      feedback || "",
    ].filter(Boolean).join(" ");
    row.innerHTML =
      "<span class=\"step-mark\">" + (isDone ? "✓" : index + 1) + "</span>" +
      "<span><strong>" + step.label + "</strong><small>" + step.detail + "</small></span>";
    list.append(row);
  });
  shell.append(list);

  const actions = document.createElement("div");
  actions.className = "ecg-procedure-actions";

  const performButton = document.createElement("button");
  performButton.type = "button";
  performButton.className = "primary";
  performButton.textContent = nextStep ? "이 단계 수행" : "모니터링 활성화";
  performButton.addEventListener("click", nextStep ? performCurrentEcgStep : submitProcedure);

  const undoButton = document.createElement("button");
  undoButton.type = "button";
  undoButton.textContent = "이전 단계 되돌리기";
  undoButton.disabled = state.procedure.length === 0;
  undoButton.addEventListener("click", () => {
    const removedStep = getProcedureStep(state.procedure.pop());
    state.procedureFeedback = {};
    addLog(removedStep ? "ECG 절차 되돌림: " + removedStep.label : "ECG 절차 선택을 되돌렸습니다.", "warning");
    render();
  });

  const skipButton = document.createElement("button");
  skipButton.type = "button";
  skipButton.className = "danger";
  skipButton.textContent = "절차 중단";
  skipButton.addEventListener("click", skipProcedure);

  actions.append(performButton, undoButton, skipButton);
  shell.append(actions);

  ecgProcedureOverlayEl.append(shell);
}
function submitProcedure() {
  if (state.procedure.length < procedureSteps.length) {
    state.procedureFeedback = {};
    addLog(`아직 ${procedureSteps.length - state.procedure.length}개 절차가 남았습니다.`, "warning");
    render();
    return;
  }

  const firstMismatchIndex = state.procedure.findIndex(
    (stepId, index) => stepId !== procedureSteps[index].id,
  );

  if (firstMismatchIndex !== -1) {
    const selected = getProcedureStep(state.procedure[firstMismatchIndex]);
    const expected = procedureSteps[firstMismatchIndex];
    state.procedureFeedback = state.procedure.reduce((feedback, stepId, index) => {
      if (index < firstMismatchIndex) feedback[stepId] = "correct";
      if (index === firstMismatchIndex) feedback[stepId] = "wrong";
      return feedback;
    }, {});
    addLog(
      `${firstMismatchIndex + 1}번 순서 확인 필요: 선택 ${selected.label}, 권장 ${expected.label}`,
      "warning",
    );
    applyScore({ safety: -3, protocol: -5 });
    render();
    return;
  }

  state.procedureFeedback = procedureSteps.reduce((feedback, step) => {
    feedback[step.id] = "correct";
    return feedback;
  }, {});
  render();

  window.setTimeout(() => {
    completeProcedure();
  }, 650);
}

function completeProcedure() {
  procedureSteps.forEach((step) => {
    addLog(`${step.label}: ${step.detail}`, "good");
    applyScore(scoreForProcedureStep(step.id));
  });

  applyPatientImpact({ anxiety: -10, cooperation: 8, breathing: -4 });
  state.ekgAttached = true;
  state.monitorOn = true;
  if (!state.appliedRegularOrders.includes("ekg")) state.appliedRegularOrders.push("ekg");
  addLog("ECG 모니터링 절차를 올바른 순서로 완료했습니다. 침상 모니터가 실시간 ECG monitoring으로 전환되었습니다.", "good");
  state.stage = "monitoring";
  state.procedureFeedback = {};
  closeEcgProcedureOverlay();
  render();
}

function getProcedureStep(stepId) {
  return procedureSteps.find((step) => step.id === stepId);
}

function skipProcedure() {
  const remainingSteps = procedureSteps.filter((step) => !state.procedure.includes(step.id));
  remainingSteps.forEach((step) => {
    addLog(`누락: ${step.label}`, "bad");
  });
  applyScore({ safety: -10, clinical: -6, protocol: -14, empathy: -4 });
  applyPatientImpact({ pain: 1, anxiety: 10, breathing: 6, cooperation: -8 });
  state.stage = "badEnd";
  closeEcgProcedureOverlay();
  render();
}

function scoreForProcedureStep(stepId) {
  const table = {
    handHygiene: { safety: 6, protocol: 5 },
    identify: { safety: 6, protocol: 4 },
    explain: { empathy: 6, protocol: 4 },
    privacy: { empathy: 5, protocol: 4 },
    skinCheck: { safety: 4, clinical: 4, protocol: 3 },
    attach: { clinical: 7, protocol: 5 },
    leadConnect: { clinical: 5, protocol: 4 },
    waveCheck: { safety: 6, clinical: 6, protocol: 4 },
    document: { clinical: 4, protocol: 7 },
  };

  return table[stepId] || {};
}

function renderVitals() {
  if (!state.monitorOn) {
    hrEl.textContent = "--";
    spo2El.textContent = "--";
    bpEl.textContent = "--";
    monitorStatusEl.textContent = "대기";
    monitorEl.classList.remove("active");
    return;
  }

  const vitals = currentVitals();
  monitorEl.classList.add("active");
  monitorStatusEl.textContent = "실시간";
  hrEl.textContent = vitals.hr;
  spo2El.textContent = `${vitals.spo2}%`;
  bpEl.textContent = vitals.bp;
}

function currentVitals() {
  if (isGbsEpisode()) {
    const gbs = state.gbsWorkflow || createGbsWorkflowState();
    const respiratoryLoad = Math.max(0, 72 - gbs.respiratoryStrength);
    const autonomicLoad = Math.max(0, 70 - gbs.autonomicStability);
    const oxygenBoost = gbs.oxygenApplied || state.oxygenApplied ? 2 : 0;
    const lateOxygenationDrop = Math.max(0, respiratoryLoad - 18) / 10 + Math.max(0, gbs.etco2 - 50) / 5;
    const spo2 = clamp(Math.round(97 + oxygenBoost - lateOxygenationDrop), 88, 99);
    const rr = clamp(Math.round(17 + respiratoryLoad / 3.2 + Math.max(0, gbs.etco2 - 42) / 2.4), 12, 38);
    const hrSwing = autonomicLoad >= 18 && state.elapsedMinutes % 3 === 0 ? -34 : autonomicLoad * 0.95;
    const hr = clamp(Math.round(88 + hrSwing + respiratoryLoad * 0.25), 42, 138);
    const systolicSwing = autonomicLoad >= 16 && state.elapsedMinutes % 2 === 0 ? 22 : -autonomicLoad * 0.72;
    const systolic = clamp(Math.round(124 + systolicSwing), 82, 164);
    const diastolic = clamp(Math.round(76 + systolicSwing * 0.35), 48, 96);

    return {
      hr,
      spo2,
      rr,
      bp: String(systolic) + "/" + String(diastolic),
    };
  }

  if (isWardWorkflowEpisode()) {
    const ward = state.wardWorkflow || createWardWorkflowState();
    const oxygenSupport = ward.oxygenApplied ? 4 : 0;
    const monitoringRelief = ward.monitorAttached ? 1.5 : 0;
    const ivRelief = ward.ivChecked ? 5 : 0;
    const unattendedPenalty = ward.bedsidePresence ? 0 : 8;
    const shockLoad = ward.shockRisk + unattendedPenalty;
    const spo2 = clamp(Math.round(ward.oxygenation + oxygenSupport - shockLoad / 18), 84, 99);
    const hr = clamp(Math.round(94 + shockLoad * 0.72 - monitoringRelief), 72, 148);
    const rr = clamp(Math.round(18 + Math.max(0, 94 - spo2) * 0.8 + shockLoad / 18), 12, 34);
    const systolic = clamp(Math.round(112 - shockLoad * 0.62 + ivRelief), 72, 128);
    const diastolic = clamp(Math.round(66 - shockLoad * 0.28 + ivRelief * 0.35), 42, 82);

    return {
      hr,
      spo2,
      rr,
      bp: String(systolic) + "/" + String(diastolic),
    };
  }

  const status = state.patientStatus;
  const oxygenMinutes = typeof minutesSinceFollowUp === "function" ? minutesSinceFollowUp("oxygen") : null;
  const nitroMinutes = typeof minutesSinceFollowUp === "function" ? minutesSinceFollowUp("nitro") : null;
  const morphineMinutes = typeof minutesSinceFollowUp === "function" ? minutesSinceFollowUp("morphine") : null;
  const oxygenBoost = state.oxygenApplied ? 3.2 * (oxygenMinutes === null ? 1 : clamp((oxygenMinutes + 1) / 4, 0.35, 1)) : 0;
  const nitroEffect = state.prnMedicationsGiven.includes("nitro") ? (nitroMinutes !== null && nitroMinutes >= 7 ? 0.58 : 1) : 0;
  const morphineEffect = state.prnMedicationsGiven.includes("morphine") ? (morphineMinutes !== null && morphineMinutes <= 6 ? 1.12 : 0.92) : 0;
  const painLoad = Math.max(0, status.pain - 4);
  const anxietyLoad = Math.max(0, status.anxiety - 50);
  const respiratoryLoad = Math.max(0, status.breathing - 52);
  const oxygenationPenalty = respiratoryLoad / 7 + anxietyLoad / 55 + painLoad / 9;

  const spo2 = clamp(Math.round(patient.vitals.spo2 + oxygenBoost - oxygenationPenalty), 86, 99);
  const hypoxiaLoad = Math.max(0, 94 - spo2);
  const rr = clamp(Math.round(15 + respiratoryLoad / 4.4 + anxietyLoad / 24 + painLoad / 3.8 + hypoxiaLoad / 2.6 - oxygenBoost / 1.7 - morphineEffect * 1.8), 10, 36);
  const hr = clamp(Math.round(patient.vitals.hr + painLoad * 1.6 + anxietyLoad / 8.5 + respiratoryLoad / 9 + hypoxiaLoad * 1.9 - oxygenBoost * 1.1 - morphineEffect * 5 - nitroEffect * 2), 62, 154);
  const systolic = Math.round(146 + painLoad * 2.1 + anxietyLoad / 8 + hypoxiaLoad * 1.2 - nitroEffect * 8 - morphineEffect * 4);
  const diastolic = Math.round(90 + painLoad * 0.9 + anxietyLoad / 18 + hypoxiaLoad * 0.7 - nitroEffect * 4 - morphineEffect * 2);

  return {
    hr,
    spo2,
    rr,
    bp: String(systolic) + "/" + String(diastolic),
  };
}

function renderPatientStatus() {
  if (!painStatusEl || !anxietyStatusEl || !breathingStatusEl || !cooperationStatusEl || !riskStatusEl) return;

  const status = state.patientStatus;
  painStatusEl.textContent = state.knownPatientInfo.pain ? `${status.pain}/10` : "미확인";
  anxietyStatusEl.textContent = Math.round(status.anxiety);
  breathingStatusEl.textContent = state.knownPatientInfo.breathing ? breathingLabel(status.breathing) : "미확인";
  cooperationStatusEl.textContent = Math.round(status.cooperation);
  riskStatusEl.textContent = state.knownPatientInfo.cardiacRisk ? "고혈압 약 복용, 협심증 검사력" : "미확인";

  painStatusEl.closest(".status-item").classList.toggle("alert", state.knownPatientInfo.pain && status.pain >= 8);
  anxietyStatusEl.closest(".status-item").classList.toggle("alert", status.anxiety >= 82);
  breathingStatusEl.closest(".status-item").classList.toggle("alert", state.knownPatientInfo.breathing && status.breathing >= 74);
  cooperationStatusEl.closest(".status-item").classList.toggle("alert", status.cooperation <= 45);
  riskStatusEl.closest(".status-item").classList.toggle("alert", state.knownPatientInfo.cardiacRisk);

  patientEl?.classList.toggle("monitored", state.ekgAttached || state.monitorOn);
  patientEl?.classList.toggle("distressed", status.anxiety >= 75 || status.pain >= 8);
}

function breathingLabel(value) {
  if (value >= 78) return "가쁨";
  if (value >= 62) return "약간 가쁨";
  return "안정";
}

function renderLogs() {
  logEl.innerHTML = "";
  state.logs.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.text;
    if (item.tone) li.classList.add(item.tone);
    logEl.append(li);
  });
}

function createClinicalActionPrompt(scene) {
  const prompts = {
    handoff: {
      title: "인계 수신 중",
      text: "병실 위 인계 카드에서 현재 우려점과 모니터링 정보를 확인한 뒤 EMR을 엽니다.",
    },
    chartReview: {
      title: "차트 확인 중",
      text: "EMR 요약, 검사, 처방, PRN 정보를 확인하세요. EMR을 닫으면 침상에서 환자 인계를 이어받습니다.",
    },
    intro: {
      title: "병실에 들어섰습니다",
      text: "오른쪽 진행 버튼 대신 3D 병실의 환자를 클릭해 본인 확인, 현재 증상 확인, 흉통 문진을 시작하세요.",
    },
    earlyChart: {
      title: "환자가 먼저입니다",
      text: "차트 확인은 보조 자료입니다. 환자를 클릭해 직접 호소와 안전을 먼저 확인하세요.",
    },
    rapport: {
      title: "첫 대화를 이어가세요",
      text: "환자를 클릭해 침상 대화로 흉통 문진을 진행하세요.",
    },
    earlyEkg: {
      title: "설명과 동의가 필요합니다",
      text: "환자를 클릭해 사과, 설명, 현재 증상 확인을 먼저 회복하세요.",
    },
    monitorFirst: {
      title: "장비보다 환자입니다",
      text: "환자를 클릭해 목적 설명과 본인 확인을 마친 뒤 문진을 이어가세요.",
    },
    assessment: {
      title: "객관적 사정을 수행하세요",
      text: "환자 상호작용이나 Pulse Ox 도구로 활력징후와 호흡 양상을 확인하면 ECG 판단 단계로 자연스럽게 이어집니다.",
    },
    callTooSoon: {
      title: "보고 근거를 보완하세요",
      text: "환자나 모니터를 클릭해 활력징후를 확보한 뒤 SBAR 근거를 쌓으세요.",
    },
    vitals: {
      title: "ECG 모니터링을 판단하세요",
      text: "침상 모니터를 클릭해 ECG 모니터링을 켜고 파형, HR, SpO₂를 함께 관찰하세요.",
    },
    monitorPrep: {
      title: "빠진 사정을 보완하세요",
      text: "환자를 클릭해 흉통과 기본 상태를 보완한 뒤 침상 모니터에서 ECG를 시작하세요.",
    },
    monitoring: {
      title: "정규 약물 투여를 시작하세요",
      text: "EMR 노트북이나 벽 차트를 클릭한 뒤 '정규 약물 투여'를 선택하세요. PRN 약물은 정규 처방 적용 후 따로 판단합니다.",
    },
    persistentSymptoms: {
      title: "재사정 후 보고하세요",
      text: "환자와 모니터를 반복 확인해 PRN 후 pain, vital signs, ECG waveform과 지연 반응을 관찰한 뒤 SBAR를 시작하세요.",
    },
    wardIntro: {
      title: "액팅 간호사 역할",
      text: "인계의 subtle warning을 바탕으로 환자 곁에서 baseline을 잡고 차지에게 보고할 근거를 모으세요.",
    },
    wardBaseline: {
      title: "baseline을 숫자로 고정하세요",
      text: "repeat BP, SpO₂, 의식, 피부, 소변량 감소를 묶어 추세로 판단해야 합니다.",
    },
    wardDeterioration: {
      title: "차지를 부르되 곁을 지키세요",
      text: "차지 호출은 시작입니다. 산소, 모니터, IV, repeat BP를 이어가야 합니다.",
    },
    wardChargeNotify: {
      title: "노티 중 acting task",
      text: "차지가 의사에게 전화하는 동안 repeat BP, SpO₂, IV, mental change를 계속 업데이트하세요.",
    },
    gbsIntro: {
      title: "SpO₂ 정상이라는 함정",
      text: "산소포화도가 괜찮아 보여도 환기 저하가 먼저 올 수 있습니다. 환자와 모니터를 클릭해 짧은 문장, weak cough, VC, EtCO₂를 확인하세요.",
    },
    gbsDeterioration: {
      title: "환기 저하를 잡아내세요",
      text: "말이 짧아지고 기침 힘이 약해집니다. SpO₂ 대신 EtCO₂/PaCO₂/VC를 근거로 airway 준비, aspiration precaution, 차지 호출을 이어가세요.",
    },
    gbsEscalationNotify: {
      title: "ICU escalation 중",
      text: "차지가 노티 중입니다. VC/EtCO₂/cough-swallow와 BP/HR fluctuation을 계속 업데이트하세요.",
    },
    postSbarBedside: {
      title: "보고 후에도 끝이 아닙니다",
      text: "차지가 담당의에게 노티하는 동안 환자 곁에서 repeat BP, pain, SpO₂, ECG 변화를 계속 업데이트하세요.",
    },
  };

  const prompt = prompts[state.stage];
  if (!prompt) return null;

  const card = document.createElement("div");
  card.className = "clinical-action-prompt";
  card.innerHTML = "<strong>" + prompt.title + "</strong><span>" + prompt.text + "</span>";
  return card;
}

function createWardBedsideHelp() {
  const ward = state.wardWorkflow || createWardWorkflowState();
  const actions = wardWorkflowReadyActions();
  const vitals = currentVitals();
  const helper = document.createElement("div");
  helper.className = "ward-help-card";

  const stageGuide = {
    wardIntro: "처음에는 모니터 수치와 환자 반응을 같이 보면서 baseline을 잡으세요.",
    wardBaseline: "repeat BP와 SpO₂를 다시 확인하고, 처진 반응이 실제 변화인지 비교하세요.",
    wardDeterioration: "차지를 부르기 전후로 산소, 모니터, IV, 의식 변화를 끊지 말고 이어가세요.",
    wardChargeNotify: "차지가 의사에게 전화 중입니다. 기다리지 말고 bedside task를 계속 수행하세요.",
  };
  const nextHint = state.stage === "wardChargeNotify"
    ? "차지 NPC 또는 전화기를 클릭해 최신 상태를 업데이트하고, 모니터/환자/IV를 반복 확인하세요."
    : "환자, 침상 모니터, IV 라인, 전화기를 클릭해 근거를 모은 뒤 차지를 호출하세요.";

  const checklist = [
    ["모니터/파형", actions.monitor, "침상 모니터 클릭"],
    ["repeat BP", actions.repeatBp, "침상 모니터 클릭"],
    ["산소/SpO₂", actions.oxygen, "O2 마스크 도구 또는 환자 클릭"],
    ["IV 확인", actions.iv, "환자 팔 IV 라인 클릭"],
    ["의식/순환", actions.mental, "환자 클릭"],
    ["차지 보고", actions.charge, "전화기/차지 클릭"],
    ["최신 업데이트", actions.updateCharge, "차지 NPC 클릭"],
  ];

  helper.innerHTML =
    "<strong>Bedside 도움말</strong>" +
    "<p>" + (stageGuide[state.stage] || "3D 병실 오브젝트를 클릭해 bedside 행동을 수행하세요.") + "</p>" +
    "<div class=\"ward-help-vitals\"><span>HR " + vitals.hr + "</span><span>SpO₂ " + vitals.spo2 + "%</span><span>BP " + vitals.bp + "</span></div>" +
    "<ul>" +
      checklist.map(([label, done, hint]) =>
        "<li class=\"" + (done ? "done" : "pending") + "\"><span>" + (done ? "완료" : "다음") + "</span><strong>" + label + "</strong><small>" + hint + "</small></li>"
      ).join("") +
    "</ul>" +
    "<p class=\"ward-help-next\">" + nextHint + "</p>";
  return helper;
}

function createGbsBedsideHelp() {
  const gbs = state.gbsWorkflow || createGbsWorkflowState();
  const actions = gbsReadyActions();
  const vitals = currentVitals();
  const helper = document.createElement("div");
  helper.className = "ward-help-card";
  const stageGuide = {
    gbsIntro: "GBS에서는 SpO₂가 늦게 떨어질 수 있습니다. 짧은 문장, shallow breathing, weak cough를 먼저 찾으세요.",
    gbsDeterioration: "모니터에서는 EtCO₂/capnogram을, EMR에서는 ABGA PaCO₂를, bedside에서는 VC와 cough/swallow를 확인하세요.",
    gbsEscalationNotify: "차지 노티 중에도 SpO₂ 정상 속 VC, EtCO₂, cough/swallow, BP/HR fluctuation을 업데이트하세요.",
  };
  const checklist = [
    ["상행성 weakness", actions.motor, "환자 클릭"],
    ["Reflex 감소", actions.reflex, "환자 클릭"],
    ["짧은 문장/삼킴", actions.coughSwallow, "환자 클릭"],
    ["VC", actions.vc, "환자 bedside spirometry"],
    ["SpO₂+EtCO₂", actions.etco2, "침상 모니터 확대"],
    ["PaCO₂ 확인", actions.abga, "EMR 검사 탭"],
    ["Wall O₂", actions.oxygen, "벽 산소 아웃렛 클릭"],
    ["Aspiration", actions.aspiration, "환자 클릭"],
    ["Suction", actions.suction, "벽 suction 또는 airway 준비 클릭"],
    ["Escalation", actions.charge, "전화기/차지 클릭"],
    ["Update", actions.updateCharge, "차지 NPC 클릭"],
  ];
  helper.innerHTML =
    "<strong>GBS Bedside 도움말</strong>" +
    "<p>" + (stageGuide[state.stage] || "GBS respiratory risk를 bedside에서 추적하세요.") + "</p>" +
    "<div class=\"ward-help-vitals\"><span>RR " + vitals.rr + "</span><span>VC " + Math.round(gbs.vc) + "</span><span>EtCO₂ " + Math.round(gbs.etco2) + "</span></div>" +
    "<ul>" + checklist.map(([label, done, hint]) =>
      "<li class=\"" + (done ? "done" : "pending") + "\"><span>" + (done ? "완료" : "다음") + "</span><strong>" + label + "</strong><small>" + hint + "</small></li>"
    ).join("") + "</ul>" +
    "<p class=\"ward-help-next\">현재 SpO₂ " + vitals.spo2 + "%입니다. 이 숫자가 정상이어도 VC " + Math.round(gbs.vc) + ", EtCO₂ " + Math.round(gbs.etco2) + "이면 환기 저하를 의심하세요.</p>";
  return helper;
}

function renderActions(scene) {
  actionsEl.innerHTML = "";

  function appendContextPrompt(title, text, buttonLabel, onClick) {
    const prompt = document.createElement("div");
    prompt.className = "clinical-action-prompt compact";
    prompt.innerHTML = "<strong>" + title + "</strong><span>" + text + "</span>";
    if (buttonLabel && onClick) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "context-open-button";
      button.textContent = buttonLabel;
      button.addEventListener("click", onClick);
      prompt.append(button);
    }
    actionsEl.append(prompt);
  }
  if (scene.concept) {
    actionsEl.append(createConceptCard());
  }

  if (scene.reassessment) {
    if (!state.contextWindowType) renderReassessmentContextWindow();
    appendContextPrompt("재사정 필요", "환자와 모니터를 반복 확인해 PRN 후 통증, 활력징후, ECG와 지연 반응을 관찰하세요.", "재사정 창 열기", renderReassessmentContextWindow);
    return;
  }

  if (scene.history) {
    actionsEl.append(createHistoryStatus());

    const bedsidePrompt = document.createElement("div");
    bedsidePrompt.className = "history-bedside-prompt";
    bedsidePrompt.innerHTML = "<strong>환자를 클릭해 침상 대화를 이어가세요.</strong><span>흉통 문진 질문은 환자 상호작용 메뉴 안에서 선택합니다.</span>";
    actionsEl.append(bedsidePrompt);
    return;
  }

  if (scene.orders === "regular") {
    if (!state.contextWindowType) renderOrderContextWindow();
    appendContextPrompt("정규 약물 투여", "정규 약물/중재 적용은 병실 안 contextual window에서 진행합니다.", "정규 약물 투여 창 열기", renderOrderContextWindow);
    return;
  }

  if (scene.medication === "prn") {
    appendContextPrompt("투약 카트 사용", "투약 카트를 클릭해 PRN order를 route별로 선택하세요. Nitroglycerin은 설하 투여, Morphine은 IV 주사기 투여입니다.", "투약 카트 창 열기", renderMedicationContextWindow);
    return;
  }

  if (scene.procedure) {
    const prompt = document.createElement("div");
    prompt.className = "clinical-action-prompt";
    prompt.innerHTML = "<strong>ECG 모니터링이 활성화되었습니다.</strong><span>모니터 파형, 활력징후, 흉통 변화를 함께 해석하세요.</span>";
    actionsEl.append(prompt);
    renderEcgMonitoringOverlay("review");
    return;
  }

  if (scene.sbar) {
    if (!state.contextWindowType) renderSbarContextWindow();
    appendContextPrompt("차지 간호사 SBAR", "차지에게 보고하면 차지가 담당의 노티를 진행합니다. 플레이어는 bedside 재사정을 계속해야 합니다.", "차지 SBAR 창 열기", renderSbarContextWindow);
    return;
  }

  const clinicalPrompt = createClinicalActionPrompt(scene);
  if (clinicalPrompt) {
    if (isWardWorkflowEpisode()) {
      actionsEl.append(createWardBedsideHelp());
      actionsEl.append(clinicalPrompt);
      const guide = document.createElement("div");
      guide.className = "clinical-action-prompt compact ward-bedside-guide";
      guide.innerHTML = "<strong>3D 병실에서 직접 수행하세요.</strong><span>환자, 침상 모니터, IV 라인, 차지 간호사/전화기를 클릭해 액팅 간호사 행동을 이어갑니다. 오른쪽은 진행 요약만 보여줍니다.</span>";
      actionsEl.append(guide);
      return;
    }
    if (isGbsEpisode()) {
      actionsEl.append(createGbsBedsideHelp());
      actionsEl.append(clinicalPrompt);
      const guide = document.createElement("div");
      guide.className = "clinical-action-prompt compact ward-bedside-guide";
      guide.innerHTML = "<strong>3D 병실에서 직접 수행하세요.</strong><span>환자, 침상 모니터, airway/IV 준비, 차지 간호사/전화기를 클릭해 GBS 호흡근 위험을 추적합니다.</span>";
      actionsEl.append(guide);
      return;
    }
    actionsEl.append(clinicalPrompt);
    return;
  }

  scene.actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    if (action.next === "goodEnd" || action.reset) button.classList.add("primary");
    if (action.primary) button.classList.add("primary");
    if (action.next === "badEnd") button.classList.add("danger");
    button.addEventListener("click", () => guardedChoose(action));
    actionsEl.append(button);
  });
}

function createHistoryStatus() {
  const status = document.createElement("div");
  const isReady = answeredRequiredCount() === requiredHistoryQuestions().length;
  status.className = "history-status";
  status.innerHTML = `<strong>문진 진행 ${state.askedQuestions.length}/${historyQuestions.length}</strong><span>${isReady ? "사정에 필요한 정보가 충분히 모였다." : "환자 답변을 바탕으로 필요한 정보를 더 모아야 한다."}</span>`;
  return status;
}

function createReassessmentStatus() {
  ensurePostPrnReassessment();
  const status = document.createElement("div");
  const completed = Object.values(state.postPrnReassessment).filter(Boolean).length;
  const total = Object.keys(postPrnReassessmentLabels).length;
  const items = Object.entries(postPrnReassessmentLabels)
    .map((entry) => {
      const key = entry[0];
      const label = entry[1];
      const done = state.postPrnReassessment[key];
      return "<li class=\"" + (done ? "done" : "") + "\"><span>" + (done ? "완료" : "대기") + "<\/span>" + label + "<\/li>";
    })
    .join("");

  status.className = "reassessment-status";
  const followUpText = completed >= total
    ? "초기 재사정은 완료되었습니다. 환자와 모니터를 반복 확인해 지연 반응과 재상승 징후를 계속 관찰하세요."
    : "환자와 모니터를 클릭해 pain, vital signs, ECG waveform을 다시 확인하세요.";
  status.innerHTML = "<strong>PRN 후 재사정 " + completed + "/" + total + "<\/strong><span>" + followUpText + "<\/span><ul>" + items + "<\/ul>";
  return status;
}

function createConceptCard() {
  const card = document.createElement("div");
  card.className = "concept-card";
  card.innerHTML = `
    <h3>이번 챕터에서 배울 것</h3>
    <ul>
      <li><strong>첫 접촉:</strong> 환자 확인, 자기소개, 현재 호소 확인이 먼저다.</li>
      <li><strong>흉통 문진:</strong> 시작 시점, 위치와 양상, 강도, 동반 증상, 방사통, 과거력과 복용약을 확인한다.</li>
      <li><strong>객관적 사정:</strong> 문진 뒤 활력징후와 호흡 양상, 의식 상태를 확인한다.</li>
      <li><strong>처치와 보고:</strong> EKG 모니터링은 절차를 지키고, 보고는 SBAR로 짧고 명확하게 한다.</li>
    </ul>
  `;
  return card;
}

function createOrderPanel() {
  const panel = document.createElement("div");
  panel.className = "order-action-panel";

  patient.regularOrders.forEach((order) => {
    if (typeof order.correctDose === "number") {
      const row = document.createElement("div");
      row.className = "dose-row";
      row.innerHTML = `
        <div>
          <strong>${order.label}</strong>
          <span>적용 전 ordered dose/rate를 ${order.unit} 단위로 입력하세요.</span>
        </div>
        <input type="number" step="0.1" inputmode="decimal" aria-label="${order.label} dose or rate" />
      `;
      const input = row.querySelector("input");
      const button = document.createElement("button");
      button.type = "button";
      button.className = state.appliedRegularOrders.includes(order.id) ? "order-button done" : "order-button";
      button.textContent = state.appliedRegularOrders.includes(order.id) ? "적용 완료" : "적용";
      button.addEventListener("click", () => applyRegularOrder(order, input.value));
      row.append(button);
      panel.append(row);
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = state.appliedRegularOrders.includes(order.id) ? "order-button done" : "order-button";
    button.textContent = order.label;
    button.addEventListener("click", () => applyRegularOrder(order));
    panel.append(button);
  });

  const status = document.createElement("div");
  status.className = "clinical-action-prompt compact";
  status.innerHTML = "<strong>필수 정규 처방을 모두 적용하세요.</strong><span>마지막 필수 처방이 적용되면 PRN 판단으로 자동 전환됩니다.</span>";
  panel.append(status);

  return panel;
}

function createMedicationPanel() {
  const panel = document.createElement("div");
  panel.className = "medication-panel bedside-medication-workflow route-specific-medication";

  const workflow = state.medicationWorkflow || {};
  const selected = selectedMedicationOrder();
  const route = medicationRouteProfile(selected);
  const administeredSelected = Boolean(selected && state.prnMedicationsGiven.includes(selected.id));
  const header = document.createElement("div");
  header.className = "medication-workflow-header";
  header.innerHTML = "<span>EMR order to bedside route</span><strong>Route-specific PRN administration</strong><small>EMR에서 처방을 확인한 뒤 투약 카트에서 약물별 route를 구분해 투여합니다. SL Nitroglycerin은 설하 투여, IV Morphine은 주사기 준비 후 투여입니다.</small>";
  panel.append(header);

  const routeBanner = document.createElement("div");
  routeBanner.className = "medication-route-banner " + (selected ? selected.id : "none");
  routeBanner.innerHTML = selected
    ? "<span>Selected route</span><strong>" + selected.routeLabel + "</strong><small>" + route.administrationDetail + ". " + route.reassessment + ".</small>"
    : "<span>Start here</span><strong>PRN order를 선택하세요</strong><small>정규 처방 적용 후 PRN order를 route별로 선택하고, dose 확인 후 침상 투여로 이어집니다.</small>";
  panel.append(routeBanner);

  const steps = document.createElement("ol");
  steps.className = "medication-steps route-steps";
  const routeReady = selected && (route.requiresSyringe ? workflow.syringeReady : workflow.doseVerified);
  [
    ["1", "EMR/order review", "PRN indication과 route 확인", true],
    ["2", "Medication selection", selected ? selected.label : "Nitroglycerin SL 또는 Morphine IV 선택", Boolean(selected)],
    ["3", "Dose and route check", workflow.doseVerified ? workflow.verifiedDose + " " + selected?.unit + " / " + route?.route : "dose, route, allergy, indication 확인", Boolean(workflow.doseVerified)],
    ["4", selected ? route.prepLabel : "Route preparation", selected ? route.prepDetail : "선택 약물에 따라 설하 또는 IV 준비", Boolean(routeReady)],
    ["5", "Bedside administration", administeredSelected ? "투여 완료: 재사정 단계" : selected ? route.administrationDetail : "약물 선택 후 침상 투여", administeredSelected],
  ].forEach(([number, label, detail, done]) => {
    const item = document.createElement("li");
    item.className = done ? "done" : "pending";
    item.innerHTML = "<span>" + number + "</span><strong>" + label + "</strong><small>" + detail + "</small>";
    steps.append(item);
  });
  panel.append(steps);

  const prepGrid = document.createElement("div");
  prepGrid.className = "medication-prep-grid route-card-grid";
  patient.prnOrders.forEach((order) => {
    const card = document.createElement("button");
    const orderRoute = medicationRouteProfile(order);
    const isSelected = selected?.id === order.id;
    const done = state.prnMedicationsGiven.includes(order.id);
    card.type = "button";
    card.className = "medication-prep-card route-card " + order.id + (isSelected ? " selected" : "") + (done ? " done" : "");
    card.innerHTML = "<span>" + order.routeLabel + "</span><strong>" + order.label + "</strong><small>" + orderRoute.administrationDetail + " · dose " + order.correctDose + " " + order.unit + " · " + order.indication + "</small>";
    card.addEventListener("click", () => prepareMedicationOrder(order.id));
    prepGrid.append(card);
  });
  panel.append(prepGrid);

  const verification = document.createElement("div");
  verification.className = "medication-verification route-verification";
  verification.innerHTML =
    "<div><strong>" + (selected ? selected.label : "PRN medication") + " dose/route verification</strong>" +
    "<span>" + (selected ? selected.routeLabel + " route로 ordered dose를 확인합니다. Allergy, indication, BP/respiratory risk를 함께 확인하세요." : "먼저 투약 카트에서 PRN medication을 선택하세요.") + "</span></div>" +
    "<input type=\"number\" step=\"0.1\" inputmode=\"decimal\" aria-label=\"PRN medication dose\" " + (selected ? "value=\"" + (workflow.verifiedDose || selected.correctDose) + "\"" : "disabled") + " />";
  const input = verification.querySelector("input");
  const verify = document.createElement("button");
  verify.type = "button";
  verify.textContent = workflow.doseVerified ? "Dose/route 확인 완료" : "Dose/route 확인";
  verify.disabled = !selected;
  verify.addEventListener("click", () => verifyMedicationDose(input.value));
  verification.append(verify);
  panel.append(verification);

  const bedside = document.createElement("div");
  bedside.className = "medication-bedside-cue route-bedside-cue " + (selected ? selected.id : "none");
  if (!selected) {
    bedside.innerHTML = "<strong>침상 투여 단계</strong><span>PRN order를 선택하면 route별 투여 방법이 표시됩니다.</span>";
  } else if (route.requiresSyringe) {
    const readyForPatient = Boolean(workflow.doseVerified && workflow.syringeReady);
    bedside.innerHTML = "<strong>IV Morphine administration</strong><span>" + (readyForPatient
      ? "주사기 도구를 선택한 뒤 환자를 클릭해 IV 투여하세요. 투여 후 RR, SpO2, sedation, pain을 재사정하세요."
      : "Dose 확인 후 주사기 도구를 투약 카트에 적용해 IV syringe preparation을 완료하세요.") + "</span>";
  } else {
    const direct = document.createElement("button");
    bedside.innerHTML = "<strong>SL Nitroglycerin administration</strong><span>주사기 없이 환자에게 설하 tablet/spray로 직접 투여합니다. 투여 전 BP와 chest pain indication을 확인하세요.</span>";
    direct.type = "button";
    direct.className = "route-admin-button";
    direct.textContent = workflow.doseVerified ? "설하 Nitroglycerin 투여" : "Dose/route 확인 후 설하 투여";
    direct.disabled = !workflow.doseVerified || administeredSelected;
    direct.addEventListener("click", administerPreparedNitroSublingual);
    bedside.append(direct);
  }
  panel.append(bedside);

  const delay = document.createElement("button");
  delay.type = "button";
  delay.className = "danger medication-delay";
  delay.textContent = "PRN 중재를 지연하고 관찰만 한다";
  delay.addEventListener("click", () => {
    addLog("PRN 중재 지연으로 chest pain이 악화되었습니다.", "bad");
    applyScore({ safety: -8, clinical: -6 });
    applyPatientImpact({ pain: 1, anxiety: 8, breathing: 5 });
    resetMedicationWorkflow();
    state.stage = "badEnd";
    closeContextWindow();
    render();
  });
  panel.append(delay);

  return panel;
}

function createSbarBuilder() {
  const card = document.createElement("div");
  card.className = "sbar-builder";

  const readiness = sbarReadinessSummary();
  const dynamicSbarOptions = buildSbarOptions();
  normalizeSbarSelections(dynamicSbarOptions);
  const trajectoryLabel = {
    stabilizedAfterTreatment: "처치 후 안정화",
    partialResponseAfterTreatment: "부분 호전",
    persistentPainAfterTreatment: "PRN 후 증상 지속",
    deteriorating: "악화/긴급 보고",
    regularOrdersComplete: "정규 처방 후 판단",
    incompleteOrWatchful: "근거 보완 필요",
  }[getClinicalTrajectory()] || "현재 상태 기반";
  const readinessPanel = document.createElement("div");
  readinessPanel.className = "sbar-readiness";
  readinessPanel.innerHTML = "<strong>SBAR 보고 준비도: " + readiness.strength + " (" + readiness.completed + "/" + readiness.total + ")</strong><span>현재 경과: " + trajectoryLabel + ". 보기는 시행한 처치, 재사정, 현재 활력징후에 따라 바뀝니다.</span>";
  card.append(readinessPanel);

  Object.entries(dynamicSbarOptions).forEach(([component, options]) => {
    const group = document.createElement("div");
    group.className = "sbar-group";
    group.innerHTML = `<h4>${component}</h4>`;

    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = state.sbarSelections[component] === option.id ? "sbar-option selected" : "sbar-option";
      button.textContent = option.text;
      button.addEventListener("click", () => selectSbar(component, option.id));
      group.append(button);
    });

    card.append(group);
  });

  const submit = document.createElement("button");
  submit.type = "button";
  submit.className = "primary";
  submit.textContent = "SBAR 보고 제출";
  submit.addEventListener("click", submitSbar);
  card.append(submit);

  return card;
}

function outcomeLabel(type) {
  return type === "stabilized" ? "Patient stabilized" : "Patient deteriorated";
}

function outcomeKoreanLabel(type) {
  return type === "stabilized" ? "환자 안정화" : "환자 악화";
}

function createDebriefingChecklistItem(done, label, why) {
  return '<li class="' + (done ? "done" : "missing") + '">' +
    '<span>' + (done ? "확보" : "누락") + "</span>" +
    "<strong>" + label + "</strong>" +
    "<small>" + why + "</small>" +
  "</li>";
}

function createDebriefingSection(title, status, body, items = []) {
  return '<article class="debriefing-section">' +
    "<header><h4>" + title + "</h4><span>" + status + "</span></header>" +
    "<p>" + body + "</p>" +
    (items.length ? '<ul class="debriefing-list">' + items.join("") + "</ul>" : "") +
  "</article>";
}

function createDebriefingSummary() {
  if (!state.outcome) return "";

  const outcome = state.outcome;
  const readiness = sbarReadinessSummary();
  const requiredQuestions = requiredHistoryQuestions();
  const missingHistory = requiredQuestions.filter((question) => !state.askedQuestions.includes(question.id));
  const assessmentItems = [
    createDebriefingChecklistItem(patientHistoryReviewed(), "흉통 문진", "Onset, 양상, NRS, 동반증상, 방사통, 과거력은 ACS 위험도를 빠르게 잡는 핵심 단서입니다."),
    createDebriefingChecklistItem(isAssessmentComplete("vitals") || state.monitorOn, "활력징후", "HR, SpO₂, BP 변화는 흉통 환자의 불안정성을 판단하고 보고 우선순위를 정하게 합니다."),
    createDebriefingChecklistItem(isAssessmentComplete("respiratory"), "호흡 양상", "숨참과 호흡 노력은 산소화 저하와 심근 산소 요구량 증가를 의심하게 하는 소견입니다."),
    createDebriefingChecklistItem(isAssessmentComplete("skin") || isAssessmentComplete("perfusion"), "피부/말초순환", "창백, 식은땀, 말초 냉감은 교감신경 항진과 관류 저하 가능성을 보여줍니다."),
    createDebriefingChecklistItem(isAssessmentComplete("consciousness"), "의식 상태", "의식 변화는 저산소증이나 순환 불안정의 늦은 신호일 수 있어 반복 확인이 필요합니다."),
  ];
  const missedFindings = [
    ...missingHistory.map((question) => question.label),
    ...Object.values(patientInteractionFindings)
      .filter((finding) => finding.assessment && !isAssessmentComplete(finding.assessment))
      .map((finding) => finding.finding.label),
  ];
  const observedFindings = patientFindingsList();
  const observedFindingsText = observedFindings.length
    ? "확인한 소견: " + observedFindings.map((finding) => finding.label + " - " + finding.value).join("; ")
    : "직접 기록된 환자 소견이 부족했습니다.";
  const interventionItems = [
    createDebriefingChecklistItem(state.appliedRegularOrders.includes("aspirin"), "Aspirin 정규 처방 적용", "ACS 의심 상황에서 항혈소판 처방 누락은 혈전 진행 위험을 낮출 기회를 놓치게 합니다."),
    createDebriefingChecklistItem(state.appliedRegularOrders.includes("ekg") || state.monitorOn, "Continuous EKG order 반영", "지속 흉통에서는 리듬과 ST 변화 가능성을 놓치지 않도록 모니터링을 연결해야 합니다."),
    createDebriefingChecklistItem(state.prnMedicationsGiven.length > 0 || state.oxygenApplied, "증상 완화 중재", "통증과 산소화 문제를 방치하면 심근 산소 요구량과 불안이 함께 증가할 수 있습니다."),
    createDebriefingChecklistItem(outcome.actions?.reassessment, "중재 후 재사정", "PRN 또는 산소 적용 뒤 재사정해야 중재 효과와 추가 보고 필요성을 판단할 수 있습니다."),
  ];
  const ecgUsed = outcome.actions?.ecg || isAssessmentComplete("ecgReview") || state.ekgAttached || state.monitorOn;
  const sbarSelectionCount = Object.keys(state.sbarSelections || {}).length;
  const sbarQuality = outcome.actions?.sbar
    ? (readiness.score >= 80 ? "우수" : readiness.score >= 50 ? "보완 필요" : "낮음")
    : "미수행";
  const recentEvents = state.eventHistory.slice(0, 5)
    .map((event) => "<li><strong>T+" + event.minute + " min</strong>" + event.text + "</li>");
  const missedText = missedFindings.length
    ? missedFindings.slice(0, 6).join(", ")
    : "핵심 문진과 직접 사정 소견을 대부분 확보했습니다.";

  return '<section class="debriefing-panel">' +
    "<h3>디브리핑</h3>" +
    "<p>시나리오 종료 후 실제 행동 기록을 바탕으로 강점과 누락점을 정리합니다.</p>" +
    createDebriefingSection(
      "사정 완료도",
      Object.values(state.completedAssessments || {}).filter(Boolean).length + "/" + Object.keys(state.completedAssessments || {}).length,
      "흉통 환자에서는 주관적 호소와 객관적 징후를 함께 모아야 ACS 가능성, 산소화, 순환 안정성을 놓치지 않습니다.",
      assessmentItems,
    ) +
    createDebriefingSection(
      "놓친 소견",
      missedFindings.length ? missedFindings.length + "개 확인 필요" : "핵심 소견 확보",
      observedFindingsText + " " + missedText + " 놓친 소견은 SBAR의 Assessment 근거를 약하게 만들고, 악화 징후를 늦게 발견하게 할 수 있습니다.",
    ) +
    createDebriefingSection(
      "중재 타이밍",
      outcome.actions?.intervention ? "중재 시행" : "중재 지연",
      "흉통이 지속되면 처방 확인, 모니터링, PRN 투여, 재사정을 끊기지 않게 연결해야 합니다. 지연될수록 urgency가 올라가고 악화 이벤트가 누적됩니다.",
      interventionItems,
    ) +
    createDebriefingSection(
      "ECG/모니터링 사용 여부",
      ecgUsed ? "사용함" : "미사용",
      ecgUsed
        ? "ECG와 모니터링을 사용해 지속 흉통 환자의 리듬, HR, 산소화 변화를 추적했습니다. 이는 보고와 중재 우선순위를 정하는 핵심 자료입니다."
        : "ECG/모니터링이 빠지면 흉통 환자의 리듬 변화와 활력징후 악화를 늦게 발견할 수 있습니다.",
    ) +
    createDebriefingSection(
      "SBAR 보고 품질",
      sbarQuality + " · 준비도 " + readiness.completed + "/" + readiness.total,
      "SBAR는 상황, 배경, 사정, 요청을 짧고 정확하게 묶어 의사결정을 앞당기는 도구입니다. 선택한 항목 " + sbarSelectionCount + "개와 준비도 점수를 기준으로 품질을 판단했습니다.",
      readiness.items.map((item) => createDebriefingChecklistItem(item.done, item.label, item.done ? "보고 근거로 사용할 수 있습니다." : "보고 전 근거가 부족했습니다.")),
    ) +
    createDebriefingSection(
      "환자 결과 요약",
      outcomeKoreanLabel(outcome.type),
      outcome.reason + " 판정 시점은 T+" + outcome.minute + " min, 활력징후는 HR " + outcome.vitals.hr + ", SpO₂ " + outcome.vitals.spo2 + "%, BP " + outcome.vitals.bp + "였습니다. Urgency는 " + outcome.urgency.label + "로 기록되었습니다.",
      recentEvents,
    ) +
  "</section>";
}

function createOutcomeSummary() {
  if (!state.outcome) return "";

  const outcome = state.outcome;
  const actionLabels = isWardWorkflowEpisode()
    ? {
        charge: "차지 호출",
        repeatBp: "repeat BP",
        oxygen: "산소/SpO₂",
        monitor: "모니터 확인",
        iv: "IV 확인",
        mental: "의식 재사정",
        updateCharge: "차지 업데이트",
        bedside: "bedside 유지",
      }
    : {
        history: "흉통 문진",
        vitals: "활력징후",
        ecg: "ECG 모니터링",
        orders: "정규 처방",
        intervention: "중재",
        reassessment: "재사정",
        sbar: "SBAR",
      };
  const actionItems = Object.entries(actionLabels)
    .map(([key, label]) => {
      const done = Boolean(outcome.actions?.[key]);
      return '<li class="' + (done ? 'done' : 'missing') + '"><span>' + (done ? '완료' : '미완료') + '</span>' + label + '</li>';
    })
    .join("");
  const detailItems = (outcome.details || []).map((detail) => "<li>" + detail + "</li>").join("");

  return '<section class="outcome-summary ' + outcome.type + '">' +
    "<p>" + outcomeLabel(outcome.type) + "</p>" +
    "<h3>" + outcomeKoreanLabel(outcome.type) + "</h3>" +
    "<strong>" + outcome.reason + "</strong>" +
    "<dl>" +
      "<dt>판정 시점</dt><dd>T+" + outcome.minute + " min</dd>" +
      "<dt>활력징후</dt><dd>HR " + outcome.vitals.hr + ", SpO₂ " + outcome.vitals.spo2 + "%, BP " + outcome.vitals.bp + "</dd>" +
      "<dt>Urgency</dt><dd>" + outcome.urgency.label + " · " + (outcome.urgency.drivers?.join(", ") || "안정") + "</dd>" +
    "</dl>" +
    (detailItems ? '<ul class="outcome-details">' + detailItems + "</ul>" : "") +
    '<ul class="outcome-actions">' + actionItems + "</ul>" +
  "</section>";
}
function renderEvaluation() {
  const isEnd = state.stage === "goodEnd" || state.stage === "badEnd" || state.stage === "wardGoodEnd" || state.stage === "wardBadEnd" || state.stage === "gbsGoodEnd" || state.stage === "gbsBadEnd";
  evaluationEl.hidden = !isEnd;
  if (!isEnd) {
    evaluationBodyEl.innerHTML = "";
    return;
  }

  const scoreLabels = [
    ["환자안전", state.scores.safety],
    ["전문성", state.scores.clinical],
    ["공감", state.scores.empathy],
    ["절차준수", state.scores.protocol],
  ];
  const missed = procedureSteps.filter((step) => !state.procedure.includes(step.id));
  const missedHistory = requiredHistoryQuestions().filter(
    (question) => !state.askedQuestions.includes(question.id),
  );
  if (isWardWorkflowEpisode()) {
    const wardActions = state.outcome?.actions || wardWorkflowReadyActions();
    const wardItems = [
      ["차지 호출", wardActions.charge],
      ["repeat BP", wardActions.repeatBp],
      ["산소/SpO₂ 확인", wardActions.oxygen],
      ["모니터 확인", wardActions.monitor],
      ["IV 확인", wardActions.iv],
      ["의식/순환 재사정", wardActions.mental],
      ["차지 업데이트", wardActions.updateCharge],
      ["bedside 유지", wardActions.bedside],
    ];
    const note = state.outcome?.type === "stabilized"
      ? "차지 노티 중에도 액팅 간호사가 bedside에서 수행할 수 있는 행동을 이어갔습니다."
      : "보고 자체보다 보고 중 bedside 공백이 악화에 영향을 줬습니다.";

    evaluationBodyEl.innerHTML = `
      ${createOutcomeSummary()}
      <ul class="evaluation-list">
        ${scoreLabels.map(([label, score]) => `<li><span>${label}</span><strong>${score}</strong></li>`).join("")}
      </ul>
      <ul class="evaluation-list">
        ${wardItems.map(([label, done]) => `<li><span>${label}</span><strong>${done ? "수행" : "누락"}</strong></li>`).join("")}
      </ul>
      <p class="evaluation-note">${note}</p>
    `;
    return;
  }
  if (isGbsEpisode()) {
    const gbsActions = state.outcome?.actions || gbsReadyActions();
    const gbsItems = [
      ["상행성 weakness", gbsActions.motor],
      ["DTR/reflex 감소", gbsActions.reflex],
      ["짧은 문장/cough/swallow", gbsActions.coughSwallow],
      ["VC로 호흡근 reserve 확인", gbsActions.vc],
      ["SpO₂ 정상 속 EtCO₂ 확인", gbsActions.etco2],
      ["ABGA/PaCO₂ 확인", gbsActions.abga],
      ["Aspiration precaution", gbsActions.aspiration],
      ["Suction 준비", gbsActions.suction],
      ["Escalation", gbsActions.charge],
      ["최신 업데이트", gbsActions.updateCharge],
    ];
    const note = state.outcome?.type === "stabilized"
      ? "SpO₂ 정상이라는 함정에 속지 않고 VC/EtCO₂/cough-swallow로 respiratory muscle failure 전조를 조기에 묶어 escalation했습니다."
      : "GBS에서는 SpO₂가 정상처럼 보여도 VC/EtCO₂/cough-swallow가 먼저 무너질 수 있습니다. 산소화보다 환기 저하를 먼저 의심해야 합니다.";

    evaluationBodyEl.innerHTML = `
      ${createOutcomeSummary()}
      <ul class="evaluation-list">
        ${scoreLabels.map(([label, score]) => `<li><span>${label}</span><strong>${score}</strong></li>`).join("")}
      </ul>
      <ul class="evaluation-list">
        ${gbsItems.map(([label, done]) => `<li><span>${label}</span><strong>${done ? "수행" : "누락"}</strong></li>`).join("")}
      </ul>
      <p class="evaluation-note">${note}</p>
    `;
    return;
  }
  const note = state.outcome
    ? (state.outcome.type === "stabilized"
        ? "환자 상태와 핵심 임상 행동을 기준으로 안정화 결과가 확정되었습니다."
        : "환자 상태 악화 기준이 충족되어 시나리오가 종료되었습니다.")
    : missed.length === 0 && missedHistory.length === 0
      ? "핵심 문진과 EKG 절차를 모두 수행했다. 다음 단계는 시간 경과와 환자 악화 이벤트를 넣는 것이다."
      : [
          missedHistory.length > 0
            ? `누락된 문진: ${missedHistory.map((question) => question.label).join(", ")}.`
            : "",
          missed.length > 0
            ? `누락된 절차: ${missed.map((step) => step.label).join(", ")}.`
            : "",
          "다음 시도에서는 주관적 사정, 객관적 사정, 처치, 보고가 끊기지 않게 연결해보자.",
        ]
          .filter(Boolean)
          .join(" ");

  evaluationBodyEl.innerHTML = `
    ${createOutcomeSummary()}
    ${createDebriefingSummary()}
    <ul class="evaluation-list">
      ${scoreLabels.map(([label, score]) => `<li><span>${label}</span><strong>${score}</strong></li>`).join("")}
    </ul>
    <p class="evaluation-note">${note}</p>
  `;
}

function showBeginnerOnboardingHints() {
  const hints = [
    "환자와 먼저 대화해보세요.",
    "모니터에서 활력징후와 ECG를 확인할 수 있습니다.",
    "EMR에서 검사와 오더를 확인할 수 있습니다.",
  ];

  hints.forEach((text, index) => {
    window.setTimeout(() => {
      if (state.stage !== "intro" && state.stage !== "rapport" && state.stage !== "historyTaking") return;
      showClinicalNotification(text, "info");
    }, 900 + index * 2600);
  });
}

function render() {
  document.body.classList.toggle("clinical-entry-active", entryFlowActive());
  updateFloatingCardVisibility();
  syncCompletedAssessments();
  const scene = scenes[state.stage];
  renderClinicalData();
  if (scenarioLabelEl) {
    scenarioLabelEl.textContent = isGbsEpisode()
      ? "GBS SpO₂ 함정 시나리오"
      : isWardWorkflowEpisode()
        ? "흉통 액팅 간호사 모드"
        : "ACS bedside scenario";
  }
  scoreEl.textContent = "Score " + averageScore();
  safetyScoreEl.textContent = state.scores.safety;
  clinicalScoreEl.textContent = state.scores.clinical;
  empathyScoreEl.textContent = state.scores.empathy;
  protocolScoreEl.textContent = state.scores.protocol;
  sceneTitleEl.textContent = state.outcome ? outcomeKoreanLabel(state.outcome.type) : scene.title;
  sceneTextEl.textContent = state.outcome ? state.outcome.reason : scene.text;
  renderVitals();
  renderPatientStatus();
  renderLogs();
  renderActions(scene);
  renderHandoffOverlay();
  renderEvaluation();
  refreshActiveContextWindow();
  updateClinicalUrgency();
  if (state.emrOpened) renderEmr();
  const vitals = currentVitals();
  window.update3D?.(state, state.monitorOn ? vitals : null);
  renderToolSelection();
  if (state.stage === "ekgProcedure") renderEcgProcedureOverlay();
  else closeEcgProcedureOverlay();
}

hudVisibilityToggleEl?.addEventListener("click", toggleHudCluster);
hudClusterToggleEl?.addEventListener("click", toggleHudCluster);
hudClusterDragHandleEl?.addEventListener("pointerdown", beginHudClusterDrag);
window.addEventListener("pointermove", moveHudClusterDrag);
window.addEventListener("pointerup", endHudClusterDrag);
window.addEventListener("resize", () => {
  if (!state.hudCluster?.position) return;
  state.hudCluster.position = clampHudClusterPosition(state.hudCluster.position.left, state.hudCluster.position.top);
  applyHudClusterPosition();
});
floatingCardToggleButtons.forEach((button) => {
  button.addEventListener("click", () => toggleFloatingCard(button.dataset.floatingCardToggle));
});
titleStartEl?.addEventListener("click", openEpisodeLobby);
titleEpisodeSelectEl?.addEventListener("click", openEpisodeLobby);
titleOptionsEl?.addEventListener("click", toggleTitleOptions);
episodeBackHomeEl?.addEventListener("click", returnToTitleScreen);
episodeStartEl?.addEventListener("click", () => startEpisode("acsChestPain"));
episodeStartAcsEl?.addEventListener("click", () => startEpisode("acsChestPain"));
episodeStartWardEl?.addEventListener("click", () => startEpisode("wardWorkflow"));
episodeStartGbsEl?.addEventListener("click", () => startEpisode("gbsRespiratory"));
simulationHomeEl?.addEventListener("click", returnToTitleScreen);

resetGame();
render();
startPatientStateLoop();
