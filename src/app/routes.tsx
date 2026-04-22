import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { FollowingPage } from "./pages/FollowingPage";
import { ChannelPage } from "./pages/ChannelPage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage"; // 👈 thêm
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
  // 🔥 ROUTE RIÊNG (KHÔNG CÓ LAYOUT)
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  // 🔥 ROUTE CÓ LAYOUT
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "browse", Component: BrowsePage },
      { path: "following", Component: FollowingPage },
      { path: "category/:categoryName", Component: CategoryPage },
      { path: "channel/:channelName?", Component: ChannelPage },
      { path: "profile/:username", Component: ProfilePage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);