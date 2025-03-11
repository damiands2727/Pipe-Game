import React from "react";
import "./App.css";
import Footer from "./components/footer/Footer";
import PipeGame from "./components/pipegame/PipeGame";

function App() {
  return (
    <React.Fragment>
      <PipeGame></PipeGame>
      <Footer />
    </React.Fragment>
  );
}

export default App;
