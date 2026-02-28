// Question definitions for the onboarding flow

export type QuestionType = "single" | "multi";

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  category: "game" | "fitness" | "lifestyle";
  title: string;
  subtitle?: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  // === GAME EXPERIENCE (5 questions) ===
  {
    id: "yearsPlaying",
    type: "single",
    category: "game",
    title: "¿Cuánto tiempo llevas jugando al pádel?",
    options: [
      { value: "less_6_months", label: "Menos de 6 meses" },
      { value: "6m_2y", label: "6 meses - 2 años" },
      { value: "2y_5y", label: "2 - 5 años" },
      { value: "more_5y", label: "Más de 5 años" },
    ],
  },
  {
    id: "frequency",
    type: "single",
    category: "game",
    title: "¿Con qué frecuencia juegas?",
    options: [
      {
        value: "occasional",
        label: "Ocasional",
        description: "1-2 veces al mes",
      },
      {
        value: "weekly",
        label: "Semanal",
        description: "1-2 veces por semana",
      },
      {
        value: "frequent",
        label: "Frecuente",
        description: "3-4 veces por semana",
      },
      { value: "daily", label: "Diario", description: "5+ veces por semana" },
    ],
  },
  {
    id: "selfAssessedLevel",
    type: "single",
    category: "game",
    title: "¿Cuál describe mejor tu nivel actual?",
    options: [
      {
        value: "beginner",
        label: "Principiante",
        description: "Aprendiendo reglas básicas y golpes",
      },
      {
        value: "intermediate",
        label: "Intermedio",
        description: "Golpes consistentes, entiendo posicionamiento",
      },
      {
        value: "advanced",
        label: "Avanzado",
        description: "Domino la mayoría de golpes, compito en torneos",
      },
      {
        value: "pro",
        label: "Pro / Semi-pro",
        description: "Compito a nivel federado o profesional",
      },
    ],
  },
  {
    id: "tournamentLevel",
    type: "single",
    category: "game",
    title: "¿Compites en torneos?",
    options: [
      { value: "none", label: "No", description: "Solo juego por diversión" },
      {
        value: "local",
        label: "Torneos locales",
        description: "Amateur / entre amigos",
      },
      {
        value: "federated",
        label: "Torneos federados",
        description: "Competición oficial",
      },
      {
        value: "professional",
        label: "Circuito profesional",
        description: "WPT / Premier Padel",
      },
    ],
  },
  {
    id: "skills",
    type: "multi",
    category: "game",
    title: "¿En qué golpes te sientes seguro?",
    subtitle: "Selecciona todos los que apliquen",
    options: [
      { value: "basic_shots", label: "Derecha y revés de fondo" },
      { value: "lob", label: "Globo" },
      { value: "wall_rebounds", label: "Rebotes de pared" },
      { value: "volleys", label: "Voleas en la red" },
      { value: "bandeja", label: "Bandeja" },
      { value: "vibora", label: "Vibora" },
      { value: "smash", label: "Remate / Smash" },
      { value: "positioning", label: "Posicionamiento táctico" },
    ],
  },

  // === FITNESS (5 questions) ===
  {
    id: "activityLevel",
    type: "single",
    category: "fitness",
    title: "¿Cuál es tu nivel de actividad física actual?",
    options: [
      {
        value: "sedentary",
        label: "Sedentario",
        description: "Mayormente sentado, poco ejercicio",
      },
      {
        value: "light",
        label: "Ligero",
        description: "Caminatas o actividades ligeras",
      },
      {
        value: "moderate",
        label: "Moderado",
        description: "Ejercicio 2-3 veces por semana",
      },
      {
        value: "active",
        label: "Activo",
        description: "Ejercicio 4-5 veces por semana",
      },
      {
        value: "very_active",
        label: "Muy activo",
        description: "Entrenamiento intenso 6+ días",
      },
    ],
  },
  {
    id: "additionalTraining",
    type: "multi",
    category: "fitness",
    title: "¿Qué otro entrenamiento haces además del pádel?",
    subtitle: "Selecciona todos los que apliquen",
    options: [
      { value: "none", label: "Ninguno" },
      { value: "gym", label: "Gimnasio / Fuerza" },
      {
        value: "cardio",
        label: "Cardio",
        description: "Correr, ciclismo, natación",
      },
      { value: "racquet_sports", label: "Otros deportes de raqueta" },
      { value: "multiple", label: "Múltiples actividades" },
    ],
  },
  {
    id: "endurance",
    type: "single",
    category: "fitness",
    title: "¿Cómo es tu resistencia durante un partido?",
    options: [
      {
        value: "poor",
        label: "Me canso rápido",
        description: "Pierdo energía en el segundo set",
      },
      {
        value: "fair",
        label: "Aguanto el partido",
        description: "Pero termino agotado",
      },
      {
        value: "good",
        label: "Buena resistencia",
        description: "Me recupero bien entre puntos",
      },
      {
        value: "excellent",
        label: "Excelente",
        description: "Puedo jugar varios partidos seguidos",
      },
    ],
  },
  {
    id: "injuryStatus",
    type: "single",
    category: "fitness",
    title: "¿Tienes alguna lesión o limitación física?",
    options: [
      { value: "none", label: "Ninguna", description: "Sin limitaciones" },
      {
        value: "minor",
        label: "Molestias menores",
        description: "Ocasionalmente",
      },
      {
        value: "recovering",
        label: "Recuperándome",
        description: "De una lesión reciente",
      },
      {
        value: "chronic",
        label: "Condición crónica",
        description: "A tener en cuenta",
      },
    ],
  },
  {
    id: "primaryGoal",
    type: "single",
    category: "fitness",
    title: "¿Cuál es tu objetivo físico principal?",
    options: [
      { value: "endurance", label: "Mejorar resistencia" },
      { value: "strength", label: "Ganar fuerza" },
      {
        value: "weight_loss",
        label: "Perder peso",
        description: "Ponerme en forma",
      },
      { value: "injury_prevention", label: "Prevenir lesiones" },
      { value: "peak_performance", label: "Máximo rendimiento" },
    ],
  },

  // === LIFESTYLE (5 questions) ===
  {
    id: "motivation",
    type: "single",
    category: "lifestyle",
    title: "¿Cuál es tu principal motivación?",
    options: [
      {
        value: "fun",
        label: "Diversión",
        description: "Pasarla bien con amigos",
      },
      {
        value: "health",
        label: "Salud",
        description: "Mantenerme sano y en forma",
      },
      {
        value: "improvement",
        label: "Mejorar",
        description: "Quiero ser mejor jugador",
      },
      {
        value: "competition",
        label: "Competir",
        description: "Ganar partidos y torneos",
      },
    ],
  },
  {
    id: "weeklyHours",
    type: "single",
    category: "lifestyle",
    title: "¿Cuánto tiempo puedes dedicar al entrenamiento físico por semana?",
    subtitle: "Además del tiempo en pista",
    options: [
      { value: "minimal", label: "Menos de 1 hora" },
      { value: "light", label: "1-2 horas" },
      { value: "moderate", label: "3-4 horas" },
      { value: "dedicated", label: "5+ horas" },
    ],
  },
  {
    id: "preferredTime",
    type: "single",
    category: "lifestyle",
    title: "¿Cuándo prefieres entrenar?",
    options: [
      { value: "morning", label: "Mañanas", description: "Antes del trabajo" },
      { value: "midday", label: "Mediodía" },
      { value: "evening", label: "Tardes", description: "Después del trabajo" },
      { value: "weekend", label: "Fines de semana" },
      { value: "flexible", label: "Flexible", description: "Sin preferencia" },
    ],
  },
  {
    id: "sleepQuality",
    type: "single",
    category: "lifestyle",
    title: "¿Cómo es tu sueño habitualmente?",
    options: [
      {
        value: "poor",
        label: "Malo",
        description: "Menos de 6h o mala calidad",
      },
      {
        value: "fair",
        label: "Regular",
        description: "6-7h, a veces inquieto",
      },
      { value: "good", label: "Bueno", description: "7-8h, descanso bien" },
      {
        value: "excellent",
        label: "Excelente",
        description: "8h+, despierto renovado",
      },
    ],
  },
  {
    id: "lifeContext",
    type: "single",
    category: "lifestyle",
    title: "¿Qué describe mejor tu situación actual?",
    options: [
      {
        value: "student",
        label: "Estudiante",
        description: "Horario flexible",
      },
      {
        value: "professional",
        label: "Profesional",
        description: "Tiempo limitado entre semana",
      },
      {
        value: "parent",
        label: "Padre/Madre",
        description: "Con hijos pequeños",
      },
      {
        value: "flexible",
        label: "Horario flexible",
        description: "Jubilado o autónomo",
      },
      {
        value: "irregular",
        label: "Turnos irregulares",
        description: "Horarios variables",
      },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
