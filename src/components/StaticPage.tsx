interface StaticPageProps {
  title: string;
  content: string;
  lastUpdated?: string;
}

const StaticPage = ({ title, content, lastUpdated }: StaticPageProps) => {
  return (
    <div className='container max-w-4xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-6'>{title}</h1>
      {lastUpdated && (
        <p className='text-sm text-gray-500 mb-4'>
          Last updated: {lastUpdated}
        </p>
      )}
      <div className='prose prose-lg'>
        {content.split("\n\n").map((paragraph, index) => (
          <p
            key={index}
            className='mb-4'>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StaticPage;
