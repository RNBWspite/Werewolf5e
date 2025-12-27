# Werewolf 5e - Attribute Distribution Guarantee

## Overview

The Werewolf 5e character creation system **guarantees** that all characters will have the following attribute distribution, regardless of the choices made during character creation:

- **1 attribute at 4/5 points** (Primary)
- **3 attributes at 3/5 points** (Secondary)
- **4 attributes at 2/5 points** (Tertiary)
- **1 attribute at 1/5 points** (Weakest)

**Total: 9 attributes** (Physical: 3, Social: 3, Mental: 3)

## How the Guarantee Works

The system enforces this distribution through a structured selection process:

### Step 1: Primary Category Selection
Users choose which category (Physical, Social, or Mental) represents their character's primary strength.

### Step 2: Primary Attribute Selection
Users select **exactly 1 attribute** from their primary category to be their strongest attribute.
- **Result: 1 attribute at 4 points**

### Step 3: Secondary Category Selection
Users choose a second category to represent their secondary strengths.

### Step 4: Secondary Attribute Selection
Users select **exactly 3 attributes** from the pool of:
- Remaining attributes from the primary category (2 attributes)
- All attributes from the secondary category (3 attributes)

Total pool: 5 attributes, user picks 3
- **Result: 3 attributes at 3 points each**

### Step 5: Tertiary Attribute Selection
Users select **exactly 4 attributes** from the remaining pool of:
- All attributes from the tertiary category (3 attributes)
- Remaining attributes from primary category not selected as secondary (0-2 attributes)
- Remaining attributes from secondary category not selected as secondary (0-3 attributes)

Total pool: 5 attributes, user picks 4
- **Result: 4 attributes at 2 points each**

### Step 6: Automatic Assignment
The final remaining attribute automatically receives the lowest value.
- **Result: 1 attribute at 1 point**

## Mathematical Proof

```
Total attributes: 9
Selection process: 1 (primary) + 3 (secondary) + 4 (tertiary) + 1 (automatic) = 9 ✓

Distribution verification:
- Attributes with 4 points: 1 ✓
- Attributes with 3 points: 3 ✓
- Attributes with 2 points: 4 ✓
- Attributes with 1 point: 1 ✓
Total: 1 + 3 + 4 + 1 = 9 ✓
```

## Verification

### Comprehensive Test Suite
The guarantee has been verified through **comprehensive automated testing**:

- **Test file:** `test-attribute-distribution.html`
- **Scenarios tested:** 900 different user choice combinations
- **Success rate:** 100% (900/900 tests passed)
- **Coverage:** All possible combinations of category and attribute selections

### Runtime Validation
The `calculateFinalAttributes()` function includes built-in validation:

```javascript
function validateAttributeDistribution() {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    Object.values(characterData.attributes).forEach(function(value) {
        distribution[value]++;
    });
    
    const isValid = 
        distribution[4] === 1 &&  // Exactly 1 at 4 points
        distribution[3] === 3 &&  // Exactly 3 at 3 points
        distribution[2] === 4 &&  // Exactly 4 at 2 points
        distribution[1] === 1 &&  // Exactly 1 at 1 point
        distribution[5] === 0;    // None at 5 points
    
    return isValid;
}
```

This validation runs every time attributes are calculated, providing a safety net that alerts both developers (console) and users (alert) if the distribution is ever incorrect.

## Example Scenarios

### Scenario 1: Physical Primary, Social Secondary
- **Primary:** Strength (Physical) → 4 points
- **Secondary:** Charisma, Manipulation, Composure (all from Social) → 3 points each
- **Tertiary:** Dexterity, Stamina, Intelligence, Wits → 2 points each
- **Weakest:** Resolve → 1 point

**Distribution:** 1×4, 3×3, 4×2, 1×1 ✓

### Scenario 2: Mental Primary, Physical Secondary
- **Primary:** Intelligence (Mental) → 4 points
- **Secondary:** Strength, Dexterity, Stamina (all from Physical) → 3 points each
- **Tertiary:** Wits, Resolve, Charisma, Manipulation → 2 points each
- **Weakest:** Composure → 1 point

**Distribution:** 1×4, 3×3, 4×2, 1×1 ✓

### Scenario 3: Social Primary, Mental Secondary
- **Primary:** Charisma (Social) → 4 points
- **Secondary:** Manipulation, Intelligence, Wits → 3 points each
- **Tertiary:** Resolve, Strength, Dexterity, Stamina → 2 points each
- **Weakest:** Composure → 1 point

**Distribution:** 1×4, 3×3, 4×2, 1×1 ✓

## Why This Matters

This guaranteed distribution ensures:

1. **Game Balance:** All characters have comparable overall power
2. **Character Variety:** Players can create diverse characters while maintaining balance
3. **Clear Strengths & Weaknesses:** Every character has defined areas of excellence and vulnerability
4. **Predictable Outcomes:** Storytellers know what to expect from character creation
5. **Fair Play:** No combination of choices can create an overpowered or underpowered character

## For Developers

When modifying the character creation system:

1. **Always maintain the selection counts:**
   - 1 primary attribute
   - 3 secondary attributes
   - 4 tertiary attributes
   - 1 automatic weakest attribute

2. **Run the test suite after changes:**
   ```
   Open test-attribute-distribution.html in a browser
   Verify all 900 tests still pass
   ```

3. **Keep the validation function active:**
   - Never remove `validateAttributeDistribution()`
   - Monitor console for validation errors during development

4. **Document any changes:**
   - Update this README if the system changes
   - Update the test suite to match new logic

## Testing

To verify the guarantee yourself:

1. Open `test-attribute-distribution.html` in a web browser
2. The tests will run automatically
3. Verify that all 900 scenarios pass
4. Review sample test cases to understand the variety of tested scenarios

## Conclusion

The Werewolf 5e character creation system's attribute distribution is **mathematically guaranteed** and **comprehensively tested**. No matter what choices a user makes during character creation, they will always end up with exactly:
- 1 attribute at 4 points
- 3 attributes at 3 points
- 4 attributes at 2 points
- 1 attribute at 1 point

This guarantee is enforced through the system's design and verified through automated testing and runtime validation.
