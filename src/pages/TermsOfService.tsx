const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
      <h1 className="text-4xl font-bold text-center mb-6 gradient-text">Terms of Service</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          By using SplitNGo, you agree to:
        </p>
        
        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-muted-foreground">
              • Provide accurate information while booking
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <p className="text-muted-foreground">
              • Not misuse or automate our service without permission
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <p className="text-muted-foreground">
              • Acknowledge that availability depends on Indian Railways data
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <p className="text-muted-foreground">
              • Understand that layover or split journeys are at user's discretion
            </p>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground mt-8 bg-muted p-4 rounded-lg">
          SplitNGo reserves the right to terminate services for policy violations.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;