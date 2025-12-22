# Contributing to Fikanova OS

Welcome to the Fikanova Skills Hub! This guide explains how to build and submit L3 Specialist Skills.

## The 3-Tier Security Protocol

All contributions flow through our security layers:

1. **Tier 1: Sandbox** - Your skill draft in `user_skills_draft` collection
2. **Tier 2: Validation** - Human supervisor review via `/dashboard/validate`
3. **Tier 3: Core** - Approved skills deployed to production n8n

## Building an L3 Skill

### Skill Specification

Every skill must follow the `SKILL_SPEC_V1.json` schema:

```json
{
    "name": "Your Skill Name",
    "slug": "your-skill-slug",
    "version": "1.0.0",
    "description": "What your skill does in one sentence.",
    "pricing": "free",
    "agent_type": "L3_specialist",
    "triggers": ["webhook", "whatsapp"],
    "system_prompt": "Your AI system prompt here...",
    "tools": ["gemini"],
    "examples": [
        { "input": "Example input", "output": "Example output" }
    ],
    "metadata": {
        "author": "Your Name",
        "created_at": "2024-12-22T00:00:00Z"
    }
}
```

### Directory Structure

```
skills/
├── your-skill-name/
│   ├── skill.json           # Skill specification
│   ├── system_prompt.md     # Detailed system prompt
│   └── tests/               # Test cases (optional)
│       └── test_cases.json
```

### System Prompt Guidelines

Follow the **Fikanova Voice**:
- Technical, not corporate jargon
- Witty where appropriate
- Nairobi-centric cultural references OK
- Short sentences. Punchy.
- Reference the 3 Elements when relevant (Time, Knowledge, Wealth)

**Forbidden Words:**
- synergy, leverage, holistic, optimize
- utilize (use "use"), facilitate (use "help")
- revolutionary, groundbreaking, cutting-edge

### Required Components

1. **Clear Input Specification**
   - What data does your skill accept?
   - What format? (JSON, plain text, form data)

2. **Defined Output Format**
   - Structured response format
   - Error handling cases

3. **Example Pairs**
   - Minimum 2-3 input/output examples
   - Cover edge cases

## Submission Process

### Step 1: Create Your Skill

```bash
# Clone the repo
git clone https://github.com/fikanova/fikanova-hq.git

# Create skill directory
mkdir -p skills/your-skill-name
cd skills/your-skill-name

# Create skill.json and system_prompt.md
```

### Step 2: Test Locally

Before submitting, test your skill:

```bash
# Import to local n8n
# Create test workflow
# Run with sample inputs
```

### Step 3: Submit for Review

1. Create a Pull Request to `main` branch
2. Fill out the PR template:
   - Skill name and purpose
   - Test results
   - Any dependencies

3. Your skill enters **Tier 1: Sandbox**
4. Supervisor reviews in **Tier 2: Validation**
5. If approved, merged to **Tier 3: Core**

## Code of Conduct

### Do
- ✅ Follow the skill specification exactly
- ✅ Include comprehensive examples
- ✅ Document any external API dependencies
- ✅ Handle errors gracefully
- ✅ Respect rate limits and quotas

### Don't
- ❌ Include hardcoded API keys
- ❌ Make unauthorized external requests
- ❌ Modify core system prompts
- ❌ Submit skills with offensive content
- ❌ Bypass the HITL approval flow

## The Learning Loop

When humans edit AI-generated content:
1. **CimpO** logs the diff to `Learning_Traces`
2. Patterns are analyzed monthly
3. Skill prompts are refined based on learnings

Your skills contribute to this open-source learning cycle.

## Questions?

- **Discord**: [Coming Soon]
- **Email**: dev@fikanova.co.ke
- **Docs**: [docs.fikanova.co.ke](https://docs.fikanova.co.ke)

---

*Built with ❤️ in Nairobi by Fikanova*
