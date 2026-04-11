from flask import Flask, request, jsonify, render_template
import json
import os

app = Flask(__name__,
    template_folder=os.path.join(os.path.dirname(__file__), '..', 'templates'),
    static_folder=os.path.join(os.path.dirname(__file__), '..', 'static'))


@app.route("/")
def index():
    return render_template("Index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    if "followers" not in request.files or "following" not in request.files:
        return (
            jsonify({"error": "Both followers and following files are required"}),
            400,
        )

    followers_file = request.files["followers"]
    following_file = request.files["following"]

    try:
        followers_data = json.load(followers_file)
        following_data = json.load(following_file)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON files"}), 400

    # Extract usernames
    followers = set()
    for item in followers_data:
        if item.get("string_list_data"):
            followers.add(item["string_list_data"][0].get("value"))

    following = set()
    # Handle Instagram following structure
    if isinstance(following_data, dict) and "relationships_following" in following_data:
        following_list = following_data["relationships_following"]
    else:
        following_list = following_data

    for item in following_list:
        # Username is in 'title'
        if "title" in item:
            following.add(item["title"])

    # Compute lists
    not_following_back = sorted(list(following - followers))
    not_followed_back = sorted(list(followers - following))
    mutual = sorted(list(followers & following))

    # Counts
    total_following = len(following)

    total_followers = len(followers)
    mutual_followers = len(mutual)
    total_not_following_back = len(not_following_back)
    total_not_followed_back = len(not_followed_back)

    return jsonify(
        {
            "total_following": total_following,
            "total_followers": total_followers,
            "mutual_followers": mutual_followers,
            "total_not_following_back": total_not_following_back,
            "total_not_followed_back": total_not_followed_back,
            "not_following_back": not_following_back,
            "not_followed_back": not_followed_back,
            "mutual": mutual,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
