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

    it('should not be Empty Message Chars', () => {
        const msg2 = new Message("MSH$(~\\&$SOME$SYSTEM$ANOTHER$SYSTEM$20210301090416$$ORM(R01$1000000$P$2.5$$$AL$NE$$8859/15$\rNTE$1$Some~Cool~Data\r");
        expect(msg2.get("MSH-3")?.isEmpty()).to.eq(false);
        expect(msg2.get("MSH-3[1]")?.isEmpty()).to.eq(false);
        let msh2 = msg2.get("MSH-3[2]");
        expect(msh2===undefined).to.eq(false);
        expect(msh2===null).to.eq(false);
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
})
