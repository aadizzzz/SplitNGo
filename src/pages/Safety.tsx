const Safety = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
      <h1 className="text-4xl font-bold text-center mb-6 gradient-text">Passenger Safety First</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed text-center">
          Your safety matters. SplitNGo never compromises on:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">🔒 Verified train data</h3>
            <p className="text-muted-foreground">All train information is verified and up-to-date</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">🛡️ Zero third-party ticketing leaks</h3>
            <p className="text-muted-foreground">Your booking information stays secure</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">🔐 Secure HTTPS-only interactions</h3>
            <p className="text-muted-foreground">All connections are encrypted and secure</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">📍 Emergency contact listing</h3>
            <p className="text-muted-foreground">For layover stations and assistance</p>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground mt-8">
          We aim to integrate real-time safety alerts and emergency help buttons in future releases.
        </p>
      </div>
    </div>
  );
};

export default Safety;