/**
 * Warm-Up Generation Prompts
 *
 * Based on RAMP framework (Raise, Activate, Mobilise, Potentiate)
 * See warmup-system.md for full documentation
 */

import type { WarmUpGenerationContext } from '../types'

export const WARMUP_SYSTEM_PROMPT = `You are an expert Strength & Conditioning coach specialized in match preparation for racquet sports.

Your task is to generate a safe, effective, and match-ready dynamic warm-up session.

STRUCTURE REQUIREMENTS (MANDATORY):
1) Follow the RAMP framework:
   - Raise: Increase heart rate, blood flow, body temperature
   - Activate: Wake up key muscle groups
   - Mobilise: Dynamic movement through full range of motion
   - Potentiate: Explosive/reactive movements to prime nervous system
   - Sport-specific: On-court movements and hitting patterns

2) The warm-up must be:
   - Dynamic (avoid static stretching >10-15s)
   - Progressive (low → high intensity)
   - Match-ready, NOT fatiguing

3) Each drill must include:
   - Clear duration or rep scheme
   - Intensity level (RPE 1-10)
   - 1-2 coaching cues
   - 1 common mistake to avoid

SPORT-SPECIFIC REQUIREMENTS:
For racquet sports, always include:
- Lateral movement patterns
- Deceleration & change of direction
- Split-step / ready position drills
- Shoulder and rotational preparation
- If on court: progressive hitting sequence (controlled → match-like)

DAILY CHECK-IN CONTEXT:
The player may have provided recent check-in data about their physical state.
When check-in data is available:
- Energy <5 or poor sleep: Reduce intensity, extend Raise phase, add gentle activation
- Pain zones reported: Add targeted mobility for affected areas, protect in potentiation
- High stress (>7): Include 1-2 breathing exercises in Raise phase
- High activity week: More recovery-focused, less explosive work
- Muscle soreness: Add extra mobility for sore muscle groups
- Weak shots listed: Include related muscle activation in sport-specific phase
- Confident shots listed: Start sport-specific phase with these for confidence building

TONE:
Professional, clear, and concise.
Avoid unnecessary explanations.
Prioritize clarity and practical coaching cues.
Respond in Spanish.

OUTPUT FORMAT:
Respond ONLY with valid JSON matching this exact structure:
{
  "title": "string - descriptive title",
  "duration_minutes": number,
  "phases": [
    {
      "phase": "raise" | "activate" | "mobilise" | "potentiate" | "sport_specific",
      "phase_label": "string - Spanish label for the phase",
      "timestamp": "string - e.g., 0:00-2:00",
      "drills": [
        {
          "name": "string",
          "duration": "string - e.g., 60 segundos, 10 reps cada lado",
          "intensity": number (1-10 RPE),
          "coaching_cues": ["string", "string"],
          "common_mistake": "string",
          "video_search_query": "string - YouTube search query for exercise demo",
          "execution_steps": ["string", "string", "string"],
          "objective": "string - why this drill prepares you for the match",
          "expected_sensation_during": "string - what to feel while doing it",
          "expected_sensation_after": "string - what to feel after completing",
          "rounds": number (1-3),
          "rest_seconds": number (0-30)
        }
      ]
    }
  ],
  "adaptations": {
    "cold_conditions": "string - modification for cold weather",
    "if_irritated": "string - modification if priority areas feel irritated"
  },
  "ready_checklist": {
    "physical_signs": ["string", "string", "string"],
    "neurological_signs": ["string", "string"]
  }
}

DRILL FIELD REQUIREMENTS:
1) video_search_query: Optimized for YouTube search (e.g., "padel warm up hip circles exercise")
2) execution_steps: 3-5 clear, actionable steps. Start with body position, then movement.
3) objective: 1 sentence explaining the benefit for padel match readiness.
4) expected_sensation_during: Physical sensation to confirm correct execution.
5) expected_sensation_after: Readiness indicator after completing the drill.
6) rounds: Use 1-2 for warm-up phases (raise, activate, mobilise), 2-3 for potentiation.
7) rest_seconds: Use 0 for single rounds, 10-15 for moderate drills, 20-30 for intense drills.`

