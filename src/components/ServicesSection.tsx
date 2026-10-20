import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigate }) => {
  const services = [
    {
      id: 'programs',
      title: 'Programs',
      image: '/assets/img/img1.jpg',
      description: 'Our programs are tailored to meet your specific needs and preferences. With expert guidance from our certified trainers.',
      target: '#programs',
    },
    {
      id: 'personalt',
      title: 'Personal Training',
      image: '/assets/img/img2.jpg',
      description: 'It takes more than pure sweat to achieve your goals. Let our coaches create a personalized workout plan for you.',
      target: '#personalt',
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      image: '/assets/img/img3.jpg',
      description: 'Our team of experienced nutritionists can help you with customized nutrition guides that cater to your needs, bringing you closer to your fitness aspirations.',
      target: '#nutrition',
    },
  ];

  return (
    <section id="services" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white mb-4">
            Experience. Expertise. Excellence.
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
            Three pillars of physical transformation engineered into a seamless gym experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => onNavigate(service.id)}
              className="group relative w-full max-w-[360px] h-[460px] overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer shadow-lg transition-all duration-300 hover:border-neutral-700"
            >
              {/* Background Image with Zoom */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Yellow Indicator Line at Top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 bg-[#FFFF00] w-0 group-hover:w-3/4 transition-all duration-300 z-20" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <div className="transition-transform duration-500 transform group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-2 group-hover:text-[#FFFF00] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity mb-4">
                    {service.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFF00] text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 group-hover:bg-white group-hover:shadow-md">
                    <span>Discover</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
