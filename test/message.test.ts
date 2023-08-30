import { expect } from "chai";
import { Message } from "../src/message";
import { Part } from "../src/part";

describe("Message", function () {
  describe("Test Message Parsing", function () {
    it("should have Message Chars on new Element", function () {
      const msg = new Message();
      expect(msg.render()).to.be.eq("MSH|^~\\&|\r");
      expect(msg.getString("MSH-1")).to.eq("|");
      expect(msg.getString("MSH-2")).to.eq("^~\\&");
    });

    it("should respect Message Chars", function () {
      const msg2 = new Message(
        "MSH$(~\\&$SOME$SYSTEM$ANOTHER$SYSTEM$20210301090416$$ORM(R01$1000000$P$2.5$$$AL$NE$$8859/15$\n"
      );
      expect(msg2.getString("MSH-3")).to.eq("SOME");
      expect(msg2.getString("MSH-9.1")).to.eq("ORM");
      expect(msg2.getString("MSH-9.2")).to.eq("R01");
    });

    it("should not be Empty Message Chars", function () {
      const msg2 = new Message(
        "MSH$(~\\&$SOME$SYSTEM$ANOTHER$SYSTEM$20210301090416$$ORM(R01$1000000$P$2.5$$$AL$NE$$8859/15$\rNTE$1$Some~Cool~Data\r"
      );
      expect(msg2.get("MSH-3")?.isEmpty()).to.eq(false);
      expect(msg2.get("MSH-3[1]")?.isEmpty()).to.eq(false);
      const msh2 = msg2.get("MSH-3[2]");
      expect(msh2 === undefined).to.eq(false);
      expect(msh2 === null).to.eq(false);
      expect(msh2?.isEmpty()).to.eq(true);
      expect(msg2.get("MSH-3[3]")?.isEmpty()).to.eq(true);
      expect(msg2.getString("NTE-2")).to.eq("Some");
      expect(msg2.getString("NTE-2[1]")).to.eq("Some");
      expect(msg2.getString("NTE-2[2]")).to.eq("Cool");
      expect(msg2.getString("NTE-2[3]")).to.eq("Data");

      expect(msg2.get("NTE-2")?.isEmpty()).to.eq(false);
      expect(msg2.get("NTE-2[1]")?.isEmpty()).to.eq(false);
      expect(msg2.get("NTE-2[2]")?.isEmpty()).to.eq(false);
      expect(msg2.get("NTE-2[3]")?.isEmpty()).to.eq(false);
      expect(msg2.get("NTE-2[4]")?.isEmpty()).to.eq(true);
      expect(msg2.get("NTE-2[40]")?.isEmpty()).to.eq(true);
    });

    it("should respect Message Chars", function () {
      const msg = new Message();
      msg.addPart(new Part("NTE"));
      msg.set("NTE-1.1", "B");
      msg.set("NTE-1.2.3", "Note 1");
      msg.set("NTE-1[2].1", "C");
      msg.set("NTE-1[2].2", "Note 2");
      expect(msg.get("NTE-1.2.3")?.equals("Note 1")).to.eq(true);
      expect(msg.get("NTE-1[2].2")?.equals("Note 2")).to.eq(true);
      expect(msg.get("NTE-1.2.3")?.equals("Note 1")).to.eq(true);
      expect(msg.get("NTE-1[2].2")?.equals("Note 2")).to.eq(true);
      const msg2 = new Message(msg.render());
      expect(msg.equals(msg2)).to.eq(true);
      expect(msg.get("NTE-1.2.3")?.equals(msg2.get("NTE-1.2.3"))).to.eq(true);
      expect(msg.get("NTE-1.2.2")?.equals(msg2.get("NTE-1[2].2"))).to.eq(false);
    });

    it("should cleanup empty segments at the end", function () {
      const msg = new Message();
      msg.addPart(new Part("NTE"));
      msg.set("NTE-1.1", "B");
      msg.set("NTE-1.2.3", "Note 1");
      msg.set("NTE-1[3].1", "C");
      msg.set("NTE-1[3].2", "Note 2");
      msg.get("NTE-1[4]"); // force getting of NTE-1[3];
      expect(msg.render()).to.eq("MSH|^~\\&|\rNTE|B^&&Note 1~~C^Note 2~\r"); // with ending "~";
      msg.cleanup();
      expect(msg.render()).to.eq("MSH|^~\\&|\rNTE|B^&&Note 1~~C^Note 2\r"); // with ending "~";
      msg.get("ZZZ-18[18].19[19].2[2]");
      expect(msg.render()).to.eq(
        "MSH|^~\\&|\r" +
          "NTE|B^&&Note 1~~C^Note 2\r" +
          "ZZZ||||||||||||||||||~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^&\r"
      );
      msg.cleanup();
      expect(msg.render()).to.eq("MSH|^~\\&|\rNTE|B^&&Note 1~~C^Note 2\r"); // with ending "~";
    });
  });
});
