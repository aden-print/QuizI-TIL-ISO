// Elementos principales
const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");
const gameOverScreen = document.getElementById("game-over");
const questionEl = document.getElementById("question");
const answerButtonsEl = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const retryBtn = document.getElementById("retry-btn");
const backMenuBtn = document.getElementById("back-menu-btn");
const menuBtn = document.getElementById("menu-btn");
const scoreEl = document.getElementById("score");
const maxScoreEl = document.getElementById("max-score");
const livesEl = document.getElementById("lives");
const livesContainer = document.getElementById("lives-container");
const feedbackEl = document.getElementById("feedback");
const explanationEl = document.getElementById("explanation");
const progressBar = document.getElementById("progress-bar");
const startPracticeBtn = document.getElementById("start-practice");
const startSurvivalBtn = document.getElementById("start-survival");
const toggleMusicBtn = document.getElementById("toggle-music");
const bgMusic = document.getElementById("bg-music");

// Estado
let questions = [];
let currentQuestion = null;
let score = 0;
let maxScore = 0;
let lives = 3;
let streak = 0;
let mode = "practice";
let availableQuestions = [];
let answered = false; // Previene respuestas múltiples

// Sonidos
const soundCorrect = new Audio("sounds/correct.mp3");
const soundWrong = new Audio("sounds/wrong.mp3");
const soundGameOver = new Audio("sounds/gameover.mp3");

function playSound(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// Música de fondo
toggleMusicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    toggleMusicBtn.textContent = "🎵 Música: ON";
  } else {
    bgMusic.pause();
    toggleMusicBtn.textContent = "🎵 Música: OFF";
  }
});

