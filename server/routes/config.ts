import express from 'express';
const router = express.Router();

router.get('/config', (req, res) => {
  // Return only the config keys safe for frontend usage
  res.json({
    REACT_APP_VIDEO_LINK: process.env.REACT_APP_VIDEO_LINK,
    REACT_APP_MAPBOX_TOKEN: process.env.REACT_APP_MAPBOX_TOKEN,
    REACT_APP_MAPBOX_DATASETS_TOKEN: process.env.REACT_APP_MAPBOX_DATASETS_TOKEN,
    REACT_APP_GOOGLE_MAP_API_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    REACT_APP_GOOGLE_GEOCODE_API_KEY: process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY,
    REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH: process.env.REACT_APP_FIREBASE_AUTH,
    REACT_APP_FIREBASE_PROJECT: process.env.REACT_APP_FIREBASE_PROJECT,
    REACT_APP_FIREBASE_BUCKET: process.env.REACT_APP_FIREBASE_BUCKET,
    REACT_APP_FIREBASE_MESS: process.env.REACT_APP_FIREBASE_MESS,
    REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
    REACT_APP_TUTORIAL_ONE: process.env.REACT_APP_TUTORIAL_ONE,
    REACT_APP_TUTORIAL_TWO: process.env.REACT_APP_TUTORIAL_TWO,
    REACT_APP_TUTORIAL_VIDEO: process.env.REACT_APP_TUTORIAL_VIDEO,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    
    // add other keys you want frontend to know dynamically
  });
});

export default router;
