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
  const manuelinvierte = await root.createSubAccount("manuelinvierte", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  const silent = await root.createSubAccount("silentadc", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  const ronin = await root.createSubAccount("roningautama", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  const semk = await root.createSubAccount("semk", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  const contract = await root.createSubAccount('test-account');

  // Obtiene la ruta del archivo wasm desde el script de prueba en el archivo package.json
  await contract.deploy(
    process.argv[2],
  );

  // Guarda el estado para las ejecuciones de prueba, es único para cada prueba
  t.context.worker = worker;
  t.context.accounts = { root, contract, manuelinvierte, silent, ronin, semk };
});

// Limpia el entorno después de cada prueba
test.afterEach.always(async (t) => {
  // Detiene el servidor Sandbox
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

// Prueba específica: Donación Manuel Invierte a Silent ADC
test('Donacion hecha por Manuel Invierte a Silent ADC', async (t) => {
  const { contract, manuelinvierte, silent } = t.context.accounts;

  // Obtiene el saldo del beneficiario antes de la donación
  const balance = await silent.balance();
  const available = parseFloat(balance.available.toHuman());

  // Realiza una donación desde la cuenta de Alice al contrato
  await manuelinvierte.call(contract, "donate", {beneficiary: silent.accountId}, { attachedDeposit: NEAR.parse('1') } )

  // Obtiene el nuevo saldo del beneficiario después de la donación
  const new_balance = await silent.balance();
  const new_available = parseFloat(new_balance.available.toHuman());

  // Calcula la diferencia entre los valores y compara si es menor que una tolerancia dado a que la linea 74 da error por una diferencia minima
  function isCloseTo(a: number, b: number, tolerance: number = 0.000001): boolean {
    return Math.abs(a - b) < tolerance;
  }

  // Utiliza la función isCloseTo para comparar los saldos
  t.true(isCloseTo(new_available, available + 1 - 0.001));

  // Verifica que el nuevo saldo sea igual al saldo anterior más la donación menos una pequeña cantidad para cubrir las tarifas
  //t.is(new_available, available + 10 - 0.001);
});

// Prueba específica: Donación hecha por Manuel Invierte a Ronin Gautama
test('Donacion hecha por Manuel Invierte a Ronin Gautama', async (t) => {
  const { contract, manuelinvierte, ronin } = t.context.accounts;

  // Obtiene el saldo del beneficiario antes de la donación
  const balance = await ronin.balance();
  const available = parseFloat(balance.available.toHuman());

  // Realiza una donación desde la cuenta de Alice al contrato
  await manuelinvierte.call(contract, "donate", {beneficiary: ronin.accountId}, { attachedDeposit: NEAR.parse('10') } )

  // Obtiene el nuevo saldo del beneficiario después de la donación
  const new_balance = await ronin.balance();
  const new_available = parseFloat(new_balance.available.toHuman());

  // Calcula la diferencia entre los valores y compara si es menor que una tolerancia dado a que la linea 74 da error por una diferencia minima
  function isCloseTo(a: number, b: number, tolerance: number = 0.000001): boolean {
    return Math.abs(a - b) < tolerance;
  }

  // Utiliza la función isCloseTo para comparar los saldos
  t.true(isCloseTo(new_available, available + 10 - 0.001));

  // Verifica que el nuevo saldo sea igual al saldo anterior más la donación menos una pequeña cantidad para cubrir las tarifas
  //t.is(new_available, available + 10 - 0.001);
});

// Prueba específica: Donación hecha por Manuel Invierte a Semk
test('Donacion hecha por Manuel Invierte a Semk', async (t) => {
  const { contract, manuelinvierte, semk } = t.context.accounts;

  // Obtiene el saldo del beneficiario antes de la donación
  const balance = await semk.balance();
  const available = parseFloat(balance.available.toHuman());

  // Realiza una donación desde la cuenta de Alice al contrato
  await manuelinvierte.call(contract, "donate", {beneficiary: semk.accountId}, { attachedDeposit: NEAR.parse('5') } )

  // Obtiene el nuevo saldo del beneficiario después de la donación
  const new_balance = await semk.balance();
  const new_available = parseFloat(new_balance.available.toHuman());

  // Calcula la diferencia entre los valores y compara si es menor que una tolerancia dado a que la linea 74 da error por una diferencia minima
  function isCloseTo(a: number, b: number, tolerance: number = 0.000001): boolean {
    return Math.abs(a - b) < tolerance;
  }

  // Utiliza la función isCloseTo para comparar los saldos
  t.true(isCloseTo(new_available, available + 5 - 0.001));

  // Verifica que el nuevo saldo sea igual al saldo anterior más la donación menos una pequeña cantidad para cubrir las tarifas
  //t.is(new_available, available + 10 - 0.001);
});