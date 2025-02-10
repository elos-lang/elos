import ImgNode from "../../nodes/ImgNode";
import LineNode from "../../nodes/LineNode";
import TxtNode from "../../nodes/TxtNode";
import GroupNode from "../../nodes/GroupNode";
import ColsNode from "../../nodes/ColsNode";
import SpaceNode from "../../nodes/SpaceNode";
import BtnNode from "../../nodes/BtnNode";
import Parser from "../Parser";
import IncludeNode from "../../nodes/IncludeNode";
import RawNode from "../../nodes/RawNode";

export default function parseBody(parser: Parser) {

  while(
    IncludeNode.parse(parser) ||
    SpaceNode.parse(parser) ||
    ColsNode.parse(parser) ||
    GroupNode.parse(parser) ||
    ImgNode.parse(parser) ||
    LineNode.parse(parser) ||
    TxtNode.parse(parser) ||
    BtnNode.parse(parser) ||
    RawNode.parse(parser)
  );
}
