import * as fs from "fs";
// import Aquafier, { Aqua, createAqua, WitnessConfigs, SignConfigs } from "aqua-js-sdk";
import { AquaV4 } from "aqua-js-sdk";
import { CredentialsData } from "aqua-js-sdk";


const { Aqua, createAqua, WitnessConfigs, SignConfigs } = AquaV4

// console.log(Aquafier)
// Load credentials
let creds: CredentialsData = {
  "did_key": "",
  alchemy_key: "",
  mnemonic: "",
  nostr_sk: "",
  witness_eth_network: "sepolia",
  witness_method: "metamask",
};

if (fs.existsSync("credentials.json")) {
  const credsContent = fs.readFileSync("credentials.json", "utf-8");
  creds = JSON.parse(credsContent);
}

/**
 * Example 1: Ultra-concise file processing
 */
async function ultraConciseExample() {
  console.log("🚀 Ultra-Concise Example - One Method Call");

  const aqua = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);

  // Everything in one call: load file, notarize, sign, witness, verify, save
  const result = await aqua.processFile("./test.txt", {
    sign: true,
    witness: true,
    verify: false, // Verification is failing because JSON RPC cannot be reached
    save: "./test.txt.aqua.json"
  });

  if (result.isOk()) {
    console.log("✅ Complete workflow finished in one call");
    console.log(`🌳 Tree has ${Object.keys(result.data.revisions).length} revisions`);
  } else {
    console.log("❌ Workflow failed:", aqua.getLogs());
  }
}

/**
 * Example 2: Basic usage with file paths
 */
async function basicFileExample() {
  console.log("🔧 Basic File Example - Direct File Operations");

  const aqua = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);

  // Use file paths directly - no manual FileObject creation
  await aqua.create("./test.txt");
  await aqua.sign();
  await aqua.witness();
  const fileResult = Aqua.loadFile("./test.txt")
  if (fileResult.isOk()) {
    let data = fileResult.data
    console.log("✅ File loaded successfully")
    await aqua.verify([data]);
  }

  // Save the result
  aqua.save("./test.txt.aqua.json");

  console.log("✅ File operations completed");
  console.log(`📊 Generated ${aqua.getLogs().length} log entries`);
}

/**
 * Example 2.1: Basic usage with file paths
 */
async function basicTorExample() {
  console.log("🔧 Basic Tor Example - Direct File Operations");

  const aqua = createAqua(creds, WitnessConfigs.tsa, SignConfigs.cli);

  // Use file paths directly - no manual FileObject creation
  await aqua.create("./form.json", { isTOR: true });
  aqua.save("./form.json.aqua.json");


  const fileAquaResult = aqua.loadAquaFile("./form.json.aqua.json")


  if (fileAquaResult.isErr()) {

    console.log("❌ Failed to load  Aqua file:", fileAquaResult.data);
    return
  }


  console.log("✅ File loaded successfully")
  await aqua.verify();

}

/**
 * Example 3: Working with existing aqua files
 */
async function existingAquaFileExample() {
  console.log("\n📁 Existing Aqua File Example");

  const aqua = createAqua(creds, WitnessConfigs.tsa, SignConfigs.cli);

  // Load existing aqua file
  const loadResult = aqua.loadAquaFile("./test.txt.aqua.json");
  if (loadResult.isOk()) {
    console.log("✅ Loaded existing aqua file");

    // Continue with more operations
    await aqua.sign(SignConfigs.did);
    await aqua.witness(WitnessConfigs.nostr);

    // Save updated version
    aqua.save("./test.txt.updated.aqua.json");
  } else {
    console.log("❌ Failed to load aqua file");
  }
}

/**
 * Example 3.1: Working with existing aqua tree
 */
async function existingAquaTreeExample() {
  console.log("\n📁 Existing Aqua Tree Example");

  const aqua = createAqua(creds, WitnessConfigs.tsa, SignConfigs.cli);
  const aquaTree = fs.readFileSync("./test.txt.aqua.json", "utf-8");
  // Load existing aqua file
  const loadResult = aqua.loadAquaTree(JSON.parse(aquaTree));
  if (loadResult.isOk()) {
    console.log("✅ Loaded existing aqua file");

    // Continue with more operations
    await aqua.sign(SignConfigs.did);
    await aqua.witness(WitnessConfigs.nostr);

    // Save updated version
    aqua.save("./test.txt.updated.aqua.json");
  } else {
    console.log("❌ Failed to load aqua file");
  }
}

