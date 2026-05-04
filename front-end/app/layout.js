import SessionWrapper from "./Components/essentials/SessionWrapper";
import { NavBar } from "./Components/layout/NavBar";
import NotificationToast from "./Components/notifications/NotificationToast";
// import "./globals.css";

import "./globals.css";

export const metadata = {
  title: "Dev Collab"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          {/* <NavBar /> */}
          {children}
          <NotificationToast />
        </SessionWrapper>
      </body>
    </html>
  );
}