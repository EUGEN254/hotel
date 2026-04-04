const Footer = () => {
  return (
    <footer className="px-6 py-10 border-t border-border-light">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-1">
            <div className="text-[25px] font-medium text-foreground mb-3">
              Serene Hotel
            </div>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              A boutique hotel in Nairobi offering warm hospitality, modern comfort, and unforgettable experiences since 2012.
            </p>
          </div>
          <div>
            <div className="text-[15px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Quick Links
            </div>
            <div className="space-y-2">
              {["Rooms", "About", "Dining", "Spa"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-[15px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[15px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Policies
            </div>
            <div className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cancellation", "FAQ"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-[15px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[15px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Follow Us
            </div>
            <div className="space-y-2">
              {["Instagram", "Twitter", "Facebook", "TripAdvisor"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-[15px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-[12px] text-muted-foreground">
            © 2026 Serene Hotel. All rights reserved.
          </div>
          <div className="text-[12px] text-muted-foreground">
            Kenyatta Avenue, Nairobi, Kenya
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
