import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PRODUCTO = { nombre: "Plan Pro (1 mes)", precio: "9.99" };

const App = () => {
  const [estado, setEstado] = useState<"idle" | "pagado" | "error">("idle");
  const [orden, setOrden] = useState("");

  return (
    <div style={{ maxWidth: 360, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>{PRODUCTO.nombre}</h1>
      <p>Acceso completo al curso durante 1 mes.</p>
      <h2>${PRODUCTO.precio} USD</h2>

      {estado === "pagado" ? (
        <p>✅ Pago aprobado. Orden: {orden}</p>
      ) : (
        <PayPalScriptProvider
          options={{
            clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID ?? "test",
            currency: "USD",
          }}
        >
          <PayPalButtons
            createOrder={(_, actions) =>
              actions.order!.create({
                // intent: Cuando se cobra. hay 2 formas
                // CAPTURE: Cobrar de inmediato
                // AUTHORIZE: Reservar el dinero y cobrar después 
                intent: "CAPTURE",
                purchase_units: [
                  {
                    description: PRODUCTO.nombre,
                    amount: { currency_code: "USD", value: PRODUCTO.precio },
                  },
                ],
              })
            }

            // Donde tú mandarías el correo
            onApprove={async (_, actions) => {
              try {
                const detalle = await actions.order!.capture();
                setOrden(detalle.id ?? "");
                setEstado("pagado");
              } catch (error) {
                console.error(error);
                setEstado("error");
              }
            }}
            onError={() => setEstado("error")}
          />
        </PayPalScriptProvider>
      )}

      {estado === "error" && <p>❌ Algo falló. Intenta de nuevo.</p>}
    </div>
  );
};

export default App;