/**
 * Example 4: Selective operations with processFile
 */
async function selectiveOperationsExample() {
  console.log("\n🎯 Selective Operations Example");

  const aqua = createAqua(creds);

  // Only notarize and sign, skip witnessing
  await aqua.processFile("./test.txt", {
    sign: SignConfigs.cli,
    save: "./test-signed-only.aqua.json"
  });

  console.log("✅ Selective operations completed");

  // Later, load and add witnessing
  aqua.reset();
  aqua.loadAquaFile("./test-signed-only.aqua.json");
  await aqua.witness(WitnessConfigs.ethereumSepolia);
  aqua.save("./test-complete.aqua.json");

  console.log("✅ Added witnessing to existing aqua file");
}

/**
 * Example 4: Error handling and state management
 */
async function errorHandlingExample() {
  console.log("\n⚠️  Error Handling Example");

  const aqua = createAqua(creds);

  // Try to sign without notarizing first
  const signResult = await aqua.sign();
  if (signResult.isErr()) {
    console.log("❌ Expected error: Cannot sign without tree");
    console.log("📋 Logs:", aqua.getLogs().map(l => l.log));
  }

  // Clear logs and start properly
  aqua.clearLogs();
  await aqua.create("./test.txt");

  const successResult = await aqua.sign(SignConfigs.cli);
  if (successResult.isOk()) {
    console.log("✅ Sign succeeded after notarization");
  }
}

/**
 * Example 5: Dynamic configuration updates
 */
async function dynamicConfigExample() {
  console.log("\n🔧 Dynamic Config Example");

  const aqua = createAqua(creds, WitnessConfigs.ethereumSepolia);

  await aqua.create("./test.txt");
  await aqua.sign(SignConfigs.cli);

  let currentAquaFile = aqua.getTree()
  console.log("Aqua Tree: ", JSON.stringify(currentAquaFile, null, 4))

  // Update witness configuration
  aqua.configure({
    witness: WitnessConfigs.tsa
  });

  // await aqua.witness(); // Uses updated config

  console.log("✅ Dynamic configuration update working");
}

/**
 * Example 6: Tree linking functionality
 */
async function treeLinkingExample() {
  console.log("\n🔗 Tree Linking Example");

  // Create first aqua tree
  const aqua1 = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);
  await aqua1.create("./test.txt");
  await aqua1.sign();
  aqua1.save("./test.txt-1.aqua.json");

  // const tree1View = aqua1.getView();
  // console.log("Tree 1 View: ", JSON.stringify(tree1View, null, 4))
  console.log("✅ Created first aqua tree");
  console.log("Aqua1 instance ID:", JSON.stringify(aqua1, null, 4));
  console.log("Aqua1 tree hash:", Object.keys(aqua1.getTree()?.revisions || {})[0]);

  // Create second aqua tree
  const aqua2 = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);
  await aqua2.create("./sample.txt");
  await aqua2.sign();
  aqua2.save("./sample.txt.aqua.json");

  console.log("✅ Created second aqua tree");
  console.log("Aqua2 instance ID:", JSON.stringify(aqua2, null, 4));
  console.log("Aqua2 tree hash:", Object.keys(aqua2.getTree()?.revisions || {})[0]);
  console.log("Are they the same instance?", aqua1 === aqua2);

  // Link the first tree to the second
  // if (tree1View) {
  const linkResult = await aqua2.link(aqua1);
  if (linkResult.isOk()) {
    console.log("✅ Successfully linked trees");
    aqua2.save("./linked-tree--3.aqua.json")
    console.log(`🌳 Linked tree has ${Object.keys(aqua2.getTree()?.revisions || {}).length} revisions`);
  } else {
    console.log("❌ Tree linking failed:", aqua2.getLogs());
  }
  // }

  // Save the linked tree
  aqua2.save("./linked-tree.aqua.json");
  console.log("✅ Saved linked tree");
}

