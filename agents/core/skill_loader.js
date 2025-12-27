/**
 * Skill Loader - Progressive Disclosure Pattern
 * 
 * Implements Claude Skills pattern for Fikanova OS
 * - Loads metadata first (~100 tokens)
 * - Only loads full instructions when matched
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'L3_skills');

// Cache for loaded metadata
let skillsMetadataCache = null;

/**
 * Load all skill metadata (lightweight)
 */
function loadAllMetadata() {
    if (skillsMetadataCache) {
        return skillsMetadataCache;
    }

    const skills = {};

    try {
        const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const skillDir of skillDirs) {
            const metadataPath = path.join(SKILLS_DIR, skillDir, 'metadata.json');

            if (fs.existsSync(metadataPath)) {
                const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                skills[skillDir] = {
                    ...metadata,
                    _path: skillDir
                };
            }
        }
    } catch (error) {
        console.error('Error loading skills metadata:', error);
    }

    skillsMetadataCache = skills;
    return skills;
}

/**
 * Match a message to a skill based on triggers
 * @param {string} message - User message to match
 * @returns {object|null} Matched skill metadata or null
 */
function matchSkill(message) {
    const metadata = loadAllMetadata();
    const messageLower = message.toLowerCase();

    for (const [skillId, skill] of Object.entries(metadata)) {
        const triggers = skill.triggers || [];

        for (const trigger of triggers) {
            if (messageLower.includes(trigger.toLowerCase())) {
                return { skillId, ...skill };
            }
        }
    }

    return null;
}

/**
 * Load full skill instructions (on demand)
 * @param {string} skillId - Skill directory name
 * @returns {object} Full skill with instructions
 */
function loadSkillInstructions(skillId) {
    const metadata = loadAllMetadata();
    const skill = metadata[skillId];

    if (!skill) {
        throw new Error(`Skill not found: ${skillId}`);
    }

    const instructionsPath = path.join(SKILLS_DIR, skillId, 'instructions.md');

    if (fs.existsSync(instructionsPath)) {
        skill.instructions = fs.readFileSync(instructionsPath, 'utf8');
    } else {
        skill.instructions = '';
    }

    return skill;
}

/**
 * Get skill with full context for LLM
 * @param {string} message - User message
 * @returns {object|null} Skill with instructions or null
 */
function getSkillForMessage(message) {
    const matched = matchSkill(message);

    if (!matched) {
        return null;
    }

    return loadSkillInstructions(matched._path);
}

/**
 * Build system prompt with skill context
 * @param {string} basePrompt - Agent's base system prompt
 * @param {string} message - User message
 * @returns {string} Enhanced prompt with skill instructions
 */
function buildPromptWithSkill(basePrompt, message) {
    const skill = getSkillForMessage(message);

    if (!skill || !skill.instructions) {
        return basePrompt;
    }

    return `${basePrompt}

---
## Active Skill: ${skill.name}

${skill.instructions}
---

Now respond to the user's request:`;
}

/**
 * Get all available skills summary
 */
function getSkillsSummary() {
    const metadata = loadAllMetadata();

    return Object.entries(metadata).map(([id, skill]) => ({
        id,
        name: skill.name,
        description: skill.description,
        triggers: skill.triggers.slice(0, 3), // First 3 triggers
        engine: skill.preferred_engine
    }));
}

/**
 * Clear cache (for hot reload)
 */
function clearCache() {
    skillsMetadataCache = null;
}

module.exports = {
    loadAllMetadata,
    matchSkill,
    loadSkillInstructions,
    getSkillForMessage,
    buildPromptWithSkill,
    getSkillsSummary,
    clearCache
};
