module.exports = async function ({ req, res }) {
    if (req.method === "POST") {
        const { amount, type } = JSON.parse(req.body);
        let taxRate = 0.16;
        if (type === "TOT") taxRate = 0.03;
        return res.json({ net: amount, tax: amount * taxRate, gross: amount * (1 + taxRate) });
    }
    return res.json({ error: "Post method required" });
};
