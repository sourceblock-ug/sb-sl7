const Message = require("../dist/main.js").Message;

const msgString = 'MSH|^~\\&|SOME|SYSTEM|ANOTHER|SYSTEM|20210301090416||ORM^O01|1000000|P|2.5|||AL|NE||8859/15|\n' +
    'PID|1||8008008|ABC123~DEF456|Test^Radiologie^Zusatz^^^Titel|Testrad|19611019000000||||Test Str. 66^^Test^^12345^||05555/6667778889||||||Test@example.local|||Anna Test|Testhausen|N|||Developer|||\n' +
    'NTE|1|Note 1\n' +
    'NTE|2|Note 2\n'
const sl7Msg = new Message(msgString)

// Access a single Message Part "as String":
const pidStr = sl7Msg.getString("PID-3") // = "8008008"
console.log(`PID-3: ${pidStr}`)
console.log("PID-5.2: " + sl7Msg.getString("PID-5.2")) // = "Radiologie"
console.log("PID-4[2]: " + sl7Msg.getString("PID-4[2]")) // = "DEF456"
console.log("NTE[2]-2: " + sl7Msg.getString("NTE[2]-2")) // = "Note 2"
console.log("NTE[1]-2: " + sl7Msg.getString("NTE[1]-2")) // = "Note 1"
console.log("NTE-2: " + sl7Msg.getString("NTE-2")) // = "Note 1"

// Set a Value:
sl7Msg.set("PID-2.1", "ID")
sl7Msg.set("PID-2.4", "SYSTEM")
sl7Msg.set("PID-3[2]", "9009009")
sl7Msg.set("NTE[2]-2", "Note 2, line 1\nNote 2, Line 2")

// Add a Part:
const Part = require("../dist/main.js").Part;
sl7Msg.addPart(new Part("NTE|3|Note 3\nNote 3, Line 2\nNote 3, Line 3\nNote 3, Line 4\n"))

// Encoding Chars:
console.log("Chars: " + sl7Msg.getMessageChars())

const ren = sl7Msg.debug();
console.log("Rendered:\n" + ren)

// Loop over the Elements:
console.log("EQ", ren === msgString)
for (let i = 1; i < 12; i++) {
    const key = `MSH-${i}`
    console.log(key + " = " + sl7Msg.getString(key))
}
for (let i = 1; i < 12; i++) {
    const key = `PID-${i}`
    console.log(key + " = " + sl7Msg.getString(key))
}

// TODO: Add proper tests here... sry ;)