questions = [
  {
    question: "¿Cuál de los siguientes enunciados define mejor un \"servicio de TI\" según ITIL?",
    answers: [
      { text: "Una aplicación informática que permite realizar operaciones contables.", correct: false },
      { text: "Un conjunto de componentes tecnológicos interconectados.", correct: false },
      { text: "Un medio para entregar valor al cliente facilitando resultados deseados sin asumir riesgos específicos.", correct: true },
      { text: "El proceso de instalación y configuración de un software empresarial.", correct: false }
    ],
    explanation: "ITIL define un servicio de TI como un medio para entregar valor al cliente, permitiendo que este logre sus objetivos sin tener que encargarse de costos y riesgos específicos."
  },
  {
    question: "¿Qué es el valor en el contexto de servicios ITIL?",
    answers: [
      { text: "Valor es la utilidad y garantía entregada al cliente.", correct: true },
      { text: "Es el precio comercial del servicio.", correct: false },
      { text: "Es el costo técnico de operación.", correct: false },
      { text: "Es la marca y popularidad del proveedor.", correct: false }
    ],
    explanation: "En ITIL, el valor se entiende como la combinación de utilidad (lo que hace el servicio) y garantía (seguridad en disponibilidad, capacidad y continuidad)."
  },
  {
    question: "¿Cuál es el principal objetivo de la gestión de servicios de TI según ISO 20000?",
    answers: [
      { text: "Asegurar la entrega de servicios de calidad alineados al negocio.", correct: true },
      { text: "Reducir el personal técnico innecesario.", correct: false },
      { text: "Documentar los activos tecnológicos.", correct: false },
      { text: "Auditar a los proveedores de hardware.", correct: false }
    ],
    explanation: "ISO 20000 está enfocada en asegurar que los servicios de TI satisfagan las necesidades del negocio y del cliente."
  },
  {
    question: "¿Cuál de los siguientes NO forma parte del ciclo de vida del servicio según ITIL v3?",
    answers: [
      { text: "Estrategia del servicio", correct: false },
      { text: "Diseño del servicio", correct: false },
      { text: "Transición del servicio", correct: false },
      { text: "Ejecución operativa", correct: true }
    ],
    explanation: "El ciclo de vida en ITIL v3 incluye: Estrategia, Diseño, Transición, Operación y Mejora Continua. 'Ejecución operativa' no corresponde."
  },
  {
    question: "¿Cuál de estas se considera una práctica central en ITIL 4?",
    answers: [
      { text: "Gestión de incidentes", correct: true },
      { text: "Gestión del talento humano", correct: false },
      { text: "Gestión de la cadena de suministro", correct: false },
      { text: "Control de calidad de software", correct: false }
    ],
    explanation: "La gestión de incidentes es una de las 34 prácticas clave en ITIL 4."
  },
  {
    question: "¿Qué define mejor a la norma ISO/IEC 20000?",
    answers: [
      { text: "Estándar para desarrollo ágil", correct: false },
      { text: "Guía de auditoría financiera", correct: false },
      { text: "Norma internacional de sistema de gestión de servicios TI", correct: true },
      { text: "Manual de implementación de ERP", correct: false }
    ],
    explanation: "ISO/IEC 20000 establece los requisitos para un Sistema de Gestión de Servicios de TI (SGSTI)."
  },
  {
    question: "¿Qué relación existe entre ITIL e ISO/IEC 20000?",
    answers: [
      { text: "ITIL es una guía de buenas prácticas, ISO 20000 es certificable.", correct: true },
      { text: "ITIL es más estricta que ISO.", correct: false },
      { text: "ISO 20000 depende de herramientas específicas.", correct: false },
      { text: "No tienen relación entre sí.", correct: false }
    ],
    explanation: "ITIL es una guía no certificable; ISO/IEC 20000 permite certificación y ambas son complementarias."
  },
  {
    question: "¿Qué representa el ciclo PDCA en ISO/IEC 20000?",
    answers: [
      { text: "Planificar, hacer, verificar, actuar.", correct: true },
      { text: "Probar, desarrollar, cambiar, ajustar.", correct: false },
      { text: "Presupuestar, diseñar, construir, aplicar.", correct: false },
      { text: "Planificación de centros de atención.", correct: false }
    ],
    explanation: "El ciclo PDCA (Plan-Do-Check-Act) es base de la mejora continua en ISO 20000."
  },
  {
    question: "¿Qué contiene un catálogo de servicios en ITIL?",
    answers: [
      { text: "Activos físicos de TI.", correct: false },
      { text: "Usuarios del sistema.", correct: false },
      { text: "Descripción de servicios disponibles para los usuarios.", correct: true },
      { text: "Software usado por TI.", correct: false }
    ],
    explanation: "El catálogo de servicios documenta los servicios disponibles para los usuarios."
  },
  {
    question: "¿Cuál es el objetivo de la gestión de incidentes según ITIL?",
    answers: [
      { text: "Restaurar el servicio lo más rápido posible.", correct: true },
      { text: "Cambiar un hardware defectuoso.", correct: false },
      { text: "Capacitar al usuario final.", correct: false },
      { text: "Actualizar los sistemas operativos.", correct: false }
    ],
    explanation: "Su objetivo es restaurar el servicio y minimizar el impacto al negocio."
  },
  {
    question: "¿Qué es un SLA (Acuerdo de Nivel de Servicio)?",
    answers: [
      { text: "Informe de evaluación de proveedor.", correct: false },
      { text: "Lista de errores frecuentes.", correct: false },
      { text: "Compromiso formal del proveedor sobre calidad del servicio.", correct: true },
      { text: "Política de TI genérica.", correct: false }
    ],
    explanation: "Un SLA define los niveles de calidad acordados entre proveedor y cliente."
  },
  {
    question: "¿Qué función tiene la gestión de cambios en el marco ITIL?",
    answers: [
      { text: "Eliminar configuraciones obsoletas.", correct: false },
      { text: "Evaluar, aprobar y coordinar cambios.", correct: true },
      { text: "Rediseñar toda la arquitectura.", correct: false },
      { text: "Solicitar compra de software.", correct: false }
    ],
    explanation: "Se asegura de que los cambios sean controlados y minimicen riesgos."
  },
  {
    question: "¿Cuál es el objetivo principal de la gestión de la configuración en ITIL?",
    answers: [
      { text: "Identificar y controlar activos y relaciones.", correct: true },
      { text: "Comprar licencias.", correct: false },
      { text: "Eliminar software duplicado.", correct: false },
      { text: "Actualizar la red.", correct: false }
    ],
    explanation: "Mantiene un control de los activos (CI) y sus relaciones."
  },
  {
    question: "¿Qué rol es responsable de la entrega y calidad continua del servicio?",
    answers: [
      { text: "Director de TI.", correct: false },
      { text: "Encargado de redes.", correct: false },
      { text: "Gestor del servicio.", correct: true },
      { text: "Asistente técnico.", correct: false }
    ],
    explanation: "El Gestor de Servicio es quien asegura la entrega y mejora de los servicios."
  },
  {
    question: "¿Qué mide la gestión de calidad del servicio en ITIL/ISO 20000?",
    answers: [
      { text: "Grado de cumplimiento de los requisitos acordados.", correct: true },
      { text: "Número de usuarios.", correct: false },
      { text: "Número de incidencias de software.", correct: false },
      { text: "Velocidad de la red.", correct: false }
    ],
    explanation: "Se mide según los requisitos del cliente y los acuerdos establecidos (SLA)."
  },
  {
    question: "¿Qué actividad corresponde a la auditoría en ISO/IEC 20000?",
    answers: [
      { text: "Desarrollar nuevas políticas.", correct: false },
      { text: "Verificar cumplimiento del SGSTI.", correct: true },
      { text: "Reconfigurar la base de datos.", correct: false },
      { text: "Reemplazar software libre.", correct: false }
    ],
    explanation: "La auditoría verifica el cumplimiento de la norma ISO 20000."
  },
  {
    question: "¿Qué significa “no conformidad” en una auditoría ISO 20000?",
    answers: [
      { text: "Errores en la aplicación.", correct: false },
      { text: "Fallas de hardware.", correct: false },
      { text: "Desviación respecto a lo establecido en el sistema de gestión.", correct: true },
      { text: "Pérdida de información.", correct: false }
    ],
    explanation: "Es cualquier incumplimiento con los requisitos de la norma o el sistema de gestión."
  },
  {
    question: "¿Qué se requiere para una política de servicio efectiva según ITIL/ISO?",
    answers: [
      { text: "Apoyo de la alta dirección y comunicación clara.", correct: true },
      { text: "Presupuesto amplio.", correct: false },
      { text: "Control remoto.", correct: false },
      { text: "Servicio en la nube.", correct: false }
    ],
    explanation: "La política debe ser respaldada por la alta dirección y comunicada adecuadamente."
  },
  {
    question: "¿Qué controla el Acuerdo de Nivel Operativo (OLA)?",
    answers: [
      { text: "SLA de proveedores externos.", correct: false },
      { text: "Relación interna entre grupos de soporte.", correct: true },
      { text: "Evaluación de riesgos.", correct: false },
      { text: "Niveles de conocimiento.", correct: false }
    ],
    explanation: "El OLA regula los compromisos internos para cumplir con los SLA."
  },
  {
    question: "¿Qué competencia debe tener el gestor de servicios TI?",
    answers: [
      { text: "Manejo de finanzas.", correct: false },
      { text: "Diseño gráfico.", correct: false },
      { text: "Conocimiento técnico, comunicación y liderazgo.", correct: true },
      { text: "Habilidades en ventas.", correct: false }
    ],
    explanation: "Debe tener conocimientos técnicos, comunicación y liderazgo para coordinar y asegurar la calidad del servicio."
  },
  {
    question: "¿Cuál de los siguientes procesos pertenece a la gestión del nivel de servicio en ITIL?",
    answers: [
      { text: "Revisión de seguridad perimetral", correct: false },
      { text: "Evaluación del rendimiento de servicios contra SLA", correct: true },
      { text: "Configuración del hardware de red", correct: false },
      { text: "Desarrollo de aplicaciones móviles", correct: false }
    ],
    explanation: "La gestión del nivel de servicio incluye evaluar si los servicios cumplen con los acuerdos establecidos (SLA)."
  },
  {
    question: "¿Cuál es una característica clave del enfoque basado en procesos de ISO/IEC 20000?",
    answers: [
      { text: "Independencia total de roles y funciones", correct: false },
      { text: "Cada departamento gestiona sus servicios sin coordinación", correct: false },
      { text: "Enlace entre actividades para generar valor sistemático", correct: true },
      { text: "Gestión únicamente financiera del servicio", correct: false }
    ],
    explanation: "El enfoque basado en procesos promueve la integración y coordinación de actividades para generar valor coherente."
  },
  {
    question: "¿Qué herramienta apoya directamente la gestión del conocimiento en ITIL?",
    answers: [
      { text: "Base de datos de errores conocidos (KEDB)", correct: true },
      { text: "Firewall perimetral", correct: false },
      { text: "Software ERP", correct: false },
      { text: "Antivirus corporativo", correct: false }
    ],
    explanation: "La KEDB es clave en la gestión del conocimiento, documentando errores conocidos y sus soluciones."
  },
  {
    question: "¿Cuál es el propósito principal del proceso de gestión de problemas?",
    answers: [
      { text: "Minimizar el impacto de cambios", correct: false },
      { text: "Eliminar la causa raíz de incidentes repetitivos", correct: true },
      { text: "Automatizar respuestas al cliente", correct: false },
      { text: "Monitorear la conectividad de red", correct: false }
    ],
    explanation: "La gestión de problemas busca encontrar y eliminar causas raíz de incidentes."
  },
  {
    question: "¿Qué documento establece formalmente las métricas, alcance y niveles esperados de un servicio?",
    answers: [
      { text: "Manual de usuario", correct: false },
      { text: "Catálogo técnico", correct: false },
      { text: "SLA (Acuerdo de Nivel de Servicio)", correct: true },
      { text: "Inventario de activos", correct: false }
    ],
    explanation: "El SLA establece compromisos concretos y medibles entre proveedor y cliente."
  },
  {
    question: "¿Cuál es el objetivo de la gestión de la disponibilidad en ITIL?",
    answers: [
      { text: "Maximizar el tiempo de respuesta de red", correct: false },
      { text: "Garantizar que los servicios estén disponibles según lo acordado", correct: true },
      { text: "Proteger los datos de acceso no autorizado", correct: false },
      { text: "Monitorear el uso de licencias de software", correct: false }
    ],
    explanation: "La gestión de la disponibilidad asegura que los servicios estén accesibles conforme a los SLA."
  },
  {
    question: "¿Qué busca lograr la gestión de la capacidad en un servicio TI?",
    answers: [
      { text: "Documentar activos obsoletos", correct: false },
      { text: "Garantizar que los recursos soporten la demanda actual y futura", correct: true },
      { text: "Minimizar errores en las instalaciones", correct: false },
      { text: "Eliminar software sin licencia", correct: false }
    ],
    explanation: "La gestión de la capacidad busca que la infraestructura soporte la demanda presente y futura."
  },
  {
    question: "¿Qué tipo de acuerdo se establece entre una organización y un proveedor externo de servicios TI?",
    answers: [
      { text: "OLA (Acuerdo de Nivel Operativo)", correct: false },
      { text: "MOU (Memorando de Entendimiento)", correct: false },
      { text: "SLA externo (Acuerdo de Nivel de Servicio)", correct: true },
      { text: "Manual interno de operaciones", correct: false }
    ],
    explanation: "El SLA externo formaliza compromisos entre la organización y el proveedor."
  },
  {
    question: "¿Qué se requiere para implementar un sistema de gestión de servicios TI conforme a ISO 20000?",
    answers: [
      { text: "Un conjunto de herramientas de código abierto", correct: false },
      { text: "Definición de políticas, procesos, roles y mejoras continuas", correct: true },
      { text: "Certificación previa en ISO 9001", correct: false },
      { text: "Adopción obligatoria de ITIL 4", correct: false }
    ],
    explanation: "ISO 20000 exige políticas, procesos y mejora continua, no depende de certificaciones previas."
  },
  {
    question: "¿Cuál es el propósito del proceso de gestión financiera para servicios TI en ITIL?",
    answers: [
      { text: "Negociar contratos laborales", correct: false },
      { text: "Elaborar informes contables generales", correct: false },
      { text: "Gestionar costos, presupuestos y facturación del servicio TI", correct: true },
      { text: "Realizar pagos a proveedores externos", correct: false }
    ],
    explanation: "Busca controlar los costos asociados a los servicios TI."
  },
  {
    question: "¿Qué papel cumple el proceso de gestión de continuidad del servicio en ITIL?",
    answers: [
      { text: "Eliminar vulnerabilidades del software", correct: false },
      { text: "Garantizar que el servicio pueda recuperarse ante eventos graves", correct: true },
      { text: "Optimizar el rendimiento de red", correct: false },
      { text: "Automatizar los backups semanales", correct: false }
    ],
    explanation: "Se enfoca en mantener la operación ante desastres o interrupciones."
  },
  {
    question: "¿Cuál de los siguientes es un principio fundamental de ITIL 4?",
    answers: [
      { text: "Documentar cada ticket manualmente", correct: false },
      { text: "Comenzar donde se está y avanzar iterativamente", correct: true },
      { text: "Contratar más personal técnico", correct: false },
      { text: "Externalizar toda la infraestructura TI", correct: false }
    ],
    explanation: "Uno de los principios de ITIL 4 es 'Start where you are', mejorar sobre lo existente."
  },
  {
    question: "¿Qué representa el término 'valor' en la gestión de servicios según ITIL?",
    answers: [
      { text: "Utilidad + Garantía entregadas al cliente", correct: true },
      { text: "Margen de ganancia del proveedor", correct: false },
      { text: "Cantidad de usuarios atendidos", correct: false },
      { text: "Costo de implementación de software", correct: false }
    ],
    explanation: "ITIL define valor como la suma de utilidad y garantía."
  },
  {
    question: "¿Cuál de las siguientes actividades se relaciona con la gestión del portafolio de servicios?",
    answers: [
      { text: "Aprobar los diseños gráficos del sitio web", correct: false },
      { text: "Evaluar, priorizar y justificar inversiones en servicios TI", correct: true },
      { text: "Gestionar licencias de software", correct: false },
      { text: "Administrar las cuentas de correo electrónico", correct: false }
    ],
    explanation: "El portafolio permite decidir qué servicios ofrecer, continuar o retirar."
  },
  {
    question: "¿Qué diferencia a un incidente de un problema en ITIL?",
    answers: [
      { text: "El problema es menos urgente", correct: false },
      { text: "El incidente es la causa raíz del problema", correct: false },
      { text: "El incidente afecta servicios, el problema busca eliminar su causa", correct: true },
      { text: "No hay diferencia, ambos son errores técnicos", correct: false }
    ],
    explanation: "Un incidente es una interrupción del servicio; el problema es su causa subyacente."
  },
  {
    question: "¿Cuál es una función del Centro de Servicios (Service Desk) en ITIL?",
    answers: [
      { text: "Desarrollar nuevas funcionalidades de software", correct: false },
      { text: "Actuar como punto único de contacto con los usuarios", correct: true },
      { text: "Gestionar bases de datos empresariales", correct: false },
      { text: "Planificar proyectos de transformación digital", correct: false }
    ],
    explanation: "El Service Desk actúa como punto único de contacto con los usuarios."
  },
  {
    question: "¿Qué representa el SVS (Sistema de Valor del Servicio) en ITIL 4?",
    answers: [
      { text: "Un repositorio de políticas internas", correct: false },
      { text: "Un conjunto de recursos físicos de TI", correct: false },
      { text: "Un marco que facilita la co-creación de valor a través de servicios", correct: true },
      { text: "Un informe financiero de costos TI", correct: false }
    ],
    explanation: "El SVS integra componentes clave para generar valor en ITIL 4."
  },
  {
    question: "¿Cuál es el propósito de la gestión de riesgos en el contexto de servicios TI?",
    answers: [
      { text: "Registrar todos los incidentes", correct: false },
      { text: "Planificar mejoras de interfaz gráfica", correct: false },
      { text: "Identificar, evaluar y mitigar eventos que puedan afectar los servicios", correct: true },
      { text: "Gestionar cuentas de usuario", correct: false }
    ],
    explanation: "La gestión de riesgos permite tomar decisiones informadas sobre amenazas y oportunidades."
  },
  {
    question: "¿Cuál es un beneficio de la mejora continua del servicio (CSI) en ITIL?",
    answers: [
      { text: "Eliminar todo el personal de soporte", correct: false },
      { text: "Aumentar la complejidad del sistema", correct: false },
      { text: "Adaptar los servicios a las necesidades cambiantes del negocio", correct: true },
      { text: "Reducir el número de reuniones internas", correct: false }
    ],
    explanation: "CSI busca alinear los servicios con las necesidades del negocio mediante ajustes constantes."
  },
  {
    question: "¿Qué herramienta permite visualizar relaciones entre componentes en la gestión de configuración?",
    answers: [
      { text: "Diagrama de Gantt", correct: false },
      { text: "CMDB (Base de Datos de la Configuración)", correct: true },
      { text: "Mapa de procesos empresariales", correct: false },
      { text: "Catálogo de productos", correct: false }
    ],
    explanation: "La CMDB almacena información sobre elementos de configuración y sus relaciones."
  }
];


