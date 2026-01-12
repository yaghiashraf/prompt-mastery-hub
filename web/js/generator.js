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

Before providing the final answer, please think step-by-step:
1. Break down the problem into core components.
2. Analyze the constraints: ${data.context}.
3. Draft a preliminary solution.
4. Refine the solution based on the tone: ${data.tone}.

Finally, provide the output in ${data.format} format.`;
        }
    },
    DEPTH: {
        name: "DEPTH Framework (Advanced)",
        id: "depth",
        generate: (data) => {
            return `# DEPTH Prompting Framework

## 1. Define Perspectives
Act as a panel of experts including:
- ${data.role || "Primary Expert"}
- A Critic/Reviewer
- A User Advocate

## 2. Establish Success Metrics
The output must achieve the following:
- Clear resolution of: ${data.task}
- Adherence to format: ${data.format}

## 3. Provide Context
${data.context || "[Insert detailed context here]"}

## 4. Task Breakdown
Execute the following steps sequentially:
1. Analyze the context from all expert perspectives.
2. Debate the best approach.
3. Synthesize the final ${data.format} output.

## 5. Human Feedback Loop
Rate your confidence (0-100%) in the solution.`;
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
