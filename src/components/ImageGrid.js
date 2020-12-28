import React from 'react';
import Figure from "react-bootstrap/Figure";
import {Chip } from '@material-ui/core'
import './ImageGrid.css';

const ImageGrid = (props) => {
    if(props.items) {
        return (
            <div>
                {props.items.map((i, index) =>
                    <Figure key={index}>
                        <Figure.Image
                            className={props.selectedID === (index) ? 'highlight' : 'regular'}
                            onClick={() => props.handleImageSearch(index)}
                            height={window.innerWidth / 3.5}
                            width={window.innerWidth / 3.5}
                            src={i.url}
                        />
                        <Figure.Caption>
                            {i.labels.slice(0, 3).map((v) =>
                                <Chip key={index + "val" + v} label={v}/>
                            )}
                        </Figure.Caption>
                    </Figure>
                )}
            </div>
        )
    }
    else {
        return(
            <div>
            </div>
        )
    }
}

export default ImageGrid;
