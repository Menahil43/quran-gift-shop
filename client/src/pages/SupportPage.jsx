import { useState } from 'react';

const SupportPage = ({ title }) => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const renderContent = () => {
    switch (title) {
      case 'Track Your Order':
        return (
          <div className="space-y-8">
            <p className="text-gray-600">Enter your TCS tracking number below to see the status of your delivery.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="TCS Tracking Number (e.g. 123456789)"
                className="flex-1 p-4 bg-beige-soft rounded-2xl outline-none border border-beige-dark focus:ring-2 focus:ring-orange-warm"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <a
                href={`https://www.tcsexpress.com/tracking/number?tracking_number=${trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 text-center rounded-2xl font-bold"
              >
                Track on TCS
              </a>
            </div>
          </div>
        );
      case 'Shipping Policy':
        return (
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h3 className="text-xl font-bold text-navy mb-2">Delivery Time</h3>
              <p>Standard delivery across Pakistan takes 3-5 working days. For major cities like Karachi, Lahore, and Islamabad, delivery may occur within 48 hours.</p>
            </section>
            <section>
              <h3 className="text-xl font-bold text-navy mb-2">Shipping Charges</h3>
              <p>Flat shipping fee of Rs. 350 applies to all orders.</p>
            </section>
            <section>
              <h3 className="text-xl font-bold text-navy mb-2">Courier Partners</h3>
              <p>We primarily use TCS Courier to ensure your precious gifts reach you safely and on time.</p>
            </section>
          </div>
        );
      case 'Privacy Policy':
        return (
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>At Quran Gift Shop, we value your privacy. We only collect necessary information to process your orders and improve your shopping experience.</p>
            <section>
              <h3 className="text-xl font-bold text-navy mb-2">Data Protection</h3>
              <p>Your personal details like address and phone number are used strictly for delivery purposes and are never shared with third parties except courier services.</p>
            </section>
          </div>
        );
      case 'Terms of Service':
        return (
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h3 className="text-xl font-bold text-navy mb-2">Ordering</h3>
              <p>By placing an order, you agree to pay the 50% advance amount as per our payment policy.</p>
            </section>
            <section>
              <h3 className="text-xl font-bold text-navy mb-2">Personalization</h3>
              <p>Customized items (with names/calligraphy) cannot be returned unless there is a physical defect in the product.</p>
            </section>
          </div>
        );
      case 'Frequently Asked Questions':
        return (
          <div className="space-y-6">
            {[
              { q: "How can I personalize my gift set?", a: <>You can add custom names or messages to our Bridal Sets. <a href="https://wa.me/923151645896" className="text-orange-warm font-bold hover:underline">Contact us on WhatsApp</a> for custom calligraphy options.</> },
              { q: "Is Cash on Delivery available?", a: "Yes, we offer COD across Pakistan for the remaining 50% of the payment." },
              { q: "What is your return policy?", a: "We offer a 7-day return policy for any non-customized damaged items." }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-beige-soft rounded-2xl border border-beige-dark">
                <h4 className="font-bold text-navy mb-2">Q: {faq.q}</h4>
                <p className="text-gray-600 text-sm">A: {faq.a}</p>
              </div>
            ))}
          </div>
        );
      case 'Contact Us':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-navy mb-4">Get in Touch</h3>
                <p className="text-gray-600 leading-relaxed">
                  Have a question about a product, personalization, or bulk orders? We're here to help!
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-navy">
                  <div className="w-12 h-12 bg-orange-warm/10 flex items-center justify-center rounded-full text-orange-warm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold">WhatsApp/Phone</p>
                    <p className="text-gray-600">+92 315 1645896</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-navy">
                  <div className="w-12 h-12 bg-orange-warm/10 flex items-center justify-center rounded-full text-orange-warm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold">Email</p>
                    <p className="text-gray-600">qurangiftboxes@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <form
              className="space-y-4 bg-beige-soft p-8 rounded-3xl border border-beige-dark"
              onSubmit={(e) => {
                e.preventDefault();
                const name = e.target.name.value;
                const message = e.target.message.value;
                const whatsappUrl = `https://wa.me/923151645896?text=Hi, my name is ${encodeURIComponent(name)}.%0A%0A${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              <div>
                <label className="block text-sm font-bold text-navy mb-2">Name</label>
                <input required name="name" type="text" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-orange-warm transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-2">Message</label>
                <textarea required name="message" rows="4" className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-orange-warm transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full btn-primary py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                Send via WhatsApp
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </form>
          </div>
        );
      default:
        return <p>Content coming soon...</p>;
    }
  };

  return (
    <div className="pt-32 pb-20 bg-beige-soft min-h-screen px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-beige-dark">
        <h1 className="text-4xl font-serif font-bold text-navy mb-12">{title}</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default SupportPage;
