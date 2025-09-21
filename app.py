import os
import uuid
from pathlib import Path

from flask import Flask, render_template, send_from_directory, jsonify, request

app = Flask(__name__)

config = {
    "UPLOAD_FOLDER": "dynamic/audio/",
    "ALLOWED_EXTENSIONS": [".wav", ".mp3", ".ogg"],
}
os.makedirs(config["UPLOAD_FOLDER"], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and Path(filename).suffix in config["ALLOWED_EXTENSIONS"]

@app.route('/audio')
def root():
    return render_template("index.html")

def generate_random_filename(original_filename):
    extension = Path(original_filename).suffix
    random_name = str(uuid.uuid4())
    if extension:
        return f"{random_name}{extension}"
    return random_name


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400

        original_filename = file.filename
        random_filename = generate_random_filename(original_filename)

        file_path = os.path.join(config["UPLOAD_FOLDER"], random_filename)
        file.save(file_path)

        file_url = f"/audios/{random_filename}"

        return jsonify({
            'success': True,
            'filename': random_filename,
            'original_filename': original_filename,
            'url': file_url,
            'message': 'File uploaded successfully'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/audios/<filename>')
def get_file(filename):
    try:
        return send_from_directory(config["UPLOAD_FOLDER"], filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    app.run(port=1469, debug=False)
