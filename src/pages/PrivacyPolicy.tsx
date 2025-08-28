const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
      <h1 className="text-4xl font-bold text-center mb-6 gradient-text">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed text-center">
          Your data privacy is important to us.
        </p>
        
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">🔒 Data Protection</h3>
            <p className="text-muted-foreground">
              We do not sell or share your personal data.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">🔐 Search Privacy</h3>
            <p className="text-muted-foreground">
              All searches are encrypted and stored anonymously for analytics.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">💳 Payment Security</h3>
            <p className="text-muted-foreground">
              Payment details are processed via secure third-party payment gateways.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">📧 Data Deletion</h3>
            <p className="text-muted-foreground">
              You can request data deletion by emailing: <span className="font-mono bg-muted px-2 py-1 rounded">aadizz@icloud.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;