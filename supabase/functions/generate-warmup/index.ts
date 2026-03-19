import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Types for context building
interface PlayerProfile {
  id: string
  user_id: string
  game_experience_level: string
  fitness_level: string
  injury_status: string
  primary_goal: string
  frequency: string
  years_playing: string
}

interface CheckinResponse {
  id: string
  question_id: string
  response_value: unknown
  skipped: boolean
  response_date: string
  question_slug?: string
}

interface CheckinResponseWithQuestion {
  id: string
  question_id: string
  response_value: unknown
  skipped: boolean
  response_date: string
  checkin_questions?: {
    slug?: string
    ai_relevance?: string[]
  } | null
}

interface CheckinContext {
  energy_level?: number
  sleep_quality?: string
  pain_zones?: string[]
  sore_muscles?: string[]
  stress_level?: number
  recovery_status?: string
  playing_frequency?: string
  weak_shots?: string[]
  confident_shots?: string[]
}

interface WarmUpGenerationContext {
  sport: string
  match_type: "singles" | "doubles"
  skill_level: "beginner" | "intermediate" | "advanced" | "competitive"
  age?: number
  training_background: string
  duration_minutes: number
  environment: "cold_outdoor" | "hot_outdoor" | "indoor"
  space: "on_court" | "off_court" | "limited"
  equipment: string[]
  match_timing: "immediately" | "in_10_15_min"
  injuries: string
  priority_areas: string
  fatigue_level: "fresh" | "normal" | "tired"
  desired_outcome: string
  checkin?: CheckinContext
}

// System prompt for warm-up generation
const WARMUP_SYSTEM_PROMPT = `You are an expert Strength & Conditioning coach specialized in match preparation for racquet sports.

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

// Build user prompt from context
function buildUserPrompt(context: WarmUpGenerationContext): string {
  const equipmentList = context.equipment.length > 0
    ? context.equipment.join(", ")
    : "ninguno"

  let prompt = `Generate a warm-up for this player:

PLAYER PROFILE:
- Sport: ${context.sport}
- Match type: ${context.match_type}
- Skill level: ${context.skill_level}
- Age: ${context.age || "not specified"}
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
- Current energy: ${c.energy_level !== undefined ? `${c.energy_level}/10` : "not reported"}
- Sleep quality: ${c.sleep_quality || "not reported"}
- Pain/discomfort zones: ${c.pain_zones?.length ? c.pain_zones.join(", ") : "none reported"}
- Muscle soreness: ${c.sore_muscles?.length ? c.sore_muscles.join(", ") : "none reported"}
- Stress level: ${c.stress_level !== undefined ? `${c.stress_level}/10` : "not reported"}
- Recovery feeling: ${c.recovery_status || "not reported"}
- Week activity: ${c.playing_frequency || "not reported"}

