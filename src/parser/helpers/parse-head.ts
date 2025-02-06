import Parser from "../Parser";
import IncludeNode from "../nodes/IncludeNode";
import DefNode from "../nodes/DefNode";
import StyleNode from "../nodes/StyleNode";

export default function parseHead(parser: Parser) {

	while(
		DefNode.parse(parser) ||
		StyleNode.parse(parser) ||
		IncludeNode.parse(parser)
	);
}
