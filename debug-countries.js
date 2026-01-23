// Native fetch is available in Node 18+

const query = `
  query Introspect {
    __schema {
      types {
        name
      }
    }
    root: __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }
`;

async function audit() {
    console.log("🔍 Starting Deep Audit...");
    try {
        const response = await fetch('http://bydcarupdates.local/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        const json = await response.json();

        if (json.errors) {
            console.error("❌ GraphQL Errors:", json.errors);
            return;
        }

        if (json.data.__schema) {
            console.log("✅ Schema Introspection Success");
            const types = json.data.__schema.types.map(t => t.name);
            console.log("Types found:", types.join(", "));

            const rootFields = json.data.root.queryType.fields.map(f => f.name);
            console.log("\nRoot Query Fields:", rootFields.join(", "));
            return;
        }

        const nodes = json.data?.countries?.nodes || [];
        console.log(`✅ Found ${nodes.length} country nodes.\n`);

        console.log("--- RAW DATA DUMP ---");
        nodes.forEach(n => {
            console.log(`ID: ${n.id.slice(0, 8)}... | Title: "${n.title}" | Raw CountryName: "${n.countryName?.countryName}"`);
        });
        console.log("---------------------\n");

        const aeNodes = nodes.filter(n => n.countryName?.countryName?.toLowerCase().includes('ae'));
        if (aeNodes.length > 0) {
            console.log("🇦🇪 AE Analysis:");
            aeNodes.forEach(n => {
                console.log(`   -> "${n.countryName?.countryName}"`);
            });
        } else {
            console.log("⚠️ No nodes found containing 'ae'");
        }

    } catch (error) {
        console.error("🔥 Fatal Error:", error);
    }
}

audit();
