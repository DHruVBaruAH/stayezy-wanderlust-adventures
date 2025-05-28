import StaticPage from "@/components/StaticPage";
import { PRIVACY_POLICY_CONTENT } from "@/constants/staticContent";

const PrivacyPolicy = () => {
  return (
    <StaticPage
      title={PRIVACY_POLICY_CONTENT.title}
      content={PRIVACY_POLICY_CONTENT.content}
      lastUpdated={PRIVACY_POLICY_CONTENT.lastUpdated}
    />
  );
};

export default PrivacyPolicy;
