import { useParams } from "react-router-dom";

const ModulePage = () => {
  const { year, module } = useParams();
  console.log(year + " " + module);
  return (
    <div>
      hey
      <p>module page :D</p>
    </div>
  );
};

export default ModulePage;
