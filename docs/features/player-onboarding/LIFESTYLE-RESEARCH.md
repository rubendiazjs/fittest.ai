# Lifestyle Dimension Research

**Date:** 2026-01-10
**Approach:** Keep it simple - 5-6 questions max

---

## Why Lifestyle Matters

The third pillar completes the player profile:
1. **Game Experience** → What can they do technically?
2. **Fitness Level** → What can their body handle?
3. **Lifestyle** → What fits their life? What drives them?

Understanding lifestyle helps us:
- Schedule training at realistic times
- Set appropriate session duration
- Match intensity to recovery capacity
- Align with personal motivation

---

## Research Findings

### Key Factors from Sports Science

**Recovery & Sleep** (from RESTQ-Sport, ASBQ research):
- Sleep quality correlates with injury prevention
- Athletes sleeping ≥8h have better recovery
- Stress levels impact training readiness

**Motivation Types** (from BRSQ, SportDNA):
- Intrinsic: Love of the game, personal challenge
- Extrinsic: Competition, social, results
- Task-oriented vs Ego-oriented goals

**Practical Constraints**:
- Time availability (work, family)
- Equipment/facility access
- Training preferences (alone vs group)

---

## Proposed Questions (5 questions)

### Q1: What's your main motivation for training?
*Why they play - drives content and tone*

- **Fun & Social**: I play to have fun and spend time with friends
- **Health & Fitness**: I want to stay healthy and in shape
- **Improvement**: I want to get better at padel specifically
- **Competition**: I want to win matches and tournaments

### Q2: How much time can you dedicate to physical training per week?
*Realistic capacity planning*

- Less than 1 hour
- 1-2 hours
- 3-4 hours
- 5+ hours

### Q3: When do you prefer to train?
*Schedule optimization*

- Morning (before work)
- Midday
- Evening (after work)
- Weekends only
- Flexible / No preference

### Q4: How would you describe your typical sleep?
*Recovery capacity - simplified from ASBQ*

- Poor (less than 6h or bad quality)
- Fair (6-7h, sometimes restless)
- Good (7-8h, generally well-rested)
- Excellent (8h+, wake up refreshed)

### Q5: What best describes your current life situation?
*Context for realistic expectations*

- Student (flexible schedule)
- Working professional (limited weekday time)
- Parent with young kids (very limited time)
- Retired / Flexible schedule
- Shift worker / Irregular hours

---

## Scoring / Classification

Unlike Game Experience and Fitness, Lifestyle doesn't produce a "score" but rather a **profile** that influences recommendations:

```typescript
interface LifestyleProfile {
  motivation: 'fun' | 'health' | 'improvement' | 'competition'
  weeklyHours: 'minimal' | 'light' | 'moderate' | 'dedicated'
  preferredTime: 'morning' | 'midday' | 'evening' | 'weekend' | 'flexible'
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent'
  lifeContext: 'student' | 'professional' | 'parent' | 'flexible' | 'irregular'
}
```

### How It Affects Recommendations

| Factor | Impact on Training |
|--------|-------------------|
| **Motivation = Fun** | Varied exercises, game-like drills, less strict structure |
| **Motivation = Competition** | Periodized plans, performance metrics, intensity focus |
| **Hours = Minimal** | Short efficient sessions, compound exercises |
| **Hours = Dedicated** | Full periodization, specialized work |
| **Sleep = Poor** | Lower intensity defaults, recovery emphasis |
| **Context = Parent** | Flexible home workouts, shorter sessions |

---

## Alternative Questions Considered (Not MVP)

**Dropped for simplicity:**
- Stress level at work (too personal for onboarding)
- Detailed nutrition habits (separate feature)
- Specific equipment available (ask later when generating sessions)
- Training history outside padel (covered in fitness section)

**Future iterations:**
- Weekly check-in on sleep/stress/soreness (Hooper Index style)
- Seasonal availability changes
- Travel schedule for competition players

---

## Complete Onboarding Summary

### Total: 15 Questions (~3 minutes)

| Dimension | Questions | Purpose |
|-----------|-----------|---------|
| Game Experience | 5 | Technical level |
| Fitness Level | 5 | Physical capacity |
| Lifestyle | 5 | Context & motivation |

### Output: Complete Player Profile

```
Player: [Name]

Game Experience: Intermediate (6.5/10)
Fitness Level: Moderate (5/10)

Lifestyle:
- Motivation: Improvement
- Available: 3-4h/week, evenings
- Sleep: Good
- Context: Working professional

→ Recommended: 2-3 focused sessions/week,
  45-60min each, progression-oriented
```

---

## Sources

- [RESTQ-Sport Recovery Questionnaire](https://www.scribd.com/document/629181434/The-Recovery-Stress-Questionnaire-RESTQ-Sport-52-items)
- [Athlete Sleep Behavior Questionnaire](https://pmc.ncbi.nlm.nih.gov/articles/PMC5916575/)
- [Wellness Questionnaires for Athlete Monitoring](https://www.globalperformanceinsights.com/post/wellness-questionnaires-for-athlete-monitoring)
- [Sport Personality Types](https://sportpersonalities.com/sport-personality-types/)
- [Big Five Personality in Sports](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1284378/full)
