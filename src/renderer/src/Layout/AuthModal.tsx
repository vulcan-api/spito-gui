import { motion } from 'framer-motion'
import { BsX } from 'react-icons/bs'
import Input from './Input'
import Button from './Button'
import { useState } from 'react'

export default function AuthModal({
  closeModal
}: {
  closeModal: React.MouseEventHandler<SVGElement>
}): JSX.Element {
  const [isUserRegistering, setIsUserRegistering] = useState<boolean>(false)

  function changeAuthMethodHandler() {
    setIsUserRegistering((prev: boolean) => !prev)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center absolute left-0 top-0 w-screen h-screen bg-[#00000080] z-10"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`w-1/4 h-1/2 bg-bgColor border-2 rounded-xl border-teal-500 text-gray-100 relative p-8 py-16 ${
          isUserRegistering ? 'h-2/3' : 'h-1/2'
        }`}
      >
        <BsX
          className="absolute text-3xl right-4 top-4 cursor-pointer hover:text-emerald-500 transition-colors"
          onClick={closeModal}
        />
        {isUserRegistering ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col gap-4 justify-between"
          >
            <h2 className="text-center text-4xl roboto mb-4">Register</h2>
            <Input placeholder="Username" />
            <Input placeholder="E-Mail" type="email" />
            <Input placeholder="Password" type="password" />
            <Input placeholder="Repeat password" type="password" />
            <div className="flex items-center gap-2">
              <Button theme="alt" className="!w-full" onClick={changeAuthMethodHandler}>
                Back to Login
              </Button>
              <Button theme="default" className="!w-full">
                Register
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col gap-4 justify-between"
          >
            <BsX
              className="absolute text-3xl right-4 top-4 cursor-pointer hover:text-emerald-500 transition-colors"
              onClick={closeModal}
            />
            <h2 className="text-center text-4xl roboto mb-8">Login</h2>
            <Input placeholder="Username / Email" />
            <Input placeholder="Password" type="password" />
            <p className="text-center cursor-pointer">Forgot password?</p>
            <div className="flex items-center gap-2">
              <Button theme="alt" className="!w-full" onClick={changeAuthMethodHandler}>
                New? Register
              </Button>
              <Button theme="default" className="!w-full">
                Login
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
