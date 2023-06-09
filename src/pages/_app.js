import "@/styles/globals.css";
import "@/styles/contact.css";
import "@/styles/footer.css";
import "@/styles/home.css";
import "@/styles/navigationBar.css";
import "@/styles/newsLetterCheckBox.css";
import "@/styles/profile.css";
import "@/styles/profileBackdrop.css";
import "@/styles/profileBandInfo.css";
import "@/styles/profileCard.css";
import "@/styles/profileContent.css";
import "@/styles/profileHeader.css";
import "@/styles/profileModal.css";
import "@/styles/profileInterests.css";
import "@/styles/feed.css";
import "@/styles/verify.css";
// import "@/styles/signin.module.css";
import "@/styles/signup.css";
import "@/styles/feedPost.css";
import "@/styles/feedFriend.css";
import "@/styles/createBand.css";
import "@/styles/myBand.css";
import "@/styles/myBandNavigationBar.css";
import "@/styles/myBandSettingsTab.css";
import "@/styles/myBandMembersTab.css";
import "@/styles/myBandAboutTab.css";
import "@/styles/joinBand.css";
import "@/styles/leftPanelNavigation.css";
import "@/styles/joinBandCarousel.css";
import "@/styles/joinBandCarouselCard.css";
import "@/styles/forgotPassword.css";
import "@/styles/passwordRecovery.css";
import "@/styles/myBandPostingUI.css";
import "@/styles/myBandFeaturedTab.css";
import "@/styles/termsAndConditions.css";
import "@/styles/privacyPolicy.css";
import "@/styles/termsAndConditionsCheckBox.css";
import "@/styles/myBandMember.css";
import { UserContext } from "@/context/userContext";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/fetchUserData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      setUser(data.user);
    })();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