// ==================== FUNCIONES ====================

function startQuiz() {
  score = 0;
  lives = 3;
  streak = 0;
  answered = false;
  availableQuestions = [...questions];
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  updateStats();
  showQuestion();
}

function showQuestion() {
  resetState();
  if (availableQuestions.length === 0) {
    return endQuiz();
  }
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions.splice(randomIndex, 1)[0];
  questionEl.innerText = currentQuestion.question;
  currentQuestion.answers.forEach(a => {
    const btn = document.createElement("button");
    btn.innerText = a.text;
    btn.classList.add("btn");
    btn.addEventListener("click", () => selectAnswer(a, btn));
    answerButtonsEl.appendChild(btn);
  });
  updateProgress();
  answered = false;
}

function resetState() {
  feedbackEl.innerText = "";
  explanationEl.innerText = "";
  nextBtn.classList.add("hidden");
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  }
}
///////////////////////////////////////////////////////
function selectAnswer(answer, button) {
  if (answered) return;
  answered = true;

  if (answer.correct) {
    playSound(soundCorrect);
    feedbackEl.innerText = "¡Correcto! 🎉";   // Muestra mensaje
    button.classList.add("correct");
    score++;
    streak++;
    if (score > maxScore) maxScore = score;
  } else {
    playSound(soundWrong);
    feedbackEl.innerText = "❌ Incorrecto";   // Muestra mensaje
    button.classList.add("incorrect");
    streak = 0;
    if (mode === "survival") {
      lives--;
      if (lives <= 0) {
        return gameOver();
      }
    }
  }

  // Mostrar explicación
  explanationEl.innerText = "Explicación: " + currentQuestion.explanation;

  // Marcar la correcta
  Array.from(answerButtonsEl.children).forEach(btn => {
    btn.disabled = true;
    if (currentQuestion.answers.find(a => a.correct).text === btn.innerText) {
      btn.classList.add("correct");
    }
  });

  nextBtn.classList.remove("hidden");
  updateStats();
}



////////////////////////////////////////////////

nextBtn.addEventListener("click", showQuestion);

function endQuiz() {
  feedbackEl.innerText = "¡Has completado todas las preguntas!";
  nextBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");
  launchConfetti();
}

function gameOver() {
  quizContainer.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  playSound(soundGameOver);
}

function updateStats() {
  scoreEl.innerText = score;
  maxScoreEl.innerText = maxScore;
  livesEl.innerText = lives;
  livesContainer.style.display = mode === "survival" ? "inline" : "none";
}

function updateProgress() {
  const progress = ((questions.length - availableQuestions.length) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function launchConfetti() {
  console.log("Confetti 🎉");
}

// ==================== EVENTOS ====================
startPracticeBtn.addEventListener("click", () => { mode = "practice"; startQuiz(); });
startSurvivalBtn.addEventListener("click", () => { mode = "survival"; startQuiz(); });
restartBtn.addEventListener("click", startQuiz);
retryBtn.addEventListener("click", startQuiz);
backMenuBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
menuBtn.addEventListener("click", () => {
  quizContainer.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
