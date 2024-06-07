const LandingPage = () => {
  return (
    <div className="w-full flex flex-col justify-center mb-10">
      <img
        src="/04a5c76b-ccd9-47d2-8f09-fd05050725ab.jpg"
        className="rounded mx-auto mb-10 mt-5"
        height={400}
        width={400}
      />
      <div className="w-1/6 bg-[#b5bab6] mx-auto landingline" height={2} />
      <div className="w-1/2 mx-auto m-10 text-offblack text-center">
        <p>Welkom op mijn ontwikkelingsportfolio!</p>
        <br />
        <p>
          Mijn naam is Jana van Eijk en ik ben een student aan de Kunstacademie
          St Joost in Breda, waar ik de richting Fotografie, Film en Digital
          volg.
        </p>

        <br />
        <p>
          Als maker van beeld en inhoud koester ik een diepgaand bewustzijn van
          de noodzaak om een stem te geven aan degenen die niet worden gezien of
          gehoord in onze samenleving. Mijn werk fungeert als een platform voor
          mensen die vaak worden genegeerd of gemarginaliseerd, en als een bron
          van troost en herkenning voor degenen die leven met angst voor hun
          gevoelens, gedachten en ervaringen.
        </p>

        <br />
        <p>
          Ik maak gebruik van verschillende media, afhankelijk van het verhaal
          en doel. Mijn meest gebruikte medium is film. Ik geloof dat film de
          diepere gedachten en gevoelens kan overbrengen die bij andere media
          moeilijker te bereiken zijn zonder te vervallen in abstractie. Mijn
          inspiratie komt voort uit mijn sterke emoties tegen de oneerlijkheid
          in de wereld. Dit spoort me aan om op te komen voor degenen in een
          kwetsbare positie en om de redenen achter de ongelijkheid in macht te
          onderzoeken.
        </p>

        <br />
        <p>
          Door middel van deze website wil ik mijn ontwikkeling gedurende mijn
          studiejaren documenteren. Ik ben voortdurend op zoek naar mijn
          identiteit als maker en naar de verhalen die ik wil vertellen. Ik
          nodig je uit om samen met mij door mijn creatieve ontwikkeling te
          reizen en te ontdekken hoe mijn visie zich ontvouwt.
        </p>
      </div>
      <div className="w-1/6 bg-[#b5bab6] mx-auto landingline2" height={2} />
    </div>
  );
};

export default LandingPage;
