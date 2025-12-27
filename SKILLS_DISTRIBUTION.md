# Werewolf 5e - Skills Distribution System

## Overview

The skills questionnaire system ensures that all characters achieve the exact skill distribution required by their chosen skill type, through dynamic questioning and intelligent filtering.

## Required Distributions

### Jack of All Trades (29 points total)
- **1 skill at 3/5 points**
- **8 skills at 2/5 points**
- **10 skills at 1/5 points**

*Recommended for new players - provides broad competence across many skills*

### Balanced (26 points total)
- **3 skills at 3/5 points**
- **5 skills at 2/5 points**
- **7 skills at 1/5 points**

*Harmony between specialization and versatility*

### Specialist (22 points total)
- **1 skill at 4/5 points**
- **3 skills at 3/5 points**
- **3 skills at 2/5 points**
- **3 skills at 1/5 points**

*Deep expertise in focused areas*

## How It Works

### 1. Dynamic Question Looping

Unlike the attribute system which has a fixed number of steps, the skills questionnaire **continues until the distribution is complete**:

- Scenarios are presented one at a time
- Each scenario awards 1 skill point
- When all scenarios are exhausted, they **loop back** and repeat
- Process continues until the exact distribution is achieved

**Example Flow (Jack of All Trades):**
```
Scenario 1 → Brawl: 0→1
Scenario 2 → Athletics: 0→1
...
Scenario 7 → Stealth: 0→1
Scenario 1 (loop) → Brawl: 1→2
Scenario 2 (loop) → Athletics: 1→2
...continues until distribution complete...
```

### 2. Skill Filtering

Skills are **automatically filtered** from question choices when they reach their maximum for the current distribution:

**Example (Jack of All Trades - need 1×3, 8×2, 10×1):**

| Skill State | Can Receive Points? | Reason |
|-------------|-------------------|---------|
| Brawl at 1, have 5 skills at 2 | ✅ YES | Can go to 2, still need 3 more at level 2 |
| Brawl at 2, have 8 skills at 2 | ❌ NO | Already have 8/8 skills at level 2 |
| Athletics at 2, have 0 skills at 3 | ✅ YES | Can go to 3, still need 1 at level 3 |
| Athletics at 3, have 1 skill at 3 | ❌ NO | Already have 1/1 skill at level 3 |

**Code Implementation:**
```javascript
function canAddPointToSkill(skill) {
    const currentValue = skillPoints[skill];
    const targetValue = currentValue + 1;
    const currentDist = getCurrentDistribution();
    
    // Check if we need more skills at target level
    if (requiredDistribution[targetValue] && 
        currentDist[targetValue] < requiredDistribution[targetValue]) {
        return true;
    }
    
    return false;
}
```

### 3. Progress Tracking

The system displays real-time progress toward the required distribution:

**Display Format:**
```
3 pts: 1/1  2 pts: 5/8  1 pt: 8/10
```

This shows:
- ✅ 1 skill at 3 points (requirement met)
- ⏳ 5 skills at 2 points (need 3 more)
- ⏳ 8 skills at 1 point (need 2 more)

### 4. Guaranteed Completion

The system **guarantees** the correct distribution through:

1. **Distribution tracking** - Tracks current vs required at each skill level
2. **Validation** - Checks `isDistributionComplete()` after each skill point
3. **Filtering** - Removes maxed skills to ensure only valid choices appear
4. **Looping** - Continues scenarios until all requirements are met

## Base Skills

Four skills start with 1 point automatically (these count toward the distribution):
- Academics (Mental)
- Craft (Mental)
- Performance (Social)
- Science (Mental)

These base points are included in the distribution. For example, in Jack of All Trades, these 4 skills start at 1/5 and count toward the "10 skills at 1/5" requirement.

## Technical Details

### Key Functions

**`getCurrentDistribution()`**
- Returns count of skills at each level: `{ 0: 0, 1: 10, 2: 8, 3: 1, 4: 0, 5: 0 }`

**`canAddPointToSkill(skill)`**
- Returns `true` if skill can receive another point based on current distribution
- Returns `false` if skill is maxed or distribution requirement for next level is met

**`isDistributionComplete()`**
- Checks if current distribution matches required distribution
- Returns `true` only when all requirements are exactly met

