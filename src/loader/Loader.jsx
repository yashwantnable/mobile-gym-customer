import "./loader.css";
import { useLoading } from "./LoaderContext";

const Loader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loader__wrapper">
      <div className="outbox-loader">
        {"OUTBOX".split("").map((letter, idx) => (
          <span className="letter" key={idx}>
            {letter}
          </span>
        ))}
        <span className="ball"></span>
      </div>
    </div>
  );
};

export default Loader;