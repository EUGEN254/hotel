import { Star } from "lucide-react";

const reviews = [
  {
    name: "Grace M.",
    location: "Nairobi",
    text: "The staff remembered my name from my last visit two years ago. That kind of attention to detail is what keeps me coming back. The rooms are spotless and the garden is beautiful.",
    rating: 5,
  },
  {
    name: "James O.",
    location: "Mombasa",
    text: "Booked for a business trip and extended my stay by three days. The WiFi is genuinely fast, the restaurant is excellent, and the pool area is perfect for unwinding after meetings.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    location: "Kisumu",
    text: "We stayed in the suite for our anniversary. Everything was perfect — from the welcome drinks to the late checkout. It felt personal, not corporate. Highly recommend.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="px-6 py-15 max-w-6xl mx-auto">
      <p className="text-[39px] font-medium uppercase tracking-widest text-primary mb-3 text-center">
        Guest Reviews
      </p>
      <h2 className="text-2xl font-medium tracking-tight text-foreground mb-10 text-center">
        What our guests say
      </h2>
      <div className="grid sm:grid-cols-3 gap-5">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="p-5 rounded-xl border border-border-light bg-card"
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-primary text-primary"
                />
              ))}
            </div>
            <p className="text-[16px] leading-relaxed text-foreground mb-4">
              "{review.text}"
            </p>
            <div>
              <div className="text-[16px] font-medium text-foreground">
                {review.name}
              </div>
              <div className="text-[15px] text-muted-foreground">
                {review.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
