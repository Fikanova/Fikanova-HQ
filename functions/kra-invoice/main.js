module.exports = async function ({ req, res }) {
    if (req.method === "POST") {
        const { amount, type } = JSON.parse(req.body);
        let taxRate = 0.16; // VAT default
        if (type === "TOT") taxRate = 0.03; // Turnover Tax
        const tax = amount * taxRate;
        return res.json({
            invoice_data: { net: amount, tax: tax, gross: amount + tax, hs_code: "998311" }
        });
    }
    return res.json({ error: "Post method required" });
};
