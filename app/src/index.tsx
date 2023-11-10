import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ExplorationPage from "./pages/Exploration";
import LabelPage from "./pages/Label";
import ProtectedRoute from "./components/ProtectedRoute";
import EditLabelingPage from "./pages/Label/EditLabelingPage";
import ReviewLabelingPage from "./pages/Label/ReviewLabelingPage";
import LeaderBoard from "./pages/LeaderBoard";
import ResetPage from "./pages/Login/ResetPage";
import Contest from "./pages/Contest";
import Test from "./pages/Contest/test"
import Profile from "./pages/Profile"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<ResetPage />} />
          <Route path="/leaderBoard" element={<LeaderBoard />} />
          <Route path="*" element={<NotFound />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/contest" element={<Contest />} />
            {<Route path="/contestTest" element = {<Test />} /> }
            <Route path="/profile" element={<Profile />} />
            <Route path="/exploration" element={<ExplorationPage />} />
            <Route path="/label" element={<LabelPage />} />
            <Route path="/reviewLabels" element={<ReviewLabelingPage />} />
            <Route path="/editLabel/:id" element={<EditLabelingPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
