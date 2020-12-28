from flask import Flask
from imageHelperAPI.addImage import addImage_api
from imageHelperAPI.searchImage import searchImage_api
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__, static_folder="build", static_url_path="/")


# Entry point to serve built static file index.js (React)
@app.route("/", methods=["GET"])
def hello():
    return app.send_static_file("index.html")


# Set authentication for application
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

# Register API endpoints
app.register_blueprint(addImage_api)
app.register_blueprint(searchImage_api)

if __name__ == "__main__":
    # Used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host="localhost", port=8080, debug=True)
