"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msh = void 0;
const ruleset_1 = require("../ruleset");
exports.msh = new ruleset_1.RuleSet("MSH", "Message Header", "1");
exports.msh.addChild(new ruleset_1.RuleSet("EncodingChars", "Encoding Characters of this Message", "1")); // 0 + 1
const msh2 = new ruleset_1.RuleSet("sApp", "Sending Application", "1");
msh2.addChild(new ruleset_1.RuleSet("id", "Namespace ID", "1"));
msh2.addChild(new ruleset_1.RuleSet("uid", "Universal ID", "+"));
msh2.addChild(new ruleset_1.RuleSet("idtype", "Universal ID Type", "+"));
exports.msh.addChild(msh2); // 2
exports.msh.addChild(msh2.cloneRuleSet("sFacc", "Sending Faccility", "1")); //3
exports.msh.addChild(msh2.cloneRuleSet("rApp", "Receiving Application", "1")); //4
exports.msh.addChild(msh2.cloneRuleSet("rFacc", "Receiving Faccility", "1")); //3
const dt = new ruleset_1.RuleSet("dt", "Date Time of Message", "1");
dt.addChild(new ruleset_1.RuleSet("t", "Time", "1"));
dt.addChild(new ruleset_1.RuleSet("precision", "Degree of Precision", "1+"));
exports.msh.addChild(dt);
exports.msh.addChild(new ruleset_1.RuleSet("sec", "Security", "+"));
const msgType = new ruleset_1.RuleSet("type", "Message Type", "1");
msgType.addChild(new ruleset_1.RuleSet("code", "Message Type Code", "1"));
msgType.addChild(new ruleset_1.RuleSet("event", "Message Trigger Event", "1"));
msgType.addChild(new ruleset_1.RuleSet("struc", "Message Structure", "+"));
exports.msh.addChild(msgType);
exports.msh.addChild(new ruleset_1.RuleSet("mid", "MEssage Controll ID", "1"));
exports.msh.addChild(new ruleset_1.RuleSet("ptype", "Processing TID", "1"));
exports.msh.addChild(new ruleset_1.RuleSet("version", "Version ID", "1"));
exports.msh.addChild(new ruleset_1.RuleSet("sequence", "Sequence Number", "+"));
exports.msh.addChild(new ruleset_1.RuleSet("conpointer", "Continuation Pointer", "+"));
exports.msh.addChild(new ruleset_1.RuleSet("accat", "Accept Acknowledgment Type", "+"));
exports.msh.addChild(new ruleset_1.RuleSet("appat", "Application Acknowledgment Type", "+"));
exports.msh.addChild(new ruleset_1.RuleSet("country", "Country Code", "+"));
exports.msh.addChild(new ruleset_1.RuleSet("charset", "Character Set", "+"));
//# sourceMappingURL=rule_msh.js.map