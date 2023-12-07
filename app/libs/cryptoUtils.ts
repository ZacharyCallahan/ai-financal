import crypto from "crypto";

// Assert that ENCRYPTION_KEY is a string and has the correct length
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("Invalid ENCRYPTION_KEY: Must be 32 characters long");
}

const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text: string): string => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY, "hex"),
        iv
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text: string): string => {
    let textParts = text.split(":");
    let ivString = textParts.shift();
    if (!ivString) {
        throw new Error(
            "Invalid input text. Cannot extract initialization vector."
        );
    }
    let iv = Buffer.from(ivString, "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY, "hex"),
        iv
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};
