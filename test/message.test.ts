import {Message} from "../src/message";
import {expect} from "chai";

describe("Test Message Parsing", () => {
    it('should have Message Chars on new Element', () => {
        const msg = new Message();
        expect(msg.render()).to.be.eq('MSH|^~\\&|\r');
        expect(msg.getString("MSH-1")).to.eq("|");
        expect(msg.getString("MSH-2")).to.eq("^~\\&");
    })

    it('should respect Message Chars', () => {
        const msg2 = new Message("MSH$(~\\&$SOME$SYSTEM$ANOTHER$SYSTEM$20210301090416$$ORM(R01$1000000$P$2.5$$$AL$NE$$8859/15$\n");
        expect(msg2.getString("MSH-3")).to.eq("SOME");
        expect(msg2.getString("MSH-9.1")).to.eq("ORM");
        expect(msg2.getString("MSH-9.2")).to.eq("R01");
    })
})
