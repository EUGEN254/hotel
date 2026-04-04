import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="px-6 py-10 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <p className="text-[29px] font-medium uppercase tracking-widest text-primary mb-3 text-center">
          Get in Touch
        </p>
        <h2 className="text-2xl font-medium tracking-tight text-foreground mb-10 text-center">
          We'd love to hear from you
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[15px] font-medium text-foreground">Location</div>
                <div className="text-[15px] text-muted-foreground">
                  Kenyatta Avenue, Nairobi, Kenya
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[15px] font-medium text-foreground">Phone</div>
                <div className="text-[15px] text-muted-foreground">
                  +254 700 123 456
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[15px] font-medium text-foreground">Email</div>
                <div className="text-[15px] text-muted-foreground">
                  reservations@serenehotel.co.ke
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[15px] font-medium text-foreground">Front Desk</div>
                <div className="text-[15px] text-muted-foreground">
                  24 hours, 7 days a week
                </div>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <form
            className="space-y-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your name"
                className="text-[15px] py-2.5 px-3 border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                type="email"
                placeholder="Email address"
                className="text-[15px] py-2.5 px-3 border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full text-[15px] py-2.5 px-3 border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full text-[15px] py-2.5 px-3 border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
            <button
              type="submit"
              className="text-[15px] font-medium py-2.5 px-6 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
