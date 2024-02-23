let beneficiary = props.beneficiary || "silentadc.testnet";

// Inicialización del estado con un objeto que contiene la cantidad y el beneficiario
initState({ amount: 1, beneficiary });

// Función que realiza una llamada a un contrato en la red Near para hacer una donación
const donate = () => {
  Near.call(
    "plausible-title.testnet",
    "donate",
    { beneficiary: state.beneficiary },
    "30000000000000",
    state.amount * 1e24
  );
};

// Función que actualiza el estado con la cantidad ingresada
const onChangeAmount = (amount) => {
  State.update({
    amount,
  });
};

// Función que actualiza el estado con el beneficiario ingresado
const onChangebeneficiary = (beneficiary) => {
  State.update({
    beneficiary,
  });
};

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
};

// Renderizado de elementos JSX con estilos
return (
  <div style={styles.container}>
    <h1 style={styles.title}>Apoya a tu artista a crecer</h1>
    <div className="col-lg-6 p-2 p-md-3">
      <h5 style={styles.h5}>Dirección del artista</h5>
      {/* Input para ingresar la dirección del beneficiario */}
      <input
        style={styles.input}
        placeholder={state.beneficiary}
        onChange={(e) => onChangebeneficiary(e.target.value)}
      />
    </div>

    <div className="col-lg-6 p-2 p-md-3">
      <h5 style={styles.h5}>Cantidad a donar</h5>
      {/* Input para ingresar la cantidad a donar */}
      <input
        style={styles.input}
        type="number"
        placeholder={state.amount}
        onChange={(e) => onChangeAmount(e.target.value)}
      />
    </div>

    {/* Botón para realizar la donación */}
    <button
      style={
        context.loading
          ? { ...styles.button, ...styles.buttonDisabled }
          : styles.button
      }
      disabled={context.loading}
      onClick={donate}
    >
      Donar {state.amount} NEAR a {state.beneficiary}
    </button>
  </div>
);
