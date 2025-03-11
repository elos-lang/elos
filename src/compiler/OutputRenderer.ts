import OutputBuffer from "./OutputBuffer";
import Store from "../runtime/Store";
import {AttributeValue} from "../types/attribute";

export default class OutputRenderer {

	render(buffer: OutputBuffer, variables: Store<AttributeValue>) {
		return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<!--<![endif]-->
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
			<style type="text/css">
			  * { padding: 0; margin: 0; }
			  #outlook a { padding:0; }
			  body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
			  table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
			  img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
			  p { display:block;margin:13px 0; }
			</style>
		${buffer.getHead()}
	</head>
	<body bgcolor="${variables.get('bgcolor')}">
		${buffer.getBody()}
	</body>
</html>
        `;
	}
}
