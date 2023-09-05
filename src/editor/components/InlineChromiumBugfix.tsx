// Put this at the start and end of an inline component to work around this Chromium bug:

import { FC } from "react";

// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix: FC = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

export default InlineChromiumBugfix;
