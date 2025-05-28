import StaticPage from "@/components/StaticPage";
import { ABOUT_US_CONTENT } from "@/constants/staticContent";

const AboutUs = () => {
  return (
    <StaticPage
      title={ABOUT_US_CONTENT.title}
      content={ABOUT_US_CONTENT.content}
    />
  );
};

export default AboutUs;
