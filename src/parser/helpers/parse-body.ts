import Img from "../nodes/ImgNode";
import LineNode from "../nodes/LineNode";
import Txt from "../nodes/TxtNode";
import GroupNode from "../nodes/GroupNode";
import ColsNode from "../nodes/ColsNode";
import Space from "../nodes/SpaceNode";
import Btn from "../nodes/BtnNode";
import Parser from "../Parser";
import IncludeNode from "../nodes/IncludeNode";

export default function parseBody(parser: Parser) {

  while(
    IncludeNode.parse(parser) ||
    Space.parse(parser) ||
    ColsNode.parse(parser) ||
    GroupNode.parse(parser) ||
    Img.parse(parser) ||
    LineNode.parse(parser) ||
    Txt.parse(parser) ||
    Btn.parse(parser)
  );
}
