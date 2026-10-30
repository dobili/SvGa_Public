/**
 * Zeigt eine Wiki-Seite (Markdown) als React-Elemente, ohne HTML-Text einzusetzen (Paket D).
 * Abhängigkeiten: markdown.ts.
 */
import { createElement } from "react";
import { bloecke, inline, type Block } from "./markdown";

/** Eine Zeile mit Fett, Code und Links. */
function Zeile({ text }: { text: string }) {
  return (
    <>
      {inline(text).map((teil, i) => {
        if (teil.art === "fett") return <strong key={i}>{teil.text}</strong>;
        if (teil.art === "code") return <code key={i}>{teil.text}</code>;
        if (teil.art === "link") {
          return (
            <a key={i} href={teil.ziel} target="_blank" rel="noreferrer noopener">
              {teil.text}
            </a>
          );
        }
        return <span key={i}>{teil.text}</span>;
      })}
    </>
  );
}

/** Ein Block; Überschriften eine Stufe kleiner, weil die Seite selbst schon h2 trägt. */
function Blockansicht({ block }: { block: Block }) {
  switch (block.art) {
    case "ueberschrift":
      return createElement(`h${Math.min(6, block.ebene + 2)}`, null, <Zeile text={block.text} />);
    case "absatz":
      return (
        <p>
          <Zeile text={block.text} />
        </p>
      );
    case "zitat":
      return (
        <blockquote>
          <Zeile text={block.text} />
        </blockquote>
      );
    case "code":
      return <pre className="admin-code">{block.text}</pre>;
    case "liste":
      return (
        <ul>
          {block.punkte.map((punkt, i) => (
            <li key={i}>
              <Zeile text={punkt} />
            </li>
          ))}
        </ul>
      );
    case "tabelle":
      return (
        <div className="admin-tabelle">
          <table>
            <tbody>
              {block.zeilen.map((zeile, i) => (
                <tr key={i}>
                  {zeile.map((zelle, j) => (
                    <td key={j}>
                      <Zeile text={zelle} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** Die ganze Seite. */
export function Markdown({ text }: { text: string }) {
  return (
    <div className="admin-wikitext">
      {bloecke(text).map((block, i) => (
        <Blockansicht key={i} block={block} />
      ))}
    </div>
  );
}
