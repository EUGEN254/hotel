import poolImg from "../assets/amenity-pool.jpeg";
import diningImg from "../assets/amenity-dining.jpeg";
import spaImg from "../assets/amenity-spa.jpeg";

const amenities = [
  {
    title: "Pool & Garden",
    description: "Unwind by our infinity pool overlooking lush tropical gardens. Open daily from 6am to 9pm.",
    image: poolImg,
  },
  {
    title: "Fine Dining",
    description: "Experience curated menus featuring local ingredients, paired with wines from around the world.",
    image: diningImg,
  },
  {
    title: "Spa & Wellness",
    description: "Restore body and mind with traditional therapies in a serene, candlelit setting.",
    image: spaImg,
  },
];

const AmenitiesSection = () => {
  return (
    <section className="px-6 py-20 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <p className="text-[41px] font-medium uppercase tracking-widest text-primary mb-3 text-center">
          Experience
        </p>
        <h2 className="text-2xl font-medium tracking-tight text-foreground mb-10 text-center">
          More than just a room
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {amenities.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl overflow-hidden bg-card border border-border-light"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[17px] font-medium text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-[17px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;