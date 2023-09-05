import { Descendant } from "slate";
import { jsx } from "slate-hyperscript";
import { CustomElement } from "../types/editor";
import {
  TableBlockActions,
  TableBlockDeserializer,
} from "../modules/block/table";
import { TrBlockActions, TrBlockDeserializer } from "../modules/block/tr";
import { TdBlockActions, TdBlockDeserializer } from "../modules/block/td";
import {
  ParagraphBlockActions,
  ParagraphBlockDeserializer,
} from "../modules/block/paragraph";
import { RefInlineActions, RefInlineDeserializer } from "../modules/inline/ref";
import {
  RubyInlineActions,
  RubyInlineDeserializer,
} from "../modules/inline/ruby";
import { MlgInlineActions, MlgInlineDeserializer } from "../modules/inline/mlg";
import { RtInlineActions, RtInlineDeserializer } from "../modules/inline/rt";
import { IInlineActions, IInlineDeserializer } from "../modules/inline/i";
import { DefaultTextDeserializer } from "../modules/text/default";

export const deserialize = (xml: string): Descendant[] => {
  if (xml === "") {
    return [jsx("element", { type: "paragraph" }, [jsx("text", { text: "" })])];
  }

  const blocks = xml.split("<br/>");
  return blocks.map((block) => {
    const dom = new DOMParser().parseFromString(block, "text/html");
    if (
      dom.body.childNodes.length === 1 &&
      dom.body.childNodes[0].nodeType === Node.TEXT_NODE
    ) {
      return jsx("element", { type: "paragraph" }, [
        jsx("text", { text: dom.body.childNodes[0].textContent }),
      ]);
    }
    if (
      dom.body.childNodes.length === 1 &&
      dom.body.childNodes[0].nodeType !== Node.TEXT_NODE &&
      dom.body.childNodes[0].nodeName === "TABLE"
    ) {
      return recursiveDeserialize(dom.body.childNodes[0]);
    }
    return jsx(
      "element",
      { type: "paragraph" },
      Array.from(dom.body.childNodes).map(recursiveDeserialize),
    );
  });
};

export const recursiveDeserialize = (node: ChildNode): Descendant => {
  if (node.nodeType === Node.TEXT_NODE) {
    const deserializer = TextDeserializerFactory(node);
    return deserializer.deserialize();
  }

  if (!(node instanceof HTMLElement)) {
    throw new Error(`This node is HTMLElement: ${node}`);
  }

  const deserializer = ElementDeserializerFactory(node);
  return deserializer.deserialize(recursiveDeserialize);
};

export interface ElementDeserializer {
  deserialize: (recursive: (node: ChildNode) => Descendant) => Descendant;
}

export interface TextDeserializer {
  deserialize: () => Descendant;
}

const ElementDeserializerFactory = (node: HTMLElement): ElementDeserializer => {
  const nodeName = node.nodeName.toLowerCase() as CustomElement["type"];

  if (nodeName === new TableBlockActions().getType()) {
    return new TableBlockDeserializer(node);
  }
  if (nodeName === new TrBlockActions().getType()) {
    return new TrBlockDeserializer(node);
  }
  if (nodeName === new TdBlockActions().getType()) {
    return new TdBlockDeserializer(node);
  }
  if (nodeName === new ParagraphBlockActions().getType()) {
    return new ParagraphBlockDeserializer(node);
  }
  if (nodeName === new RefInlineActions().getType()) {
    return new RefInlineDeserializer(node);
  }
  if (nodeName === new RubyInlineActions().getType()) {
    return new RubyInlineDeserializer(node);
  }
  if (nodeName === new MlgInlineActions().getType()) {
    return new MlgInlineDeserializer(node);
  }
  if (nodeName === new RtInlineActions().getType()) {
    return new RtInlineDeserializer(node);
  }
  if (nodeName === new IInlineActions().getType()) {
    return new IInlineDeserializer(node);
  }
  const never: never = nodeName;
  throw new Error(`This code should not be called: ${never}`);
};

const TextDeserializerFactory = (node: ChildNode): TextDeserializer => {
  return new DefaultTextDeserializer(node);
};
