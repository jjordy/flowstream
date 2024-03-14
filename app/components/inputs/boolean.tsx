import { FC } from "hono/jsx";

export const BooleanInput: FC = ({ question }) => {
  return (
    <div className="flex items-center space-x-4">
      <input
        type="checkbox"
        name={question.key}
        id={`id_${question.key}`}
        placeholder={question.content?.placeholder}
        className="h-7 w-7 accent-sky-400"
      />
      <label for={`id_${question.key}`}>{question.content.text}</label>
    </div>
  );
};
