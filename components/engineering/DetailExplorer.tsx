import { detailStudy as copy } from "@/content/detail-study";
import { DetailDrawing } from "./DetailDrawing";

/** Native radio controls preserve selection and keyboard behavior without JS. */
export function DetailExplorer({ id }: { id: string }) {
  return (
    <fieldset className="detail-explorer" aria-describedby={`${id}-note`}>
      <legend className="sr-only">{copy.controls}</legend>
      <div className="detail-visual">
        <div className="detail-visual-heading eyebrow">
          <span>{copy.figureLabel}</span>
          <span>{copy.status}</span>
        </div>
        <DetailDrawing />
      </div>
      <div className="detail-reading">
        <div className="detail-selectors">
          {copy.options.map((option, i) => (
            <label className="detail-selector" key={option.id}>
              <input
                type="radio"
                name={`${id}-layer`}
                value={option.id}
                defaultChecked={i === 0}
                aria-describedby={`${id}-${option.id}`}
              />
              <span className="eyebrow">{option.number}</span>
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <div className="detail-explanations">
          {copy.options.map((option) => (
            <div
              key={option.id}
              id={`${id}-${option.id}`}
              className={`detail-explanation explanation-${option.id}`}
            >
              <p className="detail-explanation-title">{option.title}</p>
              <p className="text-sm text-muted leading-relaxed">
                {option.text}
              </p>
              <p className="eyebrow text-accent mt-5">{option.reference}</p>
            </div>
          ))}
        </div>
        <p id={`${id}-note`} className="detail-note">
          {copy.note}
        </p>
      </div>
    </fieldset>
  );
}
