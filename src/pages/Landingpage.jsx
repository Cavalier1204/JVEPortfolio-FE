import PortfolioItem from "../components/PortfolioItemCard";

const LandingPage = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <PortfolioItem
        title="Kunstwerk 1"
        time="gisteren"
        description="mooi he"
      />
      <PortfolioItem
        title="Kunstwerk 2"
        time="gisteren"
        description="mooi he"
      />
      <PortfolioItem
        title="Kunstwerk 3"
        time="gisteren"
        description="mooi he"
      />
      <PortfolioItem
        title="Kunstwerk 4"
        time="gisteren"
        description="mooi he"
      />
    </div>
  );
};

export default LandingPage;
