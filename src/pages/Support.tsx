const Support = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
      <h1 className="text-4xl font-bold text-center mb-6 gradient-text">Support Center</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed text-center">
          Need help using SplitNGo?
        </p>
        
        <div className="grid md:grid-cols-1 gap-6 mt-8 max-w-2xl mx-auto">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">General Issues</h3>
            <p className="text-muted-foreground">Check our Help Center for common questions and solutions</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Bug Reports</h3>
            <p className="text-muted-foreground">
              Email us at: <span className="font-mono bg-muted px-2 py-1 rounded">aadizz@icloud.com</span>
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Account & Payment Issues</h3>
            <p className="text-muted-foreground">Reach support via chat or email for account-related help</p>
          </div>
        </div>
        
        <p className="text-center text-lg font-semibold gradient-text mt-8">
          We're here 24×7 to help you.
        </p>
      </div>
    </div>
  );
};

export default Support;