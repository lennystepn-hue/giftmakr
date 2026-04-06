import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#FDF8F4",
          border: "1px solid rgba(124, 144, 130, 0.2)",
          color: "#3D3D3D",
        },
      }}
    />
  );
}
