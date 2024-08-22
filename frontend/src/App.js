import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReservationTimePicker from "./components/Pages/ReservationTimePicker/ReservationTimePicker";
import EnterCode from "./components/Pages/EnterCode/EnterCode";
import ReservationPage from "./components/Pages/ReservationPage/Reservation";
import TopNavBar from "./components/Functions/TopNavBar/TopNavBar";
import SelectClassPage from "./components/Pages/SelectClassPage/SelectClassPage";


class App extends Component {
  state = {
    selectedDates: {
      pickupDate: new Date(),
      pickupTime: new Date(),
      returnDate: new Date(),
      returnTime: new Date(),
    }
  };

  setSelectedDates = (pickupDate, pickupTime, returnDate, returnTime) => {
    this.setState({
      selectedDates: { pickupDate, pickupTime, returnDate, returnTime }
    });
  };
  
  render() {
    return (
      <Router>
        <TopNavBar/>
        <Routes>
          <Route path="/" element={<EnterCode/>} />
          <Route path="/SelectClass" element={<SelectClassPage/>} />
          <Route path="/Reservation" element={<ReservationTimePicker onConfirm={this.setSelectedDates}/>} />
          <Route path="/ReservationPage" element={<ReservationPage selectedDates={this.state.selectedDates}/>}/>
        </Routes>
      </Router>
    );
  }
}

export default App;
