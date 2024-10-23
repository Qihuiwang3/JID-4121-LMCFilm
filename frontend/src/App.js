import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Payment from "./components/Pages/Payment/Payment";
import TopNavBar from "./components/Functions/TopNavBar/TopNavBar";
import SelectClassPage from "./components/Pages/SelectTaskPages/StudentSelectClassPage/SelectClassPage";
import Equipment from "./components/Pages/Equipment/Equipment";
import CartConfirmation from "./components/Pages/CartConfirmation/CartConfirmation";
import ReservationTimePicker from "./components/Pages/ReservationTimePicker/ReservationTimePicker";
import ReservationConfirmationMessagePage from "./components/Pages/ReservationConfirmationMessagePage/ReservationConfirmationMessagePage";
import Students from "./components/Pages/Students/Students";
import ViewEquipment from "./components/Pages/SelectTaskPages/AdminViewEquipment/ViewEquipment";
import SelectTask from "./components/Pages/SelectTaskPages/AdminSelectTaskPage/SelectTask";
import Management from "./components/Pages/SelectTaskPages/AdminManagementPage/Management";
import EnterCode from "./components/Pages/EnterCode/EnterCode";
import ClassCodes from "./components/Pages/ClassCodes/ClassCodes";
import ReservationPage from "./components/Pages/ReservationPage/Reservation";
import ViewReservation from "./components/Pages/ViewReservation/ViewReservation";
import Login from "./components/Pages/Login/Login";
import ReservationHistory from "./components/Pages/ReservationHistory/ReservationHistory";
import DamageReport from "./components/Pages/DamageReport/DamageReport";
import { Provider } from "react-redux";
import store from "./components/redux/store";
import ProtectedRoute from "./ProtectedRoute";

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
                      {/* Public route - Login */}
                      <Route path="/" element={<Login />} />

                      {/* Protected routes */}
                      <Route
                          path="/Enter"
                          element={<ProtectedRoute element={<EnterCode />} />}
                      />
                      <Route
                          path="/SelectClass"
                          element={<ProtectedRoute element={<SelectClassPage />} />}
                      />
                      <Route
                          path="/Reservation"
                          element={<ProtectedRoute element={<ReservationTimePicker onConfirm={this.setSelectedDates} />} />}
                      />
                      <Route
                          path="/ReservationPage"
                          element={<ProtectedRoute element={<ReservationPage />} />}
                      />
                      <Route
                          path="/ViewReservation"
                          element={<ProtectedRoute element={<ViewReservation />} />}
                      />
                      <Route
                          path="/Payment"
                          element={<ProtectedRoute element={<Payment />} />}
                      />
                      <Route
                          path="/CartConfirmation"
                          element={<ProtectedRoute element={<CartConfirmation />} />}
                      />
                      <Route
                          path="/ClassCodes"
                          element={<ProtectedRoute element={<ClassCodes />} />}
                      />
                      <Route
                          path="/ReservationConfirmationMessagePage"
                          element={<ProtectedRoute element={<ReservationConfirmationMessagePage />} />}
                      />
                      <Route
                          path="/Equipment"
                          element={<ProtectedRoute element={<Equipment />} />}
                      />
                      <Route
                          path="/Students"
                          element={<ProtectedRoute element={<Students />} />}
                      />
                      <Route
                          path="/ViewEquipment"
                          element={<ProtectedRoute element={<ViewEquipment />} />}
                      />
                      <Route
                          path="/SelectTask"
                          element={<ProtectedRoute element={<SelectTask />} />}
                      />
                      <Route
                          path="/Management"
                          element={<ProtectedRoute element={<Management />} />}
                      />
                      <Route
                          path="/ReservationHistory"
                          element={<ProtectedRoute element={<ReservationHistory />} />}
                      />
                      <Route
                          path="/DamageReport"
                          element={<ProtectedRoute element={<DamageReport />} />}
                      />
                  </Routes>
              </Router>
          </Provider>
      );
  }
}

export default App;
