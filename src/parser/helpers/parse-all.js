"use strict";

import Img from "../nodes/img.js";
import Divider from "../nodes/divider.js";
import Txt from "../nodes/txt.js";
import Group from "../nodes/group.js";
import Cols from "../nodes/cols.js";
import Space from "../nodes/space.js";
import Btn from "../nodes/btn.js";
import Expression from "../nodes/expression.js";

export default function parseAll(parser) {
    while (
        Expression.parse(parser) ||
        Space.parse(parser) ||
        Cols.parse(parser) ||
        Group.parse(parser) ||
        Img.parse(parser) ||
        Divider.parse(parser) ||
        Txt.parse(parser) ||
        Btn.parse(parser)
    );
}
