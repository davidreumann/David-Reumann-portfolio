import React, { useEffect } from 'react';

interface ImpressumProps {
  onBack: () => void;
}

const Impressum: React.FC<ImpressumProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#202124] text-[#bdc1c6] pt-24 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
            onClick={onBack}
            className="mb-8 font-heading text-xl text-[#bdc1c6] hover:text-white uppercase flex items-center gap-2"
        >
            ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6 text-white">Impressum</h1>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
            <section>
                <h2 className="text-xl font-semibold mb-2 text-white">Angaben gemäß § 5 DDG</h2>
                <p>David Reumann</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2 text-white">Vertreten durch:</h2>
                <p>David Reumann</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2 text-white">Kontakt:</h2>
                <p>E-Mail: info@davidreumann.com</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2 text-white">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                <p>Wir nehmen nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil und sind dazu auch nicht verpflichtet.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2 text-white">Haftungsausschluss:</h2>
                
                <h3 className="text-lg font-medium mt-4 mb-2 text-white">Haftung für Inhalte</h3>
                <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

                <h3 className="text-lg font-medium mt-4 mb-2 text-white">Haftung für Links</h3>
                <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

                <h3 className="text-lg font-medium mt-4 mb-2 text-white">Urheberrecht</h3>
                <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
            </section>

            <p className="text-xs text-[#9aa0a6] mt-8">Impressum von Impressum-Generator.de. Powered by Franziska Hasselbach, Bonn.</p>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
