import { RuleSet } from "../ruleset";

export const msh: RuleSet = new RuleSet("MSH", "Message Header", "1");

msh.addChild(
  new RuleSet("EncodingChars", "Encoding Characters of this Message", "1")
); // 0 + 1

const msh2 = new RuleSet("sApp", "Sending Application", "1");
msh2.addChild(new RuleSet("id", "Namespace ID", "1"));
msh2.addChild(new RuleSet("uid", "Universal ID", "+"));
msh2.addChild(new RuleSet("idtype", "Universal ID Type", "+"));
msh.addChild(msh2); // 2

msh.addChild(msh2.cloneRuleSet("sFacc", "Sending Faccility", "1")); // 3
msh.addChild(msh2.cloneRuleSet("rApp", "Receiving Application", "1")); // 4
msh.addChild(msh2.cloneRuleSet("rFacc", "Receiving Faccility", "1")); // 3

const dt = new RuleSet("dt", "Date Time of Message", "1");
dt.addChild(new RuleSet("t", "Time", "1"));
dt.addChild(new RuleSet("precision", "Degree of Precision", "1+"));
msh.addChild(dt);

msh.addChild(new RuleSet("sec", "Security", "+"));

const msgType = new RuleSet("type", "Message Type", "1");
msgType.addChild(new RuleSet("code", "Message Type Code", "1"));
msgType.addChild(new RuleSet("event", "Message Trigger Event", "1"));
msgType.addChild(new RuleSet("struc", "Message Structure", "+"));
msh.addChild(msgType);

msh.addChild(new RuleSet("mid", "MEssage Controll ID", "1"));
msh.addChild(new RuleSet("ptype", "Processing TID", "1"));
msh.addChild(new RuleSet("version", "Version ID", "1"));

msh.addChild(new RuleSet("sequence", "Sequence Number", "+"));
msh.addChild(new RuleSet("conpointer", "Continuation Pointer", "+"));
msh.addChild(new RuleSet("accat", "Accept Acknowledgment Type", "+"));
msh.addChild(new RuleSet("appat", "Application Acknowledgment Type", "+"));
msh.addChild(new RuleSet("country", "Country Code", "+"));
msh.addChild(new RuleSet("charset", "Character Set", "+"));
