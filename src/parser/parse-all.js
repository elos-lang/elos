"use strict";

import Img from "./nodes/img.js";
import Divider from "./nodes/divider.js";
import Txt from "./nodes/txt.js";
import Group from "./nodes/group.js";
import Cols from "./nodes/cols.js";
import Space from "./nodes/space.js";

export default function parseAll(parser) {
    while (
        Space.parse(parser) ||
        Cols.parse(parser) ||
        Group.parse(parser) ||
        Img.parse(parser) ||
        Divider.parse(parser) ||
        Txt.parse(parser)
    );
}
