import Button from "@renderer/Layout/Button";
import Input from "@renderer/Layout/Input";
import { motion } from "framer-motion";
import { useState } from "react";
import AuthCode from "react-auth-code-input";
import QRCode from "react-qr-code";

export default function TwoFa(): JSX.Element {
  const [is2faEnabled, setIs2faEnabled] = useState<boolean>(false);
  const [twoFACode, setTwoFACode] = useState<string>();

  function handleAuthCodeState(res: string): void {
    setTwoFACode(res);
  }

  function disable2FA(): void {
    console.log("Not implemented yet!");
  }

  function enable2FA(): void {
    console.log("Not implemented yet!");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
      key="2fa"
      className="flex-1 flex flex-col gap-16 items-center justify-center"
    >
      {is2faEnabled ? (
        <>
          <p className="font-poppins text-gray-400 text-2xl">2FA is Enabled!</p>
          <Button theme="default" onClick={disable2FA}>
            Disable
          </Button>
        </>
      ) : (
        <>
          <ul className="font-poppins text-gray-400 text-2xl list-disc">
            <p>Follow these steps:</p>
            <li>Install any auth app (eg. Google Authenticator)</li>
            <li>Scan the QR code</li>
            <li>Enter the 6 digit code below</li>
          </ul>
          <QRCode
            value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="p-2 border-2 rounded-lg shadow-darkMain bg-gray-200 border-bgLighter"
          />
          <AuthCode
            onChange={handleAuthCodeState}
            allowedCharacters="numeric"
            containerClassName="flex items-center justify-center gap-4"
            inputClassName="w-8 h-10 bg-transparent border-2 border-bgLighter rounded-lg text-3xl text-center shadow-darkMain text-gray-400"
          />
          <Button theme="default" onClick={enable2FA}>
            Enable
          </Button>
        </>
      )}
    </motion.div>
  );
}
