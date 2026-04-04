import aboutImg from "../assets/about-lobby.jpeg";

const AboutSection = () => {
  return (
    <section id="about" className="px-6 py-20 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-xl overflow-hidden aspect-[4/5] md:aspect-auto md:h-[420px]">
          <img
            src={aboutImg}
            alt="Serene Hotel lobby"
            loading="lazy"
            width={960}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-[44px] font-medium uppercase tracking-widest text-primary mb-3">
            Our Story
          </p>
          <h2 className="text-4xl font-medium tracking-tight text-foreground mb-4 leading-snug">
            A place where warmth <br className="hidden sm:block" />meets modern comfort
          </h2>
          <p className="text-[17px] leading-relaxed text-muted-foreground mb-4">
            Nestled in the heart of the city, Serene Hotel has been welcoming guests since 2012. 
            We believe hospitality is more than a service — it's a feeling. Every corner of our 
            space is designed to make you feel at home, from the locally sourced wood furnishings 
            to the hand-picked art that tells our region's story.
          </p>
          <p className="text-[16px] leading-relaxed text-muted-foreground mb-6">
            Whether you're here for business or leisure, our dedicated team ensures every stay 
            is seamless. No fuss, no pretension — just genuine care.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-2xl font-medium text-foreground">48</div>
              <div className="text-[12px] text-muted-foreground">Rooms</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-foreground">12</div>
              <div className="text-[12px] text-muted-foreground">Years</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-foreground">4.8</div>
              <div className="text-[12px] text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;