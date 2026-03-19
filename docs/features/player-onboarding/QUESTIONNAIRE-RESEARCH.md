# Player Onboarding Questionnaire Research

**Date:** 2026-01-10
**Approach:** Keep it simple and lean - iterate with user feedback

---

## Dimension 1: Game Experience

### Proposed Questions (5 questions)

**Q1: How long have you been playing padel?**
- Less than 6 months
- 6 months - 2 years
- 2 - 5 years
- More than 5 years

**Q2: How often do you play?**
- Occasionally (1-2 times/month)
- Weekly (1-2 times/week)
- Frequent (3-4 times/week)
- Daily (5+ times/week)

**Q3: Which description best matches your current level?**
- **Beginner**: Learning basic rules and shots, struggling to keep rallies going
- **Intermediate**: Consistent shots, understanding positioning, can play tactical points
- **Advanced**: Master most shots, strong tactics, compete in tournaments
- **Pro/Semi-pro**: Compete at federated/professional level

**Q4: Do you compete in tournaments?**
- No, I only play for fun
- Yes, local/amateur tournaments
- Yes, federated tournaments
- Yes, professional circuit

**Q5: Which skills do you feel confident with?** (multi-select)
- Basic forehand/backhand
- Volleys at the net
- Lobs and bandejas
- Wall rebounds (pared)
- Smash/Remate
- Strategic positioning

### Scoring Algorithm (Simple)

```
Level = base_from_Q3 + modifiers

Q3 gives base level:
- Beginner → 1-2
- Intermediate → 3-5
- Advanced → 6
- Pro → 7

Modifiers from other questions adjust within range:
- Years playing: +0.5 for each tier above minimum
- Frequency: +0.5 for frequent/daily
- Tournaments: +0.5 for federated, +1 for pro
- Skills: +0.1 per advanced skill (max +0.5)

Final score: 0-10 scale within their level category
```

---

## Dimension 2: Fitness Level

### Proposed Questions (5 questions)

**Q1: How would you describe your current physical activity level?**
- Sedentary (mostly sitting, little exercise)
- Light (walking, light activities occasionally)
- Moderate (exercise 2-3 times/week)
- Active (exercise 4-5 times/week)
- Very Active (intense training 6+ times/week)

**Q2: Besides padel, do you do other physical training?**
- No other training
- Gym/Strength training
- Cardio (running, cycling, swimming)
- Other racquet sports
- Multiple activities

**Q3: How would you rate your current fitness for padel?**
- I get tired quickly during matches
- I can handle a full match but feel exhausted after
- I have good endurance, recover well between points
- I have excellent fitness, can play multiple matches

**Q4: Do you have any injuries or physical limitations?**
- No limitations
- Minor issues (occasional discomfort)
- Recovering from injury
- Chronic condition (please specify)

**Q5: What's your primary physical goal?**
- Improve endurance
- Build strength
- Lose weight / Get fit
- Prevent injuries
- Peak performance

### Scoring Algorithm (Simple)

```
Fitness categories:
- Low: Score 1-3
- Moderate: Score 4-6
- Good: Score 7-8
- Excellent: Score 9-10

Calculation:
- Q1 activity level: 1-5 base points
- Q2 additional training: +1 if any
- Q3 self-assessment: +1-3 points
- Q4 limitations: -1 if recovering, -2 if chronic
- Cap at 10
```

---

## Implementation Notes

### Keep It Lean
- Total: 10 questions (~2 minutes to complete)
- All single-select except skills (Q5 in Game Experience)
- No text inputs required
- Mobile-friendly radio buttons and checkboxes

### Iteration Plan
1. **V1**: Launch with these 10 questions
2. **V2**: Add optional detailed questions based on user feedback
3. **V3**: Refine scoring based on correlation with actual performance

### Future Considerations (Not MVP)
- Integration with match results (like Playtomic)
- Periodic re-assessment prompts
- Detailed fitness tests (RSA, agility) for advanced users

---

## Sources

- [Playtomic Padel Levels](https://playtomic.com/blog/padel-levels)
- [Padel Nuestro Level Guide](https://www.padelnuestro.com/int/blog/padel-levels-how-to-know-yours)
- [PAR-Q+ Physical Activity Readiness](https://eparmedx.com/)
- [Padel Level Chart - Padel Magic](https://padel-magic.com/padel/padel-level-chart/)
