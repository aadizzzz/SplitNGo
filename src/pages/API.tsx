const API = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
      <h1 className="text-4xl font-bold text-center mb-6 gradient-text">SplitNGo API Access</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Want to use SplitNGo's smart journey engine in your own apps? We offer RESTful APIs that let developers:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Fetch train routes between stations</li>
          <li>Get optimal journey options (direct/split/layover)</li>
          <li>Access real-time route mapping</li>
        </ul>
        <div className="bg-card border rounded-lg p-6 mt-8">
          <p className="text-lg font-semibold mb-2">📘 API Documentation</p>
          <p className="text-muted-foreground mb-4">Comprehensive documentation coming soon</p>
          <p className="text-sm text-muted-foreground">
            💻 For developer access, write to: <span className="font-mono bg-muted px-2 py-1 rounded">aadizz@icloud.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default API;
