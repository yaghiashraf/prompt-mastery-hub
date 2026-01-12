// generator.js - The Logic Core

const FRAMEWORKS = {
    BASIC: {
        name: "Basic 3-Step",
        id: "basic",
        generate: (data) => {
            return `### 1. Context & Role
Act as a ${data.role || "Expert"}.
Your goal is to ${data.task || "complete a task"}.

### 2. Task Description
Please ${data.action || "analyze"} the following:
${data.context || "[Insert Content Here]"}

### 3. Constraints & Format
- Tone: ${data.tone || "Professional"}
- Format: ${data.format || "Markdown"}
- Length: ${data.length || "Concise"}
`;
        }
    },
    COT: {
        name: "Chain of Thought (CoT)",
        id: "cot",
        generate: (data) => {
            return `Act as a ${data.role || "Expert"}.
Your task is to ${data.task}.

Before providing the final answer, please think step-by-step in a scratchpad:
1.  **Analyze Request:** Identify the core question and constraints (${data.context}).
2.  **Knowledge Retrieval:** Recall relevant principles regarding ${data.task}.
3.  **Step-by-Step Reasoning:**
    - Step 1: ...
    - Step 2: ...
4.  **Self-Correction:** Critique the draft for ${data.tone} tone.

Finally, output ONLY the refined response in ${data.format} format.`;
        }
    },
    DEPTH: {
        name: "DEPTH Framework (Advanced)",
        id: "depth",
        generate: (data) => {
            const role = (data.role || "").toLowerCase();
            let experts = ["Critical Reviewer", "User Advocate"];

            // Dynamic Expert Assignment
            if (role.includes("dev") || role.includes("engineer") || role.includes("code") || role.includes("architect")) {
                experts = ["Security Auditor", "Performance Specialist"];
            } else if (role.includes("writer") || role.includes("copy") || role.includes("content") || role.includes("marketing")) {
                experts = ["SEO Strategist", "Editor-in-Chief"];
            } else if (role.includes("manager") || role.includes("exec") || role.includes("business")) {
                experts = ["Financial Analyst", "Risk Manager"];
            } else if (role.includes("data") || role.includes("analyst")) {
                experts = ["Data Privacy Officer", "Visualization Expert"];
            }

            return `# DEPTH Prompting Framework

## 1. Define Perspectives (The Panel)
Act as a panel of experts including:
- **Lead:** ${data.role || "Primary Expert"}
- **Expert 2:** ${experts[0]}
- **Expert 3:** ${experts[1]}

## 2. Establish Success Metrics
The output must achieve the following:
- Primary Goal: ${data.task}
- Format Requirement: ${data.format}
- Tone Calibration: ${data.tone}

## 3. Provide Context
${data.context || "[Insert detailed context here]"}

## 4. Task Breakdown (Cognitive Workflow)
Execute the following steps sequentially:
1.  **Deep Analysis:** Each expert analyzes the context from their unique perspective.
2.  **Debate:** The ${experts[0]} critiques the Lead's initial approach.
3.  **Synthesis:** Merge the best insights into a unified strategy.
4.  **Final Polish:** Format the output as ${data.format}.

## 5. Human Feedback Loop
Rate your confidence (0-100%) in the solution and flag any missing information.`;
        }
    }
};

function generatePrompt(inputs, userTier = 'free') {
    const frameworkKey = inputs.framework || "BASIC";
    
    // Feature Gating Logic
    if (userTier === 'free' && frameworkKey !== 'BASIC') {
        return "LOCKED_FEATURE";
    }

    const framework = FRAMEWORKS[frameworkKey] || FRAMEWORKS.BASIC;
    return framework.generate(inputs);
}

// Export for browser usage
window.PromptEngine = {
    generate: generatePrompt,
    frameworks: Object.keys(FRAMEWORKS).map(k => ({id: k, name: FRAMEWORKS[k].name}))
};
