import React from 'react'
import {ImageList, ImageListItem} from '@mui/material'

function srcset(image: any, size: any, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}
    &h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h
            =${size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export function Intro() {
  return (
    <div className="Images">
      <div
        className="head"
        style={{
          width: "fit-content",
          margin: "auto",
        }}
      >


      </div>
      <br/>
      <ImageList
        variant="quilted"
        sx={{width: 1000, margin: "auto"}}
        cols={4}
        rowHeight={300}
      >
        <ImageListItem cols={1} rows={1}>
          <img
            {...srcset(
              "https://thumbs.dreamstime.com/z/close-up-blind-person-negotiating-steps-outdoors-using-cane-154515757.jpg",
              121,
              1,
              1
            )}
            loading="lazy"
          />

        </ImageListItem>
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/door.jpeg')} alt=""/>
        </ImageListItem>
        <ImageListItem cols={1} rows={1}>
          <img
            {...srcset(
              "http://img.thrfun.com/img/068/950/couple_m.jpg",
              121,
              1,
              1
            )}
            loading="lazy"
          />
        </ImageListItem>
        <ImageListItem cols={1} rows={1}>
          <img
            {...srcset(
              "https://www.readersdigest.ca/wp-content/uploads/2020/03/GettyImages-586384872-e1584451335950.jpg",
              121,
              1,
              1
            )}

            loading="lazy"
          />
        </ImageListItem>

      </ImageList>
    </div>
  );
}

export function Junior() {
  return (
    <div className="Images">
      <div
        className="head"
        style={{
          width: "fit-content",
          margin: "auto",
        }}
      >
      </div>
      <br/>
      <ImageList
        sx={{width: 1000, height: 300, margin: "auto"}}

      >


        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/arrow2.PNG')} alt=""/>
        </ImageListItem>


        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/arrow1.PNG')} alt=""/>
        </ImageListItem>
      </ImageList>
    </div>

  )
}

export function Pivot() {
  return (
    <div className="Images">
      <div
        className="head"
        style={{
          width: "fit-content",
          margin: "auto",
        }}
      >
      </div>
      <br/>
      <ImageList
        sx={{width: 1000, height: 300, margin: "auto"}}
      >
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/drag2.PNG')} alt=""/>
        </ImageListItem>
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/drag1.png')} alt=""/>
        </ImageListItem>
      </ImageList>
    </div>
  )
};

export function Ramdom() {
  return (
    <div className="Images">
      <div
        className="head"
        style={{
          width: "fit-content",
          margin: "auto",
        }}
      >
      </div>
      <br/>
      <ImageList
        sx={{width: 1000, height: 300, margin: "auto"}}
      >
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/general.PNG')} alt=""/>
        </ImageListItem>
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/ramdom.PNG')} alt=""/>
        </ImageListItem>

      </ImageList>

    </div>

  )
};

export function Validate() {
  return (
    <div className="Validate">
      <div
        className="head"
        style={{
          width: "fit-content",
          margin: "auto",
        }}
      >
      </div>
      <br/>
      <ImageList
        sx={{width: 1000, height: 300, margin: "auto"}}

      >
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/validate.png')} alt=""/>
        </ImageListItem>

        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/valid.png')} alt=""/>
        </ImageListItem>
      </ImageList>
    </div>

  )
}

export function Labeling() {
  return (
    <div className="Labeling">
      <div
        className="head"
        style={{
          width: "fit-content",
          margin: "auto",
        }}
      >
      </div>
      <br/>
      <ImageList
        sx={{width: 1000, height: 300, margin: "auto"}}

      >
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/capture.png')} alt=""/>
        </ImageListItem>

        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/editAI.png')} alt=""/>
        </ImageListItem>
      </ImageList>
    </div>

  )
}

export function Panels() {
  return (
    <div className="Panels">
      <div
        className="head"
        style={{
          width: "fit-content",
          margin: "auto",
        }}
      >
      </div>
      <br/>
      <ImageList
        sx={{width: 1000, height: 200, margin: "auto"}}
        rowHeight={100}
        cols={3}
      >
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/Capimage.png')} alt=""/>
        </ImageListItem>
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/box.png')} alt=""/>
        </ImageListItem>
        <ImageListItem cols={1} rows={1}>
          <img src={require('./Timage/lbels.png')} alt=""/>
        </ImageListItem>
      </ImageList>
    </div>

  )
}

