from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import faiss
import numpy as np
import re
from sentence_transformers import SentenceTransformer, CrossEncoder
from rank_bm25 import BM25Okapi

app = Flask(__name__, static_folder="static")

# Load Dataset
dataset_path = "Expanded_Plant_Care_Dataset.csv"
df = pd.read_csv(dataset_path, low_memory=False)
df.dropna(subset=["Question", "Answer"], inplace=True)
df["processed_question"] = df["Question"].str.lower().str.strip()
df["processed_answer"] = df["Answer"].str.lower().str.strip()

# Load NLP Models
embedder = SentenceTransformer("all-MiniLM-L6-v2")
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# FAISS Indexing
X_train_emb = embedder.encode(df["processed_question"].tolist(), convert_to_numpy=True)
dimension = X_train_emb.shape[1]
faiss_index = faiss.IndexFlatIP(dimension)
faiss_index.add(X_train_emb.astype("float32"))
responses = df["Answer"].tolist()

# BM25 for retrieval
tokenized_corpus = [doc.split() for doc in df["processed_answer"].tolist()]
bm25 = BM25Okapi(tokenized_corpus)

def retrieve_answer(query):
    """Retrieve answer using FAISS and BM25."""
    query_emb = embedder.encode([query], convert_to_numpy=True)
    _, candidate_idxs = faiss_index.search(query_emb.astype("float32"), 3)
    candidates = [responses[i] for i in candidate_idxs[0]]

    # Re-rank with Cross-Encoder
    pairs = [(query, cand) for cand in candidates]
    scores = cross_encoder.predict(pairs)
    best_idx = np.argmax(scores)
    return candidates[best_idx]


def extract_plant_name(query):
    """
    Extracts the plant name from queries like "How do I care for a snake plant?"
    """
    pattern = r"(?:care (?:for|of)|care required for)\s+(?:a|an|the)?\s*([\w\s]+)"
    match = re.search(pattern, query, re.IGNORECASE)
    if match:
        plant = match.group(1).strip()
        return plant if plant else None
    return None

from rapidfuzz import process, fuzz


def clean_plant_name(question):
    """ Extract the plant name from dataset questions. """
    # Remove common question phrases to isolate the plant name
    question = question.lower().strip()
    question = re.sub(r"how do i care for|what are the best conditions for|how to grow|care instructions for", "",
                      question, flags=re.IGNORECASE)
    return question.strip()

def get_plant_care_instructions(plant_name):
    """
    Retrieve and consolidate care instructions for a given plant.
    Ensures structured, list-based formatting with proper categories.
    """
    try:
        print(f"🔎 Searching for: {plant_name}")  # Debug log

        # Ensure dataset contains required columns
        if "Question" not in df.columns or "Answer" not in df.columns:
            print("❌ ERROR: Dataset is missing required columns.")
            return "Error: The dataset is missing required information."

        # Step 1: Retrieve **Top 5 Matches** Using FAISS
        plant_query_emb = embedder.encode([plant_name], convert_to_numpy=True)
        _, candidate_idxs = faiss_index.search(plant_query_emb.astype("float32"), 5)  # Get 5 best matches
        candidate_answers = [responses[i] for i in candidate_idxs[0]]

        # Step 2: Re-rank using Cross-Encoder to prioritize best matches
        pairs = [(plant_name, cand) for cand in candidate_answers]
        scores = cross_encoder.predict(pairs)
        sorted_indices = np.argsort(scores)[::-1]  # Sort in descending order
        best_answers = [candidate_answers[i] for i in sorted_indices]  # Get sorted best responses

        # Step 3: Consolidate all responses into a structured format
        unique_answers = list(set(best_answers))  # Remove duplicates
        cleaned_answers = [re.sub(rf'\b{re.escape(plant_name)}\b', '', answer, flags=re.IGNORECASE).strip() for answer in unique_answers]

        # Step 4: Categorize responses with emojis
        categories = {
            "💡 Lighting": [],
            "💧 Watering": [],
            "🌿 Fertilization": [],
            "🦠 Common Issues": [],
            "🌱 Propagation": [],
            "✅ General Care": []
        }

        # Ensure every care detail is categorized
        for answer in cleaned_answers:
            sentences = re.split(r'\. |\n', answer)  # Split sentences properly
            for sentence in sentences:
                sentence = sentence.strip()
                lower_sentence = sentence.lower()

                if not sentence:  # Skip empty lines
                    continue

                if "light" in lower_sentence:
                    categories["💡 Lighting"].append(f"- {sentence}")
                elif "water" in lower_sentence or "soak" in lower_sentence:
                    categories["💧 Watering"].append(f"- {sentence}")
                elif "fertilizer" in lower_sentence or "feed" in lower_sentence:
                    categories["🌿 Fertilization"].append(f"- {sentence}")
                elif "disease" in lower_sentence or "mealybugs" in lower_sentence or "scale" in lower_sentence:
                    categories["🦠 Common Issues"].append(f"- {sentence}")
                elif "propagate" in lower_sentence or "division" in lower_sentence:
                    categories["🌱 Propagation"].append(f"- {sentence}")
                else:
                    categories["✅ General Care"].append(f"- {sentence}")

        # Step 5: Format the response as a structured bullet-point list with double line breaks
        formatted_output = f"🌿 **Care instructions for {plant_name.capitalize()}**: 🌿\n\n"
        for category, tips in categories.items():
            if tips:
                formatted_output += f"{category}:\n"  # Ensure category title is on its own line
                formatted_output += "\n".join(tips) + "\n\n"  # Ensure proper line spacing between categories

        return formatted_output.strip()

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")  # Print error to terminal
        return "An error occurred while retrieving plant care instructions."


@app.route("/")
def home():
    return send_from_directory("static", "index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")

    # Check if it's a general plant care inquiry
    plant_name = extract_plant_name(user_input)
    if plant_name:
        response = get_plant_care_instructions(plant_name)
    else:
        response = retrieve_answer(user_input)  # Use chatbot's main logic

    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
