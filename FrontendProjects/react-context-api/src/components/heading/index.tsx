import { useContext } from "react";
import { levelContext } from "../../context/levelContext";
import "../heading/styles.css"

export default function Heading({ children }: { children: JSX.Element | string}){
  const level = useContext(levelContext);

  switch (level) {
    case 1:
      return <h1 className="Heading-Element">{children}</h1>;
    case 2:
      return <h2 className="Heading-Element">{children}</h2>;
    case 3:
      return <h3 className="Heading-Element">{children}</h3>;
    case 4:
      return <h4 className="Heading-Element">{children}</h4>;
    case 5:
      return <h5 className="Heading-Element">{children}</h5>;
    case 6:
      return <h6 className="Heading-Element">{children}</h6>;
    default:
      throw Error("Unknown level: " + level);
  }
}
