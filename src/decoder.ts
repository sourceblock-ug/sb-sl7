import * as iconv from "iconv-lite";

export default function decoder(
  msgBuffer: Buffer,
  hl7Encoding: string
): string {
  try {
    if (hl7Encoding.startsWith("8859/")) {
      return iconv.decode(msgBuffer, `ISO-${hl7Encoding.replace("/", "-")}`);
    }
    if (hl7Encoding.toUpperCase() === "UNICODE UTF-16") {
      return iconv.decode(msgBuffer, "UTF-16BE");
    }
    if (hl7Encoding.toUpperCase() === "ASCII") {
      return iconv.decode(msgBuffer, "ascii");
    }
  } catch (e) {
    console.error("Error during decode: ", e);
  }
  return msgBuffer.toString(); // Fallback if encoding is not supported.
}
