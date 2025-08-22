// No imports needed in Node 18+ because fetch is built-in

async function query(data) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/medicalai/ClinicalBERT",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

query({ inputs: "Clinic doctors are [MASK]." }).then((response) => {
    console.log(JSON.stringify(response));
});



// import { InferenceClient } from "@huggingface/inference";

// const client = new InferenceClient(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);

// const output = await client.fillMask({
// 	model: "medicalai/ClinicalBERT",
// 	inputs: "The answer to the universe is [MASK].",
// 	provider: "auto",
// });

// console.log(output);
