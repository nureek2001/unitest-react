import React from "react";
import {Routes, Route} from 'react-router-dom';
import "./App.css";
import { AuthorizationStudent } from "./pages/AuthorizationStudent/AuthorizationStudent";
import { AuthorizationTeacher } from "./pages/AuthorizationTeacher/AuthorizationTeacher";
import { NotFound } from "./pages/NotFound/NotFound";
import { TeacherPage } from "./pages/TeacherPage/TeacherPage";
import { WaitingRoomTeacher } from "./pages/WaitingRoomTeacher/WaitingRoomTeacher";
import { WaitingRoomStudent } from "./pages/WaitingRoomStudent/WaitingRoomStudent";
import { TestPage } from "./pages/TestPage/TestPage";
import { WaitingTestTeacher } from "./pages/WaitingTestTeacher/WaitingTestTeacher";
import { TestResults } from "./pages/TestResults/TestResults";
import { TestResultsDetails } from "./pages/TestResultsDetails/TestResultsDetails"
import { HistoryPage } from "./pages/HistoryPage/HistoryPage"
import { WaitingTestResults } from "./pages/WaitingTestResults/WaitingTestResults";
function App(){

    return(
      <>
      <Routes>
          <Route index element={< AuthorizationStudent  />} />
          <Route path="/authorization-student" element={<AuthorizationStudent/>} />
          <Route path="/authorization-teacher" element={<AuthorizationTeacher/>} />
          <Route path="/not-found" element={< NotFound/>} />
          <Route path="/teacher-page" element={<TeacherPage/>} />
          <Route path="/waiting-room-teacher" element={< WaitingRoomTeacher/> } />
          <Route path="/waiting-test-teacher/:room_code" element={< WaitingTestTeacher/> } />
          <Route path="/waiting-room-student/:room_code" element={< WaitingRoomStudent/> } />
          <Route path="/test-page/:room_code" element={< TestPage/>} />
          <Route path="/test-results/:room_code" element={< TestResults/>} />
          <Route path="/test-results-details/:room_code/:participant_id" element={< TestResultsDetails/>} />
          <Route path="/history-page" element={< HistoryPage/>} />
          <Route path = "/waiting-test-results/:room_code" element = {<WaitingTestResults/>} />
          <Route from="*" to="/not-found" />
      </Routes>
      </>
    )
}

export default App;