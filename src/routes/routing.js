import Home from "@pages/Home/index";
import Detail from "@pages/Detail/index";
import Test from "@pages/Test/index";
import TestMap from "@pages/TestMap";
import Payment from "@pages/Payment/index";
import DataHistoris from "@pages/Detail/DataHistoris";
import DataPrakiraan from "@pages/Detail/DataPrakiraan";
import Dashboard from "@pages/Dashboard/index";
import About from "@pages/About/index";
import Silentera from "@pages/About/Silentera";
import DataProvided from "@pages/About/DataProvided";
import Parameter from "@pages/About/Parameter";
import UserGuide from "@pages/About/UserGuide";
import TestHistoris from "@pages/Detail/TestHistoris";
import TestPrakiraan from "@pages/Detail/TestPrakiraan";
import TestMonitoring from "@pages/Detail/TestMonitoring";
import Beranda from "@pages/Beranda";
import DataMonitoring from "@pages/Detail/DataMonitoring";
import ListSubscription from "@pages/ListSubscription/index";
import Profile from "@pages/Profile/index";

const routes = [
  {
    id: 1,
    path: "/",
    component: Home,
  },
  {
    id: 2,
    path: "/detail",
    component: Detail,
  },
  {
    id: 3,
    path: "/payment",
    component: Payment,
  },
  {
    id: 4,
    path: "/detail/data-historis",
    component: DataHistoris,
  },
  {
    id: 5,
    path: "/detail/data-prakiraan",
    component: DataPrakiraan,
  },
  {
    id: 6,
    path: "/dashboard",
    component: Dashboard,
  },
  {
    id: 7,
    path: "/detail/data-monitoring",
    component: DataMonitoring,
  },
  {
    id: 8,
    path: "/list-subscription",
    component: ListSubscription,
  },
  {
    id: 9,
    path: "/profile",
    component: Profile,
  },
  {
    id: 10,
    path: "/test",
    component: Test,
  },
  {
    id: 11,
    path: "/testMap",
    component: TestMap,
  },
  {
    id: 12,
    path: "/about",
    component: About,
  },
  {
    id: 13,
    path: "/about/silentera",
    component: Silentera,
  },
  {
    id: 14,
    path: "/about/data-provided",
    component: DataProvided,
  },
  {
    id: 15,
    path: "/about/parameter",
    component: Parameter,
  },
  {
    id: 16,
    path: "/about/user-guide",
    component: UserGuide,
  },
  {
    id: 17,
    path: "/detail/test-historis",
    component: TestHistoris,
  },
  {
    id: 18,
    path: "/detail/test-prakiraan",
    component: TestPrakiraan,
  },
  {
    id: 19,
    path: "/detail/test-monitoring",
    component: TestMonitoring,
  },
  {
    id: 20,
    path: "/beranda",
    component: Beranda,
  },
];

export default routes;
