from flask import Flask, render_template, request, jsonify
import random, json, os, datetime

app = Flask(__name__)

# Load ALL .jpg images dynamically from static/images
IMAGE_FOLDER = "static/img"
IMAGES = [img for img in os.listdir(IMAGE_FOLDER) if img.lower().endswith(".jpg")]

@app.route("/")
def index():
    # Pick 8 random images for this round
   selected = random.sample(IMAGES, 8)
   cards = selected * 2
   random.shuffle(cards)
   return render_template("index.html", cards=cards)

@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.json
    name = data.get("name")
    time = data.get("time")

    entry = {
        "name": name,
        "time": time,
        "date": str(datetime.date.today())
    }

    if not os.path.exists("scores.json"):
        with open("scores.json", "w") as f:
            json.dump([], f)

    with open("scores.json", "r") as f:
        scores = json.load(f)

    scores.append(entry)

    with open("scores.json", "w") as f:
        json.dump(scores, f, indent=4)

    return jsonify({"status": "ok"})

@app.route("/scores")
def scores():
    if not os.path.exists("scores.json"):
        return jsonify([])
    with open("scores.json", "r") as f:
        return jsonify(json.load(f))

if __name__ == "__main__":
    app.run(debug=True)
