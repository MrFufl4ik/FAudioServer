import os
from pathlib import Path

from flask import Flask, render_template, send_from_directory, jsonify

app = Flask(__name__)

config = {
    "UPLOAD_FOLDER": "dynamic/audio/",
    "ALLOWED_EXTENSIONS": ["wav", "mp3", "ogg"],
}
os.makedirs(config["UPLOAD_FOLDER"], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and Path(filename).suffix in config["ALLOWED_EXTENSIONS"]

@app.route('/audio')
def hello_world():
    return render_template("index.html")





@app.route('/audios/<filename>')
def get_file(filename):
    try:
        return send_from_directory(config["UPLOAD_FOLDER"], filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404


if __name__ == '__main__':
    app.run()
