export const handleHealthRequest = async (req, res) => {
  try {
    const { type, params } = req.body;
    const client = req.app.locals.gradioClient;

    let api_name;
    switch (type) {
      case "fda":
        api_name = "/fda_drug_lookup_gr";
        break;
      case "pubmed":
        api_name = "/pubmed_search_gr";
        break;
      case "topic":
        api_name = "/health_topics_gr";
        break;
      default:
        return res.status(400).json({ success: false, error: "Invalid type" });
    }

    const result = await client.predict(api_name, params);
    res.json({ success: true, data: result.data });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
