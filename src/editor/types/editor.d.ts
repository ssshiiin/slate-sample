import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

import { ParagraphBlock } from "../modules/block/paragraph";
import { BrBlock } from "../modules/block/br";

import { MlgInline } from "../modules/inline/mlg";
import { IInline } from "../modules/inline/i";
import { RefInline } from "../modules/inline/ref";
import { RubyInline } from "../modules/inline/ruby";
import { RtInline } from "../modules/inline/rt";

import { TableBlock } from "../modules/block/table";
import { TrBlock } from "../modules/block/tr";
import { TdBlock } from "../modules/block/td";

import { DefaultText } from "../modules/text/default";
import { DivBlock } from "../modules/block/div";

type CustomInline = MlgInline | IInline | RefInline | RubyInline | RtInline;
type CustomBlock = ParagraphBlock | TableBlock | TrBlock | TdBlock;

type CustomElement = CustomInline | CustomBlock;

type CustomLeaf = DefaultText;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomLeaf;
  }
}
