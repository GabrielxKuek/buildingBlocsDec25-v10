
import TestPage from './pages/TestPage'
import ErrorPage from './pages/ErrorPage'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/test" element={<TestPage />} />
//         <Route path="*" element={<ErrorPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import "./App.css";
import { Container, AppBar, Toolbar, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function App() {
  return (
//     <Router>
//       <AppBar position="static" className="AppBar">
//         <Container>
//           <Toolbar disableGutters={true}>
//             <Link to="/">
//               <Typography variant="h6" component="div">
//                 Learning
//               </Typography>
//             </Link>
//             <Link to="/tutorials">
//               <Typography>Tutorials</Typography>
//             </Link>
//           </Toolbar>
//         </Container>
//       </AppBar>
//       <Container>
//         <Routes>
//           <Route path={"/"} />
//           <Route path={"/tutorials"} />
//         </Routes>
//       </Container>
//     </Router>
// =======
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
