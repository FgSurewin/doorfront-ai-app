# Doorfront

[![test](https://img.shields.io/github/followers/FgSurewin?label=Follow%20me&style=social)](https://github.com/FgSurewin) ![GCP](https://img.shields.io/badge/%E2%86%91%20Deploy%20to-GCP-purple) ![license](https://img.shields.io/badge/license-MIT-green) ![node](https://img.shields.io/badge/Node-%3E%3D14.0.0-blue)

<center><img src="https://cdn.jsdelivr.net/gh/FgSurewin/pictures/imgGroup%202.svg" alt="doorFront" /></center>

<center><strong>😃Crowdsourcing Web App Based on React<strong></center>

:new: DoorFront, a web-based crowdsourcing application, enables volunteers not only to remotely label storefront accessibility data on GSV images, but also to validate the labeling result to ensure high data quality. 

---

# Background

In New York City (NYC), the number of blind people continues to increase. To support the visually impaired independent travel and reduce their stress in travel planning, BMCC Reality Computing Laboratory has been developing a web-based application, DoorFront, to collect large-scale accessibility data of (NYC) storefronts using crowdsourcing, Google Street View (GSV) and artificial intelligence (AI).

# Features

:memo:This is an integrated version, which means it has both a sign-up/login pages and landing page. If you prefer to customizing your own landing page as well as other pages, you can just install our label tool :fire: which has been separated from the project and released by NPM (You can get more [info](#Released package) below).

- [x] Landing page
- [x] Sign-up & Login
- [x] Built in Google Streetview
- [x] Integrated MongoDB database
- [x] Fully support TypeScript
- [x] Step-by-Step Travel Guide
- [x] Ranking & Badge System
- [x] Integrated AI Model
- [x] Embedded GSV markers

## Features of Label Tool

🍎 The entire component was developed based on [Konva.js](https://konvajs.org/). We use canvas to accomplish the bounding boxes' transformations.

- [x] Zoom in and out of images
- [x] Resize bounding box
- [x] Transfer bounding box
- [x] Custom context menu
- [x] Integrated manipulation panel
- [x] Support object' s subtype

# Visit our app

##### Live Experience🌈: Click it [here](https://doorfront.org/)

##### :stuck_out_tongue_winking_eye: Built-in Google Streetview

![](https://cdn.jsdelivr.net/gh/FgSurewin/pictures/imgdoorfront_1.png)

##### :heart_eyes: Label Tool

![](https://cdn.jsdelivr.net/gh/FgSurewin/pictures/imgdoorfront_2.png)


# Released package

In this project, label tool has been separated and released via NPM. Therefore, you can easily install the label tool and integrate it into your project without other pages.

```bash
# install the label tool in your project
$ npm install --save @fgsurewin/react_labeltool
```

## DEMO

##### Live Example🌈: Click it [here](https://codesandbox.io/s/react-label-tool-jteur?file=/src/App.js)

### APIs

#### :question:Types Description

```ts
interface InputLabel {
  x: number; // left
  y: number; // top
  width: number;
  height: number;
  type: string;
  id: string;
  subtype?: string;
}

type TypeConfig = {
  type: string;
  color: string;
  subtype?: string[];
}[];
```

| Name           | Description                                                      | Type                   |
| -------------- | ---------------------------------------------------------------- | ---------------------- |
| **typeConfig** | Type configuration (**required**)                                | TypeConfig             |
| **labels**     | Labels (**required**)                                            | InputLabel[]           |
| **imgUrl**     | Set label image's url (**required**)                             | string                 |
| **Logo**       | Set Logo's url (**required**)                                    | string                 |
| asideWidth     | Set aside's width (Optional)                                     | number                 |
| headerHeight   | Set header's height (Optional)                                   | number                 |
| handleBack     | This function will fire when back button is clicked(Optional)    | (_value_: any) => void |
| handleSubmit   | This function will fire when confirm button is clicked(Optional) | (_value_: any) => void |
| backContext    | Set back button's context (Optional)                             | string                 |
| confirmContext | Set confirm button's context (Optional)                          | string                 |
| handleFinish   | This function will fire when finished labeling(Optional)         | (_value_: any) => void |
| scaleBy        | Set image's scale value (Optional)                               | number                 |
| maxScale       | Set image's maximum scale (Optional)                             | number                 |

:boom:**All functions have a parameter value that contains labels' information**

## Contributing

:tada:Feel free to dive in! [Open an issue](https://github.com/FgSurewin/crsp_crowdsourcing_app/issues/new) or submit PRs.

## License

[MIT](https://github.com/RichardLitt/standard-readme/blob/master/LICENSE) © FgSurewin
