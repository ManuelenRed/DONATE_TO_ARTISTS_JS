import { Worker, NearAccount, NEAR } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';
import { near } from 'near-sdk-js';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;

  // define users
  const alice = await root.createSubAccount("alice", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  const beneficiary = await root.createSubAccount("beneficiary", {
    initialBalance: NEAR.parse("30 N").toJSON(),
  });

  const contract = await root.createSubAccount('test-account');

  // Get wasm file path from package.json test script in folder above
  await contract.deploy(
    process.argv[2],
  );

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract, alice, beneficiary };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('Donacion hecha por Alice', async (t) => {
  const { contract, alice, beneficiary } = t.context.accounts;

  const balance = await beneficiary.balance();
  const available = parseFloat(balance.available.toHuman());
  const accound_id = beneficiary.accountId;

  await alice.call(contract, "donate", {beneficiary: accound_id}, {attachedDeposit: NEAR.parse("1")})

  const new_balance = await beneficiary.balance();
  const new_available = parseFloat(new_balance.available.toHuman());

  t.is(new_available, available );
});

