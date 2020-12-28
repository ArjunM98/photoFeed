from flask import Blueprint, request, jsonify
from flask_api import status
from google.cloud import storage, firestore, vision
from datetime import datetime
import uuid
import os

# Load environment variables
addImage_api = Blueprint('addImage_api', __name__)


@addImage_api.route('/image', methods=['POST'])
def addImage():
    # Build Response
    response = {}

    # Checks whether a file is specified in request
    if 'file' not in request.files:
        response["error"] = "Please provide an image to upload"
        return jsonify(response), status.HTTP_400_BAD_REQUEST

    # Get file information
    imgToAdd = request.files.getlist("file")

    # Add all files to DB
    response["images_added"] = []
    for img in imgToAdd:
        response["images_added"].append(addToDB(img))

    return jsonify(response)


def addToDB(img):

    # Connect to DB
    bucket = storage.Client().bucket(os.environ.get("GOOGLE_STORAGE_BUCKET"))
    photoFeedRef = firestore.Client().collection(os.environ.get("GOOGLE_COLLECTION"))

    # unique identifier for image
    imageUUID = str(uuid.uuid4())
    docRef = photoFeedRef.document(imageUUID).get()

    # Ensure image uuid does not already exist
    while docRef.exists:
        imageUUID = str(uuid.uuid4())
        docRef = photoFeedRef.document(imageUUID).get()

    # Checks whether a file is an image type
    if 'image' not in img.mimetype:
        return {"Error": "Please provide a valid image to upload"}

    # Write blob to Google Storage
    blob = bucket.blob(imageUUID)
    blob.upload_from_file(img)
    blob.make_public()

    # Generate public URL and URI
    publicURL = "https://storage.googleapis.com/{0}/{1}".format(os.environ.get("GOOGLE_STORAGE_BUCKET"), imageUUID)
    imageURI = "gs://{0}/{1}".format(os.environ.get("GOOGLE_STORAGE_BUCKET"), imageUUID)

    # Generate image labels using Google Vision API
    labels = getLabels(imageURI)

    imgInf = {
        'name': img.filename,
        'url': publicURL,
        'uri': imageURI,
        'key': imageUUID,
        'datetime': datetime.now(),
        'labels': labels
    }

    # Store reference and label information of image in Google Firestore
    photoFeedRef.document(imageUUID).set(imgInf)

    return imgInf


def getLabels(URI):
    # Vision client
    visionClient = vision.ImageAnnotatorClient()
    visionImg = vision.Image()

    # Extract key characteristics of image
    visionImg.source.image_uri = URI
    visionImgRes = visionClient.label_detection(image=visionImg)
    visionImgLabels = visionImgRes.label_annotations

    # Format label descriptions
    labels = []
    for label in visionImgLabels:
        labels.append(label.description.lower())

    return labels