PERFORMANCE NOTES:
- Working on: ${c.weak_shots?.length ? c.weak_shots.join(", ") : "not specified"}
- Confident with: ${c.confident_shots?.length ? c.confident_shots.join(", ") : "not specified"}`
  }

  return prompt
}

// Build context from player profile
function buildContextFromProfile(profile: PlayerProfile): WarmUpGenerationContext {
  const skillLevelMap: Record<string, WarmUpGenerationContext["skill_level"]> = {
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
    pro: "competitive",
  }

  const getTrainingBackground = (): string => {
    if (profile.years_playing === "less_6_months") {
      return "recreational, new to the sport"
    }
    if (profile.frequency === "daily" || profile.frequency === "frequent") {
      return "trained athlete, regular practice"
    }
    if (profile.frequency === "weekly") {
      return "recreational, weekly practice"
    }
    return "recreational, occasional play"
  }

  const getInjuries = (): string => {
    switch (profile.injury_status) {
      case "none":
        return "none"
      case "minor":
        return "minor discomfort, be cautious"
      case "recovering":
        return "recovering from injury, prioritize protection"
      case "chronic":
        return "chronic issue, needs careful management"
      default:
        return "none"
    }
  }

  const getDesiredOutcome = (): string => {
    switch (profile.primary_goal) {
      case "endurance":
        return "feel ready for long rallies, good cardio base"
      case "strength":
        return "feel strong and powerful, ready for explosive shots"
      case "weight_loss":
        return "feel energized and ready to move, high activity"
      case "injury_prevention":
        return "feel protected and stable, confident in movements"
      case "peak_performance":
        return "feel explosive, quick feet, sharp reactions"
      default:
        return "feel ready to play, loose and mobile"
    }
  }

  return {
    sport: "padel",
    match_type: "doubles",
    skill_level: skillLevelMap[profile.game_experience_level] || "intermediate",
    training_background: getTrainingBackground(),
    duration_minutes: 12,
    environment: "indoor",
    space: "on_court",
    equipment: [],
    match_timing: "in_10_15_min",
    injuries: getInjuries(),
    priority_areas: profile.injury_status !== "none" ? "affected area from injury" : "none",
    fatigue_level: "normal",
    desired_outcome: getDesiredOutcome(),
  }
}

// Build check-in context from recent responses
function buildCheckinContext(responses: CheckinResponse[]): CheckinContext {
  const context: CheckinContext = {}

  for (const response of responses) {
    if (response.skipped) continue

    const slug = response.question_slug
    const value = response.response_value

    switch (slug) {
      case "energy_level":
        context.energy_level = value as number
        break
      case "sleep_quality_last_night":
        context.sleep_quality = value as string
        break
      case "pain_location":
        context.pain_zones = value as string[]
        break
      case "muscle_soreness":
        context.sore_muscles = value as string[]
        break
      case "stress_level":
        context.stress_level = value as number
        break
      case "recovery_feeling":
        context.recovery_status = value as string
        break
      case "playing_frequency_this_week":
        context.playing_frequency = value as string
        break
      case "weak_shots":
        context.weak_shots = value as string[]
        break
      case "confident_shots":
        context.confident_shots = value as string[]
        break
    }
  }

  // Derive fatigue override from check-in data
  if (context.energy_level !== undefined && context.energy_level < 5) {
    // Will be used to override fatigue_level
  }

  return context
}

// Derive fatigue level from check-in context
function deriveFatigueLevel(
  checkin: CheckinContext,
  defaultLevel: "fresh" | "normal" | "tired"
): "fresh" | "normal" | "tired" {
  // Low energy = tired
  if (checkin.energy_level !== undefined && checkin.energy_level < 5) {
    return "tired"
  }
  // High energy = fresh
  if (checkin.energy_level !== undefined && checkin.energy_level >= 8) {
    return "fresh"
  }
  // Poor sleep = tired
  if (checkin.sleep_quality === "poor" || checkin.sleep_quality === "muy_mal") {
    return "tired"
  }
  // Poor recovery = tired
  if (checkin.recovery_status === "poor" || checkin.recovery_status === "mal") {
    return "tired"
  }
  return defaultLevel
}

// Main handler
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Create Supabase client with auth context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    )

    // Get request body first
    let requestBody: { player_profile_id?: string } = {}
    try {
      requestBody = await req.json()
    } catch {
      // No body or invalid JSON
    }

    // Get the user from the JWT
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const token = authHeader.replace("Bearer ", "")
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    // For development, allow mock user ID if no real user
    let userId = user?.id
    if (!userId && requestBody.player_profile_id) {
      // Fetch the profile to get the user_id
      const { data: profile } = await supabaseClient
        .from("player_profiles")
        .select("user_id")
        .eq("id", requestBody.player_profile_id)
        .single()
      userId = profile?.user_id
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "User not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const playerProfileId = requestBody.player_profile_id

    // Fetch player profile
    const { data: profile, error: profileError } = await supabaseClient
      .from("player_profiles")
      .select("*")
      .eq(playerProfileId ? "id" : "user_id", playerProfileId || userId)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: "Player profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Fetch recent check-in responses (last 7 days) with question slugs
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0]

    const { data: checkinResponses } = await supabaseClient
      .from("checkin_responses")
      .select(`
        id,
        question_id,
        response_value,
        skipped,
        response_date,
        checkin_questions!inner(slug, ai_relevance)
      `)
      .eq("user_id", userId)
      .gte("response_date", sevenDaysAgoStr)
      .order("response_date", { ascending: false })

    // Transform responses to include slug
    const responsesWithSlug: CheckinResponse[] = ((checkinResponses || []) as CheckinResponseWithQuestion[])
      .filter((r) => r.checkin_questions?.ai_relevance?.includes("warmup"))
      .map((r) => ({
        id: r.id,
        question_id: r.question_id,
        response_value: r.response_value,
        skipped: r.skipped,
        response_date: r.response_date,
        question_slug: r.checkin_questions?.slug,
      }))

    // Build contexts
    const baseContext = buildContextFromProfile(profile)
    const checkinContext = buildCheckinContext(responsesWithSlug)

    // Merge check-in data into context
    const finalContext: WarmUpGenerationContext = {
      ...baseContext,
      fatigue_level: deriveFatigueLevel(checkinContext, baseContext.fatigue_level),
      checkin: Object.keys(checkinContext).length > 0 ? checkinContext : undefined,
    }

    // Update injuries if pain zones reported
    if (checkinContext.pain_zones?.length) {
      const painZonesStr = checkinContext.pain_zones.join(", ")
      finalContext.injuries = finalContext.injuries === "none"
        ? `Current discomfort: ${painZonesStr}`
        : `${finalContext.injuries}. Current discomfort: ${painZonesStr}`
      finalContext.priority_areas = painZonesStr
    }

    // Build the prompt
    const userPrompt = buildUserPrompt(finalContext)

    // Call Anthropic API
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY")
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Anthropic API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const anthropic = new Anthropic({ apiKey: anthropicApiKey })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: WARMUP_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    })

    // Extract JSON from response
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : ""

    // Parse the JSON response
    let warmupData
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        warmupData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("Failed to parse warm-up response:", parseError)
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Save to warmup_sessions
    const { data: savedSession, error: saveError } = await supabaseClient
      .from("warmup_sessions")
      .insert({
        user_id: userId,
        player_profile_id: profile.id,
        title: warmupData.title,
        duration_minutes: warmupData.duration_minutes,
        exercises: warmupData.phases,
        expected_sensations: warmupData.ready_checklist?.physical_signs || [],
        match_benefits: warmupData.adaptations?.cold_conditions,
        feedback_prompt: warmupData.adaptations?.if_irritated,
        generation_context: finalContext,
      })
      .select()
      .single()

    if (saveError) {
      console.error("Failed to save warm-up session:", saveError)
      // Continue anyway - return the generated data even if save fails
    }

    // Build response
    const warmup = {
      id: savedSession?.id || null,
      title: warmupData.title,
      duration_minutes: warmupData.duration_minutes,
      phases: warmupData.phases,
      adaptations: warmupData.adaptations,
      ready_checklist: warmupData.ready_checklist,
      generated_at: new Date().toISOString(),
    }

    return new Response(
      JSON.stringify({ success: true, warmup }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Edge function error:", error)
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
