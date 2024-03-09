// Cuenta donde el widget esta publicado
const widgetOwner = "manueldesarrolla.testnet";

// Inicializa el estado con una pestaña predeterminada
State.init({
  tab: props.tab ?? "donate",
});

// Define las pestañas disponibles en la interfaz
const pills = [
  { id: "donate", title: "Donar a un artista" },
  { id: "found_proyect", title: "Fondear Proyecto" },
];

// Carga las fuentes de Google Fonts y el CSS de un repositorio externo
const cssFont = fetch(
  "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
).body;

const css = fetch(
  "https://raw.githubusercontent.com/cryptosynk/near-social-profile/main/css/mainLight.css"
).body;

// Estilo para el componente Theme
const Theme = styled.div`
  font-family: "Open Sans", sans-serif;
  ${cssFont}
  ${css}
`;

// Renderizado de elementos JSX
return (
  <div style={{ padding: 10 }}>
    <h1> Ellos apreciarán esto 🤝</h1>
    <ul className="nav nav-pills nav-fill mb-4" id="pills-tab" role="tablist">
      {pills.map(({ id, title }, i) => (
        <li className="nav-item" role="presentation" key={i}>
          <a
            className={`nav-link ${state.tab === id ? "active" : ""}`}
            id={`pills-${id}-tab`}
            onClick={() => {
              State.update({
                tab: id,
              });
            }}
          >
            {title}
          </a>
        </li>
      ))}
    </ul>
    <div className="tab-content" id="pills-tabContent">
      {/* Renderiza un widget basado en la pestaña seleccionada */}
      {state?.tab === "donate" && (
        <Widget src={`${widgetOwner}/widget/donate-to-artists.donate`} />
      )}
      {state?.tab === "found_proyect" && (
        <h5> Este componente aún no se ha construido</h5>
      )}
    </div>
  </div>
);
