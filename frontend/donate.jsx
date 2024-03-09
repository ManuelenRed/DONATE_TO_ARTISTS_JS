// En cao de no haber un beneficiario se asigna uno predeterminado
let beneficiary = props.beneficiary || "manuelenred.testnet";

//  Contrato para donar
const donateContract = "plausible-title.testnet";

// Inicialización del estado con un objeto que contiene la cantidad y el beneficiario
initState({ amount: 1, beneficiary });

// Función que realiza una llamada a un contrato en la red Near para hacer una donación
const donate = () => {
  Near.call(
    donateContract,
    "donate",
    { beneficiary: state.beneficiary },
    "30000000000000",
    state.amount * 1e24
  );
};

// Función que actualiza las variables de estado
const onChange = (key, value) =>
  State.update({
    [key]: value,
  });

// Definición de estilos CSS
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 0",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  h5: {
    marginBottom: "20px",
  },
  h3: {
    marginBottom: "20px",
  },
};

// Renderizado de elementos JSX con estilos
return (
  <div style={styles.container}>
    <h1 style={styles.h3}>Datos del artista</h1>
    <div className="col-lg-6 p-2 p-md-3">
      <h5 style={styles.h5}>Dirección de la billetera</h5>
      {/* Input para ingresar la dirección del beneficiario */}
      <input
        style={styles.input}
        placeholder={state.beneficiary}
        onChange={(e) => onChange("beneficiary", e.target.value)}
      />
    </div>

    <div className="col-lg-6 p-2 p-md-3">
      <h5 style={styles.h5}>Cantidad en NEAR a donar</h5>
      {/* Input para ingresar la cantidad a donar */}
      <input
        style={styles.input}
        type="number"
        placeholder={state.amount}
        onChange={(e) => onChange("amount", e.target.value)}
      />
    </div>

    {/* Botón para realizar la donación */}
    {context.accountId ? (
      <button
        style={
          context.loading
            ? { ...styles.button, ...styles.buttonDisabled }
            : styles.button
        }
        disabled={context.loading}
        onClick={donate}
      >
        Enviar {state.amount} Ⓝ a {state.beneficiary}
      </button>
    ) : (
      <button
        style={
          context.loading
            ? { ...styles.button, ...styles.buttonDisabled }
            : styles.button
        }
        disabled={context.loading}
      >
        Debes iniciar sesion para donar
      </button>
    )}
  </div>
);
