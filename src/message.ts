import { Structure } from "./structure";
import { RuleSet } from "./ruleset";
import { Part } from "./part";
import decoder from "./decoder";

export class Message extends Structure<Part> {
  private messageChars = "|^~\\&";

  private msgRuleSet: RuleSet | null = null;

  constructor(content?: string | Date | unknown) {
    super(undefined, undefined);
    if (content instanceof RuleSet) {
      this.msgRuleSet = content as RuleSet;
    } else if (content !== undefined) {
      this.parse(content, undefined);
    } else {
      this.addPart(new Part(`MSH${this.messageChars}`));
    }
  }

  public getMessageChars(idx?: number): string {
    if (idx === undefined || idx < 0 || idx > 4) {
      return this.messageChars;
    }
    return this.messageChars.substring(idx, idx + 1);
  }

  parse(content: string | Date | unknown, parent?: Structure<any> | number) {
    if (content instanceof Buffer) {
      // PreFlight for Encoding in Buffer
      content = Message.encodingPreFlight(content);
    }
    super.parse(content, parent);
  }

  private static encodingPreFlight(buffer: Buffer): string {
    let msgStr = buffer.toString();
    if (msgStr.startsWith("MSH") && msgStr.length > 5) {
      const mySplit = msgStr.substring(3, 4);
      const parts = msgStr.split(mySplit);
      let encoding: string | null = null;
      if (parts.length >= 19) {
        encoding = parts[18];
      }
      if (
        encoding !== null &&
        encoding !== "" &&
        encoding !== "UNICODE UTF-8"
      ) {
        msgStr = decoder(buffer, encoding);
      }
    }
    return msgStr;
  }

  public msh(): Part {
    for (let idx = 0; idx < this.length(); idx += 1) {
      const part: Part = this.childAtIndex(idx);
      if (part.type !== null && part.type.toUpperCase() === "MSH") {
        return part;
      }
    }
    // insert a msh at first position
    const msh = new Part("MSH|");
    this.insertChild(msh, 0);
    return msh;
  }

  public addPart(part: Part) {
    this.addChild(part);
  }

  joinChar(): string | Array<string> {
    return "\r";
  }

  splitChar(): string | Array<string> {
    return ["\r\n", "\r", "\n"];
  }

  removeLastJoinChar(): boolean {
    return false;
  }

  escapeChar(): string | null {
    return null;
  }

  createChildStructure(content?: string | Date | unknown): Part {
    return new Part(content, this);
  }

  ruleSet(): RuleSet | null {
    return this.msgRuleSet;
  }

  chars(): string {
    return this.messageChars;
  }

  parseParts(content: string | Date | unknown): string[] {
    const parseParts = super.parseParts(content);
    for (let i = 0; i < parseParts.length; i += 1) {
      if (
        parseParts[i].length > 9 &&
        parseParts[i].toUpperCase().startsWith("MSH")
      ) {
        const length = 5;
        const tc = parseParts[i].substring(3, 3 + 1);
        let c = parseParts[i].substring(3, 3 + length);
        if (c.indexOf(tc) > 0) {
          // TODO:
          c =
            c.substring(0, c.indexOf(tc)) +
            this.messageChars.substring(c.indexOf(tc));
        }
        this.messageChars = c;
        i = parseParts.length; // abort
      }
    }
    // remove empty at the End
    while (parseParts[parseParts.length - 1] === "") {
      parseParts.splice(parseParts.length - 1, 1);
    }
    return parseParts;
  }

  fieldForKey(key: number | string, create = true): Structure<any> | null {
    let item = 0;
    if (typeof key === "string" && key.indexOf("[") >= 0) {
      item = Math.max(
        0,
        parseInt(key.substring(key.indexOf("[") + 1, key.indexOf("]")), 10) - 1
      );
      key = key.substring(0, key.indexOf("["));
    }

    const keyNr: number = typeof key === "string" ? parseInt(key, 10) : key;
    if (Number.isInteger(keyNr)) {
      return this.fieldAtIndex(keyNr - 1, create);
    }
    if (typeof key === "string") {
      let found = -1;
      for (let i = 0; i < this.length(); i += 1) {
        const loopPart: Part = this.childAtIndex(i);
        if (loopPart.type.toUpperCase() === key.toUpperCase()) {
          found += 1;
          if (found === item) {
            return loopPart;
          }
        }
      }
      if (create) {
        const part: Part = new Part(undefined, this);
        part.type = key;

        /* TODO apply Rule set, sample:
             var ruleSet = RuleSet.getRuleSet(key);
              if (ruleSet!=null) {
                  ruleSet.applyRuleSet(part);
              }
        */

        this.addChild(part);
        return part;
      }
      return null;
    }
    return null;
  }

  protected extractParts(selector: string | Array<string>) {
    if (typeof selector === "string") {
      // TODO: convert path using ruleSet!?!
      const isMSH = selector.toLowerCase().startsWith("msh");
      const parts = selector.replace("-", ".").split(".");
      if (isMSH) {
        if (parts[1].indexOf("[") >= 0) {
          const item = Math.max(
            0,
            parseInt(
              parts[1].substring(
                parts[1].indexOf("[") + 1,
                parts[1].indexOf("]")
              ),
              10
            )
          );
          const key = parts[1].substring(0, parts[1].indexOf("["));
          parts[1] = `${parseInt(key, 10) - 1}[${item}]`;
        } else {
          // MSH Fields are one off - due to the numbering of the Seperator String!
          parts[1] = `${parseInt(parts[1], 10) - 1}`;
        }
      }
      return parts;
    }
    return selector;
  }

  public debug() {
    return this.render().replace(/\r/g, "\n");
  }

  public static formatDate(dt?: Date): string {
    if (!(dt instanceof Date)) {
      dt = new Date();
    }
    return `${dt.getFullYear()}${`0${dt.getMonth() + 1}`.slice(
      -2
    )}${`0${dt.getDate()}`.slice(-2)}${`0${dt.getHours()}`.slice(
      -2
    )}${`0${dt.getMinutes()}`.slice(-2)}${`0${dt.getSeconds()}`.slice(-2)}`;
  }

  public static createResponse(
    source: Message | string | unknown,
    code?: string,
    message?: string
  ): Message {
    const msg: Message =
      source instanceof Message ? source : new Message(source);

    code = code || "AA";
    message = message || "";
    const ack = new Message(msg.msh().render());
    const msgId = ack.getString("MSH-10");
    const app = ack.getString("MSH-3");
    const facc = ack.getString("MSH-4");
    const dt = Message.formatDate(new Date());
    const nid = (dt + Math.random()).substring(0, 22);
    ack.set("MSH-3", ack.getString("MSH-5"));
    ack.set("MSH-4", ack.getString("MSH-6"));
    ack.set("MSH-5", app);
    ack.set("MSH-6", facc);
    ack.set("MSH-7", dt);
    ack.set("MSH-9", "ACK");
    ack.set("MSH-10", nid);

    // AS
    ack.set("MSA-1", code);
    ack.set("MSA-2", msgId);
    ack.set("MSA-3", message);
    return ack;
  }
}
