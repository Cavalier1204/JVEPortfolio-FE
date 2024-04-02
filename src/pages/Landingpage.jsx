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
          St Joost in Breda, waar ik de richting Photograph, Film and the
          Digital volg. Mijn passie ligt bij het verbeelden van verhalen en
          emoties, en het geven van een stem aan degenen die vaak over het hoofd
          worden gezien. Mijn reis als filmmaker draait om zelfontdekking en het
          vinden van mijn unieke bijdrage aan de kunstwereld.
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
