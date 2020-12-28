import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {Select, InputLabel, FormControl, MenuItem, Button} from '@material-ui/core';
import './MainPage.css';
import ImageGrid from "./ImageGrid";
import ChipInput from 'material-ui-chip-input'

function MainPage() {

    const [items, setItems] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [searchType, setSearchType] = useState('');
    const [chipAttr, setChipAttr] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');

    const getAllImages = async () => {
        const response = await axios.get('/imageAll');
        setInitialized(true);
        setItems(response.data.images);
    };

    const getImageByName = async () => {
        const response = await axios.get('/imageName?keyword=' + chipAttr[0]);
        setItems(response.data.images);
    };

    const getImageByAttr = async () => {
        const request = {
            params: {
                attr: chipAttr
            }
        }
        const response = await axios.get('/imageAttr',request);
        setItems(response.data.images);
    };

    const getSimilarImage = async () => {
        const imageUUID = items[parseInt(selectedImage)].key;
        const response = await axios.get('/imageSimilar?uuid='+imageUUID);
        setItems(response.data.images);
    };

    const uploadImage = async (files) => {
        let formData = new FormData();
        for(const prop in files) {
            if(prop !== 'length'){
                formData.append('file', files[prop]);
            }
        }
        const response = await axios.post('/image', formData)
        console.log(response)
        const newItems = [...items, ...response.data.images_added]
        setItems(newItems)
    };

    const handleChangeSelect = (event) => {
        setSearchType(event.target.value);
        setSelectedImage('');
        getAllImages();
    };

    const handleAddChip = (chip) => {
        if(searchType === "Name" && chipAttr.length >= 1){
            alert("Cannot enter more than 1 name to search by");
        } else {
            const newChips = [...chipAttr, chip];
            setChipAttr(newChips);
        }
    };

    const handleDeleteChip = (chip) => {
        const newChips = chipAttr.filter((tag) => {
                return tag !== chip
            })
        setChipAttr(newChips)
        if(newChips.length <= 0) {
            getAllImages();
        } else {
            getImageByAttr();
        }
    };

    const uploadFiles = (event) => {
        uploadImage(event.target.files)
    };

    const handleImageSearch = (id) => {
        if (searchType !== "Image") {
            alert("To search by an image select Image search type from drop down list")
        } else if (selectedImage === id) {
            setSelectedImage('');
        } else {
            setSelectedImage(id)
        }
    };

    const handleChangeItem = () => {
        if (searchType === "Name" && chipAttr.length >= 1) {
            getImageByName();
        } else if (searchType === "Attributes" && chipAttr.length >= 1) {
            getImageByAttr();
        } else if (searchType === "Image" && selectedImage !== '') {
            getSimilarImage();
        } else if (searchType === "") {
            alert("Select an attribute to search by in drop down list")
        } else if ((searchType === "Name" || searchType === "Attributes") && chipAttr.length <= 0) {
            alert("Enter an appropriate value to search by followed by enter")
        } else if (searchType === "Image" && selectedImage === '') {
            alert("To search by an image select an image below by clicking on it");
        }
    };

    useEffect(() => {
        if (!initialized) {
            getAllImages();
        }
    });

    return (
        <div className="HomePage">
            <div className="ImageGridHeader">
                <div className="SearchType">
                    <FormControl style={{minWidth: "120px"}}>
                        <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={searchType}
                              onChange={handleChangeSelect}
                        >
                            <MenuItem value={"Name"}>Name</MenuItem>
                            <MenuItem value={"Attributes"}>Attributes</MenuItem>
                            <MenuItem value={"Image"}>Image</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="SearchVal">
                    <ChipInput
                        disabled={searchType === "Image"}
                        fullWidth
                        placeholder={searchType === "Image" ? "Please click on an image below" : "Type and press enter to add chips"}
                        value={chipAttr}
                        onAdd={(chip) => handleAddChip(chip)}
                        onDelete={(chip) => handleDeleteChip(chip)}
                    />
                </div>
                <div className="ButtonAccess">
                    <Button
                        style={{ fontSize: '10px'}}
                        size="small"
                        variant="contained"
                        onClick={handleChangeItem}
                    >
                        Search
                    </Button>
                </div>
                <div className="ButtonAccess">
                    <Button
                        style={{ fontSize: '10px'}}
                        size="small"
                        variant="contained"
                        component="label"
                        onChange={uploadFiles}
                    >
                      Upload File
                      <input
                        type="file"
                        hidden
                        multiple
                        id="file"
                        name="file"
                      />
                    </Button>
                </div>
            </div>
            <ImageGrid
                items = {items}
                handleImageSearch={handleImageSearch}
                selectedID = {selectedImage}
            />
        </div>
    )

}

export default MainPage;