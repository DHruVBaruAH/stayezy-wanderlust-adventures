import StaticPage from "@/components/StaticPage";
import { CONTACT_US_CONTENT } from "@/constants/staticContent";

const ContactUs = () => {
  return (
    <StaticPage
      title={CONTACT_US_CONTENT.title}
      content={CONTACT_US_CONTENT.content}
    />
  );
};

export default ContactUs;
