import { FC } from "hono/jsx";

export const TextInput: FC = ({ question }) => {
  return (
    <div className="space-y-2">
      <label for={`id_${question.key}`}>{question.content.text}</label>
      <input
        name={question.key}
        id={`id_${question.key}`}
        placeholder={question.content?.placeholder}
        className="input"
      />
    </div>
  );
};
