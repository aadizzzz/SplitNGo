const Careers = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
      <h1 className="text-4xl font-bold text-center mb-6 gradient-text">Work With Us</h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed text-center">
          We're a small but passionate team building the future of travel. If you're a:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Full-stack Developer</h3>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Backend/Data Engineer</h3>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">UI/UX Designer</h3>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Data Scientist</h3>
            <p className="text-sm text-muted-foreground">with interest in graph search algorithms</p>
          </div>
        </div>
        <div className="text-center mt-8 space-y-2">
          <p className="text-lg font-semibold">…we'd love to talk!</p>
          <p className="text-muted-foreground">
            💼 Email us at: <span className="font-mono bg-muted px-2 py-1 rounded">aadizz@icloud.com</span>
          </p>
          <p className="text-sm text-muted-foreground">🌏 Remote-first | Flexible Hours | Impactful Work</p>
        </div>
      </div>
    </div>
  );
};

export default Careers;