# Photo Feed Application 

The following is an image repository which allows the user to upload new images, and search for existing images based on: 
names, image attributes, and other similar images. 

The application is written using python from the backend API utilizing the Flask framework. 

It is hosted on Google Cloud utilizing the following features: 
- GCP App Engine for hosting the API and frontend
- GCP Cloud Storage for storing images as blobs
- GCP Firestore for storing a reference to the image in GCP Cloud Storage and additional metadata
- GCP Vision API for extracting useful features for search, and finding similar images

### Image Repository API: 
- Publicly Available from here: https://photofeed-299523.uc.r.appspot.com/

### Frontend 
- WIP 