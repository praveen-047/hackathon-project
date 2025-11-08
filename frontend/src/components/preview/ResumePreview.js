import Template1 from "../templates/Template1";
import Template2 from "../templates/Template2";
import Template3 from "../templates/Template3";

function ResumePreview({ data, template }) {
  if (template === "template2") return <Template2 data={data} />;
  if (template === "template3") return <Template3 data={data} />;
  return <Template1 data={data} />;
}
export default ResumePreview;