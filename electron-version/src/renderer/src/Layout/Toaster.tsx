import { Toaster } from "react-hot-toast";

export default function ToasterComponent(): JSX.Element {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 3000,
        style: {
          background: "#242424",
          color: "#ffffffdd",
          fontSize: "1.2rem"
        },
        success: {
          duration: 3000,
          style: {
            border: "2px solid #84cc16",
            color: "#ffffffdd"
          }
        },
        error: {
          duration: 3000,
          style: {
            border: "2px solid #ef4444",
            color: "#ffffffdd"
          }
        },
        loading: {
          style: {
            border: "2px solid #ffffffaa"
          },
          duration: Infinity
        }
      }}
    />
  );
}
