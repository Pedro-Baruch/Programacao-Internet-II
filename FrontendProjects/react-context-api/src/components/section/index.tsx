import { useContext } from "react";
import { levelContext } from "../../context/levelContext";
import "../section/styles.css"

export default function Section({ children }: { children: JSX.Element[]}) {
  const level = useContext(levelContext)
  return (
    <section className="Section-Element">
      <levelContext.Provider value={level}>
        {children}
      </levelContext.Provider>
    </section>
  );
}
