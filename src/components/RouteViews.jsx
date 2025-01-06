import { Route, Routes } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";

const RouteViews = () => {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default RouteViews;