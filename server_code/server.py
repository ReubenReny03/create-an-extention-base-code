from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/highlight', methods=['POST'])
def highlight():
    # Existing code remains the same
    data = request.json
    text = data['text']
    words_to_highlight = your_model_function(text)
    print(words_to_highlight)
    return jsonify(words=words_to_highlight)

def your_model_function(text):
    # Your model logic here

    return [re.sub(r'[^\w\s]', '', word) for word in text.split() if len(re.sub(r'[^\w\s]', '', word)) > 7]

if __name__ == '__main__':
    app.run(debug=True, port=5000)