export function buildUserPrompt(context: WarmUpGenerationContext): string {
  const equipmentList = context.equipment.length > 0
    ? context.equipment.join(', ')
    : 'ninguno'

  let prompt = `Generate a warm-up for this player:

PLAYER PROFILE:
- Sport: ${context.sport}
- Match type: ${context.match_type}
- Skill level: ${context.skill_level}
- Age: ${context.age || 'not specified'}
- Training background: ${context.training_background}

CONTEXT:
- Time available: ${context.duration_minutes} minutes
- Environment: ${context.environment}
- Space available: ${context.space}
- Equipment available: ${equipmentList}
- Match starts: ${context.match_timing}

HEALTH & CONSTRAINTS:
- Injuries/sensitive areas: ${context.injuries}
- Areas to prioritize or protect: ${context.priority_areas}
- Fatigue status: ${context.fatigue_level}

DESIRED FEEL BEFORE MATCH:
${context.desired_outcome}`

  // Add check-in data if available
  if (context.checkin) {
    const c = context.checkin
    prompt += `

RECENT CHECK-IN DATA (last 7 days):
- Current energy: ${c.energy_level !== undefined ? `${c.energy_level}/10` : 'not reported'}
- Sleep quality: ${c.sleep_quality || 'not reported'}
- Pain/discomfort zones: ${c.pain_zones?.length ? c.pain_zones.join(', ') : 'none reported'}
- Muscle soreness: ${c.sore_muscles?.length ? c.sore_muscles.join(', ') : 'none reported'}
- Stress level: ${c.stress_level !== undefined ? `${c.stress_level}/10` : 'not reported'}
- Recovery feeling: ${c.recovery_status || 'not reported'}
- Week activity: ${c.playing_frequency || 'not reported'}

PERFORMANCE NOTES:
- Working on: ${c.weak_shots?.length ? c.weak_shots.join(', ') : 'not specified'}
- Confident with: ${c.confident_shots?.length ? c.confident_shots.join(', ') : 'not specified'}`
  }

  return prompt
}

/**
 * Build context from player profile with sensible defaults
 */
export function buildContextFromProfile(profile: {
  game_experience_level: string
  fitness_level: string
  injury_status: string
  primary_goal: string
  frequency: string
  years_playing: string
}): WarmUpGenerationContext {
  // Map game experience to skill level
  const skillLevelMap: Record<string, WarmUpGenerationContext['skill_level']> = {
    beginner: 'beginner',
    intermediate: 'intermediate',
    advanced: 'advanced',
    pro: 'competitive',
  }

  // Map frequency + years to training background
  const getTrainingBackground = (): string => {
    if (profile.years_playing === 'less_6_months') {
      return 'recreational, new to the sport'
    }
    if (profile.frequency === 'daily' || profile.frequency === 'frequent') {
      return 'trained athlete, regular practice'
    }
    if (profile.frequency === 'weekly') {
      return 'recreational, weekly practice'
    }
    return 'recreational, occasional play'
  }

  // Map injury status
  const getInjuries = (): string => {
    switch (profile.injury_status) {
      case 'none':
        return 'none'
      case 'minor':
        return 'minor discomfort, be cautious'
      case 'recovering':
        return 'recovering from injury, prioritize protection'
      case 'chronic':
        return 'chronic issue, needs careful management'
      default:
        return 'none'
    }
  }

  // Map primary goal to desired outcome
  const getDesiredOutcome = (): string => {
    switch (profile.primary_goal) {
      case 'endurance':
        return 'feel ready for long rallies, good cardio base'
      case 'strength':
        return 'feel strong and powerful, ready for explosive shots'
      case 'weight_loss':
        return 'feel energized and ready to move, high activity'
      case 'injury_prevention':
        return 'feel protected and stable, confident in movements'
      case 'peak_performance':
        return 'feel explosive, quick feet, sharp reactions'
      default:
        return 'feel ready to play, loose and mobile'
    }
  }

  return {
    sport: 'padel',
    match_type: 'doubles', // Default for padel
    skill_level: skillLevelMap[profile.game_experience_level] || 'intermediate',
    training_background: getTrainingBackground(),
    duration_minutes: 12,
    environment: 'indoor', // Default
    space: 'on_court', // Default for pre-match
    equipment: [], // No equipment by default
    match_timing: 'in_10_15_min',
    injuries: getInjuries(),
    priority_areas: profile.injury_status !== 'none' ? 'affected area from injury' : 'none',
    fatigue_level: 'normal',
    desired_outcome: getDesiredOutcome(),
  }
}
