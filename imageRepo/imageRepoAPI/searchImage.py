from flask import Blueprint, request, jsonify
from google.cloud import firestore
import os

searchImage_api = Blueprint('searchImage_api', __name__)


@searchImage_api.route('/imageName', methods=['GET'])
def searchImageName():
    # Build Response
    response = {}

    # Get keyword parameter defining search string
    keywordInfo = request.args.get("keyword")

    # Defining collections location
    photoFeedRef = firestore.Client().collection(os.environ.get("GOOGLE_COLLECTION"))

    # Query for searching by image name
    docs = photoFeedRef.where("name", "==", keywordInfo).stream()
    response["images"] = []
    for doc in docs:
        response["images"].append(doc.to_dict())

    return jsonify(response)


@searchImage_api.route('/imageAttr', methods=['GET'])
def searchImageAttr():
    # Build Response
    response = {}

    # Get attr parameter defining search string labels
    attrInfo = request.args.getlist("attr")

    # Defining collections location
    photoFeedRef = firestore.Client().collection(os.environ.get("GOOGLE_COLLECTION"))

    # Query for searching by image labels
    docs = photoFeedRef.where("labels", 'array_contains_any', attrInfo).stream()
    response["images"] = []
    for doc in docs:
        response["images"].append(doc.to_dict())

    return jsonify(response)


@searchImage_api.route('/imageSimilar', methods=['GET'])
def searchImageSimilar():
    # Build Response
    response = {}

    # Find similar image based on one that already exists in database
    imageUUID = request.args.get("uuid")

    # Defining collections location
    photoFeedRef = firestore.Client().collection(os.environ.get("GOOGLE_COLLECTION"))

    # Get image information
    doc = photoFeedRef.document(imageUUID).get()
    docLabelInf = doc.to_dict()["labels"]

    # Query for searching by image labels
    similarDocs = photoFeedRef.where("labels", 'array_contains_any', docLabelInf).stream()
    response["images"] = []
    for currDoc in similarDocs:
        # Filter out doc with same UUID
        if currDoc.id != imageUUID:
            response["images"].append(currDoc.to_dict())

    return jsonify(response)



