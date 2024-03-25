import { useParams } from "react-router-dom";

const ModulePage = () => {
  const { moduleId } = useParams();
  return (
    <div>
      hey
      <p>module page :D</p>
    </div>
  );
};

export default ModulePage;
