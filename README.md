# Photo Feed Application 

The hosted version of the application can be found here: https://vivid-outcome-300023.uc.r.appspot.com/

The following is a public image repository which allows anyone to upload new images, and search for existing images based on: 
names, image attributes, and other similar images. 

The application is written using python for the backend utilizing the Flask framework. 
The client side is built using react.

It is hosted on Google Cloud utilizing the following features: 
- GCP App Engine for hosting the API and client
- GCP Cloud Storage for storing images as blobs
- GCP Firestore for storing a reference to the image in GCP Cloud Storage and additional metadata
- GCP Vision API for extracting useful features for search, and finding similar images

### Backend API 
| Endpoint       | Type | Description |
| ----------     |----- |-------------| 
| `/Image`       | POST | - Add new image(s) to the repository <br/> - Supports both single/bulk secure image upload <br/> - Files are stored in Google Cloud Storage, and it's reference in Google Cloud Firestore. |
| `/ImageAll`    | GET  | - Returns all images currently stored within the repository
| `/ImageName`   | GET  | - Returns a single image with the name specified by parameter `keyword`
| `/ImageAttr`   | GET  | - Returns a list of images associated with a single or list of attributes associated with the parameter `attr` <br/> - Upon upload, all images are tagged by the Google Vision API and their appropriate references stored in Google Cloud Firestore. 
| `/ImageSimilar`| GET  | - Returns a list of images similar to one previously uploaded and specified by parameter `uuid`. <br/> - Fetch the uuid of an image previously uploaded before making a call to `/ImageSimilar` <br/> - Using the Google Vision API, we can keep track of key features of an image, and find images with overlapping key features. 

### Calls to Backend 

- ##### Upload single/Bulk image
``` 
curl -F 'file=@/path/to/your/file1.png'
     -F 'file=@/path/to/your/file2.png'
        https://vivid-outcome-300023.uc.r.appspot.com/image
```

- ##### Response
```
{
    images_added: [
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        ...
    ]
}
```

- ##### Get all Images
``` 
curl https://vivid-outcome-300023.uc.r.appspot.com/imageAll
```

- ##### Response
```
{
    images: [
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        ...
    ]
}
```

- ##### Find image with specified name
``` 
curl https://vivid-outcome-300023.uc.r.appspot.com/imageName?keyword=dogs.jpg
```

- ##### Response
```
{
    images: [
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        ...
    ]
}
```

- ##### Find image with specified attributes
``` 
curl https://vivid-outcome-300023.uc.r.appspot.com/imageName?attr[]=dog?attr[]=cat
```

- ##### Response
```
{
    images: [
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        ...
    ]
}
```


- ##### Find a similar image
``` 
curl https://vivid-outcome-300023.uc.r.appspot.com/imageName?uuid=8c6423e3-59d7-4690-9e23-536791cdf128
```

- ##### Response
```
{
    images: [
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        {
            'name': filename,
            'url': URL,
            'uri': URI,
            'key': UUID,
            'datetime': datetime,
            'labels': [a, b, c]
        },
        ...
    ]
}
```

### Local development

- If you would like to develop and play around with this locally follow these steps: 

1. Download the [Google Cloud SDK](https://cloud.google.com/sdk)
2. Set up a Google Cloud Project with the following components: <br/>
    1. Google App Engine (With the default Google Storage Bucket)
    2. Google Cloud Firestore with a collection named: `photoFeed`
    3. Google Vision API enabled
3. Download a [service account key](https://cloud.google.com/docs/authentication/production) from Google Cloud 
4. Create a `.env` file that looks as follows, and place it in the API folder: 
```
GOOGLE_APPLICATION_CREDENTIALS = "abcd"
GOOGLE_STORAGE_BUCKET = "abcd"
GOOGLE_COLLECTION = "photoFeed"
```
5. Place the service account key `.json` file into the API folder, and a reference to it's location in the `.env` file
6. Update the name of the default Google Cloud storage bucket found in the `.env` file
7. Create an empty `/build` directory in the API folder and run `yarn create-app`
8. Run the following command from the API folder location: `dev_appserver.py --application=[App Engine Project ID] app.yaml`
9. Access the application from `http://localhost:8080`