import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import routes from "./routing";
import Navbar from "@components/organism/Navbar";
import LoginModal from "@components/organism/Login";
import Toast from "@components/molecule/Toast/Toast";

import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import the NProgress CSS for styling the progress bar
import SurveyModal from "@components/organism/Survey";
import { useSelector } from "react-redux";

const Config = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    NProgress.done();
  }, [location.pathname]);

  return (
    <Routes>
      {routes.map(({ id, path, component: Component }) => {
        return (
          <Route
            path={path}
            element={
              <div
                className={`relative ${
                  path.includes("/about") ? "" : "bg-[#F7FFF4]"
                }  font-jost`}
              >
                <Toast />
                {id !== 6 && id !== 17 && id !== 18 && id !== 19 ? (
                  <>
                    <div className="z-50">
                      <LoginModal />
                    </div>
                    {!user && window.location.pathname === "/" && (
                      <div className="z-50">
                        <SurveyModal />
                      </div>
                    )}

                    {/* <div className="max-h-[100vh] overflow-hidden bg-[#F7FFF4]"> */}
                    <div className="h-full bg-[#F7FFF4]">
                      <Navbar />
                      {/* <div className={`max-h-[93vh] overflow-auto`}>
                          <Component />
                        </div> */}
                      <div className={`mt-[50px] md:mt-[60px] min-h-[87vh]`}>
                        <Component />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="min-h-[87vh] font-jost box-border bg-[#F7FFF4]">
                    {" "}
                    <Component />
                  </div>
                )}
                {/* <div className="h-full mt-8 flex flex-col justify-end">
                    <Footer />
                  </div> */}
              </div>
            }
            key={id}
          />
        );
      })}
    </Routes>
  );
};

export default Config;