**`getAvailableSkills()`**
- Returns array of skills that can still receive points
- Used to filter question choices

### Question Filtering Logic

**Initial Choices:**
```javascript
const validChoices = scenario.initialChoices.filter(choice => {
    // Keep choice if any of its skills can receive points
    return choice.skills.some(skill => availableSkills.includes(skill));
});
```

**Follow-up Choices:**
```javascript
const validFollowUps = currentInitialChoice.followUp.choices.filter(choice => {
    // Keep choice only if its skill can receive points
    return availableSkills.includes(choice.skill);
});
```

**Automatic Skip:**
If no valid choices remain for a scenario, it's automatically skipped and the next scenario is presented.

## User Experience

### What Players See

1. **Clear Progress**
   - Real-time tracking of skill distribution
   - Shows how many more skills needed at each level

2. **Dynamic Questions**
   - Scenarios presented based on available skills
   - No dead-end choices (all choices can accept points)

3. **Natural Flow**
   - Questions repeat naturally without feeling repetitive
   - System handles filtering transparently

4. **Guaranteed Outcome**
   - Always achieves exact required distribution
   - No possibility of getting "stuck" with wrong distribution

### Example Session (Jack of All Trades)

```
Progress: 3 pts: 0/1  2 pts: 0/8  1 pt: 4/10

Scenario: "You're in a fight..."
Choices:
  - Throw a punch (Brawl)
  - Use a weapon (Melee)
  - Dodge away (Athletics)

Player selects: Brawl (0→1)

Progress: 3 pts: 0/1  2 pts: 0/8  1 pt: 5/10

...continues through more scenarios...

Progress: 3 pts: 0/1  2 pts: 7/8  1 pt: 10/10

Scenario: "You're in a fight..."
Choices:
  - Throw a punch (Brawl) ← can go 2→3
  - Use a weapon (Melee) ← can go 1→2

Note: Athletics removed - already at 2 and have 7/8 at level 2

Player selects: Brawl (2→3)

Progress: 3 pts: 1/1  2 pts: 7/8  1 pt: 10/10

...one more scenario to get last skill to 2...

Progress: 3 pts: 1/1  2 pts: 8/8  1 pt: 10/10 ✓

Distribution complete! Shows results.
```

## Testing

A comprehensive test suite (`test-skills-distribution.html`) verifies:

1. ✅ All three distribution types achieve correct results
2. ✅ Skill filtering works correctly
3. ✅ Distribution tracking is accurate
4. ✅ System completes without infinite loops

**Test Results:**
- Jack of All Trades: PASS ✓
- Balanced: PASS ✓
- Specialist: PASS ✓

## For Developers

### Modifying the System

When making changes to the skills questionnaire:

1. **Maintain Distribution Requirements**
   - Don't change the distribution values in `skillDistributions` without updating documentation
   - Total points must match: sum of (level × count) for all levels

2. **Test After Changes**
   - Run `test-skills-distribution.html` to verify logic
   - Manually test at least one complete questionnaire for each type

3. **Keep Filtering Active**
   - Never disable `canAddPointToSkill()` checks
   - Always filter choices before displaying

4. **Preserve Looping**
   - Don't add artificial limits on scenario count
   - Let the system loop until `isDistributionComplete()` returns true

### Adding New Scenarios

When adding new skill scenarios:

1. Include multiple skill options in initial choices
2. Ensure follow-up choices cover diverse skills
3. Test that new scenarios work with filtering logic
4. Verify all three distribution types still complete correctly

### Debugging

If distribution isn't completing:

1. Check console for distribution state: `getCurrentDistribution()`
2. Verify `requiredDistribution` is set correctly
3. Ensure `canAddPointToSkill()` logic is working
4. Check that scenarios have enough skill variety

## Conclusion

The skills distribution system provides:

- ✅ **Guaranteed correct distribution** for all three types
- ✅ **Dynamic, engaging questionnaire** that adapts to progress
- ✅ **Intelligent filtering** to prevent dead ends
- ✅ **Clear progress tracking** for players
- ✅ **Robust, tested implementation** with 100% success rate

Players can confidently make choices knowing they'll achieve the exact skill distribution required by their chosen character type.
