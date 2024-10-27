const LandingPage = () => {
  return (
    <div
      className="w-full flex flex-col lg:flex-row bg-[#222222] text-white"
      style={{ minHeight: "calc(100vh - 80px)", height: "fit-content" }}
    >
      <div className="relative w-full lg:w-1/2 order-1 lg:order-2">
        <img
          src="/artist_photo.jpg"
          alt="Artist"
          className="w-full lg:absolute lg:right-0 object-cover lg:h-full"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#222222] to-transparent lg:h-full lg:w-1/3 lg:bg-gradient-to-r" />
      </div>

      <div className="relative w-full lg:w-1/2 flex flex-col items-center p-4 lg:p-10 lg:pl-20 order-2 lg:order-1 justify-center">
        <div
          className="w-1/6 bg-[#b5bab6] mx-auto lg:mx-0"
          style={{ height: "2px" }}
        />

        <div className="w-5/6 text-center lg:text-left mt-4 lg:mt-8">
          <p className="text-2xl lg:text-4xl font-semibold">
            Welkom op mijn ontwikkelingsportfolio!
          </p>
          <p className="mt-4 lg:mt-8 text-lg lg:text-xl leading-relaxed">
            Mijn naam is Jana van Eijk en ik ben een student aan de
            Kunstacademie St Joost in Breda, waar ik de richting Fotografie,
            Film en Digital volg.
          </p>

          <p className="mt-4 lg:mt-6 text-lg lg:text-xl leading-relaxed">
            In mijn werk als filmmaker streef ik ernaar om fictieve en
            documentaire films te creëren die de levens van de genegeerde en
            gemarginaliseerde mensen belichten.
          </p>

          <p className="mt-4 lg:mt-6 text-lg lg:text-xl leading-relaxed">
            Film biedt mij de kans om gelaagde verhalen te vertellen die
            uitnodigen tot zelfreflectie en tot het verbinden tussen (groepen)
            mensen. Mijn films zijn ontworpen om impact te maken; ik wil dat ze
            de kijker raken en aanzetten tot nadenken over heftige en complexe
            onderwerpen. Door discussies te stimuleren, hoop ik begrip tussen
            mensen te bevorderen.
          </p>

          <p className="mt-4 lg:mt-6 text-lg lg:text-xl leading-relaxed">
            Afhankelijk van het thema van mijn film kies ik de ervaring die ik
            de kijker wil bieden. Ik wil troost en herkenning bieden aan mensen
            die soortgelijke situaties meemaken, wat kan bijdragen aan begrip
            voor degenen die worstelen met deze angsten of persoonlijke
            uitdagingen. Het kan de kijker een breder perspectief geven door hen
            een andere kant van het verhaal te tonen, wat hen kan inspireren tot
            actie, hoewel dat niet altijd noodzakelijk is.
          </p>

          <p className="mt-4 lg:mt-6 text-lg lg:text-xl leading-relaxed">
            Mijn motivatie is ontstaan uit persoonlijke ervaringen met onmacht
            (zoals ziekte, seksisme en grensoverschrijdend gedrag) en een sterk
            rechtvaardigheidsgevoel. Ik kaart thema’s als migratie,
            revalidatieprocessen en vervreemding aan, en gebruik film als medium
            om de complexiteit van deze verhalen vast te leggen. De uitdaging om
            meerdere frames vast te leggen die de juiste boodschap overbrengen,
            voedt mijn perfectionisme en houdt het creatieve proces voor mij
            levendig.
          </p>

          <p className="mt-4 lg:mt-6 text-lg lg:text-xl leading-relaxed">
            Mijn ideeën voor films ontstaan uit de verhalen van anderen. De
            ervaringen en woorden van mensen inspireren mij en zetten me aan tot
            onderzoek naar de betekenis ervan in de samenleving.
          </p>

          <p className="mt-4 lg:mt-6 text-lg lg:text-xl leading-relaxed">
            Ik haal veel inspiratie uit makers die door subtiele verhalen en
            beelden bewustwording creëren. Christine Spengler vertelt
            bijvoorbeeld met dubbele fotografie hoe kinderen hun onschuld
            verliezen. Dat zet me aan om verder te kijken dan mijn eigen
            perspectief. Ook Matteo Garrone raakt me, vooral met Io Capitano,
            waarin hij door de reis van zijn personages begrip oproept voor hun
            situatie en de westerse wereld bewust maakt van de realiteit.
            Charlotte Wells inspireert me met Aftersun, waar ze emoties heel
            puur en zonder overdreven details laat zien. Dit soort eerlijkheid
            en diepgang wil ik ook in mijn werk bereiken.
          </p>
        </div>

        <div
          className="w-1/6 bg-[#b5bab6] mx-auto lg:mx-0 mt-4 lg:mt-8"
          style={{ height: "2px" }}
        />
      </div>
    </div>
  );
};

export default LandingPage;
