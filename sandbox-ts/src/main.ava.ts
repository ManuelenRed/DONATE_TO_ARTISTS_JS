/**
 * Conjunto de pruebas unitarias para un contrato inteligente que maneja donaciones.
 * Se utiliza el framework de pruebas `ava` para definir y ejecutar las pruebas.
 */
import { Worker, NearAccount, NEAR } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

// Define el tipo de las pruebas unitarias
const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

// Configura el entorno antes de cada prueba
test.beforeEach(async (t) => {
  const worker = await Worker.init();

  // Despliega el contrato
  const root = worker.rootAccount;

  // Define usuarios
  const alice = await root.createSubAccount("alice", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  const beneficiary = await root.createSubAccount("beneficiary", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  const contract = await root.createSubAccount('test-account');

  // Obtiene la ruta del archivo wasm desde el script de prueba en el archivo package.json
  await contract.deploy(
    process.argv[2],
  );

  // Guarda el estado para las ejecuciones de prueba, es único para cada prueba
  t.context.worker = worker;
  t.context.accounts = { root, contract, alice, beneficiary };
});

// Limpia el entorno después de cada prueba
test.afterEach.always(async (t) => {
  // Detiene el servidor Sandbox
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

// Prueba específica: Donación hecha por Alice
test('Donacion hecha por Alice', async (t) => {
  const { contract, alice, beneficiary } = t.context.accounts;

  // Obtiene el saldo del beneficiario antes de la donación
  const balance = await beneficiary.balance();
  const available = parseFloat(balance.available.toHuman());

  // Realiza una donación desde la cuenta de Alice al contrato
  await alice.call(contract, "donate", {beneficiary: beneficiary.accountId}, { attachedDeposit: NEAR.parse("10 N").toString()} )

  // Obtiene el nuevo saldo del beneficiario después de la donación
  const new_balance = await beneficiary.balance();
  const new_available = parseFloat(new_balance.available.toHuman());

  // Verifica que el nuevo saldo sea igual al saldo anterior más la donación menos una pequeña cantidad para cubrir las tarifas
  t.is(new_available, available + 10 - 0.001);
});
