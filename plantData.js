const plantData = [
    {
        "Question":"How often should I water Aloe Vera?",
        "Answer":"Aloe Vera Plants should be watered every 2-3 weeks"
    },
    {
        "Question":"What type of light does Aloe Vera need?",
        "Answer":"Aloe Vera thrives best in bright, indirect light"
    },
    {
        "Question":"What kind of soil is best for Aloe Vera?",
        "Answer":"Aloe Vera require well-draining cactus soil mix"
    },
    {
        "Question":"How do I fertilize Aloe Vera?",
        "Answer":"Aloe Vera should be fertilized once a month in spring and summer"
    },
    {
        "Question":"What are common diseases that affect Aloe Vera?",
        "Answer":"Common diseases include aphids and root rot"
    },
    {
        "Question":"How do I prevent diseases in Aloe Vera?",
        "Answer":"Common diseases include spider mites and root rot"
    },
    {
        "Question":"What is the best way to propagate Aloe Vera?",
        "Answer":"Common diseases include scale and mealybugs"
    },
    {
        "Question":"How often should I water Snake Plants?",
        "Answer":"Common diseases include spider mites and root rot"
    },
    {
        "Question":"What type of light does Snake Plants need?",
        "Answer":"Common diseases include mealybugs and spider mites"
    },
    {
        "Question":"What kind of soil is best for Snake Plants?",
        "Answer":"Common diseases include spider mites and scale"
    },
    {
        "Question":"How do I fertilize Snake Plants?",
        "Answer":"Common diseases include mealybugs and aphids"
    },
    {
        "Question":"What are common diseases that affect Snake Plants?",
        "Answer":"Common diseases include spider mites and scale"
    },
    {
        "Question":"How do I prevent diseases in Snake Plants?",
        "Answer":"Common diseases include mealybugs and root rot"
    },
    {
        "Question":"What is the best way to propagate Snake Plants?",
        "Answer":"Common diseases include spider mites and scale"
    }
    // Add the rest of the dataset here
];

function getResponse(input) {
    console.log("Searching for:", input);

    const lowerInput = input.toLowerCase();

    // Search for the most relevant plant care information
    for (let i = 0; i < plantData.length; i++) {
        const entry = plantData[i];
        if (lowerInput.includes(entry.Question.toLowerCase())) {
            return entry.Answer;
        }
    }

    return "I'm sorry, I don't have information on that plant yet. Try asking about a different plant!";
}
