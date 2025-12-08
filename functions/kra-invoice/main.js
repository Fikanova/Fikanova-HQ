module.exports = async function ({ req, res }) {
    if (req.method === "POST") {
        const { amount, type } = JSON.parse(req.body);
        let taxRate = 0.16;
        if (type === "TOT") taxRate = 0.03;
        const tax = amount * taxRate;
        return res.json({ net: amount, tax: tax, gross: amount + tax });
    }
    return res.json({ error: "Post method required" });
};
