import { Descendant, Editor, Element, Text } from "slate";
import {
  ParagraphBlockActions,
  ParagraphBlockSerializer,
} from "../modules/block/paragraph";
import { RefInlineActions, RefInlineSerializer } from "../modules/inline/ref";
import { MlgInlineActions, MlgInlineSerializer } from "../modules/inline/mlg";
import { DefaultTextSerializer } from "../modules/text/default";
import {
  RubyInlineActions,
  RubyInlineSerializer,
} from "../modules/inline/ruby";
import { RtInlineActions, RtInlineSerializer } from "../modules/inline/rt";
import { IInlineActions, IInlineSerializer } from "../modules/inline/i";
import {
  TableBlockActions,
  TableBlockSerializer,
} from "../modules/block/table";
import { TrBlockActions, TrBlockSerializer } from "../modules/block/tr";
import { TdBlockActions, TdBlockSerializer } from "../modules/block/td";

export const serialize = (editor: Editor, descendant: Descendant[]) => {
  return descendant.map(recursivelySerialize(editor)).join("<br/>");
};

const serializeForInline = (editor: Editor, descendant: Descendant[]) => {
  return descendant.map(recursivelySerialize(editor)).join("");
};

const recursivelySerialize =
  (editor: Editor) =>
  (descendant: Descendant): string => {
    if (Text.isText(descendant)) {
      const serializer = TextSerializerFactory(descendant);
      return serializer.serialize();
    }

    if (Editor.isBlock(editor, descendant)) {
      const serializer = ElementSerializerFactory(descendant);
      return (
        serializer.serialize().opening +
        serializeForInline(editor, serializer.getChildren()) +
        serializer.serialize().closing
      );
    }

    if (Editor.isInline(editor, descendant)) {
      const serializer = ElementSerializerFactory(descendant);
      return (
        serializer.serialize().opening +
        serializeForInline(editor, serializer.getChildren()) +
        serializer.serialize().closing
      );
    }

    throw new Error("Invalid descendant");
  };

export type Tag = {
  opening: string;
  closing: string;
};

export interface ElementSerializer {
  serialize: () => Tag;
  getChildren: () => Descendant[];
}

export interface TextSerializer {
  serialize: () => string;
}

const ElementSerializerFactory = (descendant: Element): ElementSerializer => {
  if (new TableBlockActions().is(descendant)) {
    return new TableBlockSerializer(descendant);
  }
  if (new TrBlockActions().is(descendant)) {
    return new TrBlockSerializer(descendant);
  }
  if (new TdBlockActions().is(descendant)) {
    return new TdBlockSerializer(descendant);
  }
  if (new ParagraphBlockActions().is(descendant)) {
    return new ParagraphBlockSerializer(descendant);
  }
  if (new RefInlineActions().is(descendant)) {
    return new RefInlineSerializer(descendant);
  }
  if (new RubyInlineActions().is(descendant)) {
    return new RubyInlineSerializer(descendant);
  }
  if (new MlgInlineActions().is(descendant)) {
    return new MlgInlineSerializer(descendant);
  }
  if (new RtInlineActions().is(descendant)) {
    return new RtInlineSerializer(descendant);
  }
  if (new IInlineActions().is(descendant)) {
    return new IInlineSerializer(descendant);
  }
  const never: never = descendant;
  throw new Error(`This code should not be called: ${never}`);
};

const TextSerializerFactory = (descendant: Text): TextSerializer => {
  return new DefaultTextSerializer(descendant);
};
