import StaticPage from "@/components/StaticPage";
import { TERMS_OF_SERVICE_CONTENT } from "@/constants/staticContent";

const TermsOfService = () => {
  return (
    <StaticPage
      title={TERMS_OF_SERVICE_CONTENT.title}
      content={TERMS_OF_SERVICE_CONTENT.content}
      lastUpdated={TERMS_OF_SERVICE_CONTENT.lastUpdated}
    />
  );
};

export default TermsOfService;