/**
 * Example 7: Multiple tree linking
 */
async function multipleLinkingExample() {
  console.log("\n🔗 Multiple Tree Linking Example");

  // Create base tree
  const baseAqua = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);
  await baseAqua.create("./test.txt");
  await baseAqua.sign();

  // Create multiple trees to link
  const trees = [];
  for (let i = 1; i <= 3; i++) {
    const aqua = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);
    await aqua.create("./test.txt");
    await aqua.sign();
    trees.push({
      aqua,
      targetRevision: ""
    })
    // const view = aqua.getView();
    // if (view) {
    //   trees.push(view);
    // }
    // console.log(`✅ Created tree ${i}`);
  }

  // Link multiple trees at once
  if (trees.length > 0) {
    const linkResult = await baseAqua.linkMultiple(trees);
    if (linkResult.isOk()) {
      console.log("✅ Successfully linked multiple trees");
      console.log(`🌳 Final tree has ${Object.keys(baseAqua.getTree()?.revisions || {}).length} revisions`);
    } else {
      console.log("❌ Multiple tree linking failed:", baseAqua.getLogs());
    }
  }

  // Save the final linked tree
  baseAqua.save("./multiple-linked-tree.aqua.json");
  console.log("✅ Saved multiple linked tree");
}

/**
 * Comparison with original API
 */
function showAPIComparison() {
  console.log("\n📊 API Comparison - Maximum Conciseness");
  console.log("=".repeat(60));

  console.log("🔴 Original API (15+ lines):");
  console.log(`
// Manual file reading
let testFileContent = readFile("./test.txt");
let aquaFileObject = {
    fileName: "text.txt",
    fileContent: testFileContent || "",
    path: "./text.txt"
};

// Verbose operations with parameter repetition
const aqt = await new AquafierChainable(null).notarize(aquaFileObject);
await aqt.sign("cli", creds);
await aqt.witness("eth", "sepolia", "metamask", creds);
let result = aqt.getValue();

// Manual file saving
writeAquaFile("./result.aqua.json", result);
`);

  console.log("🟢 New Ultra-Concise API (3 lines):");
  console.log(`
const aqua = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);
const result = await aqua.processFile("./test.txt", { 
    sign: true, witness: true, verify: true, save: "./test.txt.aqua.json" 
});
`);

  console.log("🟢 New Step-by-Step API (5 lines):");
  console.log(`
const aqua = createAqua(creds, WitnessConfigs.ethereumSepolia, SignConfigs.cli);
await aqua.notarizeFile("./test.txt");
await aqua.sign();
await aqua.witness();  
aqua.saveAquaFile("./test.txt.aqua.json");
`);

  console.log("✨ Improvements:");
  console.log("  • 80% reduction in code for complete workflow");
  console.log("  • No manual FileObject creation needed");
  console.log("  • Built-in file I/O operations");
  console.log("  • Configuration reuse across operations");
  console.log("  • Better error handling with Result types");
  console.log("  • Rust-compatible design patterns");
}

// Run all examples
async function runAllExamples() {
  try {
    // showAPIComparison();
    // await ultraConciseExample();
    await basicTorExample()
    // await basicFileExample();
    // await existingAquaFileExample();
    // await existingAquaTreeExample();
    // await selectiveOperationsExample();
    // await errorHandlingExample();
    // await dynamicConfigExample();
    // await treeLinkingExample();
    // await multipleLinkingExample();

    console.log("\n🎉 All examples completed successfully!");
  } catch (error) {
    console.error("❌ Example failed:", error);
  }
}

// Export for use in tests or other files
export {
  ultraConciseExample,
  basicFileExample,
  existingAquaFileExample,
  existingAquaTreeExample,
  selectiveOperationsExample,
  errorHandlingExample,
  dynamicConfigExample,
  treeLinkingExample,
  multipleLinkingExample,
  basicTorExample
};

// Run if called directly
// if (require.main === module) {
// }
runAllExamples();
