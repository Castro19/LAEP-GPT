import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = new MarkdownIt({ linkify: true, breaks: true });
const defaultLinkRenderer =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet("target", "_blank");
  tokens[idx].attrSet("rel", "noopener noreferrer");
  return defaultLinkRenderer(tokens, idx, options, env, self);
};

const renderMarkdown = (raw: string) => {
  const dirtyHtml = md.render(raw || "");
  return DOMPurify.sanitize(dirtyHtml, { ADD_ATTR: ["target", "rel"] });
};

interface FormattedChatMessageProps {
  msg: string;
  variant?: string;
}

const FormattedChatMessage = ({ msg, variant }: FormattedChatMessageProps) => {
  return (
    <div className={`rounded-lg shadow-lg px-3 py-4 ${variant}`}>
      <div
        className="prose prose-invert weekly-planner-tables"
        style={{ maxWidth: "100%" }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg) }}
      />
    </div>
  );
};

export default FormattedChatMessage;
