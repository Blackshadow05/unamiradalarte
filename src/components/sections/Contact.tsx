import { ContactForm } from '@/components/forms/ContactForm';

export function Contact() {
    return (
        <section id="contacto" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Hablemos de tu <span className="text-gradient">Proyecto</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        ¿Tienes una idea en mente? Me encantaría conocer tu visión y ayudarte
                        a crear algo extraordinario que refleje tu personalidad y estilo.
                    </p>
                </div>

                <div id="contacto-form">
                  <ContactForm />
                </div>
            </div>
        </section>
    );
}