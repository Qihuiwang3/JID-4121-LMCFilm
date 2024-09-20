import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Payment from "./components/Pages/Payment/Payment";
import TopNavBar from "./components/Functions/TopNavBar/TopNavBar";
import EnterCode from "./components/Pages/EnterCode/EnterCode";
import Equipment from "./components/Pages/Equipment/Equipment";
import SelectClassPage from "./components/Pages/SelectClassPage/SelectClassPage";
import ReservationPage from "./components/Pages/ReservationPage/Reservation";
import CartConfirmation from "./components/Pages/CartConfirmation/CartConfirmation";
import ReservationTimePicker from "./components/Pages/ReservationTimePicker/ReservationTimePicker";
import ReservationConfirmationMessagePage from "./components/Pages/ReservationConfirmationMessagePage/ReservationConfirmationMessagePage";
import { Provider } from "react-redux";
import store from "./components/redux/store";

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
      <Provider store={store}>
        <Router>
          <TopNavBar />
          <Routes>
            <Route path="/" element={<EnterCode />} />
            <Route path="/SelectClass" element={<SelectClassPage />} />
            <Route path="/Reservation" element={<ReservationTimePicker onConfirm={this.setSelectedDates} />} />
            <Route path="/ReservationPage" element={<ReservationPage selectedDates={this.state.selectedDates} />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/CartConfirmation" element={<CartConfirmation />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/Message" element={<ReservationConfirmationMessagePage />} />
            <Route path="/Equipment" element={<Equipment />} />
          </Routes>
        </Router>
      </Provider>
    );
  }
}

export default App;
